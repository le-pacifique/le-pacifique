'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { getBlogCategoryKey } from '@/lib/blogCategories'
import { getSectionThemeByTitle, type SettingsTheme } from '@/lib/theme'
import { resolveHref } from '@/sanity/lib/utils'
import type {
  ArtistPayload,
  BlogCategoryPayload,
  CollectionPayload,
  MenuItem,
  SettingsPayload,
} from '@/types'

import { MenuStroke } from './MenuStroke'

const ITEMS_WITH_SUBMENU = ['Artists', 'Collections', 'Blog'] as const
const ITEMS_WITH_BACKGROUND_OVERLAY = [
  'Artists',
  'Collections',
  'Blog',
  'Merch',
] as const

const menuImageConfig = {
  Artists: { srcKey: 'artists' },
  Collections: { srcKey: 'collections' },
  Blog: { srcKey: 'blog' },
  Merch: { srcKey: 'merch' },
} as const

type MenuImageKey = keyof typeof menuImageConfig
type BackgroundOverlayItem = (typeof ITEMS_WITH_BACKGROUND_OVERLAY)[number]
type MenuImageSourceKey =
  | (typeof menuImageConfig)[MenuImageKey]['srcKey']
  | 'info'
type MenuImageSource = {
  image?: string
  title?: string
  fit?: 'contain' | 'cover'
}

const hasBackgroundOverlay = (
  title: string | null,
): title is BackgroundOverlayItem =>
  Boolean(
    title &&
      ITEMS_WITH_BACKGROUND_OVERLAY.includes(title as BackgroundOverlayItem),
  )

interface NavbarLayoutProps {
  data: SettingsPayload
  artists: ArtistPayload[]
  collections: CollectionPayload[]
  blogCategories: BlogCategoryPayload[]
  menuTheme?: SettingsTheme
  menuImages: Record<MenuImageSourceKey, MenuImageSource>
}

// --- Dropdown ---
function Dropdown<
  T extends {
    _type: string
    slug?: string
    name?: string
    title?: string
    href?: string
  },
