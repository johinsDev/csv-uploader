import {
  AppShell,
  Button,
  Container,
  Drawer,
  Footer,
  Group,
  Header,
  Paper,
  Text,
  rem,
  useMantineTheme,
} from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { ParsedUrlQueryInput } from 'querystring'

function useUI(attr: string) {
  const { push, pathname, query } = useRouter()

  const open = (customQuery?: ParsedUrlQueryInput) => {
    push({
      pathname,
      query: {
        ...query,
        ...customQuery,
        ui: attr,
      },
    })
  }

  const close = () => {
    push({
      pathname,
      query: null,
    })
  }

  const uiElement = query.ui as string

  const opened = Boolean(uiElement)

  return {
    open,
    close,
    opened,
    uiElement,
  }
}

enum ModelsToImport {
  Customer = 'customer',
  Product = 'product',
}

function useImportUI() {
  const options = useUI('import-csv')

  return {
    ...options,
    open: (model: ModelsToImport) => {
      options.open({
        model,
      })
    },
  }
}

function AsideContent() {
  const { close, opened } = useImportUI()

  const theme = useMantineTheme()

  return (
    <Drawer
      opened={opened}
      onClose={close}
      title="Authentication"
      position="right"
    >
      <Dropzone
        onDrop={(files) => console.log('accepted files', files)}
        onReject={(files) => console.log('rejected files', files)}
        maxSize={3 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
      >
        <Group
          position="center"
          spacing="xl"
          style={{ minHeight: rem(220), pointerEvents: 'none' }}
        >
          <Dropzone.Accept>
            <IconUpload
              size="3.2rem"
              stroke={1.5}
              color={
                theme.colors[theme.primaryColor][
                  theme.colorScheme === 'dark' ? 4 : 6
                ]
              }
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              size="3.2rem"
              stroke={1.5}
              color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size="3.2rem" stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone>
    </Drawer>
  )
}

export default function IndexPage() {
  const theme = useMantineTheme()

  const { open } = useImportUI()

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      aside={<AsideContent />}
      footer={
        <Footer height={60} p="md">
          Application footer
        </Footer>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: 'flex', alignItems: 'center', height: '100%' }}
          >
            <Text>Application header</Text>
          </div>
        </Header>
      }
    >
      <Container>
        <Paper w={'100%'} h={'100%'} p="lg">
          <Button onClick={() => open(ModelsToImport.Customer)}>
            Import Data
          </Button>
        </Paper>
      </Container>
    </AppShell>
  )
}
