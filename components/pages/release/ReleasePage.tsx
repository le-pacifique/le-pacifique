import Image from 'next/image'
import Link from 'next/link'

import { PageScrollbarTheme } from '@/components/shared/PageScrollbarTheme'
import { getResolvedPageTheme, type SettingsTheme } from '@/lib/theme'
import type { ReleasePayload } from '@/types'

import AnimatedArtistTitle from '../artist/AnimatedArtistTitle'

const frame = '/images/frames/player-4.png'

export interface ReleasePageProps {
  data: ReleasePayload
  settingsTheme?: SettingsTheme
}

const ReleasePage = ({ data, settingsTheme }: ReleasePageProps) => {
  const release = data
  const pageTheme = getResolvedPageTheme({
    backgroundColor: release.backgroundColor,
    noteDrawing: release.noteDrawing,
    section: 'releases',
    settingsTheme,
  })
  const releaseTitleColor = release.titleColor?.hex || pageTheme.textColor
  const scrollbarColor = releaseTitleColor

  // Find the index of the current release in the collection
  const currentIndex = release.collection?.releases.findIndex(
    (r) => r._id === release._id,
  )
  const totalReleases = release.collection?.releases.length || 0

  // Get previous and next releases
  const prevRelease =
    currentIndex !== undefined && currentIndex > 0
      ? release.collection.releases[currentIndex - 1]
      : null

  const nextRelease =
    currentIndex !== undefined && currentIndex < totalReleases - 1
      ? release.collection.releases[currentIndex + 1]
      : null

  return (
    <div
      className="release-page-scrollbar min-h-svh w-full relative overflow-x-hidden px-5 pb-28 pt-28 md:px-10 md:pb-32 md:pt-32 lg:px-16"
      style={{
        backgroundColor: pageTheme.backgroundColor,
        color: pageTheme.textColor,
        ['--release-scrollbar-thumb' as string]: scrollbarColor,
        ['--release-scrollbar-track' as string]: pageTheme.backgroundColor,
      }}
    >
      <PageScrollbarTheme backgroundColor={pageTheme.backgroundColor} />
      {pageTheme.noteDrawing?.image && (
        <div
          className="absolute inset-0 min-h-full bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${pageTheme.noteDrawing.image})` }}
        />
      )}
      <AnimatedArtistTitle
        name={release.title}
        color={releaseTitleColor}
        blendMode={false}
        distort
      />

      {/* Release navigation counter */}
      {totalReleases > 1 && (
        <div className="fixed right-5 top-28 z-20 flex items-center gap-3 md:right-10 md:top-32 lg:right-16">
          <div className="distort bg-white/80 px-3 py-1 text-black font-mono text-sm md:text-base">
            {currentIndex !== undefined ? currentIndex + 1 : '?'}/
            {totalReleases}
          </div>

          <div className="flex gap-2">
            {prevRelease && (
              <Link
                href={`/releases/${prevRelease.slug}`}
                className="distort bg-black hover:bg-white text-white hover:text-black border border-white w-10 h-10 flex items-center justify-center rounded-full transition-colors"
                aria-label={`Previous release: ${prevRelease.title}`}
              >
                ←
              </Link>
            )}

            {nextRelease && (
              <Link
                href={`/releases/${nextRelease.slug}`}
                className="distort bg-black hover:bg-white text-white hover:text-black border border-white w-10 h-10 flex items-center justify-center rounded-full transition-colors"
                aria-label={`Next release: ${nextRelease.title}`}
              >
                →
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto grid w-full max-w-[88rem] grid-cols-1 gap-12 tracking-tight xl:grid-cols-[minmax(0,1fr)_minmax(20rem,34rem)] xl:items-center">
        <div className="order-2 xl:order-1">
          <div className="max-w-5xl">
            <div className="distort-text">
              <div className="flex flex-col">
                <p className="mb-0 mt-4 text-3xl leading-none">
                  {release.title}
                </p>

                <div className="flex -mt-3 mb-2">
                  {release.artists?.map((artist, index) => {
                    if (!artist) return null

                    // Internal artist reference (from Sanity)
                    if (
                      artist._type === 'artist' &&
                      'slug' in artist &&
                      artist.slug &&
                      typeof artist.slug === 'object'
                    ) {
                      return (
                        <div
                          key={artist._id || artist.name}
                          className="flex items-center"
                        >
                          <Link
                            href={`/artists/${artist.slug.current}`}
                            className="hover:text-[#C6F042] hover:underline transition-colors"
                          >
                            {artist.name}
                          </Link>
                          {index < release.artists.length - 1 && (
                            <span className="mx-1">, </span>
                          )}
                        </div>
                      )
                    }
                    // External artist object
                    if ('url' in artist && artist.url) {
                      return (
                        <div key={artist.name} className="flex items-center">
                          <a
                            href={artist.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#FF4517] hover:underline transition-colors"
                          >
                            {artist.name}
                          </a>
                          {index < release.artists.length - 1 && (
                            <span className="mx-1">, </span>
                          )}
                        </div>
                      )
                    }
                    // Fallback for external artist without URL
                    if (artist.name) {
                      return (
                        <div key={artist.name} className="flex items-center">
                          <span>{artist.name}</span>
                          {index < release.artists.length - 1 && (
                            <span className="mx-1">, </span>
                          )}
                        </div>
                      )
                    }
                    return null
                  })}
                </div>

                <div className="mt-0 flex flex-wrap gap-2">
                  {release.genres?.map((genre, index) => (
                    <span
                      key={index}
                      className="bg-[#000] px-1 py-0.5 pb-1.5 li text-sm uppercase leading-none text-white"
                    >
                      <span className="distort inline-block">{genre}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-sm leading-snug md:text-lg">
                {release.description?.map((block: any) => {
                  if (block._type === 'block') {
                    return (
                      <p key={block._key} className="mb-4">
                        {block.children?.map((child: any) => {
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

              {/* Tracklist dropdown */}
              <div className="mt-6">
                <h3 className="mb-2 text-sm font-bold md:text-base">
                  Tracklist
                </h3>
                <ol className="list-decimal list-inside mb-6">
                  {release.tracklist?.map((track: any, index: number) => (
                    <li key={index} className="text-sm md:text-base">
                      {track.title} - {track.duration}
                    </li>
                  ))}
                </ol>
              </div>
              {/* <label>
                <input
                  className="peer/showLabel absolute scale-0"
                  type="checkbox"
                />
                <span className="block max-h-14 max-w-xs overflow-hidden py-0 transition-all duration-300 peer-checked/showLabel:max-h-64">
                  <h3 className="flex h-14 cursor-pointer items-center font-bold text-sm md:text-base">
                    Tracklist
                  </h3>
                  <ol className="list-decimal list-inside mb-2">
                    {release.tracklist?.map((track: any, index: number) => (
                      <li key={index} className="text-sm md:text-md">
                        {track.title} - {track.duration}
                      </li>
                    ))}
                  </ol>
                </span>
              </label> */}

              {/* Bandcamp Player */}
              {release.bandcampPlayer && (
                <div className="mt-8 relative">
                  <Image
                    className="absolute -left-4 -top-[0.55rem] h-16 w-[calc(100%+2rem)] max-w-[26rem] pointer-events-none"
                    src={frame}
                    alt="Player frame"
                    width={7409}
                    height={1327}
                  />
                  {/* <h3 className="font-bold text-sm md:text-base mb-3">
                    Listen
                  </h3> */}
                  <div
                    className="w-full max-w-96 overflow-hidden"
                    style={{ maxWidth: '24rem' }}
                  >
                    <iframe
                      style={{ border: 0, width: '100%', height: '120px' }}
                      src={release.bandcampPlayer}
                      seamless
                      allow="autoplay"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="order-1 mx-auto aspect-square w-full max-w-[30rem] [perspective:1000px] md:max-w-[34rem] xl:order-2">
          <div className="relative h-full w-full shadow-xl transition-all duration-500 [transform-style:preserve-3d] animate-continuousFlip pointer-events-none">
            {/* Front Face */}
            <div className="absolute inset-0 h-full w-full [backface-visibility:hidden]">
              {release?.image && (
                <Image
                  className="h-full w-full object-cover object-left"
                  src={release.image}
                  alt={release.title}
                  width={2432}
                  height={1442}
                />
              )}
            </div>
            {/* Back Face */}
            <div className="absolute inset-0 h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
              {release?.backCover ? (
                <Image
                  className="h-full w-full object-cover object-left"
                  src={release.backCover}
                  alt={release.title}
                  width={2432}
                  height={1442}
                />
              ) : (
                <Image
                  className="h-full w-full object-cover object-left"
                  src={release.image}
                  alt={release.title}
                  width={2432}
                  height={1442}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReleasePage
