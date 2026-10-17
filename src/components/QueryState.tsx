import { Alert, Button, Center, Loader } from '@mantine/core'
import type { UseQueryResult } from '@tanstack/react-query'
import { IconAlertTriangle } from '@tabler/icons-react'
import type { ReactNode } from 'react'

interface Props<T> {
  query: UseQueryResult<T>
  children: (data: T) => ReactNode
}

/** Loader / error / content for a TanStack query. */
export function QueryState<T>({ query, children }: Props<T>) {
  if (query.isPending) {
    return (
      <Center py="xl">
        <Loader aria-label="Загрузка" />
      </Center>
    )
  }
  if (query.isError) {
    return (
      <Alert color="red" icon={<IconAlertTriangle />} title="Не удалось загрузить данные">
        {query.error.message}
        <div>
          <Button mt="sm" size="xs" variant="light" color="red" onClick={() => query.refetch()}>
            Повторить
          </Button>
        </div>
      </Alert>
    )
  }
  return <>{children(query.data)}</>
}
