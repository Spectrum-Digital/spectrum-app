const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['var(--font-dm-sans)'],
    },
    fontSize: {
      xxs: ['0.625rem', { lineHeight: '0.8125rem' }], // 10px
      xs: ['0.75rem', { lineHeight: '1.25rem' }], // 12px
      sm: ['0.875rem', { lineHeight: '1.5rem' }], // 14px
      base: ['1rem', { lineHeight: '1.25rem' }], // 16px
      md: ['1.125rem', { lineHeight: '1.6875rem' }], // 18px
      lg: ['1.25rem', { lineHeight: '1.5625rem' }], // 20px
      xl: ['1.4375rem', { lineHeight: '1.8125rem' }], // 23px
      'display-xs': ['1.75rem', { lineHeight: '2.1875rem' }], // 28px
      'display-sm': ['2.0625rem', { lineHeight: '2.5625rem' }], // 33px
      'display-md': ['2.5rem', { lineHeight: '3.125rem' }], // 40px
      'display-lg': ['3rem', { lineHeight: '3.75rem' }], // 48px
      'display-xl': ['3.625rem', { lineHeight: '4.5625rem' }], // 58px
      'display-2xl': ['3.875rem', { lineHeight: '4.875rem' }], // 62px
    },
    colors: {
      transparent: colors.transparent,
      white: colors.white,
      gray: colors.gray,
      black: colors.black,
      red: colors.red,
      bg100: {
        light: '#F1F2F4',
        dark: '#131313',
      },
      bg200: {
        light: '#FFFFFF',
        dark: '#1B1B1B',
      },
      bg300: {
        light: '#F9F9F9',
        dark: '#252628',
      },
      b1: {
        light: colors.gray[200],
        dark: '#2B2B2B',
      },
      b2: {
        light: colors.gray[300],
        dark: '#3B3B3B',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      backgroundImage: {
        'radial-light': 'radial-gradient(at center, #efdee6, #ffffff)',
        'radial-dark': 'radial-gradient(circle, rgba(5,11,52,1) 0%, rgba(0,0,0,1) 100%)',
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *')
      addVariant('child-hover', '& > *:hover')
    },
  ],
}
