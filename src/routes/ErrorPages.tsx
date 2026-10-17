import { Button, Center, Stack, Text, Title } from '@mantine/core'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

export function NotFoundPage() {
  return (
    <Center py="xl">
      <Stack align="center">
        <Title order={2}>Страница не найдена</Title>
        <Button component={Link} to="/" variant="light">
          На главную
        </Button>
      </Stack>
    </Center>
  )
}

export function ErrorPage() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Неизвестная ошибка'
  return (
    <Center py="xl">
      <Stack align="center">
        <Title order={2}>Что-то пошло не так</Title>
        <Text c="dimmed">{message}</Text>
        <Button component="a" href="/" variant="light">
          Перезагрузить
        </Button>
      </Stack>
    </Center>
  )
}
