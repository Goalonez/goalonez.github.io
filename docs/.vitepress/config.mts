import { defineConfig } from 'vitepress'

export default defineConfig({
  // 标题（浏览器后缀）
  title: "Goalonez",
  // 描述
  description: "Goalonez Blog",
  // 语言
  lang: 'zh-CN',
  // 根目录，如果需要部署成https://github.com/blog/的形式，则设置/blog/
  base: '/',
  // 文档最后更新时间展示
  lastUpdated: true,
  // 去除浏览器链接中的.html后缀(部署服务器时会导致页面重复问题，等待官方更新解决)
  //cleanUrls: true,
  // markdown显示行数
  markdown: {
    lineNumbers: true,
  },
  // head设置
  head: [
    // 浏览器中图标
    ["link", {rel: "icon", href: "/logo.ico"}],
    // 添加统计代码
    ['script', {},
    `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?9b77e13b749eb16bfaad0e97179ca700";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "jud16drf49");
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
      { text: 'AboutMe', link: '/aboutme' },
      {
        text: 'Blog',
        items: [
          {
            text: '2024',
            items: [
              { text: 'MacOS单独调用IDEA的文本对比工具', link: '/blog/MacOS单独调用IDEA的文本对比工具' },
              { text: '修修补补又三年', link: '/blog/修修补补又三年' },
              { text: '修了一下GPW滚轮', link: '/blog/修了一下GPW滚轮' },
              { text: '离大谱的阿里云盘', link: '/blog/离大谱的阿里云盘' },
              { text: '开工开工', link: '/blog/开工开工' },
              { text: 'MoviePilot配置-Nas媒体库自动化管理工具', link: '/blog/MoviePilot配置-Nas媒体库自动化管理工具' },
              { text: '你好2024', link: '/blog/你好2024' },
            ]
          }, 
          {
            text: '2023',
            items: [
              { text: '再见2023', link: '/blog/再见2023' },
              { text: '网易云2023年度总结', link: '/blog/网易云2023年度总结' },
              { text: 'Raycast-Wrapped-2023', link: '/blog/Raycast-Wrapped-2023' },
              { text: '新玩具-极空间Z4pro', link: '/blog/新玩具-极空间Z4pro' },
              { text: '腾讯云设置root密码登录', link: '/blog/腾讯云设置root密码登录' },
              { text: 'jar打包部署-shell脚本', link: '/blog/jar打包部署-shell脚本' },
              { text: '新玩具-15ProMax', link: '/blog/新玩具-15ProMax' },
              { text: '新玩具-Keychron-K3-Pro', link: '/blog/新玩具-Keychron-K3-Pro' },
              { text: '快捷指令折腾之路', link: '/blog/快捷指令折腾之路' },
              { text: 'AzureOpenAI申请过程', link: '/blog/AzureOpenAI申请过程' },
              { text: '新玩具-15Pro', link: '/blog/新玩具-15Pro' },
              { text: 'OpenAI api集成', link: '/blog/OpenAI api集成' },
              { text: 'SpringBoot与Redisson版本对应', link: '/blog/SpringBoot与Redisson版本对应' },
              { text: 'iOS杭州市民卡交通码...', link: '/blog/iOS杭州市民卡交通码URL_Scheme快捷打开' },
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
              { text: '唠叨一下最近修电脑的经历...', link: '/blog/唠叨一下最近修电脑的经历' },
              { text: 'Clash配置', link: '/blog/Clash配置' },
              { text: 'QuantumultX配置', link: '/blog/QuantumultX配置' },
              { text: 'Tailscale自建(Headscale...', link: '/blog/Tailscale自建(Headscale及Derp)' },
              { text: 'Navicat Mac版重置试用期脚本', link: '/blog/Navicat Mac版重置试用期脚本' },
              { text: 'Windows使用WSL2并...', link: '/blog/Windows使用WSL2并安装Docker' },
            ]
          }, 
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
    // 开启本地搜索（左上角）
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