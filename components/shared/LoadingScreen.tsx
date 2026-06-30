'use client'

import { usePathname } from 'next/navigation'

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

  return (
    <div
      className={`loading-screen loading-screen--${section} ${className}`.trim()}
      role="status"
      aria-label="Loading"
    >
      <img
        className="loading-screen__spiral"
        src="/images/cursors/cursor-loading.png"
        alt=""
        width={355}
        height={327}
        draggable={false}
      />
    </div>
  )
}
