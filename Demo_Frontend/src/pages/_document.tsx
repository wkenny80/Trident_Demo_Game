import { Html, Main, NextScript, Head } from 'next/document';

export default function Document() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="https://use.typekit.net/ych5thr.css" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }