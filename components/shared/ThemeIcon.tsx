import { useId } from 'react'

export function ThemeIcon({ mode }: { mode: 'light' | 'dark' | 'negative' }) {
  const grainId = `theme-ink-${useId().replace(/:/g, '')}`

  return (
    <svg className="theme-mode-icon shrink-0" width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <filter id={grainId} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" seed="9" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="0.65" xChannelSelector="R" yChannelSelector="G" result="ink" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.6 0 0 0 0.15" />
          <feComposite in="ink" operator="in" />
        </filter>
      </defs>
      <g transform={mode === 'light' ? undefined : 'translate(3.6 3.6) scale(0.85)'} stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${grainId})`}>
        {mode === 'light' ? (
          <>
            <path d="M6.5 36.5 C5.8 31 7.4 22 10.1 17.5 C12.8 12.3 18 7.1 23.3 8.7 C29.8 7.4 35.8 14.2 38.1 20 C40.6 25.9 40 31.9 41.2 36.2" />
            <path d="M13.3 36.9 C12 29.3 14.5 20.5 18.4 17.8 C21.9 14.2 25.8 16.1 28.6 19.4 C33.2 23.5 33.7 31.4 34.1 36.5" />
            <path d="M20.2 36.4 C19.3 32 20.3 26.6 22.5 25 C24.5 22.9 27.3 27.3 27.5 31.5 L27.9 36.9" />
            <path d="M4 39 L10 38.5 M35.9 39 L43.4 38.4" strokeWidth="3.2" />
          </>
        ) : mode === 'dark' ? (
          <>
            <path d="M28.7 6.6 C21.5 5.3 13.8 9.8 10.1 16.4 C6.5 22 7.8 30.4 12.8 35.5 C17.8 41.5 26.2 42.9 32.8 38.1 C36.4 35.9 38.5 32.6 39.1 28.9 C32.9 32.3 25.6 30 22.3 24.9 C18.5 19.6 21.3 10.6 28.7 6.6Z" />
          </>
        ) : (
          <>
            <path d="M23.1 6.8 C31.1 5.5 39.2 12.8 40.3 21.3 C42.6 29 36.7 38.4 28.4 40.2 C20.6 43.2 10.5 37.8 8.3 29.6 C5.2 22.3 9.3 12 16.1 8.8 C18.4 7.6 20.3 7 23.1 6.8Z" />
            <path d="M24 7.2 L23.1 13.4 L24.4 19.9 L23.5 26.8 L24.5 33.5 L23.8 40.5 C33.2 41.5 42.6 30.5 40.1 21 C38.8 13.5 31.6 6.9 24 7.2Z" fill="currentColor" strokeWidth="2" />
            <path d="M17 13.2 L13.7 17.6" strokeWidth="2" />
          </>
        )}
      </g>
    </svg>
  )
}
