const { theme } = require('@sanity/demo/tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './intro-template/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    ...theme,
    // Overriding fontFamily to use @next/font loaded families
    fontFamily: {
      // mono: 'var(--font-mono)',
      mono: 'var(--font-supply-mono)',
      sans: 'var(--font-sans)',
      serif: 'var(--font-serif)',
    },
    extend: {
      animation: {
        orbit: 'orbit 60s infinite linear',
        'backwards-rotation': 'backwards-rotation 60s infinite linear',
        continuousFlip: 'continuousFlip 15s linear infinite',
      },
      keyframes: {
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'backwards-rotation': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        continuousFlip: {
          '0%': { transform: 'rotateY(0)' },
          '50%': { transform: 'rotateY(180deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
      },
      colors: {
        primary: '#EED5F4',
        // primary-pairing: '#E8BBF3',
        // primary: '#CBCACA',
        // primary: '#9FADFD',
        // secondary: '#F2E9E4',
      },
      backgroundImage: {
        'homepage-pattern': "url('/images/blobs/B20s.svg')",
        'artistpage-pattern': "url('/images/blobs/B20sblack.svg')",
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
