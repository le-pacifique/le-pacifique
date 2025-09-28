import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'

import { loadHomePage, loadSettings } from '@/sanity/loader/loadQuery'

import NavbarLayout from './NavbarLayout'
const NavbarPreview = dynamic(() => import('./NavbarPreview'))

export async function Navbar() {
  const initial = await loadSettings()
  const homepage = await loadHomePage()

  if (draftMode().isEnabled) {
    return <NavbarPreview initial={initial} />
  }

  return (
    <NavbarLayout
      data={initial.data}
      artists={initial.data.artists ?? []}
      collections={initial.data.collections ?? []}
      menuImages={{
        artists: homepage?.data?.menuImages?.artists ?? { image: '' },
        collections: homepage?.data?.menuImages?.collections ?? { image: '' },
        blog: homepage?.data?.menuImages?.blog ?? { image: '' },
        merch: homepage?.data?.menuImages?.merch ?? { image: '' },
      }}
    />
  )
}
