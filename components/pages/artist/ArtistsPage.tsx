import Link from 'next/link'

import { PageScrollbarTheme } from '@/components/shared/PageScrollbarTheme'
import {
  getResolvedPageTheme,
  type SettingsTheme,
} from '@/lib/theme'
import { resolveHref } from '@/sanity/lib/utils'
import type { ArtistPayload, PageThemePayload } from '@/types'

export interface ArtistsPageProps {
  artists: ArtistPayload[]
  pageTheme?: PageThemePayload
  settingsTheme?: SettingsTheme
}

const ArtistsPage = ({
  artists,
  pageTheme: pageThemeOverride,
  settingsTheme,
}: ArtistsPageProps) => {
  const pageTheme = getResolvedPageTheme({
    backgroundColor: pageThemeOverride?.backgroundColor,
    noteDrawing: pageThemeOverride?.noteDrawing,
    section: 'artists',
    settingsTheme,
  })

  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center"
      style={{ backgroundColor: pageTheme.backgroundColor }}
    >
      <PageScrollbarTheme backgroundColor={pageTheme.backgroundColor} />
      {pageTheme.noteDrawing?.image && (
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${pageTheme.noteDrawing.image})` }}
        />
      )}
      <div className="relative z-10">
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
    </div>
  )
}

export default ArtistsPage
