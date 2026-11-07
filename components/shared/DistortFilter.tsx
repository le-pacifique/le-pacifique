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
        <filter
          id="card-stripe-distress"
          x="-15%"
          y="-5%"
          width="130%"
          height="110%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.7"
            numOctaves="3"
            seed="11"
            result="grain"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  12 0 0 0 -4.5"
            result="speckles"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="grain"
            scale="2"
            xChannelSelector="R"
            yChannelSelector="G"
            result="roughStripe"
          />
          <feComposite in="roughStripe" in2="speckles" operator="in" />
        </filter>
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
