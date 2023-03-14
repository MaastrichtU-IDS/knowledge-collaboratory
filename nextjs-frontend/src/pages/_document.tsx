import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Knowledge Collaboratory</title>
        <meta name="description" content="Browse and publish RDF Nanopublications with the Knowledge Collaboratory." />
        <link rel="icon" href="/icon.png" />
        <link rel="manifest" href="~/manifest.json" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
