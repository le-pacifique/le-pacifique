'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface FloatingTitleProps {
  name: string
  style?: React.CSSProperties
}

const FloatingTitle = ({ name, style }: FloatingTitleProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0, rotate: 0 })

  // Generate new random position every 8-12 seconds
  useEffect(() => {
    const updatePosition = () => {
      // Get viewport dimensions
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Calculate bounds - stay within top 30% of screen
      const maxY = viewportHeight * 0.3
      const minY = 20 // Minimum distance from top
      const maxX = viewportWidth * 0.8
      const minX = viewportWidth * 0.2

      // Generate new random position
      const newX = Math.random() * (maxX - minX) + minX
      const newY = Math.random() * (maxY - minY) + minY
      const newRotate = Math.random() * 3 - 1.5 // -1.5 to 1.5 degrees

      setPosition({
        x: newX - viewportWidth / 2, // Center relative to container
        y: newY - maxY / 2,
        rotate: newRotate,
      })
    }

    // Initial position
    updatePosition()

    // Update position every 8-12 seconds
    const interval = setInterval(
      () => {
        updatePosition()
      },
      Math.random() * 4000 + 8000,
    ) // Between 8 and 12 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute top-0 left-0 w-full h-[30vh] overflow-hidden pointer-events-none">
      <motion.h1
        className="absolute left-1/2 top-1/2 text-[20vw] font-bold tracking-tighter uppercase text-center text-white whitespace-nowrap z-[10000]"
        initial={{ x: 0, y: 0, rotate: 0 }}
        animate={{
          x: position.x,
          y: position.y,
          rotate: position.rotate,
          scale: [1, 1.01, 0.99, 1.02, 1],
        }}
        transition={{
          duration: 8,
          ease: 'easeInOut',
          scale: {
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          },
        }}
        style={style}
      >
        {name}
      </motion.h1>
    </div>
  )
}

export default FloatingTitle
