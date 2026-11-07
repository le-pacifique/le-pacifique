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
  const sourceImage = logo?.image || fallbackLogo.image
  const image = sourceImage.includes(
    '7ec0e61c83927430d7e22435c8c4271927711145-1000x1000.png',
  )
    ? '/images/pcfq-menu-transparent.png'
    : sourceImage
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
      <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
        <defs>
          <filter id="site-logo-thicker" x="-5%" y="-5%" width="110%" height="110%">
            <feMorphology
              in="SourceGraphic"
              operator="dilate"
              radius="0.3"
              result="thickerLogo"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="2"
              seed="7"
              result="logoGrain"
            />
            <feDisplacementMap
              in="thickerLogo"
              in2="logoGrain"
              scale="0.7"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <Image
        src={image}
        alt={alt}
        width={width}
        height={height}
        priority
        style={image === '/images/pcfq-menu-transparent.png' ? { filter: 'url(#site-logo-thicker)' } : undefined}
        unoptimized={image.startsWith('http')}
        className="h-auto w-full select-none object-contain"
      />
    </Link>
  )
}
