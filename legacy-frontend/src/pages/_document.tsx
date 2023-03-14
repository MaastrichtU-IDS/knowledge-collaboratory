import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Knowledge Collaboratory</title>
        <meta name="description" content="Browse and publish RDF Nanopublications with the Knowledge Collaboratory." />
        <link rel="icon" href="/icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
