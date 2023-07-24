/** @type {import('tailwindcss').Config} */

// NOT USED at the moment, too many conflict with current styling
// Astro + Tailwind template: https://github.com/onwidget/astrowind
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Roboto', 'sans-serif']
      // serif: ['Merriweather', 'serif'],
    },
    fontSize: {
      sm: '0.8rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem'
    },
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)'
      }
      // fontFamily: {
      // 	sans: ['var(--aw-font-sans)', ...defaultTheme.fontFamily.sans],
      // 	serif: ['var(--aw-font-serif)', ...defaultTheme.fontFamily.serif],
      // 	heading: ['var(--aw-font-heading)', ...defaultTheme.fontFamily.sans],
      // },
      // spacing: {
      // '128': '32rem',
      // '144': '36rem',
      // },
      // borderRadius: {
      // '4xl': '2rem',
      // }
    }
  },
  // corePlugins: {
  // 	margin: false,
  // 	fontSize: false,
  // 	fontWeight: false,
  // },
  plugins: [require('@tailwindcss/typography')]
};
