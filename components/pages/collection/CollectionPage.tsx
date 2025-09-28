import Image from 'next/image'
import Link from 'next/link'

import { urlForImage } from '@/sanity/lib/utils'
import { resolveHref } from '@/sanity/lib/utils'
import type { CollectionPayload } from '@/types'

import AnimatedArtistTitle from '../artist/AnimatedArtistTitle'
import CollectionTitle from './CollectionTitle'
import RotatingCarousel from './RotatingCarousel'
import { theme } from '@/lib/theme'

export interface CollectionPageProps {
  data: CollectionPayload
}

const CollectionPage = ({ data }: CollectionPageProps) => {
  const collection = data

  const formattedReleases =
    collection.releases?.map((release) => ({
      _id: release._id,
      title: release.title,
      image: release.image || '',
      _type: release._type,
      slug: {
        current: release.slug?.current || '',
      },
      ...(release.backCover && { backCover: release.backCover }),
      artists: (release.artists || []).map((artist: any) => ({
        ...artist,
        slug:
          typeof artist.slug === 'object' ? artist.slug?.current : artist.slug,
      })),
    })) || []

  const collectionColor = theme.colors.menu.Collections.background

  return (
    <div
      className="h-full w-full absolute -z-0"
      style={{ backgroundColor: collection.backgroundColor?.hex }}
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

      {collection.noteDrawing?.image && (
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${collection.noteDrawing.image})` }}
        ></div>
      )}

      {collection.description && (
        <div className="absolute top-[30%] right-[5%] z-40 max-w-xl p-6 rounded-lg text-black max-h-[50vh] overflow-y-auto ">
          {collection.description?.map((block: any) => {
            if (block._type === 'block') {
              return (
                <p
                  key={block._key}
                  className="mb-3 text-sm md:text-xl leading-snug"
                >
                  {block.children?.map((child: any) => {
                    if (child._type === 'span') {
                      return (
                        <span
                          key={child._key}
                          className={
                            child.marks?.includes('strong') ? 'font-bold' : ''
                          }
                        >
                          {child.text}
                        </span>
                      )
                    }

                    return null
                  })}
                  {block.children?.map((child: any) => {
                    if (child._type === 'span') {
                      return (
                        <span
                          key={child._key}
                          className={
                            child.marks?.includes('strong') ? 'font-bold' : ''
                          }
                        >
                          {child.text}
                        </span>
                      )
                    }

                    return null
                  })}
                </p>
              )
            }
            return null
          })}
        </div>
      )}
      {formattedReleases.length > 0 ? (
        <RotatingCarousel releases={formattedReleases} />
      ) : (
        <div className="flex h-screen items-center justify-center text-white text-2xl">
          No releases found for this collection
        </div>
      )}
      <AnimatedArtistTitle name={collection.title} color={collectionColor} />
    </div>
  )
}

export default CollectionPage
