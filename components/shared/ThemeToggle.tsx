'use client'

import { useSyncExternalStore } from 'react'

import { ThemeIcon } from './ThemeIcon'

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
      <ThemeIcon mode={mode} />
    </button>
  )
}
