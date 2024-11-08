import { Fragment } from 'react'

const ArtistTitle = ({ name }) => {
  const words = name.split(' ') // Split the name into words

  // Function to generate style for each letter
  const generateLetterStyles = (wordIndex, letterIndex) => {
    const baseTop = 10 // Starting vertical position in 'vh'
    const topIncrement = 5 // Increment value for each letter in 'vh'
    const baseLeft = 60 // Starting horizontal position in 'vw'
    const leftIncrement = 3 // Increment value for each letter in 'vw'

    // Offsets for each word
    const wordTopOffset = 15 // Vertical offset for each word in 'vh'
    const wordLeftOffset = 0 // Horizontal offset for each word in 'vw'

    // Calculating diagonal positions
    const top = baseTop + wordIndex * wordTopOffset + letterIndex * topIncrement // Increment 'top' for each letter and shift each word down
    const left =
      baseLeft + wordIndex * wordLeftOffset + letterIndex * leftIncrement // Increment 'left' for each letter and shift each word right
    const rotate = Math.random() * 30 - 15 // Random rotation between -15 and 15 degrees

    return {
      top: `${top}vh`,
      left: `${left}vw`,
      transform: `rotate(${rotate}deg)`,
    }
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
      {words.map((word, wordIndex) => (
        <Fragment key={wordIndex}>
          {word.split('').map((letter, letterIndex) => (
            <span
              key={`${wordIndex}-${letterIndex}`}
              className="absolute text-7xl font-medium text-[#C6F042] uppercase"
              style={generateLetterStyles(wordIndex, letterIndex)}
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
