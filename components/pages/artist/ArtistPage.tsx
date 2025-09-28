import Image from 'next/image'

import { theme } from '@/lib/theme'
import { urlForImage } from '@/sanity/lib/utils'
import type { ArtistPayload } from '@/types'

import CollectionTitle from '../collection/CollectionTitle'
import AnimatedArtistTitle from './AnimatedArtistTitle'
import ArtistTitle from './ArtistTitle'

export interface ArtistPageProps {
  data: ArtistPayload
}

const ArtistPage = ({ data }: ArtistPageProps) => {
  const artist = data
  const { noteDrawing, backgroundColor, socialMedia, layout } = data

  const isLeft = layout === 'left'
  const bgColor = theme.colors.menu.Artists.background

  // Function to generate random styles
  const generateRandomStyles = (index: number) => {
    const randomTop = Math.random() * 20 - 10 // Random value between -10 and 10
    const randomLeft = Math.random() * 20 - 10 // Random value between -10 and 10
    const randomRotate = Math.random() * 20 * (index % 2 === 0 ? 1 : -1) // Alternate rotation between positive and negative

    return {
      top: `${randomTop}px`,
      left: `${randomLeft}px`,
      transform: `rotate(${randomRotate}deg)`,
      '--initial-rotate': `${randomRotate}deg`,
      backgroundColor: `${bgColor}`,
    }
  }

  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center"
      style={{ backgroundColor: backgroundColor?.hex }}
      // style={{ backgroundColor: bgColor }}
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

      {/* <CollectionTitle
        name={artist.name}
        style={{ filter: 'url(#roughText)' }}
      /> */}

      <AnimatedArtistTitle
        name={artist.name}
        style={{ filter: 'url(#roughText)' }}
      />

      {noteDrawing?.image && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${noteDrawing.image})` }}
        ></div>
      )}

      <div className="mx-auto px-4 lg:px-48 z-10 py-12 lg:py-24 tracking-tight">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-0 lg:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center">
          <div
            className={`${
              isLeft ? 'order-2 lg:order-2' : 'order-2 lg:order-1'
            }`}
          >
            <div className="lg:max-w-3xl">
              <p className="mt-6 text-sm md:text-xl tracking-tight leading-snug text-black">
                {artist.biography}
              </p>
            </div>
            <div className="mt-8 flex">
              {artist.socialMedia?.map((link, index) => (
                <a
                  key={link._key}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black text-sm md:text-xl mx-3 first:ml-0 px-2 py-0 uppercase font-medium tracking-tight hover:animate-wiggle"
                  style={generateRandomStyles(index)}
                >
                  {link.title}
                </a>
              ))}
            </div>
          </div>

          {artist?.image && (
            <Image
              alt="Artist image"
              src={urlForImage(artist.image)?.url() ?? ''}
              width={2432}
              height={1442}
              className={`max-h-96 mx-auto lg:h-[75vh] lg:max-h-none w-auto md:-ml-4 lg:-ml-0 rounded-[8px] border-4 border-[${bgColor}] ${
                isLeft ? 'order-1 lg:order-1' : 'order-1 lg:order-2'
              }`}
              style={{ borderColor: bgColor }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ArtistPage
