import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import type { SiteLogoPayload } from '@/types'

const fallbackLogo = {
  alt: 'Le Pacifique',
  desktopWidth: 96,
  height: 752,
  image: '/images/logothique.png',
  mobileWidth: 64,
  width: 775,
}

type LogoStyle = CSSProperties & {
  '--site-logo-desktop-width': string
  '--site-logo-mobile-width': string
}

export function SiteLogo({ logo }: { logo?: SiteLogoPayload }) {
  const image = logo?.image || fallbackLogo.image
  const alt = logo?.alt || fallbackLogo.alt
  const width = logo?.dimensions?.width || fallbackLogo.width
  const height = logo?.dimensions?.height || fallbackLogo.height
  const logoStyle: LogoStyle = {
    '--site-logo-desktop-width': `${logo?.desktopWidth || fallbackLogo.desktopWidth}px`,
    '--site-logo-mobile-width': `${logo?.mobileWidth || fallbackLogo.mobileWidth}px`,
  }

  return (
    <Link
      href="/"
      aria-label="Go to the Le Pacifique homepage"
      className="fixed left-1/2 top-2 z-50 block w-[var(--site-logo-mobile-width)] -translate-x-1/2 sm:top-3 md:w-[var(--site-logo-desktop-width)]"
      data-testid="site-logo"
      style={logoStyle}
    >
      <Image
        src={image}
        alt={alt}
        width={width}
        height={height}
        priority
        unoptimized={image.startsWith('http')}
        className="h-auto w-full select-none object-contain"
      />
    </Link>
  )
}
