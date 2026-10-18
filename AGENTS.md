# AGENTS.md — reminder-ui

Контекст для ИИ-агентов. Разработка ведётся на разных ПК, поэтому **всё важное о проекте
хранится в репозитории**, а не в памяти агента. Файл читается в начале каждой сессии.

## Правила для агентов (обязательно)

1. **Ничего не коммитить и не пушить**, пока владелец явно не попросит. Это касается `git commit`,
   `git push`, `git tag`, создания веток/PR. Изменения остаются в рабочем дереве.
2. **Вести `TASK.md`**: перед началом работы отметить задачу как «в работе», по завершении —
   отметить выполненной; новые идеи и найденные проблемы добавлять в бэклог.
3. **Обновлять этот `AGENTS.md`**, если принято решение, изменились соглашения, команды
   или структура проекта.
4. Общие архитектурные решения ведутся в `../reminder-backend/docs/decisions.md`.
   Решения со статусом `proposed` перед реализацией уточнить у владельца.
5. Язык документации и общения — русский. Код, идентификаторы, коммиты — на английском.
6. Файл `src/api/schema.d.ts` генерируется из OpenAPI бэкенда — не править руками.

## О проекте

**Reminder** — pet-проект для трекинга привычек. Telegram-бот по расписанию присылает
чек-лист привычек (MVP — утренние, 07:00). Этот репозиторий — веб-UI: показывает привычки,
их расписание, серии выполнения (streaks) и отметки о длительном выполнении (milestones).

Соседний репозиторий `../reminder-backend` — API, worker, Telegram-бот, БД.
Там же общая документация: `docs/architecture.md`, `docs/domain.md`, `docs/decisions.md`.

## Документация этого репозитория

- `docs/architecture.md` — стек, страницы, структура, сборка и деплой в nginx.
- `docs/ui-library-comparison.md` — сравнение PatternFly / React Bootstrap / Mantine / др.
- `TASK.md` — текущие задачи.

## Стек (принят)

Vite 8, TypeScript 6 (strict, `noUncheckedIndexedAccess`), React 19, React Router 8
(пакет `react-router`), **Mantine 9** (+ `@mantine/charts` для heatmap), TanStack Query 5,
openapi-typescript + openapi-fetch, Vitest 5 + Testing Library, MSW 3, oxlint, Prettier.
Сборка в SPA → контейнер nginx (деплой отложен).

Особенности версий (сверено по типам в `node_modules`, не по памяти):

- openapi-typescript 7.x объявляет peer `typescript ^5`; в `package.json` стоит `overrides`,
  который разрешает TS 6 — генерация работает.
- MSW 3: опция `onUnhandledFrame` (а не `onUnhandledRequest`).
- Шаблон Vite 8 использует oxlint вместо ESLint.

## Ключевые решения (кратко)

- MVP — только чтение; привычки добавляются через Telegram-бота.
- Аутентификации нет: селектор пользователя в шапке, заголовок `X-User-Id` (D-013).
  Если пользователь один — выбирается автоматически; 401 от API сбрасывает выбор.
  Позже — вход через Telegram.
- Все запросы — на относительный `/api`; в dev — proxy Vite (`API_PROXY_TARGET`, по умолчанию
  `http://127.0.0.1:8000`).
- Менеджер пакетов — npm (`package-lock.json` в репозитории).

## Структура `src/`

| Путь              | Что лежит                                                                        |
| ----------------- | -------------------------------------------------------------------------------- |
| `api/schema.d.ts` | **Генерируется** из OpenAPI бэкенда (`npm run gen:api`). Не править руками       |
| `api/types.ts`    | Короткие псевдонимы типов из схемы (`Habit`, `Today`…)                           |
| `api/client.ts`   | openapi-fetch клиент, middleware `X-User-Id`, `ApiError`, `unwrap`               |
| `api/queries.ts`  | Хуки TanStack Query; ключи содержат `userId`                                     |
| `user/`           | Выбранный пользователь: контекст, провайдер, localStorage (в try/catch)          |
| `components/`     | Раскладка (`AppLayout`), `UserGate`, бейджи серий/значков, heatmap, `QueryState` |
| `routes/`         | Страницы: `TodayPage`, `HabitsPage` (lazy), `HabitPage` (lazy), 404/ошибка       |
| `lib/`            | Форматирование дат/времени/плюралов (Intl, `ru-RU`), цвета исходов дня           |
| `mocks/`          | MSW: данные, обработчики, `browser.ts` (режим `dev:mock`), `node.ts` (тесты)     |
| `test/`           | `setup.ts` (полифилы jsdom для Mantine, MSW), `renderApp`, тесты страниц         |

Соглашения:

- Даты с API вида `YYYY-MM-DD` — это календарный день пользователя; форматировать с `timeZone: 'UTC'`
  (см. `lib/format.ts`), иначе съедет на день.
- Время (`scheduled_at`) показывать в TZ пользователя из ответа API (`today.timezone`).
- Файлы с компонентами экспортируют только компоненты (oxlint `only-export-components`).
- Клиент вызывает `globalThis.fetch` лениво — иначе MSW в тестах не перехватывает запросы.

## Команды

```bash
npm install
npm run dev            # http://localhost:5173, /api проксируется на бэкенд :8000
npm run dev:mock       # без бэкенда: API отвечает MSW в браузере (src/mocks)
npm run gen:api        # типы из запущенного бэкенда (http://127.0.0.1:8000/openapi.json)
npm run gen:api:file   # типы из ../reminder-backend/openapi.json (`uv run reminder openapi -o openapi.json`)
npm test               # vitest
npm run lint           # oxlint
npm run format         # prettier
npm run build          # tsc -b && vite build → dist/

docker build -t reminder-ui .                               # nginx со статикой
docker run -p 8080:80 -e API_UPSTREAM=http://api:8000 reminder-ui
```

`API_UPSTREAM` — адрес бэкенда без пути (`/api/...` передаётся как есть). Сервер — aarch64:
для него собирать под `linux/arm64`.

## Состояние

Каркас и страницы MVP готовы (Сегодня, Привычки, Привычка с heatmap). Проверено тестами
и вручную на реальном бэкенде (headless-скриншоты). См. `TASK.md`.
