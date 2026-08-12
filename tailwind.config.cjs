const { fontFamily } = require("tailwindcss/defaultTheme");
const config = require("./tailwind.theme.config.cjs");
/**
 * Find the applicable theme color palette, or use the default one
 */
const themeConfig =
  process.env.THEME_KEY && config[process.env.THEME_KEY]
    ? config[process.env.THEME_KEY]
    : config.default;
const { colors } = themeConfig;
module.exports = {
  darkMode: "class",
  content: ["./public/**/*.html", "./src/**/*.{astro,js,ts}"],
  safelist: ["dark"],
  theme: {
    fontFamily: {
      sans: ["Noto Serif SC", "Source Han Serif SC", "Songti SC", ...fontFamily.sans],
      serif: ["Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", "serif"],
      mono: ["Fira Code", "JetBrains Mono", ...fontFamily.mono],
    },
    extend: {
      colors: {
        theme: {
          ...colors,
        },
      },
      typography: (theme) => ({
        dark: {
          css: {
            color: theme("colors.gray.200"),
            blockquote: {
              color: colors.dark.primary,
              borderColor: colors.primary,
            },
            "blockquote > p::before, p::after": {
              color: colors.primary,
            },
          },
        },
        DEFAULT: {
          css: {
            a: {
              color: colors.dark.primary,
              "&:hover": {
                color: colors.primary,
              },
            },
            blockquote: {
              color: colors.primary,
              fontSize: theme("fontSize.2xl"),
              borderColor: colors.dark.primary,
            },
            "blockquote > p::before, p::after": {
              color: colors.dark.primary,
            },
            h1: {
              color: colors.dark.secondary,
            },
            h2: {
              color: colors.dark.secondary,
            },
            h3: {
              color: colors.dark.secondary,
            },
            h4: {
              color: colors.dark.secondary,
            },
            ".text-g-1": {
              color: colors.green['100'],
            },
            ".text-g-2": {
              color: colors.green['200'],
            },
            ".text-g-3": {
              color: colors.green['300'],
            },
            ".text-g-4": {
              color: colors.green['400'],
            },
            ".text-g-5": {
              color: colors.green['500'],
            },
            ".text-g-6": {
              color: colors.green['600'],
            },
            ".text-g-7": {
              color: colors.green['700'],
            },
            ".text-g-8": {
              color: colors.green['800'],
            },
            ".text-g-9": {
              color: colors.green['900'],
            },
            ".text-r-1": {
              color: colors.red['100'],
            },
            ".text-r-2": {
              color: colors.red['200'],
            },
            ".text-r-3": {
              color: colors.red['300'],
            },
            ".text-r-4": {
              color: colors.red['400'],
            },
            ".text-r-5": {
              color: colors.red['500'],
            },
            ".text-r-6": {
              color: colors.red['600'],
            },
            ".text-r-7": {
              color: colors.red['700'],
            },
            ".text-r-8": {
              color: colors.red['800'],
            },
            ".text-r-9": {
              color: colors.red['900'],
            },
            ".text-gray-1": {
              color: colors.gray['100'],
            },
            ".text-gray-2": {
              color: colors.gray['200'],
            },
            ".text-gray-3": {
              color: colors.gray['300'],
            },
            ".text-gray-4": {
              color: colors.gray['400'],
            },
            ".text-gray-5": {
              color: colors.gray['500'],
            },
            ".text-gray-6": {
              color: colors.gray['600'],
            },
            ".text-gray-7": {
              color: colors.gray['700'],
            },
            ".text-gray-8": {
              color: colors.gray['800'],
            },
            ".text-gray-9": {
              color: colors.gray['900'],
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: { typography: ["dark"] },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-hyphens"),
  ],
};
