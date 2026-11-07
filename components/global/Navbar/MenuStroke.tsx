import { useId } from 'react'

export function MenuStroke({
  color,
  edge = 'top',
}: {
  color: string
  edge?: 'top' | 'bottom' | 'left'
}) {
  const filterId = `menu-stroke-${useId().replace(/:/g, '')}`
  const vertical = edge === 'left'

  return (
    <span
      aria-hidden="true"
      className={
        vertical
          ? 'pointer-events-none absolute inset-y-0 -left-1 block w-1'
          : 'pointer-events-none relative block h-4 w-full'
      }
    >
      <svg
        className={
          vertical
            ? 'absolute inset-0 h-full w-full overflow-visible'
            : `absolute inset-x-0 h-6 w-full overflow-visible ${edge === 'top' ? 'top-0' : 'bottom-0'}`
        }
        viewBox={vertical ? '0 0 6 200' : '0 0 200 24'}
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <filter
            id={filterId}
            filterUnits="userSpaceOnUse"
            x={vertical ? '-50' : '-20'}
            y={vertical ? '-20' : '-50'}
            width={vertical ? '106' : '240'}
            height={vertical ? '240' : '124'}
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency={vertical ? '0.6 0.08' : '0.08 0.6'}
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
          d={
            vertical
              ? 'M 3,-5 C 1,15 4,23 2,37 S 4,61 2,77 S 1,103 3,119 S 1,145 2,161 S 4,185 2,205'
              : 'M -5,6 C 15,4 23,7 37,5 S 61,7 77,5 S 103,4 119,6 S 145,4 161,5 S 185,7 205,5'
          }
          transform={
            vertical
              ? undefined
              : edge === 'top'
                ? 'translate(0 -6)'
                : 'translate(0 18)'
          }
          fill="none"
          stroke={color}
          strokeWidth={vertical ? '4' : '29'}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          filter={`url(#${filterId})`}
        />
      </svg>
    </span>
  )
}
