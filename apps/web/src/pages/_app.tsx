import { MantineProvider } from '@mantine/core'
import { AppProps } from 'next/app'
import Head from 'next/head'

import { DefaultMantineColor, Tuple } from '@mantine/core'

type ExtendedCustomColors = 'primary' | 'secondary' | DefaultMantineColor

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>
  }
}

export default function App(props: AppProps) {
  const { Component, pageProps } = props

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Component {...pageProps} />
    </MantineProvider>
  )
}