>({
  items,
  pathname,
  color,
  onItemClick,
  above = false,
}: {
  items: T[]
  pathname: string
  color: string
  onItemClick: () => void
  above?: boolean
}) {
  return (
    <div
      className={`absolute left-0 ml-3 md:ml-6 uppercase text-lg font-extrabold md:text-2xl min-w-max ${above ? 'bottom-full pb-2' : ''}`}
    >
      {items.map((item, index) => {
        const href = item.href || resolveHref(item._type, item.slug)
        if (!href) return null
        const isActive = pathname === href

        return (
          <motion.div
            key={item.href || item.slug?.toString() || index}
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
          >
            {isActive && (
              <span
                className="distort absolute -left-5 top-0 pointer-events-none"
                style={{ color }}
                aria-hidden="true"
              >
                &gt;
              </span>
            )}
            <Link
              href={href}
              className="distort block hover:opacity-70"
              style={{ color }}
              onClick={onItemClick}
            >
              {item.name || item.title}
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}

// --- Background overlay ---
function BackgroundOverlay({
  hovered,
  menuImages,
  settingsTheme,
}: {
  hovered: string
  menuImages: NavbarLayoutProps['menuImages']
  settingsTheme: SettingsTheme | null | undefined
}) {
  const config =
    hovered in menuImageConfig
      ? menuImageConfig[hovered as MenuImageKey]
      : undefined
  const sectionTheme = getSectionThemeByTitle(settingsTheme, hovered)
  const image = config ? menuImages[config.srcKey] : undefined

  return (
    <motion.div
      className="menu-background-overlay fixed inset-0 z-30 overflow-hidden pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.2 }}
      style={{ backgroundColor: sectionTheme.backgroundColor }}
    >
      {config && image?.image && (
        <Image
          className="object-center"
          src={image.image}
          alt={image.title || `${hovered} Image`}
          fill
          sizes="100vw"
          style={{ objectFit: image.fit ?? 'contain' }}
          priority
        />
      )}
    </motion.div>
  )
}

// --- Menu item ---
function MenuItemLink({
  menuItem,
  hoveredItem,
  setHoveredItem,
  artists,
  collections,
  blogCategories,
  isTop,
  pathname,
  settingsTheme,
}: {
  menuItem: MenuItem
  hoveredItem: string | null
  setHoveredItem: (item: string | null) => void
  artists: ArtistPayload[]
  collections: CollectionPayload[]
  blogCategories: BlogCategoryPayload[]
  isTop?: boolean
  pathname: string
  settingsTheme: SettingsTheme | null | undefined
}) {
  const searchParams = useSearchParams()
  if (!menuItem?.title) return null

  const href = resolveHref(menuItem._type, menuItem.slug) || '#'
  const menuTheme = getSectionThemeByTitle(settingsTheme, menuItem.title)
  const grayColor = 'rgba(255, 255, 255, 0.25)'

  const active =
    pathname === '/' ||
    pathname === '/info' ||
    pathname.includes(menuItem.title.toLowerCase())
  const borderColor =
    hoveredItem === menuItem.title ? menuTheme.textColor : menuTheme.borderColor
  const textColor =
    hoveredItem === menuItem.title || active ? menuTheme.textColor : grayColor

  const hasSubmenu = ITEMS_WITH_SUBMENU.includes(menuItem.title as any)

  return (
    <div
      className={`relative px-0 ${isTop ? 'pb-2' : ''}`}
      onMouseEnter={() => setHoveredItem(menuItem.title ?? null)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      {isTop ? (
        <>
          <MenuStroke color={borderColor} />
          <div
            className="distort uppercase text-lg font-extrabold md:text-2xl"
            style={{ color: textColor }}
          >
            {menuItem.title}
          </div>
          {/* Dropdown remains the same */}
          <AnimatePresence>
            {menuItem.title === 'Artists' && hoveredItem === 'Artists' && (
              <Dropdown
                items={artists.map((a) => ({
                  _type: a._type ?? 'artist',
                  slug: typeof a.slug === 'object' ? a.slug?.current : a.slug,
                  title: a.name,
                  name: a.name,
                }))}
                pathname={pathname}
                color={menuTheme.textColor}
                onItemClick={() => setHoveredItem(null)}
              />
            )}
            {menuItem.title === 'Collections' &&
              hoveredItem === 'Collections' && (
                <Dropdown
                  items={collections.map((c) => ({
                    _type: c._type ?? 'collection', // ensure _type is always a string
                    slug: typeof c.slug === 'object' ? c.slug?.current : c.slug,
                    title: c.title,
                    name: c.title, // for Dropdown display
                  }))}
                  pathname={pathname}
                  color={menuTheme.textColor}
                  onItemClick={() => setHoveredItem(null)}
                />
              )}
          </AnimatePresence>
        </>
      ) : (
        <>
          <Link
            href={href}
            className={`block uppercase text-lg font-extrabold tracking-tighter md:text-2xl transition-colors duration-300 ${
              !hasSubmenu ? 'hover:text-white' : ''
            }`}
          >
            <span className="distort inline-block" style={{ color: textColor }}>
              {menuItem.title}
            </span>
            <MenuStroke color={borderColor} edge="bottom" />
          </Link>
          <AnimatePresence>
            {menuItem.title === 'Blog' && hoveredItem === 'Blog' && (
              <Dropdown
                above
                items={[
                  ...blogCategories.map((category) => ({
                    _type: 'blogCategory',
                    title: category.title,
                    href: `/blog?category=${encodeURIComponent(getBlogCategoryKey(category))}`,
                  })),
                  { _type: 'blogCategory', title: 'All', href: '/blog' },
                ]}
                pathname={
                  pathname === '/blog' && searchParams.get('category')
                    ? `/blog?category=${encodeURIComponent(searchParams.get('category')!)}`
                    : pathname
                }
                color={menuTheme.textColor}
                onItemClick={() => setHoveredItem(null)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

export default function NavbarLayout({
  data,
  artists,
  collections,
  blogCategories,
  menuTheme,
  menuImages,
}: NavbarLayoutProps) {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const menuItems = data?.menuItems || []
  const backgroundOverlayItem = hasBackgroundOverlay(hoveredItem)
    ? hoveredItem
    : null

  return (
    <>
      {/* Background overlay */}
      <AnimatePresence>
        {backgroundOverlayItem && (
          <BackgroundOverlay
            hovered={backgroundOverlayItem}
            menuImages={menuImages}
            settingsTheme={menuTheme ?? data.theme}
          />
        )}
      </AnimatePresence>

      {/* Top menu */}
      <div className="fixed top-0 w-full z-40 flex justify-between px-4 md:px-16 lg:px-32">
        {menuItems.slice(0, 2).map((item, i) => (
          <MenuItemLink
            key={i}
            menuItem={item}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
            artists={artists}
            collections={collections}
            blogCategories={blogCategories}
            isTop
            pathname={pathname}
            settingsTheme={menuTheme ?? data.theme}
          />
        ))}
      </div>

      {/* Bottom menu */}
      <div className="fixed bottom-0 left-0 w-full z-40 flex justify-between px-4 md:px-16 lg:px-32">
        {menuItems
          .slice(2)
          .filter((item) => item.title !== 'Merch')
          .map((item, i) => (
            <MenuItemLink
              key={i}
              menuItem={item}
              hoveredItem={hoveredItem}
              setHoveredItem={setHoveredItem}
              artists={artists}
              collections={collections}
              blogCategories={blogCategories}
              pathname={pathname}
              settingsTheme={menuTheme ?? data.theme}
            />
          ))}
      </div>
    </>
  )
}
