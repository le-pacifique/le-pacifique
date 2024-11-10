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
      style={{ backgroundColor: collection.backgroundColor.hex }}
    >
      <RotatingCarousel releases={fakeReleases} />
      {/* <div className="absolute inset-0 bg-artistpage-pattern bg-cover bg-center -z-0 blur-sm"></div> */}

      <CollectionTitle name={collection.title} />

      {/* <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10 py-16 lg:py-24">
        {collection.releases && collection.releases.length > 0 ? (
          <div>
            <div className="mt-6 text-lg leading-snug">
              {collection.description?.map((block: any) => {
                if (block._type === 'block') {
                  return (
                    <p key={block._key} className="mb-10">
                      {block.children.map((child: any) => {
                        if (child._type === 'span') {
                          return (
                            <span key={child._key} className="mb-10">
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
            <ul>
              {collection.releases.map((release, key) => {
                console.log(release.slug.current, 'release.slug.current')

                const href = resolveHref(release._type, release.slug.current)
                console.log(release._type, 'release')
                console.log(href)
                if (!href) {
                  return null
                }
                return (
                  <li key={key}>
                    <h3>
                      <Link href={href}>
                        <span>{release.title}</span>
                      </Link>
                    </h3>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : (
          <p>No releases found.</p>
        )}
      </div> */}
    </div>
  )
}

export default CollectionPage
