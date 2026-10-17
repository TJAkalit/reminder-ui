import { useQuery } from '@tanstack/react-query'

import { useCurrentUser } from '../user/context'
import { api, unwrap } from './client'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => unwrap(await api.GET('/api/v1/users')),
  })
}

/** Query keys include the user id, so switching users refetches everything. */
function useUserKey() {
  const { userId } = useCurrentUser()
  return { userId, enabled: userId !== null }
}

export function useToday() {
  const { userId, enabled } = useUserKey()
  return useQuery({
    queryKey: ['today', userId],
    queryFn: async () => unwrap(await api.GET('/api/v1/today')),
    enabled,
    // The checklist changes from Telegram; keep the page reasonably fresh.
    refetchInterval: 60_000,
  })
}

export function useRoutines() {
  const { userId, enabled } = useUserKey()
  return useQuery({
    queryKey: ['routines', userId],
    queryFn: async () => unwrap(await api.GET('/api/v1/routines')),
    enabled,
  })
}

export function useHabits(includeArchived = false) {
  const { userId, enabled } = useUserKey()
  return useQuery({
    queryKey: ['habits', userId, { includeArchived }],
    queryFn: async () =>
      unwrap(
        await api.GET('/api/v1/habits', {
          params: { query: { include_archived: includeArchived } },
        }),
      ),
    enabled,
  })
}

export function useHabit(habitId: number) {
  const { userId, enabled } = useUserKey()
  return useQuery({
    queryKey: ['habit', userId, habitId],
    queryFn: async () =>
      unwrap(
        await api.GET('/api/v1/habits/{habit_id}', { params: { path: { habit_id: habitId } } }),
      ),
    enabled: enabled && Number.isInteger(habitId),
  })
}

export function useHabitHistory(habitId: number) {
  const { userId, enabled } = useUserKey()
  return useQuery({
    queryKey: ['habit-history', userId, habitId],
    queryFn: async () =>
      unwrap(
        await api.GET('/api/v1/habits/{habit_id}/history', {
          params: { path: { habit_id: habitId } },
        }),
      ),
    enabled: enabled && Number.isInteger(habitId),
  })
}
