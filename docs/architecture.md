# Архитектура reminder-ui

> Статус: реализовано (2026-10-18). Актуальная структура и команды — в `AGENTS.md`. Общая архитектура системы — в
> `../reminder-backend/docs/architecture.md`, доменная модель — в `../reminder-backend/docs/domain.md`.

## Стек

| Задача                  | Выбор                                              | Комментарий                                          |
| ----------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| Сборка                  | Vite                                               | Требование                                           |
| Язык                    | TypeScript (strict)                                | Требование                                           |
| UI                      | React                                              | Требование                                           |
| Роутинг                 | React Router 8 (пакет `react-router`, data router) | `react-router-dom` больше не нужен                   |
| UI-библиотека           | Mantine 9                                          | Принято (D-012), см. `ui-library-comparison.md`      |
| Загрузка данных         | TanStack Query                                     | Кэш, рефетч при фокусе окна, статусы загрузки        |
| HTTP-клиент + типы      | `openapi-typescript` + `openapi-fetch`             | Типы генерируются из OpenAPI бэкенда, ручных DTO нет |
| Даты                    | `Intl.DateTimeFormat` (`ru-RU`)                    | Отдельная библиотека не понадобилась                 |
| Lint/format             | oxlint + Prettier                                  | oxlint — дефолт шаблона Vite 8                       |
| Тесты                   | Vitest + Testing Library; позже Playwright         |                                                      |
| Моки API при разработке | MSW                                                | UI можно делать до готовности бэкенда                |

## Страницы MVP

| Путь          | Страница | Содержимое                                                                                                      |
| ------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `/`           | Сегодня  | Рутины на сегодня (🌅 Утро · 07:00), привычки и их статус, текущая серия у каждой                               |
| `/habits`     | Привычки | Все привычки: рутина, расписание («каждый день в 07:00»), текущая/лучшая серия, значки milestones, % за 30 дней |
| `/habits/:id` | Привычка | Heatmap выполнения, серии, полученные milestones, «до следующего: N дней»                                       |
| `*`           | 404      |                                                                                                                 |

MVP — только чтение. Привычки добавляются через бота (`/add`). Редактирование из UI — в бэклоге.

## Выбор пользователя (вместо аутентификации)

Аутентификации в MVP нет (D-013). В шапке — `Select` со списком из `GET /api/v1/users`.

- Выбор хранится в `localStorage` (в `try/catch`); без выбора страницы показывают приглашение выбрать.
- `client.ts` добавляет заголовок `X-User-Id` ко всем запросам.
- Ключи TanStack Query включают `userId` → при смене пользователя данные перезапрашиваются.
- Позже вход через Telegram: селектор исчезает, заголовок заменяется токеном/сессией;
  страницы не меняются.

## Структура

```
reminder-ui/
├── index.html
├── vite.config.ts           # dev proxy: /api → http://localhost:8000
├── src/
│   ├── main.tsx             # providers: MantineProvider, QueryClientProvider, Router
│   ├── routes/              # страницы
│   ├── components/          # UserSelect, HabitCard, StreakBadge, MilestoneBadges, Heatmap…
│   ├── api/
│   │   ├── schema.d.ts      # сгенерировано openapi-typescript (не редактировать)
│   │   ├── client.ts        # openapi-fetch, baseUrl = /api, заголовок X-User-Id
│   │   └── queries.ts       # хуки TanStack Query
│   └── mocks/               # MSW-обработчики
├── nginx/default.conf
└── Dockerfile
```

## Сборка и деплой — деплой отложен

> Docker/nginx прорабатываем при подготовке к запуску. В разработке — `vite` dev server с proxy `/api`.

- `npm run build` → `dist/` (статический SPA).
- Dockerfile multi-stage: `node:lts-alpine` (build) → `nginx:alpine` (раздача `dist/`).
- nginx:
  - `location / { try_files $uri $uri/ /index.html; }` — fallback для клиентского роутинга;
  - `location /api/ { proxy_pass http://api:8000; }` — один origin, без CORS;
  - долгий кэш для `/assets/*` (хэшированные имена), `no-cache` для `index.html`.
- Base URL API не зашивается в сборку (всегда относительный `/api`) → один образ для любых окружений.

## Менеджер пакетов

**npm** (D-019). Коммитим `package-lock.json`, в CI/Docker — `npm ci`.
