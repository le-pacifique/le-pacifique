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
