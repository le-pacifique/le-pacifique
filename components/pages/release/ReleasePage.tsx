import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/sanity/lib/utils'
import type { ReleasePayload } from '@/types'
import CollectionTitle from '../collection/CollectionTitle'
import AnimatedArtistTitle from '../artist/AnimatedArtistTitle'
import frame from '/public/images/frames/player-4.png'

export interface ReleasePageProps {
  data: ReleasePayload
}

const ReleasePage = ({ data }: ReleasePageProps) => {
  const release = data

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
    <div className="h-full w-full min-h-screen relative flex items-center justify-center">
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
      <div className="mx-auto max-w-full px-4 lg:px-8 relative z-10 py-12 lg:py-24 tracking-tight flex items-center justify-center">
        <AnimatedArtistTitle
          name={release.title}
          style={{ filter: 'url(#roughText)' }}
        />

        {/* Release navigation counter */}
        {totalReleases > 1 && (
          <div className="fixed top-32 right-8 z-20 flex items-center gap-4">
            <div className="bg-white/80 px-3 py-1 rounded-md text-black font-mono text-sm">
              {currentIndex !== undefined ? currentIndex + 1 : '?'}/
              {totalReleases}
            </div>

            <div className="flex gap-2">
              {prevRelease && (
                <Link
                  href={`/releases/${prevRelease.slug}`}
                  className="bg-black hover:bg-white text-white hover:text-black border border-white w-10 h-10 flex items-center justify-center rounded-full transition-colors"
                >
                  ←
                </Link>
              )}

              {nextRelease && (
                <Link
                  href={`/releases/${nextRelease.slug}`}
                  className="bg-black hover:bg-white text-white hover:text-black border border-white w-10 h-10 flex items-center justify-center rounded-full transition-colors"
                >
                  →
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="hmx-auto grid max-w-2xl grid-cols-1 gap-x-8 lg:gap-x-8 gap-y-6 lg:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:mt-16 lg:items-center">
          <div className="order-2 lg:order-1 lg:px-0">
            <div className="lg:max-w-3xl">
              <div className="flex flex-col">
                <p className="text-3xl mb-0 leading-none mt-4">
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

                <div className="flex flex-wrap gap-2 mt-0">
                  {release.genres?.map((genre, index) => (
                    <span
                      key={index}
                      className="text-white px-2 border rounded-full leading-[1] py-1 pt-0.5 text-sm lowercase"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-sm md:text-lg leading-snug">
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
                <h3 className="font-bold text-sm md:text-base mb-2">
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
                    className="absolute -left-4 -top-[0.55rem] w-[26rem] h-[4rem] pointer-events-none"
                    src={frame}
                    alt="Player frame"
                  />
                  {/* <h3 className="font-bold text-sm md:text-base mb-3">
                    Listen
                  </h3> */}
                  <div
                    className="w-full overflow-hidden rounded"
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

          <div className="group lg:w-[90%] aspect-square [perspective:1000px] order-1 lg:order-2">
            <div className="relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] animate-continuousFlip pointer-events-none">
              {/* Front Face */}
              <div className="absolute inset-0 h-full w-full rounded-xl [backface-visibility:hidden]">
                {release?.image && (
                  <Image
                    className="object-cover cursor-pointer object-left h-full w-full rounded-xl"
                    src={release.image}
                    alt={release.title}
                    width={2432}
                    height={1442}
                  />
                )}
              </div>
              {/* Back Face */}
              <div className="absolute inset-0 h-full w-full rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                {release?.backCover ? (
                  <Image
                    className="object-cover cursor-pointer object-left h-full w-full rounded-xl"
                    src={release.backCover}
                    alt={release.title}
                    width={2432}
                    height={1442}
                  />
                ) : (
                  <Image
                    className="object-cover cursor-pointer object-left h-full w-full rounded-xl"
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
    </div>
  )
}

export default ReleasePage
