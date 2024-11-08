import Link from 'next/link'
import type { ArticlePayload } from '@/types'
import { resolveHref } from '@/sanity/lib/utils'
import CollectionTitle from '../collection/CollectionTitle'

export interface BlogPageProps {
  articles: ArticlePayload[]
}

const BlogPage = ({ articles }: BlogPageProps) => {
  return (
    <div className="bg-red-500 h-full w-full ">
      <div className="h-full w-full flex items-center justify-center relative z-10">
        <CollectionTitle name="Blog" />
        {articles && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, key) => {
              const href = resolveHref(article?._type, article?.slug?.current)
              if (!href) {
                return null
              }
              return (
                <Link key={key} href={href}>
                  <div className="article-item">
                    <h2>{article.title}</h2>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPage
