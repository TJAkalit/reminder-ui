import { Card, Stack, Text, Title } from '@mantine/core'
import { useEffect, type ReactNode } from 'react'

import { useUsers } from '../api/queries'
import { useCurrentUser } from '../user/context'
import { QueryState } from './QueryState'
import { UserSelect } from './UserSelect'

/** Renders pages only when a user is selected (the MVP stand-in for login, D-013). */
export function UserGate({ children }: { children: ReactNode }) {
  const users = useUsers()
  const { userId, selectUser } = useCurrentUser()

  const only = users.data?.length === 1 ? users.data[0] : undefined
  useEffect(() => {
    if (userId === null && only) {
      selectUser(only.id)
    }
  }, [userId, only, selectUser])

  if (userId !== null) {
    return <>{children}</>
  }
  return (
    <QueryState query={users}>
      {(list) => (
        <Card withBorder padding="lg" maw={420} mx="auto" mt="xl">
          <Stack>
            <Title order={3}>Кто вы?</Title>
            {list.length === 0 ? (
              <Text c="dimmed">
                Пользователей пока нет. Напишите Telegram-боту <b>/start</b> — и обновите страницу.
              </Text>
            ) : (
              <>
                <Text c="dimmed">Выберите пользователя, чтобы увидеть его привычки.</Text>
                <UserSelect width="100%" />
              </>
            )}
          </Stack>
        </Card>
      )}
    </QueryState>
  )
}
