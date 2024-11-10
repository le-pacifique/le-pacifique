'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { resolveHref } from '@/sanity/lib/utils'
import type {
  ArtistPayload,
  CollectionPayload,
  MenuItem,
  SettingsPayload,
} from '@/types'
import { useState } from 'react'

interface NavbarLayoutProps {
  data: SettingsPayload
  artists: ArtistPayload[]
  collections: CollectionPayload[]
}

export default function NavbarLayout({
  data,
  artists,
  collections,
}: NavbarLayoutProps) {
  const menuItems = data?.menuItems || ([] as MenuItem[])
  const borderColors = ['#C6F042', '#FF4517', '#B798DF', '#FE2B97', '#6596F6']

  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const getBackgroundColor = (menuItem) => {
    switch (menuItem) {
      case 'Artists':
        return '#9D9998'
      case 'Blog':
        return '#CC96FF'
      case 'Collections':
        return '#9FADFD'
      case 'Merch':
        return '#d28a04'
      case 'Info':
        return '#556bfc'
      default:
        return 'transparent'
    }
  }

  const handleMouseEnter = (menuItem) => {
    setHoveredItem(menuItem)
  }

  const handleMouseLeave = () => {
    setHoveredItem(null)
  }

  const dropdownItem = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  }

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  return (
    <>
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            className="absolute inset-0 z-10"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backgroundVariants}
            transition={{ duration: 0.5 }}
            style={{ backgroundColor: getBackgroundColor(hoveredItem) }}
          />
        )}
      </AnimatePresence>
      <div className="fixed top-0 w-full z-50 flex flex-wrap items-center justify-between gap-x-0 px-4 md:px-16 lg:px-32 text-black tracking-tighter">
        {menuItems &&
          menuItems.slice(0, 2).map((menuItem, key) => {
            const href = resolveHref(menuItem?._type, menuItem?.slug)
            if (!href) {
              return null
            }

            const borderColor = borderColors[key % borderColors.length]

            return (
              <>
                {/* <Link
                key={key}
                className={`uppercase tracking-tighter text-lg font-extrabold hover:text-black md:text-2xl`}
                href={href}
              >
                <div
                  className={`h-2 w-full z-20 relative`}
                  style={{ backgroundColor: `${borderColor}` }}
                ></div>
                <div className="z-10" key={key}>
                  {menuItem.title}
                </div>
              </Link> */}
                <div
                  key={key}
                  className="relative px-2 pb-2"
                  onMouseEnter={() => handleMouseEnter(menuItem.title)}
                  onMouseLeave={handleMouseLeave}
                >
                  <span
                    className={`uppercase tracking-tighter text-lg font-extrabold hover:text-black md:text-2xl cursor-pointer`}
                  >
                    <div
                      className={`h-2 w-full z-20 relative uppercase tracking-tighter text-lg font-extrabold hover:text-black md:text-2xl`}
                      style={{ backgroundColor: `${borderColor}` }}
                    ></div>
                    <div className="z-10">{menuItem.title}</div>
                  </span>
                  <AnimatePresence>
                    {menuItem.title === 'Artists' &&
                      hoveredItem === 'Artists' && (
                        <div className="absolute left-0 ml-6 uppercase tracking-tighter text-lg font-extrabold hover:text-black md:text-2xl w-80">
                          {artists.map((artist, index) => {
                            const artistHref = resolveHref(
                              artist._type,
                              artist.slug,
                            )
                            if (!artistHref) {
                              return null
                            }
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
                                  href={artistHref}
                                  className="block text-black hover:text-[#fff]"
                                >
                                  {artist.name}
                                </Link>
                              </motion.div>
                            )
                          })}
                        </div>
                      )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {menuItem.title === 'Collections' &&
                      hoveredItem === 'Collections' && (
                        <div className="absolute left-0 ml-6 uppercase tracking-tighter text-lg font-extrabold hover:text-black md:text-2xl w-full">
                          {collections.map((collection, index) => {
                            const collectionHref = resolveHref(
                              collection._type,
                              collection.slug,
                            )
                            if (!collectionHref) {
                              return null
                            }
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
                                  // delay: index * 0.2,
                                  delay: index * 0.07,
                                }}
                              >
                                <Link
                                  key={index}
                                  href={collectionHref}
                                  className="block text-black hover:text-[#fff]"
                                >
                                  {collection.title}
                                </Link>
                              </motion.div>
                            )
                          })}
                        </div>
                      )}
                  </AnimatePresence>
                </div>
              </>
            )
          })}
        <div className="fixed bottom-0 left-0 w-full z-10 flex flex-wrap items-center justify-between gap-x-0 px-4 md:px-16 lg:px-32 text-black tracking-tighter">
          {menuItems &&
            menuItems.slice(2).map((menuItem, key) => {
              const href = resolveHref(menuItem?._type, menuItem?.slug)
              if (!href) {
                return null
              }

              const borderColor = borderColors[(key + 2) % borderColors.length]

              return (
                <Link
                  key={key + 2}
                  className={`uppercase text-lg font-extrabold tracking-tighter border-b-8 border-[${borderColor}] hover:text-black md:text-2xl`}
                  href={href}
                  style={{ borderBottom: `8px solid ${borderColor}` }}
                >
                  <div
                    className="z-10"
                    key={key}
                    onMouseEnter={() => handleMouseEnter(menuItem.title)}
                    onMouseLeave={handleMouseLeave}
                    // custom={key}
                    // variants={perspective}
                    // animate="enter"
                    // exit="exit"
                    // initial="initial"
                    // whileHover={{ opacity: 1, y: 0 }}
                  >
                    {menuItem.title}
                  </div>
                </Link>
              )
            })}
        </div>
      </div>
    </>
  )
}
