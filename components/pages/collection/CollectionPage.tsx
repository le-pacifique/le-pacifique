import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/sanity/lib/utils'
import { resolveHref } from '@/sanity/lib/utils'

import type { CollectionPayload } from '@/types'
import RotatingCarousel from './RotatingCarousel'
import CollectionTitle from './CollectionTitle'

export interface CollectionPageProps {
  data: CollectionPayload
}

const fakeReleases = [
  {
    _id: '1',
    title: 'Release 1',
    image:
      'https://cdn.sanity.io/images/wz2tqa8c/production/02fd887a40569d7604c9f03097019fb643542730-1200x1200.jpg',
    slug: {
      current: 'release-1',
    },
    _type: 'release',
  },
  {
    _id: '2',
    title: 'Release 2',
    image: 'https://f4.bcbits.com/img/a2083187877_2.jpg',
    slug: {
      current: 'release-2',
    },
    _type: 'release',
  },
  {
    _id: '3',
    title: 'Release 3',
    image: 'https://f4.bcbits.com/img/a3427490878_2.jpg',
    slug: {
      current: 'release-3',
    },
    _type: 'release',
  },
  {
    _id: '4',
    title: 'Release 4',
    image: 'https://f4.bcbits.com/img/a4231368697_2.jpg',
    backCover: 'https://f4.bcbits.com/img/a3268430486_16.jpg',
    slug: {
      current: 'release-4',
    },
    _type: 'release',
  },
  {
    _id: '5',
    title: 'Release 5',
    image: 'https://f4.bcbits.com/img/a4076189106_2.jpg',
    slug: {
      current: 'release-5',
    },
    _type: 'release',
  },
  {
    _id: '5',
    title: 'Release 5',
    image: 'https://f4.bcbits.com/img/a0137378437_2.jpg',
    slug: {
      current: 'release-5',
    },
    _type: 'release',
  },
]

const CollectionPage = ({ data }: CollectionPageProps) => {
  const collection = data

  return (
    <div
      className="h-full w-full absolute -z-0"
      style={{ backgroundColor: collection.backgroundColor?.hex }}
    >
      <RotatingCarousel releases={fakeReleases} />
      <CollectionTitle name={collection.title} />
    </div>
  )
}

export default CollectionPage
