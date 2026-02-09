import { Html, Head, Main, NextScript } from 'next/document';
import { ColorSchemeScript } from '@mantine/core';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <ColorSchemeScript />
        <meta name="title" content="Meglerinnsikt" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <meta name="image" content="/og-image.png" />
        <meta name="description" content="Find your next adventure" />

        <meta name="og:title" content="Meglerinnsikt" />
        <meta name="og:description" content="Find your next adventure" />
        <meta name="og:image" content="/og-image.png" />
        <meta property="og:image:secure_url" content="/og-image.png" />
        <meta name="og:url" content="https://wanderlust.hultman.dev" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Meglerinnsikt" />
        <meta property="og_locale" content="en_US" />

        <meta name="twitter:title" content="Meglerinnsikt" />
        <meta name="twitter:description" content="Find your next adventure" />
        <meta name="twitter:image" content="/og-image.png" />
        <meta name="twitter:url" content="https://wanderlust.hultman.dev" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@ACHultman" />

        <link rel="canonical" href="https://wanderlust.hultman.dev" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
