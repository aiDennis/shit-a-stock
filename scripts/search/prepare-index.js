/**
 * 构建搜索索引：扫描全部博文，输出 search-index.json。
 * 写入 public/（供 astro dev）；若 dist/ 已存在则同步写入（供 postbuild 部署）。
 */
import path from 'path'
import { promises as fs } from 'fs'
import { globby } from 'globby'
import grayMatter from 'gray-matter'

;(async function () {
    const srcDir = path.join(process.cwd(), 'src')
    const publicDir = path.join(process.cwd(), 'public')
    const distDir = path.join(process.cwd(), 'dist')
    const contentBlogDir = path.join(srcDir, 'content', 'blog')
    const contentFilePattern = path.join(contentBlogDir, '**/*.md')
    const indexFileName = 'search-index.json'

    /**
     * 将博文路径转为 Astro content collection slug。
     * 例：src/content/blog/2026-08/a-stock-20260811.md → 2026-08/a-stock-20260811
     * @param {string} filePath
     * @returns {string}
     */
    const getSlugFromPathname = (filePath) =>
        path.relative(contentBlogDir, filePath).replace(/\\/g, '/').replace(/\.md$/, '')

    const contentFilePaths = await globby([contentFilePattern])

    if (!contentFilePaths.length) {
        console.warn(`[search] 未找到博文：${contentBlogDir}`)
        return
    }

    const files = contentFilePaths.map(async (filePath) => await fs.readFile(filePath, 'utf8'))
    const index = []
    let i = 0
    for await (const file of files) {
        const { data: { title, description, tags }, content } = grayMatter(file)
        index.push({
            slug: getSlugFromPathname(contentFilePaths[i]),
            category: 'blog',
            title: title || '',
            description: description || '',
            tags: Array.isArray(tags) ? tags : [],
            body: content || '',
        })
        i++
    }

    const payload = JSON.stringify(index)
    await fs.writeFile(path.join(publicDir, indexFileName), payload)

    try {
        await fs.access(distDir)
        await fs.writeFile(path.join(distDir, indexFileName), payload)
    } catch {
        // dist 尚未生成（如 astro dev），跳过
    }

    console.log(`[search] Indexed ${index.length} documents → ${indexFileName}`)
})()
