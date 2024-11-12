import Image from 'next/image'

import { urlForImage } from '@/sanity/lib/utils'
import type { ArtistPayload } from '@/types'
import ArtistTitle from './ArtistTitle'
import CollectionTitle from '../collection/CollectionTitle'

export interface ArtistPageProps {
  data: ArtistPayload
}

const ArtistPage = ({ data }: ArtistPageProps) => {
  const artist = data
  const { noteDrawing, backgroundColor, socialMedia } = data

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
    }
  }

  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center"
      style={{ backgroundColor: backgroundColor?.hex }}
    >
      <CollectionTitle name={artist.name} />
      {noteDrawing?.image && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${noteDrawing.image})` }}
        ></div>
      )}

      <div className="mx-auto max-w-7xl px-4 lg:px-8 z-10 py-12 lg:py-24 tracking-tight">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-0 lg:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4 order-2 lg:order-1">
            <div className="lg:max-w-lg">
              <p className="mt-6 text-sm md:text-base tracking-tighter leading-snug">
                {artist.biography}
              </p>
            </div>
            <div className="mt-16 flex">
              {artist.socialMedia?.map((link, index) => (
                <a
                  key={link._key}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black text-sm md:text-xl mx-3 px-2 py-1 uppercase font-medium tracking-tight hover:animate-wiggle"
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
              src={urlForImage(artist?.image).url()}
              width={2432}
              height={1442}
              className="order-1 lg:order-2 w-full max-w-none ring-1 ring-gray-400/10 md:-ml-4 lg:-ml-0"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ArtistPage
