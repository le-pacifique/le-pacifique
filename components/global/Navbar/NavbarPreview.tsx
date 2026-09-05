'use client'

import { mergeMenuTheme } from '@/lib/theme'
import { useMenu, useSettings } from '@/sanity/loader/useQuery'

import NavbarLayout from './NavbarLayout'

type Props = {
  initial: Parameters<typeof useSettings>[0]
  initialMenu: Parameters<typeof useMenu>[0]
}

export default function NavbarPreview(props: Props) {
  const { data } = useSettings(props.initial)
  const { data: menu } = useMenu(props.initialMenu)
  const sections = data?.theme?.sections
  const menuSections = menu?.sections
  const menuImageFor = (
    section: 'artists' | 'collections' | 'blog' | 'merch' | 'info',
  ) => ({
    ...(menuSections?.[section]?.image ??
      sections?.[section]?.noteDrawing ??
      {}),
    fit: menuSections?.[section]?.overlayImageFit ?? ('contain' as const),
  })

  return (
    <NavbarLayout
      data={data!}
      artists={[]}
      collections={[]}
      menuTheme={mergeMenuTheme(data?.theme, menu)}
      menuImages={{
        artists: menuImageFor('artists'),
        collections: menuImageFor('collections'),
        blog: menuImageFor('blog'),
        merch: menuImageFor('merch'),
        info: menuImageFor('info'),
      }}
    />
  )
}
