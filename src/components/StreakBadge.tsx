import { Badge, Tooltip } from '@mantine/core'
import { IconFlame } from '@tabler/icons-react'

import { days } from '../lib/format'

interface Props {
  streak: number
  size?: 'sm' | 'md' | 'lg'
}

export function StreakBadge({ streak, size = 'md' }: Props) {
  const active = streak > 0
  return (
    <Tooltip label={active ? `Серия: ${days(streak)} подряд` : 'Серии пока нет'} withArrow>
      <Badge
        size={size}
        variant={active ? 'light' : 'outline'}
        color={active ? 'orange' : 'gray'}
        leftSection={<IconFlame size={14} />}
        aria-label={`Серия ${streak}`}
      >
        {streak}
      </Badge>
    </Tooltip>
  )
}
