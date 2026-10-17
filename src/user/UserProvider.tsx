import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { setApiUser } from '../api/client'
import { UNAUTHORIZED_EVENT, UserContext } from './context'
import { loadUserId, saveUserId } from './storage'

export function UserProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [userId, setUserId] = useState<number | null>(() => {
    const stored = loadUserId()
    setApiUser(stored)
    return stored
  })

  const selectUser = useCallback(
    (id: number | null) => {
      setApiUser(id)
      saveUserId(id)
      setUserId(id)
      // Data of the previous user must not flash on screen.
      queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== 'users' })
    },
    [queryClient],
  )

  useEffect(() => {
    const reset = () => selectUser(null)
    window.addEventListener(UNAUTHORIZED_EVENT, reset)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, reset)
  }, [selectUser])

  const value = useMemo(() => ({ userId, selectUser }), [userId, selectUser])
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
