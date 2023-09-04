import { defineConfig } from 'vitepress'

export default defineConfig({
  // 标题（浏览器后缀）
  title: "Goalonez",
  // 描述
  description: "Goalonez Blog",
  // 语言
  lang: 'zh-CN',
  // 根目录，如果需要部署成htpps://github.com/blog/的形式，则设置/blog/
  base: '/',
  // 文档最后更新时间展示
  lastUpdated: true,
  // 去除浏览器链接中的.html后缀
  cleanUrls: true,
  // markdown显示行数
  markdown: {
    lineNumbers: true,
  },
  // head设置
  head: [
    // 浏览器中图标
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
  // 主题设置
  themeConfig: {
    // 左上角logo
    logo: '/logo.png',
    // 首页右上角导航栏
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/aboutme' }
    ],
    // 文章左侧导航栏
    sidebar: [
      {
        text: '博客',
        items: [
          { text: 'About Me', link: '/aboutme' },
          { text: 'Mac软件折腾之路', link: '/blog/Mac软件折腾之路' },
          { text: 'Windows软件折腾之路', link: '/blog/Windows软件折腾之路' },
          { text: 'Chrome插件折腾之路', link: '/blog/Chrome插件折腾之路' },
          { text: 'Raycast折腾之路（常用功能篇）', link: '/blog/Raycast折腾之路（常用功能篇）' },
          { text: 'Raycast折腾之路（插件篇）', link: '/blog/Raycast折腾之路（插件篇）' },
          { text: 'Raycast快捷链接参考', link: '/blog/Raycast快捷链接参考' },
          { text: 'Obsidian折腾之路', link: '/blog/Obsidian折腾之路' },
          { text: 'VitePress博客搭建', link: '/blog/VitePress博客搭建' },
          { text: 'Zsh配置', link: '/blog/Zsh配置' },
          { text: '铭凡UM790 Pro体验', link: '/blog/铭凡UM790 Pro体验' },
          { text: '唠叨一下最近修电脑的经历', link: '/blog/唠叨一下最近修电脑的经历' },
          { text: 'Clash配置订阅节点及规则', link: '/blog/Clash配置订阅节点及规则' },
          { text: 'QuantumultX配置订阅-节点-规则-去广告-破解', link: '/blog/QuantumultX配置订阅-节点-规则-去广告-破解' },
          { text: 'Tailscale自建(Headscale及Drep)', link: '/blog/Tailscale自建(Headscale及Drep)' },
          { text: 'Navicat Mac版重置试用期脚本', link: '/blog/Navicat Mac版重置试用期脚本' },
          { text: 'Windows使用WSL2并安装Docker', link: '/blog/Windows使用WSL2并安装Docker' },
        ]
      }
    ],
    // 文章底部导航栏的自定义配置，默认是英语
    docFooter: {
			prev: '上一篇',
			next: '下一篇',
		},
    // 文章右侧目录展示级别和标题
    outline: {
      level: [2, 6],
      label: '文章目录'
    },
    // 文章更新时间的前缀文本
    lastUpdatedText: '最后更新时间',
    search: {
      provider: 'local',
    },
    // 右上角Github链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Goalonez/goalonez.github.io' }
    ],
    // 页脚
    footer: {
			copyright: 'Copyright © 2023-present Goalonez',
		}
  }
})