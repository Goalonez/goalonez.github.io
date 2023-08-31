import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Goalonez",
  description: "万变不离其宗",
  base: '/',
  lastUpdated: true,
  head: [
    ["link", {rel: "icon", href: "/logo.ico"}],
  ],
  themeConfig: {
    logo: '/logo.jpg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog/aboutme' }
    ],
    sidebar: [
      {
        text: 'BLOG',
        items: [
          { text: 'About Me', link: '/blog/aboutme' },
          { text: 'Tailscale自建(Headscale及Drep)', link: '/blog/Tailscale自建(Headscale及Drep)' },
          { text: 'Navicat Mac版重置试用期脚本', link: '/blog/Navicat Mac版重置试用期脚本' },
          { text: 'Windows使用WSL2并安装Docker', link: '/blog/Windows使用WSL2并安装Docker' },
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