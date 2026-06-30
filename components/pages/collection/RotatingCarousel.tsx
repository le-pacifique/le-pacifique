'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { resolveHref } from '@/sanity/lib/utils'

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
  const [viewport, setViewport] = useState({ width: 1024, height: 768 })

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)

    return () => window.removeEventListener('resize', updateViewport)
  }, [])

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

  const orbitRadius = Math.max(
    96,
    Math.min(viewport.width, viewport.height) / 2 - 96,
  )

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <div className="absolute inset-0">
        {releases.map((release, index) => {
          const angle = (360 * index) / releases.length
          const href = resolveHref(release._type, release.slug.current) || '#'

          return (
            <div
              key={release._id}
              className="release-orbit-item absolute left-1/2 top-1/2 z-20 hover:[animation-play-state:paused]"
              style={{
                '--orbit-radius': `${orbitRadius}px`,
                '--orbit-start': `${angle}deg`,
                '--orbit-end': `${angle + 360}deg`,
                '--orbit-start-inverse': `${-angle}deg`,
                '--orbit-end-inverse': `${-(angle + 360)}deg`,
              } as React.CSSProperties}
              onMouseEnter={() => handleMouseEnter(release)}
            >
              <Link
                href={href}
                className="block w-20 h-20 pointer-events-auto bg-blue-500 -translate-x-1/2 -translate-y-1/2 hover:scale-150 skew-x-6 transition-transform"
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
            className="group pointer-events-auto relative z-10 w-[70vw] max-w-96 aspect-square [perspective:1000px]"
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
