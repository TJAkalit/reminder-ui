import { Select, type StyleProp } from '@mantine/core'
import { IconUser } from '@tabler/icons-react'

import { useUsers } from '../api/queries'
import { useCurrentUser } from '../user/context'

export function UserSelect({ width = 200 }: { width?: StyleProp<number | string> }) {
  const users = useUsers()
  const { userId, selectUser } = useCurrentUser()

  return (
    <Select
      aria-label="Пользователь"
      placeholder={users.isPending ? 'Загрузка…' : 'Пользователь'}
      leftSection={<IconUser size={16} />}
      data={(users.data ?? []).map((user) => ({
        value: String(user.id),
        label: user.display_name,
      }))}
      value={userId === null ? null : String(userId)}
      onChange={(value) => selectUser(value === null ? null : Number(value))}
      allowDeselect={false}
      w={width}
      size="sm"
    />
  )
}
