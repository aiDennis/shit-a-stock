import type{ NavItems } from './types'

export const NAV_ITEMS: NavItems = {
    home: {
        path: '/',
        title: '首页'
    },
    blog: {
        path: '/blog',
        title: '笔记'
    },
    tags: {
        path: '/tags',
        title: '标签'
    },
    about: {
        path: '/about',
        title: '关于'
    }
}

export const SITE = {
    // Your site's detail?
    name: 'A Stock Notes',
    title: 'A Stock Notes - A Share Investment Notes',
    keywords: 'A Stock,fuck A Share,shit A Stock,shit A Share',
    description: 'A Stock is very good!',
    url: 'https://stock.955.life',
    // githubUrl: 'https://github.com/one-aalam/astro-ink',
    listDrafts: true,
    // image: 'https://raw.githubusercontent.com/one-aalam/astro-ink/main/public/astro-banner.png',
    // YT video channel Id (used in media.astro)
    ytChannelId: '',
    // Optional, user/author settings (example)
    // Author: name
    author: '', // Example: Fred K. Schott
    // Author: Twitter handler
    authorTwitter: '', // Example: FredKSchott
    // Author: Image external source
    authorImage: '', // Example: https://pbs.twimg.com/profile_images/1272979356529221632/sxvncugt_400x400.jpg, https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png
    // Author: Bio
    // authorBio: 'Crisp, minimal, personal blog theme for Astro. Crisp, minimal, personal blog theme for Astro. Crisp, minimal, personal blog theme for Astro'
}

// Ink - Theme configuration
export const PAGE_SIZE = 8
export const USE_POST_IMG_OVERLAY = false
export const USE_MEDIA_THUMBNAIL = true

export const USE_AUTHOR_CARD = true
export const USE_SUBSCRIPTION = false /* works only when USE_AUTHOR_CARD is true */

export const USE_VIEW_STATS = false /* views API removed in SSG migration */
