import Image from 'next/image'

import { urlForImage } from '@/sanity/lib/utils'
import type { ArtistPayload } from '@/types'
import ArtistTitle from './ArtistTitle'

export interface ArtistPageProps {
  data: ArtistPayload
}

const ArtistPage = ({ data }: ArtistPageProps) => {
  const artist = data

  return (
    <>
      <ArtistTitle name={artist.name} />
      <div className="absolute inset-0 bg-artistpage-pattern bg-cover bg-center -z-0"></div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 z-10 py-16 lg:py-24 tracking-tight">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-6 lg:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4 order-2 lg:order-1">
            <div className="lg:max-w-lg">
              <p className="mt-6 text-lg leading-snug">{artist.biography}</p>
            </div>
            <div className="mt-4 flex flex-col">
              {artist.links.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          {artist?.image && (
            <Image
              alt="Product screenshot"
              src={urlForImage(artist?.image).url()}
              width={2432}
              height={1442}
              className="order-1 lg:order-2 w-full max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 md:-ml-4 lg:-ml-0"
            />
          )}
        </div>
      </div>
    </>
  )
}

export default ArtistPage
