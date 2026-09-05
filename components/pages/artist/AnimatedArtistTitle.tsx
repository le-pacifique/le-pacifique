'use client'

import { motion } from 'framer-motion'

import { deterministicRange } from '@/lib/deterministicRandom'
import { theme } from '@/lib/theme'

interface AnimatedArtistTitleProps {
  name: string
  style?: React.CSSProperties
  color?: string // <-- Add color prop
  blendMode?: boolean
  distort?: boolean
  fitToColumn?: boolean
  scale?: number
}

const AnimatedArtistTitle = ({
  name,
  style,
  color,
  blendMode = true,
  distort = false,
  fitToColumn = false,
  scale,
}: AnimatedArtistTitleProps) => {
  const words = name.split(' ')
  const leftIncrement = 6
  const wordLeftOffset = 15
  const horizontalPositions = words.flatMap((word, wordIndex) =>
    word
      .split('')
      .map(
        (_, letterIndex) =>
          wordIndex * wordLeftOffset +
          letterIndex * leftIncrement -
          (word.length * leftIncrement) / 2,
      ),
  )
  const compositionCenterOffset =
    horizontalPositions.length > 0
      ? (Math.min(...horizontalPositions) + Math.max(...horizontalPositions)) /
        2
      : 0
  const compositionWidth =
    horizontalPositions.length > 0
      ? Math.max(...horizontalPositions) - Math.min(...horizontalPositions) + 8
      : 0
  const automaticScale = fitToColumn
    ? Math.max(0.55, Math.min(1, 50 / Math.max(compositionWidth, 1)))
    : 1
  const resolvedScale = scale ?? automaticScale

  const generateLetterStyles = (
    wordIndex: number,
    letterIndex: number,
    wordLength: number,
  ) => {
    const baseTop = 9
    const topIncrement = 1
    const wordTopOffset = 15

    const top =
      baseTop +
      wordIndex * wordTopOffset +
      letterIndex * topIncrement +
      deterministicRange(-2, 2, name, wordIndex, letterIndex, 'top')
    const left =
      wordIndex * wordLeftOffset +
      letterIndex * leftIncrement -
      (wordLength * leftIncrement) / 2 -
      compositionCenterOffset
    const rotate = deterministicRange(
      -5,
      5,
      name,
      wordIndex,
      letterIndex,
      'rotate',
    )

    return { top, left, rotate }
  }

  // Use passed color or fallback to theme
  const txtColor = color || theme.colors.menu.Artists.background

  return (
    <h1
      className={`relative h-full w-full overflow-visible pointer-events-none ${
        blendMode ? 'mix-blend-exclusion' : ''
      }`}
      data-testid="artist-title"
      style={{
        ...style,
        transform: `${style?.transform ? `${style.transform} ` : ''}scale(${resolvedScale})`,
        transformOrigin: '50% 0%',
      }}
    >
      <span className="sr-only">{name}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span key={wordIndex}>
            {word.split('').map((letter, letterIndex) => {
              const { top, left, rotate } = generateLetterStyles(
                wordIndex,
                letterIndex,
                word.length,
              )

              return (
                <motion.span
                  data-title-letter
                  key={`${wordIndex}-${letterIndex}`}
                  className={`absolute text-5xl font-black uppercase md:text-9xl md:font-normal ${
                    distort ? 'distort' : ''
                  }`}
                  style={{ color: txtColor }}
                  initial={{
                    top: `${top}vh`,
                    left: `calc(50% + ${left}vw)`,
                    rotate,
                  }}
                  animate={{
                    top: [
                      `${top}vh`,
                      `${top + deterministicRange(-1, 1, name, wordIndex, letterIndex, 'animate-top')}vh`,
                    ],
                    left: [
                      `calc(50% + ${left}vw)`,
                      `calc(50% + ${
                        left +
                        deterministicRange(
                          -1,
                          1,
                          name,
                          wordIndex,
                          letterIndex,
                          'animate-left',
                        )
                      }vw)`,
                    ],
                    rotate: [
                      rotate,
                      rotate +
                        deterministicRange(
                          -2,
                          2,
                          name,
                          wordIndex,
                          letterIndex,
                          'animate-rotate',
                        ),
                    ],
                  }}
                  transition={{
                    duration: deterministicRange(
                      3,
                      5,
                      name,
                      wordIndex,
                      letterIndex,
                      'duration',
                    ),
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                >
                  {letter}
                </motion.span>
              )
            })}
          </span>
        ))}
      </span>
    </h1>
  )
}

export default AnimatedArtistTitle
