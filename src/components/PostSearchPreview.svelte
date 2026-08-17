<script lang="ts">
    type Props = {
        slug: string
        title: string
        description: string
        category: string
        tags: Array<string>
    }
    export let post: Props
    export let isLast: boolean = false

    /**
     * @param {string} pathname
     * @returns {string}
     */
    const withBase = (pathname: string) => {
        const base = import.meta.env.BASE_URL || '/'
        const prefix = base.endsWith('/') ? base : `${base}/`
        return prefix + pathname.replace(/^\//, '')
    }
</script>
<a class="post-preview" class:is-last={isLast} href={withBase(`${post.category}/${post.slug}`)} title={post.title}>
    <span class="post-preview__title">{post.title}</span>
    {#if post.description}
        <span class="post-preview__desc">{post.description}</span>
    {/if}
</a>
<style lang="postcss">
    .post-preview {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        text-align: left;
        padding: 0.4rem 0.45rem;
        border-bottom: 1px solid var(--line-soft);
        color: inherit;
        background-image: none;
    }
    .post-preview.is-last {
        border-bottom: 0;
    }
    .post-preview:hover {
        background: var(--paper);
        background-image: none;
    }
    .post-preview__title {
        font-size: 0.9rem;
        line-height: 1.35;
        font-weight: 600;
        color: var(--ink-darkest);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .post-preview__desc {
        font-size: 0.78rem;
        color: var(--ink-faint);
        line-height: 1.3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
