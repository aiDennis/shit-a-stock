<script lang="ts">
    import { onMount } from 'svelte'
    import SearchIcon from './SearchIcon.svelte'
    import PostSearchPreview from './PostSearchPreview.svelte'

    type SearchDoc = {
        slug: string
        category: string
        title: string
        description: string
        tags: string[]
        body: string
    }

    let searchInput: HTMLInputElement
    let searchableDocs: SearchDoc[] = []
    let ready = false
    let loadError = false

    let searchQuery = ''
    let searchResults: SearchDoc[] = []

    /**
     * 拼接站内路径，兼容自定义域名根路径与 GitHub Pages base。
     * @param {string} pathname
     * @returns {string}
     */
    const withBase = (pathname: string) => {
        const base = import.meta.env.BASE_URL || '/'
        const prefix = base.endsWith('/') ? base : `${base}/`
        return prefix + pathname.replace(/^\//, '')
    }

    /**
     * 中文/英文通用的子串匹配。lunr 按英文分词，对中文日记无效。
     * @param {SearchDoc[]} docs
     * @param {string} rawQuery
     * @returns {SearchDoc[]}
     */
    const searchDocs = (docs: SearchDoc[], rawQuery: string): SearchDoc[] => {
        const tokens = rawQuery.trim().toLowerCase().split(/\s+/).filter(Boolean)
        if (!tokens.length) return []

        const scored = docs
            .map((doc) => {
                const title = (doc.title || '').toLowerCase()
                const description = (doc.description || '').toLowerCase()
                const tags = (doc.tags || []).join(' ').toLowerCase()
                const body = (doc.body || '').toLowerCase()
                const hay = `${title}\n${description}\n${tags}\n${body}`
                if (!tokens.every((t) => hay.includes(t))) return null

                let score = 0
                for (const t of tokens) {
                    if (title.includes(t)) score += 8
                    if (tags.includes(t)) score += 4
                    if (description.includes(t)) score += 2
                    if (body.includes(t)) score += 1
                }
                return { doc, score }
            })
            .filter(Boolean) as { doc: SearchDoc; score: number }[]

        scored.sort((a, b) => b.score - a.score)
        return scored.slice(0, 30).map((item) => item.doc)
    }

    onMount(async () => {
        try {
            const resp = await fetch(withBase('search-index.json'))
            if (!resp.ok) throw new Error(String(resp.status))
            searchableDocs = await resp.json()
            ready = true
        } catch {
            loadError = true
        }
        searchInput?.focus()
    })

    $: {
        if (!ready) {
            searchResults = []
        } else if (searchQuery.trim()) {
            searchResults = searchDocs(searchableDocs, searchQuery)
        } else {
            searchResults = []
        }
    }
</script>
<div class="search">
    <div class="search__ctrl">
        <label for="search"><SearchIcon found={searchResults.length > 0} /></label>
        <input
            id="search"
            type="search"
            name="search"
            bind:this={searchInput}
            placeholder="搜索日记标题、标签或内容"
            bind:value={searchQuery}
            autocomplete="off"
        />
    </div>
    <div class="search__results">
        {#if loadError}
            <div class="search__results--none">搜索索引加载失败，请稍后重试</div>
        {:else if !ready}
            <div class="search__results--none">正在加载索引…</div>
        {:else if searchResults.length}
            <div class="search__count">{searchResults.length} 条结果</div>
            {#each searchResults as post, i}
                <PostSearchPreview post={post} isLast={i === searchResults.length - 1} />
            {/each}
        {:else}
            <div class="search__results--none">
                {#if searchQuery.trim()}
                    没有找到匹配的日记
                {:else}
                    输入关键词，例如「黄金」或「上证」
                {/if}
            </div>
        {/if}
    </div>
    <div class="note"><small>点击空白处或按 Esc 关闭</small></div>
</div>
<style>
    .search {
        width: min(42rem, calc(100vw - 2rem));
        position: relative;
        background: var(--paper-card);
        color: var(--ink);
        padding: 0.9rem 1rem 0.7rem;
        border-radius: 8px;
        border: 1px solid var(--line);
        box-shadow: 0 12px 40px rgba(28, 26, 23, 0.18);
    }
    input {
        width: 100%;
        padding: 0.45rem 0.8rem 0.45rem 2.2rem;
        font-size: 0.95rem;
        color: var(--ink);
        background: var(--paper);
        border: 1px solid var(--line);
        border-radius: 6px;
        outline: none;
    }
    input:focus {
        border-color: var(--ink-soft);
    }
    .search__ctrl {
        position: relative;
        padding-bottom: 0.4rem;
    }
    .search__ctrl label {
        position: absolute;
        top: 0.4rem;
        left: 0.5rem;
        color: var(--ink-faint);
    }
    .search__results {
        width: 100%;
        max-height: min(70vh, 36rem);
        overflow-y: auto;
    }
    .search__count {
        font-size: 0.75rem;
        color: var(--ink-faint);
        padding: 0.2rem 0.15rem 0.35rem;
    }
    .search__results--none {
        text-align: center;
        color: var(--ink-faint);
        padding: 1.5rem 0.5rem;
    }
    .note {
        width: 100%;
        text-align: center;
        color: var(--ink-faint);
        padding-top: 0.35rem;
        font-size: 0.75rem;
    }
</style>
