'use client'

import { motion } from 'framer-motion'

interface AnimatedTitleProps {
  text: string
  color?: string
  size?: string // e.g. 'text-5xl', 'text-9xl', 'text-[6rem]'
  style?: React.CSSProperties
}

const AnimatedTitle = ({
  text,
  color = '#000',
  size = 'text-6xl',
  style,
}: AnimatedTitleProps) => {
  return (
    <div
      className={`relative w-full flex flex-wrap items-center justify-center pointer-events-none z-[19]`}
      style={style}
    >
      {text.split('').map((letter, i) => (
        <motion.span
          key={i}
          className={`inline-block font-black uppercase ${size}`}
          style={{ color }}
          initial={{
            y: 0,
            rotate: 0,
          }}
          animate={{
            y: [0, -4, 4, -4, 0],
            rotate: [0, 2, -2, 2, 0],
          }}
          transition={{
            duration: 2 + Math.random(),
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
            delay: i * 0.05,
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </div>
  )
}

export default AnimatedTitle
