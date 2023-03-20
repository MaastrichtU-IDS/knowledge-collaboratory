import '@/layout/globals.css'
import type {AppProps} from 'next/app'
import Head from 'next/head'

import dynamic from 'next/dynamic'

const Layout = dynamic(import('../layout/layout'), {ssr: false})

// https://nextjs.org/docs/basic-features/layouts

export default function App({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Knowledge Collaboratory</title>
        <meta name="description" content="Browse and publish RDF Nanopublications with the Knowledge Collaboratory." />
        <link rel="icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#fff" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
