# QuantumultX配置订阅-节点-规则-去广告-破解

## 概况

- 根据分组订阅节点
- 测试并自动切换速度快的节点
- 远程订阅常用软件分流规则
- 按需添加自定义网址
- 白名单模式,不在匹配规则里的不代理,保证大部分代理都在自己知情的情况下执行
- 重写部分app达到去广告或破解效果

## 代理分组[policy]

```properties
[policy]
# 配置一个总和的分组YourProxy,然后后面把自己的节点名分组也配上去
static=YourProxy, proxy, auto-hk, auto-usa, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/AmyTelecom.png
# 根据节点名分组,我是按区域分组
# url-latency-benchmark 取个名字
# server-tag-regex 按你自己的分组要求写
url-latency-benchmark=auto-hk, server-tag-regex=香港, check-interval=600, tolerance=0, alive-checking=false
url-latency-benchmark=auto-usa, server-tag-regex=美国, check-interval=600, tolerance=0, alive-checking=false
```

## 节点订阅地址[server_remote]

```properties
[server_remote]
https://你的节点订阅地址
```

## 订阅分流规则(代理)[filter_remote]

### 订阅地址获取

- https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/QuantumultX
- 根据自己的使用情况去搜索应用地址

```properties
[filter_remote]
# 自己根据上面提供的连接配置自己常用的应用,tag取个名字,force-policy代理规则
# force-policy平时统一用YourProxy就可以了,特殊地址可以配置一下自己的分组,比如auto-usa,国内地址直连direct
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Microsoft/Microsoft.list, tag=Microsoft, force-policy=auto-usa, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/SteamCN/SteamCN.list, tag=SteamCN, force-policy=direct, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Game/GameDownloadCN/GameDownloadCN.list, tag=GameDownloadCN, force-policy=direct, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Steam/Steam.list, tag=Steam, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
```

## 订阅重写规则(去广告,破解之类的)[rewrite_remote]

### 订阅地址获取

- https://github.com/ddgksf2013
- 根据自己的使用情况去搜索应用地址

```properties
[rewrite_remote]
# 自己根据上面提供的连接配置自己常用的应用,tag取个名字,
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/AdBlock/Ximalaya.conf, tag=喜马拉雅, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/AdBlock/BingSimplify.conf, tag=Bing首页简化, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/Html/NewBing.conf, tag=解锁NewBing, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/AdBlock/Applet.conf, tag=微信, update-interval=172800, opt-parser=false, enabled=true
```



## 自定义规则编写[filter_local]

- 因为目前采用`白名单模式`,所以只有能在`远程订阅规则,cn网站,自定义规则`匹配到的才会走代理
- 常用的一般在远程订阅规则中已经提供了,某些小众网站自己遇到了,就在自定义规则里加一下
- 有些特殊需求的网站需要对应地区,也在自定义规则中加
- 一般这些可以直接在`app界面`操作(即使使用mac icloud来编辑,同步偶尔也会有坑)

### 规则

