import './globals.css'

import { IBM_Plex_Mono, Inter, PT_Serif } from 'next/font/google'
import localFont from 'next/font/local'

const mono = localFont({
  variable: '--font-supply-mono',
  src: [
    {
      path: '../public/fonts/supply/PPSupplyMono-Ultralight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/supply/PPSupplyMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/supply/PPSupplyMono-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/supply/PPSupplyMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
})

const serif = PT_Serif({
  variable: '--font-serif',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['400', '700'],
})
const sans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${mono.variable} ${sans.variable} ${serif.variable}`}
    >
      <body className="font-mono">{children}</body>
    </html>
  )
}
