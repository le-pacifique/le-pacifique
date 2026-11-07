import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'

import { getBlogCategories } from '@/lib/blogCategories'
import { mergeMenuTheme } from '@/lib/theme'
import {
  loadArticles,
  loadHomePage,
  loadMenu,
  loadSettings,
} from '@/sanity/loader/loadQuery'

import NavbarLayout from './NavbarLayout'
const NavbarPreview = dynamic(() => import('./NavbarPreview'))

export async function Navbar() {
  const [initial, homepage, menu, articles] = await Promise.all([
    loadSettings(),
    loadHomePage(),
    loadMenu(),
    loadArticles(),
  ])
  const blogCategories = getBlogCategories(articles.data ?? [])
  const draft = await draftMode()

  if (draft.isEnabled) {
    return (
      <NavbarPreview
        initial={initial}
        initialMenu={menu}
        blogCategories={blogCategories}
      />
    )
  }

  const sections = initial.data.theme?.sections
  const menuSections = menu.data?.sections
  const menuTheme = mergeMenuTheme(initial.data.theme, menu.data)
  const menuImageFor = (
    section: 'artists' | 'collections' | 'blog' | 'merch' | 'info',
  ) => ({
    ...(menuSections?.[section]?.image ??
      sections?.[section]?.noteDrawing ??
      homepage?.data?.menuImages?.[section] ??
      {}),
    fit: menuSections?.[section]?.overlayImageFit ?? ('contain' as const),
  })

  return (
    <NavbarLayout
      data={initial.data}
      artists={initial.data.artists ?? []}
      collections={initial.data.collections ?? []}
      blogCategories={blogCategories}
      menuTheme={menuTheme}
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
