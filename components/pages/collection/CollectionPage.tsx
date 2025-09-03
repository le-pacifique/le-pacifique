import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/sanity/lib/utils'
import { resolveHref } from '@/sanity/lib/utils'

import type { CollectionPayload } from '@/types'
import RotatingCarousel from './RotatingCarousel'
import CollectionTitle from './CollectionTitle'
import AnimatedArtistTitle from '../artist/AnimatedArtistTitle'

export interface CollectionPageProps {
  data: CollectionPayload
}

const CollectionPage = ({ data }: CollectionPageProps) => {
  const collection = data
  console.log('Collection data:', collection) // For debugging

  // Format releases for the carousel
  const formattedReleases =
    collection.releases?.map((release) => ({
      _id: release._id,
      title: release.title,
      image: release.image || '', // The image URL from the query
      _type: release._type,
      slug: {
        current: release.slug?.current || '',
      },
      // Add backCover if available
      ...(release.backCover && { backCover: release.backCover }),
    })) || []

  return (
    <div
      className="h-full w-full absolute -z-0"
      style={{ backgroundColor: collection.backgroundColor?.hex }}
    >
      {formattedReleases.length > 0 ? (
        <RotatingCarousel releases={formattedReleases} />
      ) : (
        <div className="flex h-screen items-center justify-center text-white text-2xl">
          No releases found for this collection
        </div>
      )}
      <AnimatedArtistTitle name={collection.title} />
    </div>
  )
}

export default CollectionPage
