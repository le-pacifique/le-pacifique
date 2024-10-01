import Image from 'next/image'

import { urlForImage } from '@/sanity/lib/utils'
import type { ArticlePayload } from '@/types'

export interface ArticlePageProps {
  data: ArticlePayload
}

const ArticlePage = ({ data }: ArticlePageProps) => {
  const article = data

  return (
    <>
      <div className="absolute inset-0 bg-artistpage-pattern bg-cover bg-center -z-0"></div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 z-10 py-16 lg:py-24 tracking-tight">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-6 lg:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <h1 className="text-4xl font-bold">{article.title}</h1>
        </div>
      </div>
    </>
  )
}

export default ArticlePage
