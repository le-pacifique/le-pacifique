'use client'
import { useState } from 'react'
import { Rnd } from 'react-rnd'

const Stickies = ({ text }) => {
  const [isHidden, setIsHidden] = useState(false)

  const toggleCollapse = () => {
    setIsHidden(!isHidden)
  }

  return (
    <Rnd
      default={{
        x: 100,
        y: 100,
        width: 300,
        height: 200,
      }}
      minWidth={200}
      minHeight={100}
      bounds="parent"
      className="bg-yellow-200 shadow-lg rounded-lg p-4 z-[19]"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Stickies</h2>
        <button onClick={toggleCollapse} className="text-lg font-bold">
          {isHidden ? '+' : '-'}
        </button>
      </div>
      {!isHidden && (
        <div className="text-sm truncate">
          <p>{text}</p>
        </div>
      )}
    </Rnd>
  )
}

export default Stickies
