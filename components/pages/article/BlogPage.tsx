import Link from 'next/link'
import type { ArticlePayload } from '@/types'
import { resolveHref } from '@/sanity/lib/utils'

export interface BlogPageProps {
  articles: ArticlePayload[]
}

const BlogPage = ({ articles }: BlogPageProps) => {
  return (
    <div className="flex items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Articles</h1>
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
  )
}

export default BlogPage
