import '@/layout/globals.css'
import type { AppProps } from 'next/app'

import dynamic from 'next/dynamic'

const Layout = dynamic(import ("../layout/layout"), { ssr: false })

// https://nextjs.org/docs/basic-features/layouts

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
