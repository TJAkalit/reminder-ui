import '@mantine/core/styles.css'
import '@mantine/charts/styles.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

import { AppProviders } from './AppProviders'
import { createQueryClient } from './queryClient'
import { routes } from './router'

async function enableMocks(): Promise<void> {
  // `npm run dev:mock`: the whole API is served by MSW in the browser, no backend needed.
  if (import.meta.env.MODE !== 'mock') return
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledFrame: 'bypass' })
}

const root = document.getElementById('root')
if (!root) throw new Error('#root element is missing')

await enableMocks()

createRoot(root).render(
  <StrictMode>
    <AppProviders queryClient={createQueryClient()}>
      <RouterProvider router={createBrowserRouter(routes)} />
    </AppProviders>
  </StrictMode>,
)
