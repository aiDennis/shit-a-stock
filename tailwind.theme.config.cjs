/*
 * @Author: Deshun
 * @Date: 2023-12-14 10:36:10
 * @Description: tailwindCSS 主题色
 * @FilePath: /AStock.956.icu/tailwind.theme.config.cjs
 * Copyright (c) 2023 by liudeshun@pansoft.com, All Rights Reserved.
 */
const colors = require("tailwindcss/colors");

module.exports = {
  /**
   * Color Palette - Default/Duplicate of orange Heart (Never remove this)
   */
  default: {
    colors: {
      green: {
        100: colors.green[100],
        200: colors.green[200],
        300: colors.green[300],
        400: colors.green[400],
        500: colors.green[500],
        600: colors.green[600],
        700: colors.green[700],
        800: colors.green[800],
        900: colors.green[900],
      },
      red: {
        100: colors.red[100],
        200: colors.red[200],
        300: colors.red[300],
        400: colors.red[400],
        500: colors.red[500],
        600: colors.red[600],
        700: colors.red[700],
        800: colors.red[800],
        900: colors.red[900],
      },
      gray: {
        100: colors.gray[100],
        200: colors.gray[200],
        300: colors.gray[300],
        400: colors.gray[400],
        500: colors.gray[500],
        600: colors.gray[600],
        700: colors.gray[700],
        800: colors.gray[800],
        900: colors.gray[900],
      },
      primary: '#2c2620',      // 墨黑（替代 orange-700）
      secondary: '#6b6258',     // 墨灰（替代 orange-800）
      dark: {
        primary: '#d8d2c7',     // 浅墨（暗色模式）
        secondary: '#9a9389',   // 暖灰
      },
      accent: {
        gray: {
          light: colors.gray[300],
          dark: colors.gray[500],
        },
        default: '#6b6258',
      },
    },
  },
};
