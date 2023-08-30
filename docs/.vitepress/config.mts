import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Goalonez",
  description: "万变不离其宗",
  base: '/',
  lastUpdated: true,
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/logo.jpg',
      },
    ],
  ],
  themeConfig: {
    logo: '/logo.jpg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/aboutme' }
    ],
    sidebar: [
      {
        text: 'BLOG',
        items: [
          { text: 'About Me', link: '/aboutme' },
          { text: '测试', link: '/blog/测试' },
          
        ]
      }
    ],
    docFooter: {
			prev: '上一篇',
			next: '下一篇',
		},
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Goalonez/goalonez.github.io' }
    ],
    footer: {
			copyright: 'Copyright © 2023-present Goalonez',
		},
  }
})