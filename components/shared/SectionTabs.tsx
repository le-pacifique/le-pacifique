'use client'

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

import { deterministicRange } from '@/lib/deterministicRandom'

export function SectionTabs({
  seed,
  label,
  accentColor,
  contrastColor,
  sections,
  tabLayout = 'compact',
}: {
  seed: string
  label: string
  accentColor: string
  contrastColor: string
  tabLayout?: 'compact' | 'wide'
  sections: Array<{ key: string; label: string; content: ReactNode }>
}) {
  const id = useId()
  const [activeSection, setActiveSection] = useState(sections[0]?.key)
  const [showTopFade, setShowTopFade] = useState(false)
  const [showBottomFade, setShowBottomFade] = useState(false)
  const [scrollbar, setScrollbar] = useState({ height: 100, top: 0 })
  const [dragging, setDragging] = useState(false)
  const scrollPanelRef = useRef<HTMLDivElement>(null)
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ y: number; scrollTop: number } | null>(null)

  const updateScrollFades = useCallback(() => {
    const panel = scrollPanelRef.current

    if (!panel) return

    const hasOverflow = panel.scrollHeight > panel.clientHeight + 1
    const height = Math.min(
      100,
      (panel.clientHeight / panel.scrollHeight) * 100,
    )
    setScrollbar({
      height,
      top: hasOverflow
        ? Math.min(
            1,
            Math.max(
              0,
              panel.scrollTop / (panel.scrollHeight - panel.clientHeight),
            ),
          ) *
          (100 - height)
        : 0,
    })

    setShowTopFade(hasOverflow && panel.scrollTop > 2)
    setShowBottomFade(
      hasOverflow &&
        panel.scrollTop + panel.clientHeight < panel.scrollHeight - 2,
    )
  }, [])

  useEffect(() => {
    const panel = scrollPanelRef.current

    if (!panel) return

    panel.scrollTop = 0
    const frame = requestAnimationFrame(updateScrollFades)
    const resizeObserver = new ResizeObserver(updateScrollFades)

    resizeObserver.observe(panel)
    if (panel.firstElementChild) {
      resizeObserver.observe(panel.firstElementChild)
    }

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
    }
  }, [activeSection, updateScrollFades])

  const scrollMask = (() => {
    if (showTopFade && showBottomFade) {
      return 'linear-gradient(to bottom, transparent 0, black 2.5rem, black calc(100% - 2.5rem), transparent 100%)'
    }

    if (showTopFade) {
      return 'linear-gradient(to bottom, transparent 0, black 2.5rem, black 100%)'
    }

    if (showBottomFade) {
      return 'linear-gradient(to bottom, black 0, black calc(100% - 2.5rem), transparent 100%)'
    }

    return undefined
  })()

  const getTabStyle = (index: number, active: boolean) => {
    const randomTop = deterministicRange(-10, 10, seed, index, 'top')
    const randomLeft = deterministicRange(-10, 10, seed, index, 'left')
    const randomRotate =
      deterministicRange(
        0,
        tabLayout === 'wide' ? 8 : 20,
        seed,
        index,
        'rotate',
      ) * (index % 2 === 0 ? 1 : -1)

    return {
      top: `${randomTop}px`,
      left: tabLayout === 'wide' ? '0px' : `${randomLeft}px`,
      transform: `rotate(${randomRotate}deg)`,
      '--initial-rotate': `${randomRotate}deg`,
      backgroundColor: active ? contrastColor : accentColor,
      color: active ? accentColor : contrastColor,
    }
  }

  return (
    <div
      className="flex h-full min-h-0 flex-col lg:max-w-3xl"
      style={{ '--artist-scrollbar-hover': accentColor } as CSSProperties}
    >
      <div
        aria-label={label}
        className={`mb-4 flex shrink-0 flex-wrap gap-y-4 py-2 ${tabLayout === 'wide' ? 'gap-x-5' : 'gap-x-3'}`}
        role="tablist"
      >
        {sections.map((section, index) => {
          const active = activeSection === section.key

          return (
            <button
              key={section.key}
              aria-controls={`${id}-panel`}
              aria-selected={active}
              className="relative px-2 py-0 text-sm font-medium uppercase tracking-tight hover:animate-wiggle md:text-xl"
              id={`${id}-tab-${section.key}`}
              onClick={() => setActiveSection(section.key)}
              tabIndex={active ? 0 : -1}
              onKeyDown={(event) => {
                const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
                if (!keys.includes(event.key)) return
                event.preventDefault()
                const next =
                  event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? sections.length - 1
                      : (index +
                          (event.key === 'ArrowRight' ? 1 : -1) +
                          sections.length) %
                        sections.length
                setActiveSection(sections[next].key)
                document
                  .getElementById(`${id}-tab-${sections[next].key}`)
                  ?.focus()
              }}
              role="tab"
              style={getTabStyle(index, active)}
              type="button"
            >
              {section.label}
            </button>
          )
        })}
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          aria-labelledby={`${id}-tab-${activeSection}`}
          className="artist-section-scrollbar h-full overflow-y-auto overscroll-contain pr-3"
          id={`${id}-panel`}
          onScroll={updateScrollFades}
          ref={scrollPanelRef}
          role="tabpanel"
          style={{ maskImage: scrollMask, WebkitMaskImage: scrollMask }}
        >
          {sections.find((section) => section.key === activeSection)?.content}
        </div>
        {scrollbar.height < 100 && (
          <div
            ref={scrollbarRef}
            role="scrollbar"
            aria-label={`${label} scrollbar`}
            aria-controls={`${id}-panel`}
            aria-orientation="vertical"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(
              (scrollbar.top / (100 - scrollbar.height)) * 100,
            )}
            tabIndex={0}
            data-section-scrollbar
            data-dragging={dragging || undefined}
            className="artist-section-scrollbar-control"
            onPointerDown={(event) => {
              if (event.button !== 0) return
              const panel = scrollPanelRef.current
              const rail = scrollbarRef.current
              if (!panel || !rail) return
              event.preventDefault()
              event.currentTarget.setPointerCapture(event.pointerId)
              if (event.target === event.currentTarget) {
                const position =
                  (event.clientY - rail.getBoundingClientRect().top) /
                  rail.clientHeight
                panel.scrollTop =
                  position * panel.scrollHeight - panel.clientHeight / 2
              }
              dragRef.current = { y: event.clientY, scrollTop: panel.scrollTop }
              setDragging(true)
            }}
            onPointerMove={(event) => {
              const panel = scrollPanelRef.current
              const rail = scrollbarRef.current
              const drag = dragRef.current
              if (!panel || !rail || !drag) return
              panel.scrollTop =
                drag.scrollTop +
                ((event.clientY - drag.y) * panel.scrollHeight) /
                  rail.clientHeight
            }}
            onLostPointerCapture={() => {
              dragRef.current = null
              setDragging(false)
            }}
            onPointerUp={(event) =>
              event.currentTarget.releasePointerCapture(event.pointerId)
            }
            onKeyDown={(event) => {
              const panel = scrollPanelRef.current
              if (!panel) return
              const delta = {
                ArrowDown: 40,
                ArrowUp: -40,
                PageDown: panel.clientHeight,
                PageUp: -panel.clientHeight,
              }[event.key]
              if (
                delta === undefined &&
                event.key !== 'Home' &&
                event.key !== 'End'
              )
                return
              event.preventDefault()
              panel.scrollTop =
                event.key === 'Home'
                  ? 0
                  : event.key === 'End'
                    ? panel.scrollHeight
                    : panel.scrollTop + (delta ?? 0)
            }}
          >
            <span
              className="artist-section-scrollbar-handle"
              style={{
                height: `${scrollbar.height}%`,
                top: `${scrollbar.top}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
