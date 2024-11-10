import { Fragment } from 'react'

const CollectionTitle = ({ name }) => {
  const words = name.split(' ') // Split the name into words

  // Function to generate style for each letter
  const generateLetterStyles = (wordIndex, letterIndex, wordLength) => {
    const baseTop = 10 // Starting vertical position in 'vh'
    const topIncrement = 1 // Increment value for each letter in 'vh'
    const baseLeft = 50 // Starting horizontal position in 'vw'
    const leftIncrement = 6 // Increment value for each letter in 'vw'

    // Offsets for each word
    const wordTopOffset = 15 // Vertical offset for each word in 'vh'
    const wordLeftOffset = 15 // Horizontal offset for each word in 'vw'

    // Calculating diagonal positions

    const top =
      baseTop +
      wordIndex * wordTopOffset +
      letterIndex * topIncrement +
      (Math.random() * 4 - 2) // Randomly adjust 'top' for each letter

    const left =
      baseLeft +
      wordIndex * wordLeftOffset +
      letterIndex * leftIncrement -
      (wordLength * leftIncrement) / 2 // Center the word by subtracting half its total width
    const rotate = Math.random() * 10 - 5 // Random rotation between -15 and 15 degrees

    return {
      top: `${top}vh`,
      left: `${left}vw`,
      transform: `rotate(${rotate}deg)`,
    }
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[19]">
      {words.map((word, wordIndex) => (
        <div key={wordIndex}>
          {word.split('').map((letter, letterIndex) => (
            <span
              key={`${wordIndex}-${letterIndex}`}
              className="absolute text-4xl font-black md:font-normal md:text-9xl text-[#fff] uppercase"
              style={generateLetterStyles(wordIndex, letterIndex, word.length)}
            >
              {letter}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export default CollectionTitle
