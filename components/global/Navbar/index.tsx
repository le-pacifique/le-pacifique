import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'

import { loadSettings, loadHomePage } from '@/sanity/loader/loadQuery'

import NavbarLayout from './NavbarLayout'
const NavbarPreview = dynamic(() => import('./NavbarPreview'))

export async function Navbar() {
  const initial = await loadSettings()
  const homepage = await loadHomePage()

  console.log('homepageFETCH', homepage.data.menuImages)

  if (draftMode().isEnabled) {
    return <NavbarPreview initial={initial} />
  }

  return (
    <NavbarLayout
      data={initial.data}
      artists={initial.data.artists}
      collections={initial.data.collections}
      menuImages={homepage.data.menuImages}
    />
  )
}
