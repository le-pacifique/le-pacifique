import type { EncodeDataAttributeCallback } from '@sanity/react-loader'
import Image from 'next/image'
import Link from 'next/link'

// import logo from '/public/images/banners/B13.png'
import logo from '/public/images/banners/homepage.svg'
import logoBis from '/public/images/banners/B13bis.png'
import { Header } from '@/components/shared/Header'
import { resolveHref } from '@/sanity/lib/utils'
import type { HomePagePayload } from '@/types'
import LogoTitle from './LogoTitle'
import Stickies from './Stickies'

export interface HomePageProps {
  data: HomePagePayload | null
  encodeDataAttribute?: EncodeDataAttributeCallback
}

export function HomePage({ data, encodeDataAttribute }: HomePageProps) {
  // Default to an empty object to allow previews on non-existent documents
  const { logos, popupText } = data ?? {}

  console.log(data, 'data homepage')

  const randomLogo =
    logos && logos.length > 0
      ? logos[Math.floor(Math.random() * logos.length)]
      : null

  return (
    <div className="h-full w-full flex items-center justify-center">
      {/* <LogoTitle name="Le Pacifique" /> */}

      {randomLogo?.image && (
        <Image
          className="z-[19] min-w-96 max-w-[90rem] hidden md:flex p-10"
          src={randomLogo.image}
          alt={randomLogo.title || 'PCFQ Logo'}
          width={2500} // Adjust the width as needed
          height={2500} // Adjust the height as needed
        />
      )}

      <Image
        className="z-[19] max-w-60 p-4 -mt-12 md:hidden"
        src={logoBis}
        alt="PCFQ Logo"
      />

      <Stickies text={popupText} />
    </div>
  )
}

export default HomePage
