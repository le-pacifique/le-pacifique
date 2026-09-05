'use client'

import { useEffect, useRef } from 'react'

// Keep the tabs below the animated lettering, including multi-word titles.
export function TitlePanelSpacing({ title }: { title?: string }) {
  const marker = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const page = marker.current?.parentElement
    if (!page || !title?.trim()) return

    let frame = 0
    let disposed = false
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const letters = page.querySelectorAll('[data-title-letter]')
        if (!letters.length) return
        const bottom = Math.max(
          ...Array.from(
            letters,
            (letter) => letter.getBoundingClientRect().bottom,
          ),
        )
        const offset = bottom - page.getBoundingClientRect().top + 24
        page.style.setProperty('--title-panel-offset', `${offset}px`)
      })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(page)
    measure()
    document.fonts.ready.then(() => {
      if (!disposed) measure()
    })
    window.addEventListener('resize', measure)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', measure)
      page.style.removeProperty('--title-panel-offset')
    }
  }, [title])

  return <span ref={marker} hidden />
}
