import Link from 'next/link'

import { resolveHref } from '@/sanity/lib/utils'
import type { ArtistPayload } from '@/types'

export interface ArtistsPageProps {
  artists: ArtistPayload[]
}

const ArtistsPage = ({ artists }: ArtistsPageProps) => {
  return (
    <div className="flex items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Artists</h1>
      {artists && artists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist, key) => {
            const href = resolveHref(artist?._type, artist?.slug?.current)
            if (!href) {
              return null
            }
            return (
              <Link key={key} href={href}>
                <div className="artist-item">
                  <h2>{artist.name}</h2>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ArtistsPage
