import Image from 'next/image'

import { PageScrollbarTheme } from '@/components/shared/PageScrollbarTheme'
import {
  getResolvedPageTheme,
  type SettingsTheme,
} from '@/lib/theme'
import type { MerchPayload, PageThemePayload } from '@/types'

export interface MerchPageProps {
  merch: MerchPayload[]
  menuImage?: {
    image: string
    title?: string
  }
  pageTheme?: PageThemePayload
  settingsTheme?: SettingsTheme
}

const merchTypes = ['VINYL', 'TAPES', 'CLOTHES', 'BIBELOTS']

const MerchPage = ({
  merch,
  menuImage,
  pageTheme: pageThemeOverride,
  settingsTheme,
}: MerchPageProps) => {
  const pageTheme = getResolvedPageTheme({
    backgroundColor: pageThemeOverride?.backgroundColor,
    noteDrawing: pageThemeOverride?.noteDrawing,
    section: 'merch',
    settingsTheme,
  })
  const drawing = pageTheme.noteDrawing ?? menuImage

  return (
    <div
      className="min-h-screen w-full relative"
      style={{ backgroundColor: pageTheme.backgroundColor }}
    >
      <PageScrollbarTheme backgroundColor={pageTheme.backgroundColor} />
      {/* Background image from navbar */}
      {drawing?.image && (
        <div className="absolute inset-0 overflow-hidden z-0">
          <Image
            className="absolute right-[13vw] md:left-32 bottom-16 md:-top-16 w-[80vw] md:w-[45vw] -rotate-12"
            src={drawing.image}
            alt={drawing.title || 'Merch Background'}
            width={2500}
            height={2500}
          />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8 py-16 lg:py-24 tracking-tight">
        <h1 className="text-6xl font-bold mb-12 text-white tracking-tight">
          MERCH
        </h1>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-6 lg:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {merchTypes.map((type) => (
            <div key={type} className="bg-white/10 p-6 rounded-lg">
              <h2 className="text-4xl font-bold text-white mb-4">{type}</h2>
              <div className="space-y-6">
                {merch
                  .filter((merch) => merch.type.toUpperCase() === type)
                  .map((merch) => (
                    <div key={merch._id} className="bg-black/20 p-4 rounded">
                      <h3 className="text-2xl text-white">{merch.name}</h3>
                      <p className="text-white/80">Price: €{merch.price}</p>
                      {merch.artist && (
                        <p className="text-white/80">Artist: {merch.artist}</p>
                      )}
                      {merch.design && (
                        <p className="text-white/80">Design: {merch.design}</p>
                      )}
                      <p className="text-white/80">Stock: {merch.stock}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MerchPage
