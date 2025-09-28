import { Fragment } from 'react'

interface MonthTitleProps {
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

const MonthTitle = ({
  name,
  style,
  fontSize = '7xl',
  position = {},
  spacing = {},
  rotation = {},
  color = '#F1FB84',
  zIndex = 20,
}: MonthTitleProps) => {
  const words = name.split(' ') // Split the name into words

  // Set default values or use provided ones
  const {
    baseTop = 5,
    baseLeft = 10,
    wordTopOffset = 15,
    wordLeftOffset = 0,
  } = position

  const { topIncrement = 5, leftIncrement = 3 } = spacing

  // Reduce the rotation range to make letters less inclined
  const { min = -2, max = 2 } = rotation // Adjusted to a smaller range

  // Function to generate style for each letter
  const generateLetterStyles = (wordIndex: number, letterIndex: number) => {
    // Calculating diagonal positions
    const top = baseTop + wordIndex * wordTopOffset + letterIndex * topIncrement
    const left =
      baseLeft + wordIndex * wordLeftOffset + letterIndex * leftIncrement

    // Random rotation between min and max (less inclined)
    const rotate = Math.random() * (max - min) + min

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

export default MonthTitle
