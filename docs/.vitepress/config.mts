import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Goalonez",
  description: "万变不离其宗",
  base: '/',
  lastUpdated: true,
  cleanUrls: true,
  head: [
    ["link", {rel: "icon", href: "/logo.ico"}],
  ],
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/aboutme' }
    ],
    sidebar: [
      {
        text: '博客',
        items: [
          { text: 'About Me', link: '/aboutme' },
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
    outline: {
      level: [2, 6],
      label: '文章目录'
    },
    lastUpdatedText: '最后更新时间',
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