import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Goalonez",
  description: "Goalonez Blog",
  lang: 'zh-CN',
  base: '/',
  lastUpdated: true,
  cleanUrls: true,
  markdown: {
    lineNumbers: true,
  },
  head: [
    ["link", {rel: "icon", href: "/logo.ico"}],
    // 添加百度统计代码
    ['script', {},
    `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?eb7ec8e9de5faec3aceab73fc11d9b1e";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
    `
    ]
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
          { text: '铭凡UM790 Pro体验', link: '/blog/铭凡UM790 Pro体验' },
          { text: '唠叨一下最近修电脑的经历', link: '/blog/唠叨一下最近修电脑的经历' },
          { text: 'Clash配置订阅节点及规则', link: '/blog/Clash配置订阅节点及规则' },
          { text: 'QuantumultX配置订阅、节点、规则、去广告、破解', link: '/blog/QuantumultX配置订阅、节点、规则、去广告、破解' },
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
		}
  }
})