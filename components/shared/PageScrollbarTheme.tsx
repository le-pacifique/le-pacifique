'use client'

import { useEffect } from 'react'

type PageScrollbarThemeProps = {
  backgroundColor?: string
}

export function PageScrollbarTheme({
  backgroundColor,
}: PageScrollbarThemeProps) {
  useEffect(() => {
    if (!backgroundColor) return

    document.documentElement.style.setProperty(
      '--site-page-background',
      backgroundColor,
    )
    document.documentElement.style.setProperty(
      '--site-scrollbar-track',
      backgroundColor,
    )
  }, [backgroundColor])

  return null
}
