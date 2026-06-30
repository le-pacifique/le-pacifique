'use client'

import type { MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

type Vector = {
  x: number
  y: number
}

export type FloatingLogoProps = {
  src: string
  size?: number
  mobileSize?: number
  speed?: number
  className?: string
  initialPosition?: Vector
  initialDirection?: Vector
  href?: string
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const getDirection = (initialDirection?: Vector) => {
  let x = initialDirection?.x ?? Math.random() * 2 - 1
  let y = initialDirection?.y ?? Math.random() * 2 - 1

  if (Math.abs(x) < 0.28) x = x < 0 ? -0.28 : 0.28
  if (Math.abs(y) < 0.28) y = y < 0 ? -0.28 : 0.28

  const length = Math.hypot(x, y) || 1
  return { x: x / length, y: y / length }
}

export function FloatingLogo({
  src,
  size = 170,
  mobileSize = 96,
  speed = 32,
  className = '',
  initialPosition,
  initialDirection,
  href,
}: FloatingLogoProps) {
  const router = useRouter()
  const fieldRef = useRef<HTMLDivElement | null>(null)
  const logoRef = useRef<HTMLElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const stateRef = useRef({
    boundsWidth: 0,
    boundsHeight: 0,
    logoWidth: size,
    logoHeight: size,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    lastTime: 0,
    raf: 0,
    seed: Math.random() * Math.PI * 2,
    reducedMotion: false,
    hasPosition: false,
  })

  useEffect(() => {
    const field = fieldRef.current
    const logo = logoRef.current
    const image = imageRef.current
    if (!field || !logo || !image) return

    const state = stateRef.current
    const driftRoom = 7

    const direction = getDirection(initialDirection)
    const speedVariance = speed * (0.86 + Math.random() * 0.28)
    state.vx = direction.x * speedVariance
    state.vy = direction.y * speedVariance

    const getActiveSize = () => {
      return window.innerWidth < 768 ? mobileSize : size
    }

    const measure = () => {
      const fieldRect = field.getBoundingClientRect()
      const activeSize = getActiveSize()
      const imageRatio =
        image.naturalWidth > 0 && image.naturalHeight > 0
          ? image.naturalHeight / image.naturalWidth
          : 752 / 775

      logo.style.width = `${activeSize}px`
      state.boundsWidth = fieldRect.width
      state.boundsHeight = fieldRect.height
      state.logoWidth = activeSize
      state.logoHeight = activeSize * imageRatio

      const maxX = Math.max(
        0,
        state.boundsWidth - state.logoWidth - driftRoom * 2,
      )
      const maxY = Math.max(
        0,
        state.boundsHeight - state.logoHeight - driftRoom * 2,
      )

      if (!state.hasPosition) {
        state.x =
          initialPosition?.x ??
          Math.random() * Math.max(1, maxX * 0.7) + maxX * 0.15
        state.y =
          initialPosition?.y ??
          Math.random() * Math.max(1, maxY * 0.7) + maxY * 0.15
        state.hasPosition = true
      }

      state.x = clamp(state.x, 0, maxX)
      state.y = clamp(state.y, 0, maxY)
    }

    const applyTransform = (time: number) => {
      const driftX = Math.sin(time * 0.00064 + state.seed) * driftRoom
      const driftY = Math.cos(time * 0.00058 + state.seed * 0.7) * driftRoom
      const rotation =
        Math.sin(time * 0.0005 + state.seed) * 5.8 +
        Math.sin(time * 0.0024 + state.seed * 1.6) * 1.6
      const scale =
        1 +
        Math.sin(time * 0.00042 + state.seed * 1.3) * 0.035 +
        Math.sin(time * 0.002 + state.seed) * 0.008
      const skew =
        Math.sin(time * 0.0015 + state.seed * 0.4) * 1.4 +
        Math.sin(time * 0.003 + state.seed) * 0.45

      logo.style.transform = `translate3d(${state.x + driftRoom + driftX}px, ${
        state.y + driftRoom + driftY
      }px, 0) rotate(${rotation}deg) skew(${skew}deg, ${
        skew * -0.4
      }deg) scale(${scale})`
    }

    const applyReducedMotionPosition = () => {
      const maxX = Math.max(0, state.boundsWidth - state.logoWidth)
      const maxY = Math.max(0, state.boundsHeight - state.logoHeight)
      const x = initialPosition?.x ?? maxX * 0.64
      const y = initialPosition?.y ?? maxY * 0.46

      logo.style.transform = `translate3d(${clamp(x, 0, maxX)}px, ${clamp(
        y,
        0,
        maxY,
      )}px, 0) rotate(-2deg) scale(1)`
    }

    const adjustVelocity = () => {
      const currentSpeed = Math.hypot(state.vx, state.vy) || speed
      let angle = Math.atan2(state.vy, state.vx)
      angle += (Math.random() - 0.5) * 0.2

      const tooFlat = Math.abs(Math.sin(angle)) < 0.22
      const tooVertical = Math.abs(Math.cos(angle)) < 0.22
      if (tooFlat) angle += angle > 0 ? 0.22 : -0.22
      if (tooVertical) angle += Math.cos(angle) > 0 ? 0.2 : -0.2

      state.vx = Math.cos(angle) * currentSpeed
      state.vy = Math.sin(angle) * currentSpeed
    }

    const tick = (time: number) => {
      if (state.reducedMotion) {
        applyReducedMotionPosition()
        state.raf = 0
        return
      }

      if (!state.lastTime) state.lastTime = time
      const delta = Math.min((time - state.lastTime) / 1000, 0.04)
      state.lastTime = time

      state.x += state.vx * delta
      state.y += state.vy * delta

      const maxX = Math.max(
        0,
        state.boundsWidth - state.logoWidth - driftRoom * 2,
      )
      const maxY = Math.max(
        0,
        state.boundsHeight - state.logoHeight - driftRoom * 2,
      )

      if (state.x <= 0) {
        state.x = 0
        state.vx = Math.abs(state.vx)
        adjustVelocity()
      } else if (state.x >= maxX) {
        state.x = maxX
        state.vx = -Math.abs(state.vx)
        adjustVelocity()
      }

      if (state.y <= 0) {
        state.y = 0
        state.vy = Math.abs(state.vy)
        adjustVelocity()
      } else if (state.y >= maxY) {
        state.y = maxY
        state.vy = -Math.abs(state.vy)
        adjustVelocity()
      }

      applyTransform(time)
      state.raf = window.requestAnimationFrame(tick)
    }

    const start = () => {
      if (state.raf || state.reducedMotion) return
      state.lastTime = 0
      state.raf = window.requestAnimationFrame(tick)
    }

    const stop = () => {
      if (!state.raf) return
      window.cancelAnimationFrame(state.raf)
      state.raf = 0
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionPreference = () => {
      state.reducedMotion = motionQuery.matches
      measure()

      if (state.reducedMotion) {
        stop()
        applyReducedMotionPosition()
      } else {
        start()
      }
    }

    const handleResize = () => {
      measure()
      if (state.reducedMotion) {
        applyReducedMotionPosition()
      } else {
        applyTransform(performance.now())
      }
    }

    measure()
    handleMotionPreference()

    window.addEventListener('resize', handleResize)
    motionQuery.addEventListener('change', handleMotionPreference)
    image.addEventListener('load', handleResize)

    return () => {
      stop()
      window.removeEventListener('resize', handleResize)
      motionQuery.removeEventListener('change', handleMotionPreference)
      image.removeEventListener('load', handleResize)
    }
  }, [initialDirection, initialPosition, mobileSize, size, speed])

  const setLogoRef = (element: HTMLElement | null) => {
    logoRef.current = element
  }

  const handleLogoClick = (event: MouseEvent<HTMLElement>) => {
    if (
      !href ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()
    router.push(href)
  }

  const logoImage = (
    <img
      ref={imageRef}
      className="floating-logo-field__image"
      src={src}
      alt=""
      draggable={false}
    />
  )

  return (
    <div ref={fieldRef} className={`floating-logo-field ${className}`.trim()}>
      {href ? (
        <a
          ref={setLogoRef}
          className="floating-logo-field__link"
          href={href}
          onClick={handleLogoClick}
          aria-label="Go to homepage"
        >
          {logoImage}
        </a>
      ) : (
        <span ref={setLogoRef} className="floating-logo-field__link">
          {logoImage}
        </span>
      )}
    </div>
  )
}
