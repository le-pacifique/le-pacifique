'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

import { resolveHref } from '@/sanity/lib/utils'
import type { MenuItem, SettingsPayload } from '@/types'

interface NavbarProps {
  data: SettingsPayload
}

const perspective = {
  initial: { opacity: 0, y: -25 },
  initialReversed: { opacity: 0, y: -25 },
  enter: (key) => ({
    // opacity: 1,
    rotateX: 0,
    // transition: { delay: 1 + key * 0.2 },
  }),
  exit: { opacity: 0 },
}
export default function Navbar(props: NavbarProps) {
  const { data } = props
  const menuItems = data?.menuItems || ([] as MenuItem[])
  const borderColors = ['#F1FB84', '#F67665', '#B798DF', '#98C77B', '#6596F6']

  return (
    <div className="fixed top-0 w-full z-50 flex flex-wrap items-center justify-between gap-x-0 px-4 md:px-16 lg:px-32 text-black tracking-tighter">
      {menuItems &&
        menuItems.slice(0, 2).map((menuItem, key) => {
          const href = resolveHref(menuItem?._type, menuItem?.slug)
          if (!href) {
            return null
          }

          const borderColor = borderColors[key % borderColors.length]
          console.log(borderColor)

          return (
            <Link
              key={key}
              className={`uppercase tracking-tighter text-lg font-extrabold hover:text-black text-white/75 md:text-2xl`}
              href={href}
            >
              <div
                className={`h-2 w-full z-20 relative`}
                style={{ backgroundColor: `${borderColor}` }}
              ></div>
              <div
                className="z-10"
                key={key}
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
                className={`uppercase text-lg font-extrabold tracking-tighter border-b-8 text-white/75 border-[${borderColor}] hover:text-black md:text-2xl`}
                href={href}
                style={{ borderBottom: `8px solid ${borderColor}` }}
              >
                <div
                  className="z-10"
                  key={key}
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
  )
}
