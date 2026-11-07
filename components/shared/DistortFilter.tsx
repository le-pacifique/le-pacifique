export function DistortFilter() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute', pointerEvents: 'none' }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id="distort">
          <feTurbulence
            baseFrequency="0.01 0.01"
            type="turbulence"
            numOctaves="1"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="3"
            xChannelSelector="R"
            yChannelSelector="R"
          />
        </filter>
      </defs>
    </svg>
  )
}
