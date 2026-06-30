import { Fragment } from 'react'

import { deterministicRange } from '@/lib/deterministicRandom'

interface ArtistTitleProps {
  name: string
  style?: React.CSSProperties
  fontSize?: string // For text size control
  position?: {
    // For positioning control
    baseTop?: number
    baseLeft?: number
    wordTopOffset?: number
    wordLeftOffset?: number
  }
  spacing?: {
    // For letter spacing control
    topIncrement?: number
    leftIncrement?: number
  }
  rotation?: {
    // For rotation control
    min?: number
    max?: number
  }
  color?: string // For text color
  zIndex?: number // For z-index control
}

const ArtistTitle = ({
  name,
  style,
  fontSize = '7xl',
  position = {},
  spacing = {},
  rotation = {},
  color = '#F1FB84',
  zIndex = 20,
}: ArtistTitleProps) => {
  const words = name.split(' ') // Split the name into words

  // Set default values or use provided ones
  const {
    baseTop = 10,
    baseLeft = 60,
    wordTopOffset = 15,
    wordLeftOffset = 0,
  } = position

  const { topIncrement = 5, leftIncrement = 3 } = spacing

  const { min = -15, max = 15 } = rotation

  // Function to generate style for each letter
  const generateLetterStyles = (wordIndex, letterIndex) => {
    // Calculating diagonal positions
    const top = baseTop + wordIndex * wordTopOffset + letterIndex * topIncrement
    const left =
      baseLeft + wordIndex * wordLeftOffset + letterIndex * leftIncrement

    // Random rotation between min and max
    const rotate = deterministicRange(min, max, name, wordIndex, letterIndex)

    return {
      top: `${top}vh`,
      left: `${left}vw`,
      transform: `rotate(${rotate}deg)`,
      ...style, // Include any additional styles passed as props
    }
  }

  // Convert text size to Tailwind class
  const fontSizeClass = `text-${fontSize}`

  return (
    <div
      className={`absolute top-0 left-0 w-full h-full pointer-events-none z-${zIndex}`}
    >
      {words.map((word, wordIndex) => (
        <Fragment key={wordIndex}>
          {word.split('').map((letter, letterIndex) => (
            <span
              key={`${wordIndex}-${letterIndex}`}
              className={`absolute ${fontSizeClass} font-medium uppercase`}
              style={{
                ...generateLetterStyles(wordIndex, letterIndex),
                color: color,
              }}
            >
              {letter}
            </span>
          ))}
        </Fragment>
      ))}
    </div>
  )
}

export default ArtistTitle
