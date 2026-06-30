import '@/styles/index.css'

import type { Metadata, Viewport } from 'next'
import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { toPlainText } from 'next-sanity'
import { Suspense, type CSSProperties } from 'react'

import { Navbar } from '@/components/global/Navbar'
import { FloatingLogo } from '@/components/shared/FloatingLogo'
import { colorToHex, getSectionTheme, sectionThemeKeys } from '@/lib/theme'
import { urlForOpenGraphImage } from '@/sanity/lib/utils'
import {
  loadBlog,
  loadHomePage,
  loadInfo,
  loadSettings,
} from '@/sanity/loader/loadQuery'

const LiveVisualEditing = dynamic(
  () => import('@/sanity/loader/LiveVisualEditing'),
)

export async function generateMetadata(): Promise<Metadata> {
  const [{ data: settings }, { data: homePage }] = await Promise.all([
    loadSettings(),
    loadHomePage(),
  ])

  const siteTitle = settings?.seo?.siteTitle || homePage?.title
  const description =
    settings?.seo?.description ||
    (homePage?.overview ? toPlainText(homePage.overview) : undefined)
  const ogImage = urlForOpenGraphImage(settings?.seo?.ogImage ?? settings?.ogImage)
  const favicon = settings?.seo?.favicon?.asset?.url
  const appleTouchIcon = settings?.seo?.appleTouchIcon?.asset?._ref
    ? urlForOpenGraphImage(settings.seo.appleTouchIcon)
    : undefined

  return {
    title: siteTitle
      ? {
          template: `%s | ${siteTitle}`,
          default: siteTitle || 'Le Pacifique',
        }
      : undefined,
    description,
    icons: {
      icon: favicon || '/favicon.ico',
      apple: appleTouchIcon || '/iconpcfq.png',
    },
    openGraph: {
      title: siteTitle,
      description,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#000',
}

export default async function IndexRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const draft = await draftMode()
  const [{ data: settings }, { data: homePage }, { data: blog }, { data: info }] =
    await Promise.all([loadSettings(), loadHomePage(), loadBlog(), loadInfo()])
  const loadingThemeStyle = sectionThemeKeys.reduce((styles, section) => {
    styles[`--loading-background-${section}` as string] = getSectionTheme(
      settings?.theme,
      section,
    ).backgroundColor

    return styles
  }, {} as CSSProperties)

  loadingThemeStyle['--loading-background-home' as string] =
    colorToHex(homePage?.backgroundColor) ??
    loadingThemeStyle['--loading-background-home']
  loadingThemeStyle['--loading-background-blog' as string] =
    colorToHex(blog?.backgroundColor) ??
    loadingThemeStyle['--loading-background-blog']
  loadingThemeStyle['--loading-background-info' as string] =
    colorToHex(info?.backgroundColor) ??
    loadingThemeStyle['--loading-background-info']

  return (
    <>
      <FloatingLogo
        src="/images/logothique.png"
        size={192}
        mobileSize={128}
        speed={26}
        href="/"
      />
      <div
        className="flex min-h-svh flex-col text-black"
        style={loadingThemeStyle}
      >
        <Suspense>
          <Navbar />
        </Suspense>
        <div className="flex-1">
          <Suspense>{children}</Suspense>
        </div>
      </div>
      {draft.isEnabled && <LiveVisualEditing />}
    </>
  )
}
