import { createContentLoader, defineConfig } from 'vitepress'
import { Feed } from 'feed'
import { writeFile } from 'fs/promises'
import * as path from 'path'
//import { RSSOptions, RssPlugin } from 'vitepress-plugin-rss'

const map: Record<string, string> = {}

// const baseUrl = 'https://blog.goalonez.site'
// const RSS: RSSOptions = {
//   title: 'Goalonez Blog',
//   description: '万变不离其宗',
//   baseUrl,
//   copyright: 'Copyright © 2023-present Goalonez',
//   language: 'zh-cn',
//   icon: true,
//   author: {
//     name: 'Goalonez',
//     email: 'z471854680@gmail.com',
//     link: 'https://blog.goalonez.site'
//   },
//   filename: 'feed',
//   limit: 100,
//   log: true,
//   renderHTML: (filecontent: string) => {
//     // 使用正则表达式去除所有的 &ZeroWidthSpace;
//     return filecontent.replaceAll(/&ZeroWidthSpace;/g, '');
//   }
// }

export default defineConfig({
  // 标题（浏览器后缀）
  title: "Goalonez Blog",
  // 描述
  description: "万变不离其宗",
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
  // vite: {
  //   // ↓↓↓↓↓
  //   plugins: [RssPlugin(RSS)]
  //   // ↑↑↑↑↑
  // },
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
              { text: 'mt终于保号了', link: '/blog/mt终于保号了' },
              { text: 'MacOS还原自建Tailscale登录服务地址', link: '/blog/MacOS还原自建Tailscale登录服务地址' },
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
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 448 512"><title>RSS</title><path d="M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM112 416c-26.51 0-48-21.49-48-48s21.49-48 48-48s48 21.49 48 48s-21.49 48-48 48zm157.533 0h-34.335c-6.011 0-11.051-4.636-11.442-10.634c-5.214-80.05-69.243-143.92-149.123-149.123c-5.997-.39-10.633-5.431-10.633-11.441v-34.335c0-6.535 5.468-11.777 11.994-11.425c110.546 5.974 198.997 94.536 204.964 204.964c.352 6.526-4.89 11.994-11.425 11.994zm103.027 0h-34.334c-6.161 0-11.175-4.882-11.427-11.038c-5.598-136.535-115.204-246.161-251.76-251.76C68.882 152.949 64 147.935 64 141.774V107.44c0-6.454 5.338-11.664 11.787-11.432c167.83 6.025 302.21 141.191 308.205 308.205c.232 6.449-4.978 11.787-11.432 11.787z" fill="currentColor"></path></svg>'
        },
        link: 'https://blog.goalonez.site/feed.xml',
      },
      { icon: 'github', link: 'https://github.com/Goalonez/goalonez.github.io'},
    ],
    // 页脚
    footer: {
			copyright: 'Copyright © 2023-present Goalonez',
		},
  },
  //------------------------------------------------------------------------------
  //处理RSS
  transformHtml(code, id, ctx) {
    if (!/[\\/]404\.html$/.test(id)) {
      map[id] = code
    }
  },
  async buildEnd(siteConfig) {
    const hostname = 'https://blog.goalonez.site'
    const feed = new Feed({
      id: hostname,
      title: siteConfig.site.title,
      description: siteConfig.site.description,
      language: 'zh-CN',
      favicon: hostname + "/logo.ico",
      updated: new Date(),
      link: hostname,
      copyright: '',
      author: {
        name: "Goalonez",
        email: "z471854680@gmail.com",
        link: hostname
      }
    })

    // 过滤出所有的 markdown 文件
    const posts = await createContentLoader('./blog/*.md', {
      excerpt: true,
      render: true,
    }).load()

    //按时间排序
    posts.sort(
      (a, b) =>
        +new Date(b.frontmatter.date as string) -
        +new Date(a.frontmatter.date as string),
    )

    async function cleanHtml(
      html: string,
      baseUrl: string,
    ): Promise<{ cleanedHtml?: string, firstImageUrl?: string }> {
      const { parse } = await import('node-html-parser');
      const dom = parse(html).querySelector('main > .vp-doc > div');
      let firstImageUrl: string | undefined = undefined;
    
      dom?.querySelectorAll('img').forEach((it, index) => {
        const src = it.getAttribute('src');
        if (src) {
          const absoluteSrc = new URL(src, baseUrl).toString();
          it.setAttribute('src', absoluteSrc);
          if (index === 0) {
            firstImageUrl = absoluteSrc; // 记录第一个图片的路径
          }
        }
      });
    
      return {
        cleanedHtml: dom?.innerHTML,
        firstImageUrl,
      };
    }

    function getAbsPath(outDir: string, p: string): string {
      if (p.endsWith('.html')) {
        return path.join(outDir, p)
      }
      if (p.endsWith('/')) {
        return path.join(outDir, p, 'index.html')
      }
      return p
    }
 
    for (let { url, excerpt, frontmatter, html } of posts) {
      //处理图片路径
      const htmlUrl = getAbsPath(siteConfig.outDir, url);
      let result;
      if (map[htmlUrl]) {
        const baseUrl = path.join(hostname, siteConfig.site.base);
        result = await cleanHtml(map[htmlUrl], baseUrl);
      } else {
        result = { cleanedHtml: html };
      }

      //处理时区
      const date = new Date(frontmatter.date); 
      const gmtDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      
      // 添加到 feed 中
      feed.addItem({
        title: frontmatter.title,
        id: `${hostname}${url}`,
        link: `${hostname}${url}`,
        description: `${hostname}${url}`,
        //处理vitepress编译后生成的ZeroWidthSpace
        //处理gitalk
        content: result?.cleanedHtml?.replaceAll('&ZeroWidthSpace;', '')
        .replaceAll(/<span class="line-number">\d+<\/span><br>/g, '')
        .replaceAll(/<div class="gitalk-container"><div id="gitalk-container"><\/div><\/div>/g, '')
        .replaceAll(/<gitalk\/>/g, ''),
        author: feed.options.author ? [feed.options.author] : undefined,
        date: gmtDate, // 使用 GMT 时区的日期
        image: result?.firstImageUrl || `${hostname}` + '/logo.jpg',
      })
    }

    // 生成并写入文件
    await writeFile(path.join(siteConfig.outDir, 'feed.xml'), feed.rss2())

  },
  //处理RSS
  //------------------------------------------------------------------------------
})