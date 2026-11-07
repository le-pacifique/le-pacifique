import type { ArticlePayload, BlogCategoryPayload } from '@/types'

export const getBlogCategoryKey = (category: BlogCategoryPayload) =>
  category.slug || category._id

export function getBlogCategories(articles: ArticlePayload[]) {
  const categories = new Map<string, BlogCategoryPayload>()
  for (const article of articles) {
    for (const category of article.categories ?? []) {
      categories.set(getBlogCategoryKey(category), category)
    }
  }
  return [...categories.values()].sort((a, b) => a.title.localeCompare(b.title))
}
