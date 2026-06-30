'use client'

import { motion } from 'framer-motion'
import type { ElementType } from 'react'

import { deterministicRange } from '@/lib/deterministicRandom'

interface AnimatedInlineTextProps {
  as?: ElementType
  className?: string
  color?: string
  text: string
}

export function AnimatedInlineText({
  as: Tag = 'span',
  className,
  color,
  text,
}: AnimatedInlineTextProps) {
  return (
    <Tag
      aria-label={text}
      className={className}
      style={color ? { color } : undefined}
    >
      <span aria-hidden="true">
        {Array.from(text).map((letter, index) => {
          const rotate = deterministicRange(-4, 4, text, index, 'rotate')
          const y = deterministicRange(-0.08, 0.08, text, index, 'y')

          return (
            <motion.span
              key={`${letter}-${index}`}
              className="inline-block"
              initial={{
                rotate,
                y: `${y}em`,
              }}
              animate={{
                rotate: [
                  rotate,
                  rotate +
                    deterministicRange(-2, 2, text, index, 'move-rotate'),
                ],
                y: [
                  `${y}em`,
                  `${y + deterministicRange(-0.08, 0.08, text, index, 'move-y')}em`,
                ],
              }}
              transition={{
                delay: deterministicRange(0, 1.2, text, index, 'delay'),
                duration: deterministicRange(2.5, 4.5, text, index, 'duration'),
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          )
        })}
      </span>
    </Tag>
  )
}
