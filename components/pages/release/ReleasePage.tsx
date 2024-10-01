import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/utils'

import type { ReleasePayload } from '@/types'

export interface ReleasePageProps {
  data: ReleasePayload
}

const ReleasePage = ({ data }: ReleasePageProps) => {
  const release = data
  console.log(release, 'release')

  return (
    <div className="">
      <div className="absolute inset-0 bg-artistpage-pattern bg-cover bg-center -z-0 blur-sm"></div>
      {/* <div className="px-4 py-20 bg-[#B798DF]">
        <h2 className="text-2xl font-bold mb-2">Collection Details</h2>
        <p>
          <strong>PCFQ_UNREF2:</strong>
        </p>
        <p>
          <strong>Title:</strong> {collection.title}
        </p>
        <p>
          <strong>Artist:</strong> {collection.artist}
        </p>
        <p>
          <strong>Release Date:</strong> {collection.releaseDate}
        </p>
        <p>
          <strong>Genres:</strong> {collection.genres.join(', ')}
        </p>
      </div> */}

      <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10 py-16 lg:py-24 tracking-tight flex items-center justify-center">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-6 lg:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4 order-2 lg:order-1">
            <div className="lg:max-w-lg">
              <div className="flex flex-col space-y-0">
                <p>
                  <strong>PCFQ_UNREF2:</strong>
                </p>
                <p>
                  <strong>Title:</strong> {release.title}
                </p>
                <p>{/* <strong>Artist:</strong> {release.artist} */}</p>
                <p>
                  <strong>Release Date:</strong> {release.releaseDate}
                </p>
                <p>
                  <strong>Genres:</strong> {release.genres.join(', ')}
                </p>
              </div>

              <div className="mt-6 text-lg leading-snug">
                {release.description?.map((block: any) => {
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
              <h2 className="text-2xl font-bold mb-2">Tracklist</h2>
              <ol className="list-decimal list-inside">
                {release.tracklist?.map((track: any, index: number) => (
                  <li key={index} className="mb-2">
                    {track.title} - {track.duration}
                  </li>
                ))}
              </ol>
            </div>
            {/* <div className="mt-4 flex flex-col">
            {collection.links.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {link}
              </a>
            ))}
          </div> */}
          </div>
          {/* {release?.image && (
            <Image
              alt="Product screenshot"
              src={urlForImage(collection?.image).url()}
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
