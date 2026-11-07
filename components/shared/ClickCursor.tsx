'use client'

import { useEffect, useRef } from 'react'

export function ClickCursor() {
  const cursorRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    let animation: Animation | null = null
    let overLink = false
    const root = document.documentElement
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const interactive =
      'a, button, summary, label, [role="button"], [role="link"], input[type="button"], input[type="submit"], input[type="reset"], .cursor-pointer'

    const render = () => {
      const visible =
        Boolean(animation || overLink) &&
        cursor.complete &&
        cursor.naturalWidth > 0
      cursor.hidden = !visible
      root.toggleAttribute('data-cursor-spinning', visible)
      cursor.style.filter = overLink ? 'invert(1)' : 'none'
      cursor.style.mixBlendMode = overLink ? 'difference' : 'normal'
    }

    const stop = () => {
      animation?.cancel()
      animation = null
      overLink = false
      render()
    }

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      cursor.style.left = `${event.clientX - 3}px`
      cursor.style.top = `${event.clientY - 3}px`
      if (
        event.target instanceof Element &&
        event.target.closest('[data-section-scrollbar]')
      ) {
        animation?.cancel()
        animation = null
        overLink = false
        render()
        return
      }
      overLink =
        event.target instanceof Element &&
        Boolean(event.target.closest(interactive))
      render()
    }

    const spin = (event: PointerEvent) => {
      if (
        (event.target instanceof Element &&
          event.target.closest('[data-section-scrollbar]')) ||
        event.pointerType !== 'mouse' ||
        event.button !== 0 ||
        reducedMotion.matches ||
        !cursor.complete ||
        !cursor.naturalWidth
      )
        return

      animation?.cancel()
      move(event)
      animation = cursor.animate(
        [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
        { duration: 420, easing: 'ease-out' },
      )
      render()
      animation.onfinish = () => {
        animation?.cancel()
        animation = null
        render()
      }
    }

    window.addEventListener('pointerdown', spin)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', move)
    window.addEventListener('blur', stop)
    document.addEventListener('pointerleave', stop)

    return () => {
      stop()
      window.removeEventListener('pointerdown', spin)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', move)
      window.removeEventListener('blur', stop)
      document.removeEventListener('pointerleave', stop)
    }
  }, [])

  return (
    // A native-size image keeps the animated cursor aligned with its CSS counterpart.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={cursorRef}
      src="/images/cursors/arrow-grain.png"
      width={43}
      height={48}
      alt=""
      aria-hidden="true"
      hidden
      className="pointer-events-none fixed z-[2147483647] select-none"
    />
  )
}