- **HOST** / 域名匹配 / 例如：[www.google.com](http://www.google.com/)
- **HOST-SUFFIX** / 域名后缀匹配 / 例如：google.com
- **HOST-KEYWORD** / 域名关键字匹配 / 例如：google
- **USER-AGENT** / 用户代理匹配 / 例如：*abc?
- **IP-CIDR** / IP匹配 / 例如：192.168.0.1/24
- **IP6-CIDR** / IPV6
- **GEOIP** / IP数据库匹配 / 例如：US

```properties
[filter_local]
# 自定义
# 第一个写匹配方式,第二个写匹配条件,第三个写代理方式
# direct直连
# reject拒绝,一般用来去广告
# YourProxy,auto-usa,auto-hk代理方式
host, sdkapp.uve.weibo.com, direct
host, amdc.m.taobao.com, reject
host-suffix,typora.io,YourProxy
host-suffix,inoreader.com,YourProxy
host-suffix,threads.net,auto-usa

# 国内网站
host-suffix,cn,direct
host-keyword,-cn,direct

## 最终规则
geoip, cn, direct
final, direct
```

## 参考配置

```properties
[general]
server_check_url =http://www.google.com/generate_204
excluded_routes = 192.168.0.0/16, 172.16.0.0/12, 100.64.0.0/10, 10.0.0.0/8

[dns]
server=119.29.29.29
server=223.5.5.5

[policy]
static=YourProxy, proxy, auto-hk, auto-usa, auto-tw, auto-sg, auto-jp, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/AmyTelecom.png
url-latency-benchmark=auto-hk, server-tag-regex=香港, check-interval=600, tolerance=0, alive-checking=false
url-latency-benchmark=auto-usa, server-tag-regex=美国, check-interval=600, tolerance=0, alive-checking=false
url-latency-benchmark=auto-tw, server-tag-regex=台湾, check-interval=600, tolerance=0, alive-checking=false
url-latency-benchmark=auto-sg, server-tag-regex=新加坡, check-interval=600, tolerance=0, alive-checking=false
url-latency-benchmark=auto-jp, server-tag-regex=日本, check-interval=600, tolerance=0, alive-checking=false

[server_remote]
# 你的订阅地址

[filter_remote]
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Microsoft/Microsoft.list, tag=Microsoft, force-policy=auto-usa, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/SteamCN/SteamCN.list, tag=SteamCN, force-policy=direct, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Game/GameDownloadCN/GameDownloadCN.list, tag=GameDownloadCN, force-policy=direct, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Steam/Steam.list, tag=Steam, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/ChinaMaxNoIP/ChinaMaxNoIP.list, tag=国内域名, force-policy=direct, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Vercel/Vercel.list, tag=Vercel, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Tumblr/Tumblr.list, tag=Tumblr, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Twitch/Twitch.list, tag=Twitch, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Reddit/Reddit.list, tag=Reddit, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Nvidia/Nvidia.list, tag=NVIDIA, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Notion/Notion.list, tag=Notion, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Imgur/Imgur.list, tag=Imgur, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GitLab/GitLab.list, tag=GitLab, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GitBook/GitBook.list, tag=GitBook, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Dropbox/Dropbox.list, tag=Dropbox, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Emby/Emby.list, tag=Emby, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GoogleEarth/GoogleEarth.list, tag=GoogleEarth, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Wikimedia/Wikimedia.list, tag=Wikimedia, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/BBC/BBC.list, tag=BBC, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Instagram/Instagram.list, tag=Instagram, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Amazon/Amazon.list, tag=Amazon, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Wikipedia/Wikipedia.list, tag=Wikipedia, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Spotify/Spotify.list, tag=Spotify, force-policy=auto-usa, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Cloudflare/Cloudflare.list, tag=Cloudflare, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Twitter/Twitter.list, tag=Twitter, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Telegram/Telegram.list, tag=Telegram, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GitHub/GitHub.list, tag=GitHub, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Google/Google.list, tag=Google, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/YouTube/YouTube.list, tag=YouTube, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/AdvertisingLite/AdvertisingLite.list, tag=去广告, force-policy=reject, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/OpenAI/OpenAI.list, tag=OpenAI, force-policy=auto-usa, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Facebook/Facebook.list, tag=Facebook, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true

[rewrite_remote]
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/AdBlock/Ximalaya.conf, tag=喜马拉雅, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/AdBlock/BingSimplify.conf, tag=Bing首页简化, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/Html/NewBing.conf, tag=解锁NewBing, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/AdBlock/Applet.conf, tag=微信, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/app2smile/rules/master/module/tieba-qx.conf, tag=贴吧, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/script/zheye/zheye.snippet, tag=知乎, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/AdBlock/Cainiao.conf, tag=菜鸟, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/UnlockVip/Spotify.conf, tag=Spotify会员, update-interval=172800, opt-parser=false, enabled=true
https://github.com/ddgksf2013/Rewrite/raw/master/AdBlock/Netease.conf, tag=网易云, update-interval=172800, opt-parser=false, enabled=true
https://github.com/ddgksf2013/Rewrite/raw/master/AdBlock/Bilibili.conf, tag=B站, update-interval=172800, opt-parser=false, enabled=true
https://github.com/ddgksf2013/Rewrite/raw/master/AdBlock/XiaoHongShu.conf, tag=小红书, update-interval=172800, opt-parser=false, enabled=true
https://github.com/ddgksf2013/Rewrite/raw/master/AdBlock/Amap.conf, tag=高德, update-interval=172800, opt-parser=false, enabled=true
https://github.com/ddgksf2013/Rewrite/raw/master/AdBlock/Weibo.conf, tag=微博, update-interval=172800, opt-parser=false, enabled=true
https://github.com/ddgksf2013/Rewrite/raw/master/AdBlock/YoutubeAds.conf, tag=YouTube, update-interval=172800, opt-parser=false, enabled=true
https://github.com/ddgksf2013/Rewrite/raw/master/AdBlock/StartUp.conf, tag=墨鱼去开屏, update-interval=172800, opt-parser=false, enabled=true

[server_local]

[filter_local]
# 自定义
host, sdkapp.uve.weibo.com, direct
host, amdc.m.taobao.com, reject
host, amdc.m.taobao.com, reject
host-suffix,typora.io,YourProxy
host-suffix,v2ex.com,YourProxy
host-suffix,substack.com,YourProxy
host-suffix,jellow.site,direct
host-suffix,inoreader.com,YourProxy
host-suffix,unsplash.com,YourProxy
host-suffix,threads.net,auto-usa

# 国内网站
host-suffix,cn,direct
host-keyword,-cn,direct

## 最终规则
geoip, cn, direct
final, direct

[rewrite_local]

[task_local]

[http_backend]

[mitm]
# 自己去app里生成
```

<gitalk/>
