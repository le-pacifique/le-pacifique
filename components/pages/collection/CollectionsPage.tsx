import Link from 'next/link'

import { resolveHref } from '@/sanity/lib/utils'
import type { CollectionPayload } from '@/types'

export interface CollectionsPageProps {
  collections: CollectionPayload[]
}

const CollectionsPage = ({ collections }: CollectionsPageProps) => {
  return (
    <div className="bg-[#9D9998] h-full w-full flex items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Collections</h1>
      {collections && collections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, key) => {
            const href = resolveHref(
              collection?._type,
              collection?.slug?.current,
            )
            console.log(collection._type, 'collection')
            console.log(href)
            if (!href) {
              return null
            }
            return (
              <Link key={key} href={href}>
                <h2>{collection.title}</h2>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CollectionsPage
