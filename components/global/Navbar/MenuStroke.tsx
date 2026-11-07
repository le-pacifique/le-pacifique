import { useId } from 'react'

export function MenuStroke({
  color,
  edge = 'top',
}: {
  color: string
  edge?: 'top' | 'bottom'
}) {
  const filterId = `menu-stroke-${useId().replace(/:/g, '')}`

  return (
    <span aria-hidden="true" className="pointer-events-none relative block h-4 w-full">
      <svg
        className={`absolute inset-x-0 h-6 w-full overflow-visible ${edge === 'top' ? 'top-0' : 'bottom-0'}`}
        viewBox="0 0 200 24"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <filter id={filterId} filterUnits="userSpaceOnUse" x="-20" y="-50" width="240" height="124">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.08 0.6"
              numOctaves="2"
              seed="11"
              result="edgeNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="edgeNoise"
              scale="2.2"
              xChannelSelector="R"
              yChannelSelector="G"
              result="ink"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves="3"
              seed="5"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.8 0 0 0 0.55"
            />
            <feComposite in="ink" operator="in" />
          </filter>
        </defs>
        <path
          d="M -5,6 C 15,4 23,7 37,5 S 61,7 77,5 S 103,4 119,6 S 145,4 161,5 S 185,7 205,5"
          transform={edge === 'top' ? 'translate(0 -6)' : 'translate(0 18)'}
          fill="none"
          stroke={color}
          strokeWidth="29"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          filter={`url(#${filterId})`}
        />
      </svg>
    </span>
  )
}
