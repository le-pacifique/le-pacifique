import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/sanity/lib/utils'
import { resolveHref } from '@/sanity/lib/utils'

import type { CollectionPayload } from '@/types'

export interface CollectionPageProps {
  data: CollectionPayload
}

const CollectionPage = ({ data }: CollectionPageProps) => {
  const collection = data
  console.log(collection, 'collection')

  return (
    <div className="">
      <div className="absolute inset-0 bg-artistpage-pattern bg-cover bg-center -z-0 blur-sm"></div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10 py-16 lg:py-24 tracking-tight flex items-center justify-center">
        <h1>{collection.title}</h1>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10 py-16 lg:py-24">
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
      </div>
    </div>
  )
}

export default CollectionPage
