import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'

import { AppProviders } from '../AppProviders'
import { createQueryClient } from '../queryClient'
import { routes } from '../router'

/** Renders the whole app at `path`, with the real providers and MSW-mocked API. */
export function renderApp(path = '/', { userId }: { userId?: number } = {}) {
  if (userId !== undefined) {
    localStorage.setItem('reminder.userId', String(userId))
  }
  const queryClient = createQueryClient()
  queryClient.setDefaultOptions({ queries: { retry: false } })
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>,
  )
}
