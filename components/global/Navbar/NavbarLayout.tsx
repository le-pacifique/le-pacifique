'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { getSectionThemeByTitle, type SettingsTheme } from '@/lib/theme'
import { resolveHref } from '@/sanity/lib/utils'
import type {
  ArtistPayload,
  CollectionPayload,
  MenuItem,
  SettingsPayload,
} from '@/types'

const ITEMS_WITH_SUBMENU = ['Artists', 'Collections'] as const
const ITEMS_WITH_BACKGROUND_OVERLAY = [
  'Artists',
  'Collections',
  'Blog',
  'Merch',
] as const

const menuImageConfig = {
  Artists: {
    srcKey: 'artists',
    className:
      'absolute rotate-[20deg] left-[10%] md:right-0 top-[2%] md:-top-[50%] w-[100vw] md:w-[100vw] md:rotate-12',
  },
  Collections: {
    srcKey: 'collections',
    className:
      'absolute right-[13vw] md:left-32 bottom-16 md:-top-16 w-[80vw] md:w-[45vw] -rotate-12',
  },
  Blog: {
    srcKey: 'blog',
    className:
      'absolute right-[13vw] md:left-32 bottom-16 md:-top-16 w-[80vw] md:w-[45vw] -rotate-12',
  },
  Merch: {
    srcKey: 'merch',
    className:
      'absolute right-[13vw] md:left-32 bottom-16 md:-top-16 w-[80vw] md:w-[45vw] -rotate-12',
  },
} as const

type MenuImageKey = keyof typeof menuImageConfig
type BackgroundOverlayItem = (typeof ITEMS_WITH_BACKGROUND_OVERLAY)[number]
type MenuImageSourceKey =
  | (typeof menuImageConfig)[MenuImageKey]['srcKey']
  | 'info'
type MenuImageSource = {
  image?: string
  title?: string
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
  menuTheme?: SettingsTheme
  menuImages: Record<MenuImageSourceKey, MenuImageSource>
}

// --- Dropdown ---
function Dropdown<
  T extends { _type: string; slug?: string; name?: string; title?: string },
>({
  items,
  pathname,
  color,
  onItemClick,
}: {
  items: T[]
  pathname: string
  color: string
  onItemClick: () => void
}) {
  return (
    <div className="absolute left-0 ml-3 md:ml-6 uppercase text-lg font-extrabold md:text-2xl min-w-max">
      {items.map((item, index) => {
        const href = resolveHref(item._type, item.slug)
        if (!href) return null
        const isActive = pathname === href

        return (
          <motion.div
            key={item.slug?.toString() ?? index}
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
      className="fixed inset-0 z-30 overflow-hidden pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.2 }}
      style={{ backgroundColor: sectionTheme.backgroundColor }}
    >
      {config && image?.image && (
        <Image
          className={config.className}
          src={image.image}
          alt={image.title || `${hovered} Image`}
          width={2500}
          height={2500}
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
  isTop,
  pathname,
  settingsTheme,
}: {
  menuItem: MenuItem
  hoveredItem: string | null
  setHoveredItem: (item: string | null) => void
  artists: ArtistPayload[]
  collections: CollectionPayload[]
  isTop?: boolean
  pathname: string
  settingsTheme: SettingsTheme | null | undefined
}) {
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

  // Check if on homepage or if this section is active
  const isHomepage = pathname === '/'
  const isActive =
    isHomepage ||
    pathname === '/info' ||
    pathname.includes(menuItem.title.toLowerCase())

  const hasSubmenu = ITEMS_WITH_SUBMENU.includes(menuItem.title as any)

  return (
    <div
      className={`relative px-0 ${isTop ? 'pb-2' : ''}`}
      onMouseEnter={() => setHoveredItem(menuItem.title ?? null)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      {isTop ? (
        <>
          <div
            className="h-2 w-full relative"
            style={{ backgroundColor: borderColor }}
          />
          <div
            className={`distort uppercase text-lg font-extrabold md:text-2xl transition-opacity duration-300 ${
              // Only show text when:
              // 1. This is the item being hovered, OR
              // 2. This is active AND no other item is being hovered
              hoveredItem === menuItem.title ||
              (isActive && hoveredItem === null)
                ? 'opacity-100'
                : 'opacity-0'
            }`}
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
        // <Link
        //   href={href}
        //   className={`uppercase text-lg font-extrabold tracking-tighter md:text-2xl transition-colors duration-300 ${
        //     !hasSubmenu ? 'hover:text-white' : ''
        //   }`}
        //   style={{
        //     borderBottom: `8px solid ${hoveredItem === menuItem.title ? 'transparent' : borderColor}`,
        //     color: textColor,
        //   }}
        // >
        //   {menuItem.title}
        <Link
          href={href}
          className={`block uppercase text-lg font-extrabold tracking-tighter md:text-2xl transition-colors duration-300 ${
            !hasSubmenu ? 'hover:text-white' : ''
          }`}
          style={{
            borderBottom: `8px solid ${borderColor}`,
          }}
        >
          {/* Wrap the text in a span with controlled opacity */}
          <span
            className="distort inline-block"
            style={{
              color: textColor,
              opacity:
                isActive || isHomepage || hoveredItem === menuItem.title
                  ? 1
                  : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            {menuItem.title}
          </span>
        </Link>
      )}
    </div>
  )
}

export default function NavbarLayout({
  data,
  artists,
  collections,
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
              pathname={pathname}
              settingsTheme={menuTheme ?? data.theme}
            />
          ))}
      </div>
    </>
  )
}
