import { createContext, useContext } from 'react'

export interface UserContextValue {
  userId: number | null
  selectUser: (id: number | null) => void
}

export const UserContext = createContext<UserContextValue | null>(null)

export function useCurrentUser(): UserContextValue {
  const value = useContext(UserContext)
  if (value === null) {
    throw new Error('useCurrentUser must be used inside <UserProvider>')
  }
  return value
}

/** Fired when the API rejects the selected user (e.g. it no longer exists). */
export const UNAUTHORIZED_EVENT = 'reminder:unauthorized'
