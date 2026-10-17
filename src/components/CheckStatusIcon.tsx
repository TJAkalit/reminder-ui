import { ThemeIcon } from '@mantine/core'
import { IconCheck, IconPlayerSkipForward } from '@tabler/icons-react'

import type { CheckStatus } from '../api/types'

const LABELS: Record<CheckStatus, string> = {
  done: 'Выполнено',
  skipped: 'Пропущено',
  pending: 'Не отмечено',
}

export function CheckStatusIcon({ status }: { status: CheckStatus }) {
  const label = LABELS[status]
  switch (status) {
    case 'done':
      return (
        <ThemeIcon color="teal" radius="xl" size="sm" aria-label={label} title={label}>
          <IconCheck size={14} stroke={3} />
        </ThemeIcon>
      )
    case 'skipped':
      return (
        <ThemeIcon
          color="yellow"
          variant="light"
          radius="xl"
          size="sm"
          aria-label={label}
          title={label}
        >
          <IconPlayerSkipForward size={12} />
        </ThemeIcon>
      )
    case 'pending':
      return (
        <ThemeIcon
          color="gray"
          variant="outline"
          radius="xl"
          size="sm"
          aria-label={label}
          title={label}
        >
          {null}
        </ThemeIcon>
      )
  }
}
