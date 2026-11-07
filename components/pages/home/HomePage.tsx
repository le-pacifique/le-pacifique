'use client'
import type { EncodeDataAttributeCallback } from '@sanity/react-loader'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { PageScrollbarTheme } from '@/components/shared/PageScrollbarTheme'
import { getResolvedPageTheme, type SettingsTheme } from '@/lib/theme'
import type { HomePagePayload } from '@/types'

import LogoTitle from './LogoTitle'

const logoBis = '/images/banners/B13bis.png'
const homeLogoStorageKey = 'le-pacifique-home-logo-index'

export interface HomePageProps {
  data: HomePagePayload | null
  encodeDataAttribute?: EncodeDataAttributeCallback
  settingsTheme?: SettingsTheme
}

export function HomePage({
  data,
  settingsTheme,
}: HomePageProps) {
  // Default to an empty object to allow previews on non-existent documents
  const { backgroundColor, logos, noteDrawing, textColor } = data ?? {}
  const pageTheme = getResolvedPageTheme({
    backgroundColor,
    textColor,
    noteDrawing,
    section: 'home',
    settingsTheme,
  })

  const [logoIndex, setLogoIndex] = useState<number | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (!logos?.length) {
        setLogoIndex(null)
        return
      }

      try {
        const storedIndex = Number.parseInt(
          window.localStorage?.getItem(homeLogoStorageKey) ?? '-1',
          10,
        )
        const nextIndex = Number.isFinite(storedIndex)
          ? (storedIndex + 1) % logos.length
          : 0

        window.localStorage?.setItem(homeLogoStorageKey, String(nextIndex))
        setLogoIndex(nextIndex)
      } catch {
        setLogoIndex(Math.floor(Math.random() * logos.length))
      }
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [logos])

  const rotatingLogo =
    logos && logos.length > 0 && logoIndex !== null ? logos[logoIndex] : null

  return (
    <div
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: pageTheme.backgroundColor }}
    >
      <PageScrollbarTheme backgroundColor={pageTheme.backgroundColor} />
      <svg className="hidden">
        <filter id="roughText">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.02"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
        </filter>
      </svg>
      {pageTheme.noteDrawing?.image && (
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${pageTheme.noteDrawing.image})` }}
        />
      )}
      {rotatingLogo?.image && (
        <Image
          className="z-[19] min-w-96 max-w-[100rem] hidden md:flex px-10"
          src={rotatingLogo.image}
          alt={rotatingLogo.title || 'PCFQ Logo'}
          width={2500} // Adjust the width as needed
          height={2500} // Adjust the height as needed
        />
      )}
      <Image
        className="z-[19] max-w-60 p-4 -mt-12 md:hidden"
        src={logoBis}
        alt="PCFQ Logo"
        width={521}
        height={1508}
      />
      <LogoTitle
        name="Le Pacifique"
        color={pageTheme.textColor}
        style={{ filter: 'url(#roughText)' }}
      />
    </div>
  )
}

export default HomePage
