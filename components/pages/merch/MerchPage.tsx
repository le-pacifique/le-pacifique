import Image from 'next/image'

import { urlForImage } from '@/sanity/lib/utils'
import type { MerchPayload } from '@/types'

export interface MerchPageProps {
  merch: MerchPayload[]
}

const merchTypes = ['VINYL', 'TAPES', 'CLOTHES', 'BIBELOTS']

const MerchPage = ({ merch }: MerchPageProps) => {
  return (
    <>
      <div className="absolute inset-0 bg-artistpage-pattern bg-cover bg-center -z-0"></div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 z-10 py-16 lg:py-24 tracking-tight">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-6 lg:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {merchTypes.map((type) => (
            <div key={type}>
              <h1 className="text-4xl font-bold">{type}</h1>
              <div>
                {merch
                  .filter((merch) => merch.type.toUpperCase() === type)
                  .map((merch) => (
                    <div key={merch._id} className="mb-4">
                      <h2 className="text-2xl">{merch.name}</h2>
                      <p>Price: ${merch.price}</p>
                      {merch.artist && <p>Artist: {merch.artist}</p>}
                      {merch.design && <p>Design: {merch.design}</p>}
                      <p>Stock: {merch.stock}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default MerchPage
