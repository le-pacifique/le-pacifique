'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { resolveHref } from '@/sanity/lib/utils'
import type {
  ArtistPayload,
  CollectionPayload,
  MenuItem,
  SettingsPayload,
} from '@/types'
import { theme } from '@/lib/theme'

interface NavbarLayoutProps {
  data: SettingsPayload
  artists: ArtistPayload[]
  collections: CollectionPayload[]
  menuImages: {
    artists: { image: string }
    collections: { image: string }
    blog: { image: string }
    merch: { image: string }
  }
}

// 🔑 Config for background images
const menuImageConfig: Record<
  string,
  { srcKey: keyof NavbarLayoutProps['menuImages']; className: string }
> = {
  Artists: {
    srcKey: 'artists',
    className:
      'z-50 absolute rotate-[20deg] left-[10%] md:right-0 top-[2%] md:-top-[50%] w-[100vw] md:w-[100vw] md:rotate-12',
  },
  Collections: {
    srcKey: 'collections',
    className:
      'z-50 absolute right-[13vw] md:left-32 bottom-16 md:-top-16 w-[80vw] md:w-[45vw] -rotate-12',
  },
  Blog: {
    srcKey: 'blog',
    className:
      'z-50 absolute right-[13vw] md:left-32 bottom-16 md:-top-16 w-[80vw] md:w-[45vw] -rotate-12',
  },
  Merch: {
    srcKey: 'merch',
    className:
      'z-50 absolute right-[13vw] md:left-32 bottom-16 md:-top-16 w-[80vw] md:w-[45vw] -rotate-12',
  },
}

// 🔑 Dropdown renderer (generic)
function Dropdown<
  T extends { _type: string; slug?: string; name?: string; title?: string },
>({ items, color }: { items: T[]; color: string }) {
  const dropdownItem = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <div className="absolute left-0 ml-3 md:ml-6 uppercase text-lg font-extrabold md:text-2xl min-w-max">
      {items.map((item, index) => {
        const href = resolveHref(item._type, item.slug)
        if (!href) return null
        return (
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownItem}
            transition={{
              duration: 0.3,
              ease: [0.76, 0, 0.24, 1],
              delay: index * 0.07,
            }}
          >
            <Link
              href={href}
              className="block hover:opacity-70"
              style={{ color }}
            >
              {item.name || item.title}
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function NavbarLayout({
  data,
  artists,
  collections,
  menuImages,
}: NavbarLayoutProps) {
  const pathname = usePathname()
  const menuItems = data?.menuItems || []
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const grayColor = theme.colors.gray

  const shouldColorBorder = (menuItem: string) =>
    pathname === '/' ||
    pathname === '/info' ||
    pathname.includes(menuItem.toLowerCase())

  // 🔑 Background overlay (DRY)
  const BackgroundOverlay = ({ hovered }: { hovered: string }) => {
    const config = menuImageConfig[hovered]
    if (!config) return null
    return (
      <motion.div
        className="absolute inset-0 z-30 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { delay: 0.2, duration: 0.4 } }}
        transition={{ duration: 0.1 }}
        style={{ backgroundColor: theme.colors.menu[hovered]?.background }}
      >
        <Image
          className={config.className}
          src={menuImages[config.srcKey].image}
          alt={`${hovered} Image`}
          width={2500}
          height={2500}
        />
      </motion.div>
    )
  }

  return (
    <>
      {/* Background overlay */}
      <AnimatePresence>
        {hoveredItem && <BackgroundOverlay hovered={hoveredItem} />}
      </AnimatePresence>

      {/* Top menu (first 2 items) */}
      <div className="fixed top-0 w-full z-50 flex flex-wrap items-center justify-between px-4 md:px-16 lg:px-32 text-black tracking-tighter">
        {menuItems.slice(0, 2).map((menuItem, key) => {
          const href = resolveHref(menuItem?._type, menuItem?.slug) || '#'
          if (!menuItem?.title) return null

          const menuTheme =
            theme.colors.menu[menuItem.title] || theme.colors.menu.default
          const borderColor =
            hoveredItem === menuItem.title
              ? menuTheme.border
              : shouldColorBorder(menuItem.title)
                ? menuTheme.border
                : grayColor
          const textColor = shouldColorBorder(menuItem.title)
            ? menuTheme.text
            : grayColor

          return (
            <div
              key={key}
              className="relative px-0 pb-2"
              onMouseEnter={() => setHoveredItem(menuItem.title)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span className="uppercase tracking-tighter text-lg font-extrabold md:text-2xl cursor-pointer">
                <div
                  className="h-2 w-full z-20 relative"
                  style={{ backgroundColor: borderColor }}
                />
                <div
                  className="z-10"
                  style={{
                    color:
                      hoveredItem === menuItem.title
                        ? menuTheme.text
                        : textColor,
                  }}
                >
                  {menuItem.title}
                </div>
              </span>

              {/* 🔑 Dynamic dropdowns */}
              <AnimatePresence>
                {menuItem.title === 'Artists' && hoveredItem === 'Artists' && (
                  <Dropdown items={artists} color={menuTheme.text} />
                )}
                {menuItem.title === 'Collections' &&
                  hoveredItem === 'Collections' && (
                    <Dropdown items={collections} color={menuTheme.text} />
                  )}
              </AnimatePresence>
            </div>
          )
        })}

        {/* Bottom menu (rest) */}
        <div className="fixed bottom-0 left-0 w-full z-10 flex flex-wrap items-center justify-between px-4 md:px-16 lg:px-32 text-black tracking-tighter">
          {menuItems.slice(2).map((menuItem, key) => {
            const href = resolveHref(menuItem?._type, menuItem?.slug) || '#'
            if (!menuItem?.title) return null

            const menuTheme =
              theme.colors.menu[menuItem.title] || theme.colors.menu.default
            const borderColor =
              hoveredItem === menuItem.title
                ? 'transparent'
                : shouldColorBorder(menuItem.title)
                  ? menuTheme.border
                  : grayColor
            const textColor = shouldColorBorder(menuItem.title)
              ? menuTheme.text
              : grayColor

            return (
              <Link
                key={key}
                href={href}
                className="uppercase text-lg font-extrabold tracking-tighter md:text-2xl"
                style={{
                  borderBottom: `8px solid ${borderColor}`,
                  color: textColor,
                }}
                onMouseEnter={() => setHoveredItem(menuItem.title)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {menuItem.title}
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
