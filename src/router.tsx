import type { RouteObject } from 'react-router'

import { AppLayout } from './components/AppLayout'
import { ErrorPage, NotFoundPage } from './routes/ErrorPages'
import { TodayPage } from './routes/TodayPage'

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <TodayPage /> },
      {
        path: 'habits',
        lazy: async () => ({ Component: (await import('./routes/HabitsPage')).HabitsPage }),
      },
      {
        path: 'habits/:habitId',
        lazy: async () => ({ Component: (await import('./routes/HabitPage')).HabitPage }),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
