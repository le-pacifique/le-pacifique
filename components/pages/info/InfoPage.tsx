import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { theme } from '@/lib/theme'
import { urlForImage } from '@/sanity/lib/utils'
import type { InfoPayload } from '@/types'
import AnimatedArtistTitle from '../artist/AnimatedArtistTitle'
import AnimatedTitle from './AnimatedTitle'

export interface InfoPageProps {
  info: InfoPayload
  menuImage?: {
    image: string
    title?: string
  }
}

const InfoPage = ({ info, menuImage }: InfoPageProps) => {
  const bgColor =
    info.backgroundColor?.hex || theme.colors.menu.Info?.background || '#222'

  console.log(info)

  return (
    <div
      className="min-h-screen w-full relative"
      style={{ backgroundColor: bgColor }}
    >
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
      {(menuImage?.image || info.noteDrawing?.image) && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${menuImage?.image || info.noteDrawing?.image})`,
          }}
        ></div>
      )}

      <div className="relative z-10 mx-auto px-8 tracking-tight">
        {/* <h1 className="text-[6rem] font-bold mb-8 text-black tracking-tight uppercase leading-[0.75]">
          {info.title}
        </h1> */}

        <AnimatedTitle
          text={info.title}
          color="#000"
          size="text-4xl lg:text-[6.5rem]"
          style={{ filter: 'url(#roughText)' }}
        />

        {info.description && (
          <div className="text-black columns-1 lg:columns-3 mb-8">
            <PortableText value={info.description} />
          </div>
        )}

        {info.contactEmail && (
          <div className="mb-4 text-white">
            <strong>Contact:</strong>{' '}
            <a href={`mailto:${info.contactEmail}`}>{info.contactEmail}</a>
          </div>
        )}

        {info.socialMedia && info.socialMedia.length > 0 && (
          <div className="mb-4 text-white">
            <strong>Social Media:</strong>
            <ul>
              {info.socialMedia.map((sm, i) => (
                <li key={i}>
                  <a href={sm.href} target="_blank" rel="noopener noreferrer">
                    {sm.title}
                  </a>
                </li>
              ))}
            </ul>
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
