'use client'
import { Fragment } from 'react'
import { motion } from 'framer-motion'

const LogoTitle = ({ name }) => {
  const words = name.split(' ') // Split the name into words

  // Function to generate style for each letter
  const generateLetterStyles = (wordIndex, letterIndex, wordLength) => {
    const baseTop = 35 // Starting vertical position in 'vh'
    const topIncrement = 1 // Increment value for each letter in 'vh'
    const baseLeft = 50 // Starting horizontal position in 'vw'
    const leftIncrement = 7 // Increment value for each letter in 'vw'

    // Offsets for each word
    const wordTopOffset = 15 // Vertical offset for each word in 'vh'
    const wordLeftOffset = 0 // Horizontal offset for each word in 'vw'

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

  // Function to generate random animation properties
  const generateAnimationProps = () => {
    const duration = Math.random() * 2 + 1 // Random duration between 1 and 3 seconds
    const delay = Math.random() * 2 // Random delay between 0 and 2 seconds
    return {
      x: [0, -2, 2, -2, 2, 0],
      y: [0, -2, 2, -2, 2, 0],
      transition: {
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror',
        delay,
      },
    }
  }

  return (
    <div className="hidden md:block absolute top-0 left-0 w-full h-full pointer-events-none z-20 mix-blend-difference">
      {words.map((word, wordIndex) => (
        <Fragment key={wordIndex}>
          {word.split('').map((letter, letterIndex) => (
            <motion.span
              key={`${wordIndex}-${letterIndex}`}
              className="absolute font-medium text-4xl md:text-[9rem] text-[#C6F042] uppercase"
              style={generateLetterStyles(wordIndex, letterIndex, word.length)}
              animate={generateAnimationProps()}
            >
              {letter}
            </motion.span>
          ))}
        </Fragment>
      ))}
    </div>
  )
}

export default LogoTitle
