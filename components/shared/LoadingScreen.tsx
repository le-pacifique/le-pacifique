'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import {
  getLoadingSpiralPath,
  getLoadingSpiralTurns,
} from '@/lib/loadingSpiral'

type LoadingScreenProps = {
  className?: string
}

const getLoadingSection = (pathname: string | null) => {
  if (!pathname || pathname === '/') return 'home'
  if (pathname.startsWith('/artists')) return 'artists'
  if (pathname.startsWith('/collections')) return 'collections'
  if (pathname.startsWith('/blog')) return 'blog'
  if (pathname.startsWith('/merch')) return 'merch'
  if (pathname.startsWith('/info')) return 'info'
  if (pathname.startsWith('/releases')) return 'releases'
  if (pathname.startsWith('/projects')) return 'projects'
  return 'pages'
}

export function LoadingScreen({ className = '' }: LoadingScreenProps) {
  const section = getLoadingSection(usePathname())
  const pathRef = useRef<SVGPathElement>(null)
  const spiralRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let startedAt: number | undefined
    let lastDraw = -Infinity

    const draw = (time: number) => {
      startedAt ??= time
      if (time - lastDraw >= 50) {
        const elapsed = time - startedAt
        pathRef.current?.setAttribute(
          'd',
          getLoadingSpiralPath(getLoadingSpiralTurns(elapsed)),
        )
        spiralRef.current?.style.setProperty(
          '--loading-spiral-growth',
          String(1 - Math.exp(-elapsed / 800)),
        )
        lastDraw = time
      }
      frame = requestAnimationFrame(draw)
    }
    const updateMotion = () => {
      cancelAnimationFrame(frame)
      if (!reducedMotion.matches) frame = requestAnimationFrame(draw)
    }

    updateMotion()
    reducedMotion.addEventListener('change', updateMotion)
    return () => {
      cancelAnimationFrame(frame)
      reducedMotion.removeEventListener('change', updateMotion)
    }
  }, [])

  return (
    <div
      className={`loading-screen loading-screen--${section} ${className}`.trim()}
      role="status"
      aria-label="Loading"
    >
      <svg
        ref={spiralRef}
        className="loading-screen__spiral"
        viewBox="-170 -170 340 340"
        aria-hidden="true"
        focusable="false"
        fill="currentColor"
      >
        <path
          ref={pathRef}
          d={getLoadingSpiralPath(getLoadingSpiralTurns(0))}
        />
      </svg>
    </div>
  )
}
