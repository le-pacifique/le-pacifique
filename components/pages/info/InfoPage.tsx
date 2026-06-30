import { PortableText } from '@portabletext/react'
import Image from 'next/image'

import { PageScrollbarTheme } from '@/components/shared/PageScrollbarTheme'
import { deterministicRange } from '@/lib/deterministicRandom'
import {
  getResolvedPageTheme,
  getSectionTheme,
  type SettingsTheme,
} from '@/lib/theme'
import { urlForImage } from '@/sanity/lib/utils'
import type { InfoPayload } from '@/types'

export interface InfoPageProps {
  info: InfoPayload
  menuImage?: {
    image: string
    title?: string
  }
  settingsTheme?: SettingsTheme
}

const InfoPage = ({ info, menuImage, settingsTheme }: InfoPageProps) => {
  const pageTheme = getResolvedPageTheme({
    backgroundColor: info.backgroundColor,
    noteDrawing: info.noteDrawing,
    section: 'info',
    settingsTheme,
  })
  const drawing = pageTheme.noteDrawing ?? menuImage
  const socialButtonColor = getSectionTheme(
    settingsTheme,
    'artists',
  ).backgroundColor

  const generateSocialButtonStyles = (index: number) => {
    const randomTop = deterministicRange(-10, 10, info._id, index, 'top')
    const randomLeft = deterministicRange(-10, 10, info._id, index, 'left')
    const randomRotate =
      deterministicRange(0, 20, info._id, index, 'rotate') *
      (index % 2 === 0 ? 1 : -1)

    return {
      top: `${randomTop}px`,
      left: `${randomLeft}px`,
      transform: `rotate(${randomRotate}deg)`,
      '--initial-rotate': `${randomRotate}deg`,
      backgroundColor: socialButtonColor,
    }
  }

  return (
    <div
      className="min-h-screen w-full relative"
      style={{ backgroundColor: pageTheme.backgroundColor }}
    >
      <PageScrollbarTheme backgroundColor={pageTheme.backgroundColor} />
      <div className="relative w-full flex py-16 pb-8 lg:py-32 lg:pb-16 px-8">
        {info.logos?.map((logo: any, i: number) => {
          // If logo.image exists, use it. Otherwise, use urlForImage(logo).url() if logo.asset exists.
          const imageSrc =
            logo.image ?? (logo.asset ? urlForImage(logo)?.url() : '')
          return (
            imageSrc && (
              <Image
                key={logo._id || logo._key || i}
                src={imageSrc}
                alt={logo.title || logo.alt || 'Logo'}
                width={2000}
                height={2000}
                className="w-full h-full transition-all duration-500"
              />
            )
          )
        })}
      </div>
      {/* Background image from navbar or noteDrawing */}
      {drawing?.image && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${drawing.image})`,
          }}
        ></div>
      )}

      <div className="distort-text relative z-10 mx-auto px-8 tracking-tight">
        {info.description && (
          <div className="text-black columns-1 lg:columns-3 mb-8">
            <PortableText value={info.description} />
          </div>
        )}

        {info.contactEmail && (
          <div className="mb-4 text-black">
            <a href={`mailto:${info.contactEmail}`}>{info.contactEmail}</a>
          </div>
        )}

        {info.socialMedia && info.socialMedia.length > 0 && (
          <div className="mb-4 mt-8 flex">
            {info.socialMedia.map((sm, i) => (
              <a
                key={sm._key || i}
                href={sm.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-3 bg-white px-2 py-0 text-sm font-medium uppercase tracking-tight text-black first:ml-0 hover:animate-wiggle md:text-xl"
                style={generateSocialButtonStyles(i)}
              >
                {sm.title}
              </a>
            ))}
          </div>
        )}

        {info.pressKit && info.pressKit.length > 0 && (
          <div className="mb-4 text-white">
            <strong>Press Kit:</strong>
            <ul>
              {info.pressKit.map((pk, i) => {
                // Patch asset to always have _type
                const fileObj =
                  pk.file && pk.file.asset
                    ? {
                        ...pk.file,
                        asset: {
                          ...pk.file.asset,
                          _type: pk.file.asset._type ?? 'reference',
                        },
                      }
                    : undefined
                const fileUrl = fileObj ? urlForImage(fileObj)?.url() ?? '' : ''
                return (
                  <li key={i}>
                    {fileUrl ? (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pk.title}
                      </a>
                    ) : (
                      <span>{pk.title}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default InfoPage
