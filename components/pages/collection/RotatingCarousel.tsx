'use client'
import { useState } from 'react'
import { resolveHref } from '@/sanity/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export interface RotatingCarouselProps {
  releases: {
    _id: string
    title: string
    image: string
    backCover?: string
    _type: string
    slug: {
      current: string
    }
    artists?: Array<{
      name: string
      slug?: string
      url?: string
      _id?: string
      _type?: string
    }>
  }[]
}

const RotatingCarousel = ({ releases }: RotatingCarouselProps) => {
  const [focusedRelease, setFocusedRelease] = useState(releases[0])
  const [radiusX, setRadiusX] = useState(500) // Adjust the radius to control the orbit size
  const [radiusY, setRadiusY] = useState(200) // Adjust the radius to control the orbit size

  const handleMouseEnter = (release: {
    _id: string
    title: string
    image: string
    backCover?: string
    _type: string
    slug: {
      current: string
    }
  }) => {
    setFocusedRelease(release)
  }

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="absolute top-1/2 -translate-y-1/2 left-[5%] text-8xl max-w-xl flex flex-col mix-blend-difference z-[1000] pointer-events-none">
        <span className="text-[#FF4517] leading-[0.85]">
          {focusedRelease.title}
        </span>
        {focusedRelease.artists && focusedRelease.artists.length > 0 && (
          <span className="text-4xl mt-2">
            {focusedRelease.artists.map((artist) => artist.name).join(', ')}
          </span>
        )}
      </div>

      <div className="animate-orbit group hover:[animation-play-state:paused] relative">
        {releases.map((release, index) => {
          const angle = (2 * Math.PI * index) / releases.length // Calculate angle for each item
          const x = radiusX * Math.cos(angle) // X position based on the angle
          const y = radiusY * Math.sin(angle) // Y position based on the angle
          const href = resolveHref(release._type, release.slug.current) || '#'

          return (
            <div
              key={release._id}
              className="absolute transform group-hover:[animation-play-state:paused] animate-backwards-rotation"
              style={{
                left: `calc(10vw + ${x}px)`,
                top: `calc(-10vh + ${y}px)`,
                transform: `translate(-50%, -50%)`, // Center each item at its calculated position
              }}
              onMouseEnter={() => handleMouseEnter(release)}
            >
              <Link
                href={href}
                className="block w-20 h-20 bg-blue-500 hover:scale-150 skew-x-6"
                style={{
                  backgroundImage: `url(${release.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <span className="sr-only">{release.title}</span>
              </Link>
            </div>
          )
        })}
      </div>
      {focusedRelease && (
        <>
          <div
            key={focusedRelease.title}
            className="group w-[80vw] aspect-square md:w-96 [perspective:1000px]"
          >
            <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] animate-continuousFlip">
              {/* Front Face */}
              <div className="absolute inset-0 h-full w-full rounded-xl [backface-visibility:hidden]">
                {focusedRelease.image && (
                  <Link
                    href={
                      resolveHref(
                        focusedRelease._type,
                        focusedRelease.slug.current,
                      ) || '#'
                    }
                    className="block h-full w-full"
                  >
                    <Image
                      className="object-cover cursor-pointer object-left h-full w-full rounded-xl"
                      src={focusedRelease.image}
                      alt={focusedRelease.title}
                      width={320}
                      height={320}
                    />
                  </Link>
                )}
              </div>
              {/* Back Face */}
              <div className="absolute inset-0 h-full w-full rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                {focusedRelease.backCover ? (
                  <Link
                    href={
                      resolveHref(
                        focusedRelease._type,
                        focusedRelease.slug.current,
                      ) || '#'
                    }
                    className="block h-full w-full"
                  >
                    <Image
                      className="object-cover cursor-pointer object-left h-full w-full rounded-xl"
                      src={focusedRelease.backCover}
                      alt={focusedRelease.title}
                      width={320}
                      height={320}
                    />
                  </Link>
                ) : (
                  <Link
                    href={
                      resolveHref(
                        focusedRelease._type,
                        focusedRelease.slug.current,
                      ) || '#'
                    }
                    className="block h-full w-full"
                  >
                    <Image
                      className="object-cover cursor-pointer object-left h-full w-full rounded-xl"
                      src={focusedRelease.image}
                      alt={focusedRelease.title}
                      width={320}
                      height={320}
                    />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default RotatingCarousel
