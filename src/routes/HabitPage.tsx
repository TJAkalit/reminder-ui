import { Anchor, Badge, Card, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { IconArrowLeft, IconClock } from '@tabler/icons-react'
import { Link, useParams } from 'react-router'

import { useHabit, useHabitHistory } from '../api/queries'
import { HabitHeatmap } from '../components/HabitHeatmap'
import { MilestoneBadges } from '../components/MilestoneBadges'
import { QueryState } from '../components/QueryState'
import { days, formatDate, formatPercent, withEmoji } from '../lib/format'

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Paper withBorder p="md">
      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
        {label}
      </Text>
      <Text size="xl" fw={700}>
        {value}
      </Text>
    </Paper>
  )
}

export function HabitPage() {
  const habitId = Number(useParams().habitId)
  const habit = useHabit(habitId)
  const history = useHabitHistory(habitId)

  return (
    <Stack>
      <Anchor component={Link} to="/habits" size="sm">
        <Group gap={4}>
          <IconArrowLeft size={14} /> Все привычки
        </Group>
      </Anchor>
      <QueryState query={habit}>
        {(data) => (
          <Stack>
            <div>
              <Title order={2}>{withEmoji(data.title, data.emoji)}</Title>
              <Group gap="xs" mt={4}>
                <Text c="dimmed">{withEmoji(data.routine.title, data.routine.emoji)}</Text>
                <Badge variant="light" leftSection={<IconClock size={12} />}>
                  {data.routine.schedule.description}
                </Badge>
                {data.archived_at && (
                  <Badge color="gray" variant="outline">
                    В архиве с {formatDate(data.archived_at.slice(0, 10))}
                  </Badge>
                )}
              </Group>
              {data.description && <Text mt="xs">{data.description}</Text>}
            </div>

            <SimpleGrid cols={{ base: 1, xs: 3 }}>
              <StatTile label="Текущая серия" value={`🔥 ${days(data.stats.current_streak)}`} />
              <StatTile label="Рекорд" value={days(data.stats.best_streak)} />
              <StatTile label="За 30 дней" value={formatPercent(data.stats.completion_rate_30d)} />
            </SimpleGrid>

            <Card withBorder padding="lg">
              <Title order={4} mb="sm">
                Достижения
              </Title>
              {data.stats.milestones.length === 0 && (
                <Text size="sm" c="dimmed" mb="xs">
                  Первый значок — за 7 дней подряд.
                </Text>
              )}
              <MilestoneBadges stats={data.stats} />
            </Card>

            <Card withBorder padding="lg">
              <Title order={4} mb="sm">
                История
              </Title>
              <QueryState query={history}>
                {(historyData) => <HabitHeatmap history={historyData} />}
              </QueryState>
            </Card>
          </Stack>
        )}
      </QueryState>
    </Stack>
  )
}
