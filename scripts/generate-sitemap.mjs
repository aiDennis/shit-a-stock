#!/usr/bin/env node
/**
 * 生成 XML Sitemap（构建后运行）
 *
 * 输出：dist/sitemap.xml（含全部文章 + 首页 + 分页 + 标签页 + 关于）
 * 用法：node scripts/generate-sitemap.mjs（在 npm run build 的 postbuild 阶段运行）
 *
 * 说明：不依赖 @astrojs/sitemap（版本兼容问题），直接遍历 content collection 生成
 */

import { promises as fs } from "fs";
import path from "path";
import { globby } from "globby";

const SITE_URL = process.env.SITE_URL || "https://stock.955.life";
const OUT_DIR = path.resolve("dist");
const BLOG_DIR = path.resolve("src/content/blog");
const PAGE_SIZE = 8; // 与 src/config.ts PAGE_SIZE 保持一致

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

  // 2. 收集标签
  const tags = new Set();
  for (const f of files) {
    const raw = await fs.readFile(f, "utf-8");
    const tagMatches = [...raw.matchAll(/^\s*-\s+(.+)$/gm)];
    let inTags = false;
    for (const line of raw.split("\n")) {
      if (line.trim() === "tags:") { inTags = true; continue; }
      if (inTags && /^\s*-\s+/.test(line)) tags.add(line.trim().replace(/^-\s*/, ""));
      else if (inTags && !/^\s/.test(line)) inTags = false;
    }
  }

  // 3. 组装 URL
  const urls = [];
  // 首页
  urls.push({ loc: `${SITE_URL}/`, lastmod: latestDate });
  // 博客列表 + 分页
  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  urls.push({ loc: `${SITE_URL}/blog`, lastmod: latestDate });
  for (let p = 2; p <= totalPages; p++) {
    urls.push({ loc: `${SITE_URL}/blog/${p}` });
  }
  // 标签
  urls.push({ loc: `${SITE_URL}/tags` });
  for (const t of tags) {
    urls.push({ loc: `${SITE_URL}/tags/${encodeURIComponent(t)}` });
  }
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
