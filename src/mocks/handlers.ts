import { http, HttpResponse } from 'msw'

import * as data from './data'

function requireUser(request: Request): Response | null {
  const id = Number(request.headers.get('X-User-Id'))
  return data.users.some((user) => user.id === id)
    ? null
    : HttpResponse.json({ detail: 'Unknown user' }, { status: 401 })
}

// `*` matches any origin: relative URLs in the browser, absolute ones in tests.
export const handlers = [
  http.get('*/api/health', () => HttpResponse.json({ status: 'ok', database: 'ok' })),
  http.get('*/api/v1/users', () => HttpResponse.json(data.users)),
  http.get(
    '*/api/v1/today',
    ({ request }) => requireUser(request) ?? HttpResponse.json(data.today),
  ),
  http.get(
    '*/api/v1/routines',
    ({ request }) => requireUser(request) ?? HttpResponse.json(data.routines),
  ),
  http.get(
    '*/api/v1/habits',
    ({ request }) => requireUser(request) ?? HttpResponse.json(data.habits),
  ),
  http.get('*/api/v1/habits/:habitId', ({ request, params }) => {
    const denied = requireUser(request)
    if (denied) return denied
    const habit = data.habits.find((h) => h.id === Number(params.habitId))
    return habit
      ? HttpResponse.json(habit)
      : HttpResponse.json({ detail: 'Habit not found' }, { status: 404 })
  }),
  http.get('*/api/v1/habits/:habitId/history', ({ request, params }) => {
    const denied = requireUser(request)
    return denied ?? HttpResponse.json(data.history(Number(params.habitId)))
  }),
]
