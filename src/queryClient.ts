import { QueryCache, QueryClient } from '@tanstack/react-query'

import { ApiError } from './api/client'
import { UNAUTHORIZED_EVENT } from './user/context'

export function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof ApiError && error.status === 401) {
          window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (count, error) => !(error instanceof ApiError && error.status < 500) && count < 2,
      },
    },
  })
}
