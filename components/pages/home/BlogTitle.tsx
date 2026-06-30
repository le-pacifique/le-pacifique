'use client'

import { motion } from 'framer-motion'
import { type CSSProperties, Fragment } from 'react'

import { deterministicRange } from '@/lib/deterministicRandom'

interface BlogTitleProps {
  name: string
  style?: CSSProperties
  color?: string
  distort?: boolean
}

const BlogTitle = ({ name, style, color, distort = false }: BlogTitleProps) => {
  const words = name.split(' ') // Split the name into words

  // Function to generate style for each letter
  const generateLetterStyles = (wordIndex, letterIndex, wordLength) => {
    const baseTop = 10 // Starting vertical position in 'vh'
    const topIncrement = 1 // Increment value for each letter in 'vh'
    const baseLeft = 75 // Starting horizontal position in 'vw'
    const leftIncrement = 7 // Increment value for each letter in 'vw'

    // Offsets for each word
    const wordTopOffset = 15 // Vertical offset for each word in 'vh'
    const wordLeftOffset = 0 // Horizontal offset for each word in 'vw'

    // Calculating diagonal positions

    const top =
      baseTop +
      wordIndex * wordTopOffset +
      letterIndex * topIncrement +
      deterministicRange(-2, 2, name, wordIndex, letterIndex, 'top')

    const left =
      baseLeft +
      wordIndex * wordLeftOffset +
      letterIndex * leftIncrement -
      (wordLength * leftIncrement) / 2 // Center the word by subtracting half its total width
    const rotate = deterministicRange(
      -5,
      5,
      name,
      wordIndex,
      letterIndex,
      'rotate',
    )

    return {
      top: `${top}vh`,
      left: `${left}vw`,
      transform: `rotate(${rotate}deg)`,
    }
  }

  // Function to generate random animation properties
  const generateAnimationProps = (wordIndex: number, letterIndex: number) => {
    const duration = deterministicRange(
      1,
      3,
      name,
      wordIndex,
      letterIndex,
      'duration',
    )
    const delay = deterministicRange(
      0,
      2,
      name,
      wordIndex,
      letterIndex,
      'delay',
    )
    return {
      x: [0, -2, 2, -2, 2, 0],
      y: [0, -2, 2, -2, 2, 0],
      transition: {
        duration,
        ease: 'easeInOut' as const,
        repeat: Infinity,
        repeatType: 'mirror' as const,
        delay,
      },
    }
  }

  return (
    <div
      className="hidden md:block absolute top-0 left-0 w-full h-full pointer-events-none z-20"
      style={style}
    >
      {words.map((word, wordIndex) => (
        <Fragment key={wordIndex}>
          {word.split('').map((letter, letterIndex) => (
            <motion.span
              key={`${wordIndex}-${letterIndex}`}
              className={`absolute font-medium text-4xl md:text-[9rem] uppercase ${
                distort ? 'distort' : ''
              }`}
              style={{
                ...generateLetterStyles(wordIndex, letterIndex, word.length),
                color,
              }}
              animate={generateAnimationProps(wordIndex, letterIndex)}
            >
              {letter}
            </motion.span>
          ))}
        </Fragment>
      ))}
    </div>
  )
}

export default BlogTitle
