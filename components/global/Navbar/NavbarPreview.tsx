'use client'

import { useSettings } from '@/sanity/loader/useQuery'

import NavbarLayout from './NavbarLayout'

type Props = {
  initial: Parameters<typeof useSettings>[0]
}

export default function NavbarPreview(props: Props) {
  const { data } = useSettings(props.initial)
  const sections = data?.theme?.sections

  return (
    <NavbarLayout
      data={data!}
      artists={[]}
      collections={[]}
      menuImages={{
        artists: sections?.artists?.noteDrawing ?? {},
        collections: sections?.collections?.noteDrawing ?? {},
        blog: sections?.blog?.noteDrawing ?? {},
        merch: sections?.merch?.noteDrawing ?? {},
        info: sections?.info?.noteDrawing ?? {},
      }}
    />
  )
}
