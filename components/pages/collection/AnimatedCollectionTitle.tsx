'use client'

import { motion } from 'framer-motion'
import { theme } from '@/lib/theme'

interface AnimatedCollectionTitleProps {
  name: string
  style?: React.CSSProperties
  color?: string // <-- Add color prop
}

const AnimatedCollectionTitle = ({
  name,
  style,
  color,
}: AnimatedCollectionTitleProps) => {
  const words = name.split(' ')

  const generateLetterStyles = (
    wordIndex: number,
    letterIndex: number,
    wordLength: number,
  ) => {
    const baseTop = 10 // vh
    const topIncrement = 1
    const baseLeft = 50 // vw
    const leftIncrement = 6
    const wordTopOffset = 15
    const wordLeftOffset = 15

    const top =
      baseTop +
      wordIndex * wordTopOffset +
      letterIndex * topIncrement +
      (Math.random() * 4 - 2)

    const left =
      baseLeft +
      wordIndex * wordLeftOffset +
      letterIndex * leftIncrement -
      (wordLength * leftIncrement) / 2

    const rotate = Math.random() * 10 - 5

    return { top, left, rotate }
  }

  // Use passed color or fallback to theme
  const txtColor = color || theme.colors.menu.Artists.background

  return (
    <div
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-[19] mix-blend-exclusion"
      style={style}
    >
      {words.map((word, wordIndex) => (
        <div key={wordIndex}>
          {word.split('').map((letter, letterIndex) => {
            const { top, left, rotate } = generateLetterStyles(
              wordIndex,
              letterIndex,
              word.length,
            )

            return (
              <motion.span
                key={`${wordIndex}-${letterIndex}`}
                className="absolute text-5xl font-black md:font-normal md:text-9xl text-black uppercase"
                style={{ color: txtColor }}
                initial={{
                  top: `${top}vh`,
                  left: `${left}vw`,
                  rotate,
                }}
                animate={{
                  top: [`${top}vh`, `${top + (Math.random() * 2 - 1)}vh`],
                  left: [`${left}vw`, `${left + (Math.random() * 2 - 1)}vw`],
                  rotate: [rotate, rotate + (Math.random() * 4 - 2)],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                {letter}
              </motion.span>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default AnimatedCollectionTitle
