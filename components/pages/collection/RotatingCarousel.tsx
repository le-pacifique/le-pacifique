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
      <div className="animate-orbit group hover:[animation-play-state:paused] relative">
        {releases.map((release, index) => {
          const angle = (2 * Math.PI * index) / releases.length // Calculate angle for each item
          const x = radiusX * Math.cos(angle) // X position based on the angle
          const y = radiusY * Math.sin(angle) // Y position based on the angle
          const href = resolveHref(release._type, release.slug.current)

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
          {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none [backface-visibility:hidden]">
            <div className="w-64 h-64 z-10">
              <img
                src={focusedRelease.image}
                alt={focusedRelease.title}
                className="w-full h-full object-cover animate-skew"
              />
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-xl font-bold text-white">
                {focusedRelease.title}
              </div>
            </div>
          </div> */}
          <div
            key={focusedRelease.title}
            className="group h-64 w-64 md:h-96 md:w-96 [perspective:1000px]"
          >
            <div className="relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              {/* Front Face */}
              <div className="absolute inset-0 h-full w-full rounded-xl [backface-visibility:hidden]">
                {focusedRelease.image && (
                  <Image
                    className="object-cover cursor-pointer object-left h-full w-full rounded-xl"
                    src={focusedRelease.image}
                    alt={focusedRelease.title}
                    width={320}
                    height={320}
                  />
                )}
              </div>
              {/* Back Face */}
              <div className="absolute inset-0 h-full w-full rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                {focusedRelease.backCover ? (
                  <Image
                    className="object-cover cursor-pointer object-left h-full w-full rounded-xl"
                    src={focusedRelease.backCover}
                    alt={focusedRelease.title}
                    width={320}
                    height={320}
                  />
                ) : (
                  <Image
                    className="object-cover cursor-pointer object-left h-full w-full rounded-xl"
                    src={focusedRelease.image}
                    alt={focusedRelease.title}
                    width={320}
                    height={320}
                  />
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
