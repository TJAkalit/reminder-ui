import { Badge, Group, Text, Tooltip } from '@mantine/core'
import { IconAward } from '@tabler/icons-react'

import type { HabitStats } from '../api/types'
import { days, formatDate } from '../lib/format'

interface Props {
  stats: HabitStats
  /** Also show «до 14 дней: ещё 3». */
  withNext?: boolean
}

export function MilestoneBadges({ stats, withNext = true }: Props) {
  const next = stats.next_milestone
  if (stats.milestones.length === 0 && !withNext) {
    return null
  }
  return (
    <Group gap={6} wrap="wrap">
      {stats.milestones.map((milestone) => (
        <Tooltip
          key={milestone.threshold}
          label={`Достигнуто ${formatDate(milestone.achieved_on)}`}
          withArrow
        >
          <Badge color="grape" variant="light" leftSection={<IconAward size={14} />}>
            {days(milestone.threshold)}
          </Badge>
        </Tooltip>
      ))}
      {withNext && next && (
        <Text size="xs" c="dimmed">
          до {days(next.threshold)}: ещё {next.remaining}
        </Text>
      )}
    </Group>
  )
}
