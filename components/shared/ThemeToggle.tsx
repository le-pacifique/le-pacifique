'use client'

import { useSyncExternalStore } from 'react'

const storageKey = 'le-pacifique-color-mode'
const modes = ['light', 'dark', 'negative'] as const
const names = { light: 'Couleur', dark: 'Sombre', negative: 'Négatif' }
const isMode = (value: string | undefined): value is (typeof modes)[number] =>
  modes.some((mode) => mode === value)

function subscribe(callback: () => void) {
  window.addEventListener('pacifique-theme-change', callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener('pacifique-theme-change', callback)
    window.removeEventListener('storage', callback)
  }
}

export function ThemeToggle() {
  const mode = useSyncExternalStore(
    subscribe,
    () => {
      const value = document.documentElement.dataset.theme
      return isMode(value) ? value : 'light'
    },
    () => 'light' as const,
  )
  const next = modes[(modes.indexOf(mode) + 1) % modes.length]

  const toggle = () => {
    document.documentElement.dataset.theme = next
    try { localStorage.setItem(storageKey, next) } catch {}
    window.dispatchEvent(new Event('pacifique-theme-change'))
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Thème ${names[mode]}. Activer le thème ${names[next]}`}
      title={`Thème ${names[mode]} — passer à ${names[next]}`}
      onClick={toggle}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        {mode === 'negative' ? (
          <><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" /></>
        ) : mode === 'dark' ? (
          <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>
        ) : (
          <path d="M20.8 13.1A9 9 0 0 1 10.9 3.2 9 9 0 1 0 20.8 13.1Z" />
        )}
      </svg>
      <span>{names[mode]}</span>
    </button>
  )
}
