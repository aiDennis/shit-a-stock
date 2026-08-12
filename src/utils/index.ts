import path from 'path'
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


export const toTitleCase = (str: string) => str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    )

export const getMonthName = (date: Date) => MONTHS[new Date(date).getMonth()]

export const getSlugFromPathname = (pathname: string) => path.basename(pathname, path.extname(pathname))

/**
 * 给站内路径加 base 前缀（GitHub Pages 项目页部署时需要）
 * 例：withBase('blog') → '/shit-a-stock/blog'（base=/shit-a-stock）或 '/blog'（base=/）
 */
export const withBase = (pathname: string) => {
  const base = import.meta.env.BASE_URL;
  return base.endsWith('/') ? base + pathname : base + '/' + pathname;
}

/**
 * 生成规范 URL（canonical）：去掉 base 前缀，指向最终域名
 * 例：Astro.url.pathname='/shit-a-stock/blog/xxx' → 'https://stock.955.life/blog/xxx'
 */
export const canonicalUrl = (pathname: string) => {
  const base = import.meta.env.BASE_URL;
  const path = base && base !== '/' ? pathname.replace(base, '') : pathname;
  return new URL(path || '/', import.meta.env.SITE).href;
}
