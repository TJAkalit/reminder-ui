import createClient, { type Middleware } from 'openapi-fetch'

import type { paths } from './schema'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

let currentUserId: number | null = null

/** Called by the user selector; every request carries X-User-Id (no auth in the MVP, D-013). */
export function setApiUser(userId: number | null): void {
  currentUserId = userId
}

const userHeader: Middleware = {
  onRequest({ request }) {
    if (currentUserId !== null) {
      request.headers.set('X-User-Id', String(currentUserId))
    }
    return request
  },
}

// Paths in the schema already start with /api, so the base URL is the page origin.
export const api = createClient<paths>({
  baseUrl: globalThis.location?.origin ?? '',
  // Resolve fetch on every call (not at import) so test mocks and polyfills are picked up.
  fetch: (request) => globalThis.fetch(request),
})
api.use(userHeader)

/** Unwraps an openapi-fetch result or throws ApiError. */
export function unwrap<T>(result: { data?: T; error?: unknown; response: Response }): T {
  if (result.data !== undefined) {
    return result.data
  }
  const detail = (result.error as { detail?: unknown } | undefined)?.detail
  const message = typeof detail === 'string' ? detail : `HTTP ${result.response.status}`
  throw new ApiError(result.response.status, message)
}
