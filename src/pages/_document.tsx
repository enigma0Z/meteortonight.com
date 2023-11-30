import { GTag, MetaTags, NitroAds } from '@enigma0z/brand-resources'
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>

        <Script strategy='afterInteractive' src="https://www.googletagmanager.com/gtag/js?id=G-WZ67KCRGPC"></Script>
        <Script strategy='afterInteractive' id='gtag.js setup'> {`
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-WZ67KCRGPC');
        `} </Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
