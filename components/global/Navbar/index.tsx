import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'

import { mergeMenuTheme } from '@/lib/theme'
import { loadHomePage, loadMenu, loadSettings } from '@/sanity/loader/loadQuery'

import NavbarLayout from './NavbarLayout'
const NavbarPreview = dynamic(() => import('./NavbarPreview'))

export async function Navbar() {
  const [initial, homepage, menu] = await Promise.all([
    loadSettings(),
    loadHomePage(),
    loadMenu(),
  ])
  const draft = await draftMode()

  if (draft.isEnabled) {
    return <NavbarPreview initial={initial} />
  }

  const sections = initial.data.theme?.sections
  const menuSections = menu.data?.sections
  const menuTheme = mergeMenuTheme(initial.data.theme, menu.data)

  return (
    <NavbarLayout
      data={initial.data}
      artists={initial.data.artists ?? []}
      collections={initial.data.collections ?? []}
      menuTheme={menuTheme}
      menuImages={{
        artists:
          menuSections?.artists?.image ??
          sections?.artists?.noteDrawing ??
          homepage?.data?.menuImages?.artists ??
          {},
        collections:
          menuSections?.collections?.image ??
          sections?.collections?.noteDrawing ??
          homepage?.data?.menuImages?.collections ??
          {},
        blog:
          menuSections?.blog?.image ??
          sections?.blog?.noteDrawing ??
          homepage?.data?.menuImages?.blog ??
          {},
        merch:
          menuSections?.merch?.image ??
          sections?.merch?.noteDrawing ??
          homepage?.data?.menuImages?.merch ??
          {},
        info:
          menuSections?.info?.image ??
          sections?.info?.noteDrawing ??
          homepage?.data?.menuImages?.info ??
          {},
      }}
    />
  )
}
