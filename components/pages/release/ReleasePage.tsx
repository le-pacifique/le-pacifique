import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/utils'

import type { ReleasePayload } from '@/types'
import CollectionTitle from '../collection/CollectionTitle'

export interface ReleasePageProps {
  data: ReleasePayload
}

const ReleasePage = ({ data }: ReleasePageProps) => {
  const release = data

  console.log(release.collection.releases, 'release data')
  // Find the index of the current release in the collection
  const currentIndex = release.collection?.releases.findIndex(
    (r) => r._id === release._id,
  )
  const totalReleases = release.collection?.releases.length || 0
  const nextRelease =
    currentIndex !== undefined && currentIndex < totalReleases - 1
      ? release.collection.releases[currentIndex + 1]
      : null

  return (
    <div className="">
      {/* <div className="absolute inset-0 bg-artistpage-pattern bg-cover bg-center -z-0 blur-sm"></div> */}
      <div className="mx-auto max-w-full px-4 lg:px-8 relative z-10 py-12 lg:py-24 tracking-tight flex items-center justify-center">
        <CollectionTitle name="PCFQ-UNREF" />
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 lg:gap-x-56 gap-y-6 lg:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4 order-2 lg:order-1 lg:px-24">
            <div className="lg:max-w-lg">
              <div className="flex flex-col">
                {/* <p className="text-xl md:text-2xl">
                  <strong>PCFQ_UNREF2</strong>
                  {release.releaseDate}
                </p> */}
                <p className="text-3xl mb-0 leading-none mt-4">
                  {release.title}
                </p>
                {/* <div className="mt-8">
                  <h2 className="text-2xl font-bold">
                    Collection: {release.collection?.title}
                  </h2>
                  <p>Total Releases in Collection: {totalReleases}</p>
                  {currentIndex !== undefined && (
                    <p>
                      Release {currentIndex + 1} of {totalReleases}
                    </p>
                  )}
                  {nextRelease && (
                    <a
                      href={`/releases/${nextRelease.slug.current}`}
                      className="text-blue-500 hover:underline"
                    >
                      Next Release &rarr;
                    </a>
                  )}
                </div> */}
                <div className="flex -mt-3 mb-2">
                  {release.artists.map((artist, index) => (
                    <div key={artist._id}>
                      <span>{artist.name}</span>
                      {index < release.artists.length - 1 && ', '}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {release.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="border border-black px-2 py-1 rounded-none text-sm hover:bg-black hover:text-white"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-sm md:text-md leading-snug">
                {release.description?.map((block: any) => {
                  if (block._type === 'block') {
                    return (
                      <p key={block._key} className="mb-4">
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
              <label>
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
              </label>
            </div>
          </div>

          <div className="group lg:w-[90%] aspect-square [perspective:1000px] order-1 lg:order-2">
            <div className="relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] animate-continuousFlip">
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

          {/* {release?.image && (
            <Image
              alt="Product screenshot"
              src={release?.image}
              width={2432}
              height={1442}
              className="order-1 lg:order-2 w-full max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 md:-ml-4 lg:-ml-0"
            />
          )} */}
        </div>
      </div>
    </div>
  )
}

export default ReleasePage
