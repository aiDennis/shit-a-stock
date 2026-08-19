#!/usr/bin/env node
/**
 * 生成 XML Sitemap（构建后运行）
 *
 * 输出：dist/sitemap.xml（仅收录首页 + /blog 第 1 页 + /about + 全部文章详情页）
 * 用法：node scripts/generate-sitemap.mjs（在 npm run build 的 postbuild 阶段运行）
 *
 * 说明：不依赖 @astrojs/sitemap（版本兼容问题），直接遍历 content collection 生成。
 *       分页 /blog/2+ 与 /tags/* 已 noindex, follow，不进 sitemap（低价值页会让
 *       Google 大量标记"已发现 - 尚未编入索引"，浪费抓取预算）。
 */

import { promises as fs } from "fs";
import path from "path";
import { globby } from "globby";

const SITE_URL = process.env.SITE_URL || "https://stock.955.life";
const OUT_DIR = path.resolve("dist");
const BLOG_DIR = path.resolve("src/content/blog");

function xmlEscape(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function main() {
  // 1. 收集文章（slug + 日期）
  const files = await globby(`${BLOG_DIR}/**/*.md`);
  const posts = [];
  for (const f of files) {
    const raw = await fs.readFile(f, "utf-8");
    const slugMatch = f.replace(BLOG_DIR + "/", "").replace(/\.md$/, "");
    const dateMatch = raw.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m);
    posts.push({
      slug: slugMatch, // 形如 2026-08/a-stock-20260807
      date: dateMatch ? dateMatch[1] : "",
    });
  }
  // 按日期降序（date 缺失排最后）
  posts.sort((a, b) => (b.date || "0000").localeCompare(a.date || "0000"));
  const latestDate = posts.find((p) => p.date)?.date || "";

  // 3. 组装 URL
  // SEO 策略（2026-08-19）：sitemap 只收录对搜索有价值的页面——
  //   首页、/blog 列表第 1 页、/about、全部文章详情页。
  //   分页（/blog/2+）、标签页（/tags/*）已加 noindex, follow，不再进 sitemap，
  //   避免 Google 把大量低价值页标记为"已发现 - 尚未编入索引"（曾达 250 页）。
  const urls = [];
  // 首页
  urls.push({ loc: `${SITE_URL}/`, lastmod: latestDate });
  // 博客列表（仅第 1 页；分页页 noindex 不进 sitemap）
  urls.push({ loc: `${SITE_URL}/blog`, lastmod: latestDate });
  // 关于
  urls.push({ loc: `${SITE_URL}/about` });
  // 全部文章
  for (const p of posts) {
    urls.push({ loc: `${SITE_URL}/blog/${p.slug}/`, lastmod: p.date });
  }

  // 4. 生成 XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${xmlEscape(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>
`;

  const outPath = path.join(OUT_DIR, "sitemap.xml");
  await fs.writeFile(outPath, xml);
  console.log(`[sitemap] ✅ ${urls.length} 个 URL → ${outPath}`);
}

main().catch((e) => {
  console.error("[sitemap] ❌", e.message);
  process.exit(1);
});
