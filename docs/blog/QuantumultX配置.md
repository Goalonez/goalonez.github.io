# QuantumultX配置

## 概况

- 根据分组订阅节点
- 测试并自动切换速度快的节点
- 远程订阅常用软件分流规则
- 按需添加自定义网址
- 白名单模式,不在匹配规则里的不呆梨,保证大部分呆梨都在自己知情的情况下执行
- 重写部分app达到去广告或破解效果

## 呆梨分组[policy]

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

## 订阅分流规则(呆梨)[filter_remote]

### 订阅地址获取

- https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/QuantumultX
- 根据自己的使用情况去搜索应用地址

```properties
[filter_remote]
# 自己根据上面提供的连接配置自己常用的应用,tag取个名字,force-policy呆梨规则
# force-policy平时统一用YourProxy就可以了,特殊地址可以配置一下自己的分组,比如auto-usa,国内地址直连direct
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Microsoft/Microsoft.list, tag=Microsoft, force-policy=auto-usa, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/SteamCN/SteamCN.list, tag=SteamCN, force-policy=direct, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Game/GameDownloadCN/GameDownloadCN.list, tag=GameDownloadCN, force-policy=direct, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Steam/Steam.list, tag=Steam, force-policy=YourProxy, update-interval=172800, opt-parser=false, enabled=true
```

## 订阅重写规则[rewrite_remote]

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

- 因为目前采用`白名单模式`,所以只有能在`远程订阅规则,cn网站,自定义规则`匹配到的才会走呆梨
- 常用的一般在远程订阅规则中已经提供了
- 有些特殊需求的网站需要对应地区,也在自定义规则中加
- 一般这些可以直接在`app界面`操作(即使使用mac icloud来编辑,同步偶尔也会有坑)

### 规则

- **HOST** / 域名匹配 / 例如：[www.google.com](http://www.google.com/)
- **HOST-SUFFIX** / 域名后缀匹配 / 例如：google.com
- **HOST-KEYWORD** / 域名关键字匹配 / 例如：google
- **USER-AGENT** / 用户呆梨匹配 / 例如：*abc?
- **IP-CIDR** / IP匹配 / 例如：192.168.0.1/24
- **IP6-CIDR** / IPV6
- **GEOIP** / IP数据库匹配 / 例如：US

```properties
[filter_local]
# 自定义
# 第一个写匹配方式,第二个写匹配条件,第三个写呆梨方式
# direct直连
# reject拒绝,一般用来去广告
# YourProxy,auto-usa,auto-hk呆梨方式
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
server=223.5.5.5
server=119.29.29.29
server=1.1.1.1
server=8.8.8.8

[policy]
static=GoalonezProxy, proxy, auto-hk, auto-usa, img-url=https://图标
url-latency-benchmark=auto-hk, server-tag-regex=香港, check-interval=600, tolerance=0, alive-checking=false
url-latency-benchmark=auto-usa, server-tag-regex=美国, check-interval=600, tolerance=0, alive-checking=false

[server_remote]
你的节点地址, tag=标签, update-interval=3600, opt-parser=false, enabled=true

[filter_remote]
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Direct/Direct.list, tag=直连, force-policy=direct, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/PrivateTracker/PrivateTracker.list, tag=直连, force-policy=direct, update-interval=172800, opt-parser=false, enabled=true

https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/AdvertisingLite/AdvertisingLite.list, tag=去广告, force-policy=reject, update-interval=172800, opt-parser=false, enabled=true

https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/ChinaMaxNoIP/ChinaMaxNoIP.list, tag=国内域名, force-policy=direct, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Game/GameDownloadCN/GameDownloadCN.list, tag=GameDownloadCN, force-policy=direct, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/SteamCN/SteamCN.list, tag=SteamCN, force-policy=direct, update-interval=172800, opt-parser=false, enabled=true

https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Microsoft/Microsoft.list, tag=Microsoft, force-policy=auto-usa, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Jetbrains/Jetbrains.list, tag=Jetbrains, force-policy=auto-usa, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Claude/Claude.list, tag=Claude, force-policy=auto-usa, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/OpenAI/OpenAI.list, tag=OpenAI, force-policy=auto-usa, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Spotify/Spotify.list, tag=Spotify, force-policy=auto-usa, update-interval=172800, opt-parser=false, enabled=true

https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Google/Google.list, tag=Google, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Steam/Steam.list, tag=Steam, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Cloudflare/Cloudflare.list, tag=Cloudflare, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Twitter/Twitter.list, tag=Twitter, force-policy=auto-usa, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Telegram/Telegram.list, tag=Telegram, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/GitHub/GitHub.list, tag=GitHub, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/YouTube/YouTube.list, tag=YouTube, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Vercel/Vercel.list, tag=Vercel, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Tumblr/Tumblr.list, tag=Tumblr, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Twitch/Twitch.list, tag=Twitch, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Reddit/Reddit.list, tag=Reddit, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Nvidia/Nvidia.list, tag=Nvidia, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Notion/Notion.list, tag=Notion, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Imgur/Imgur.list, tag=Imgur, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/GitLab/GitLab.list, tag=GitLab, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/GitBook/GitBook.list, tag=GitBook, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Dropbox/Dropbox.list, tag=Dropbox, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Emby/Emby.list, tag=Emby, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/GoogleEarth/GoogleEarth.list, tag=GoogleEarth, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Wikimedia/Wikimedia.list, tag=Wikimedia, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Wikipedia/Wikipedia.list, tag=Wikipedia, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/BBC/BBC.list, tag=BBC, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Instagram/Instagram.list, tag=Instagram, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Threads/Threads.list, tag=Threads, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Amazon/Amazon.list, tag=Amazon, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Pinterest/Pinterest.list, tag=Pinterest, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Facebook/Facebook.list, tag=Facebook, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Slack/Slack.list, tag=Slack, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Discord/Discord.list, tag=Discord, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Docker/Docker.list, tag=Docker, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Python/Python.list, tag=Python, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Jsdelivr/Jsdelivr.list, tag=Jsdelivr, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Figma/Figma.list, tag=Figma, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Nintendo/Nintendo.list, tag=Nintendo, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/Tmdb/Tmdb.list,tag=Tmdb, force-policy=GoalonezProxy, update-interval=172800, opt-parser=false, enabled=true

[rewrite_remote]
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/AdBlock/Ximalaya.conf, tag=喜马拉雅, update-interval=172800, opt-parser=false, enabled=true
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
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/AdBlock/KeepStyle.conf, tag=Keep, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/limbopro/Adblock4limbo/main/Adblock4limbo.conf, tag=百度搜索去广告, update-interval=172800, opt-parser=false, enabled=true

[server_local]

[filter_local]
# PT
host-suffix,m-team.io,direct

host-keyword,tracker,direct
host-keyword,v6tracker,direct

# 自定义
host,sdkapp.uve.weibo.com,direct
host,amdc.m.taobao.com,reject
host,amdc.m.taobao.com,reject

host-suffix,jellow.site,direct
  
host-suffix,sentry.io,auto-usa
host-suffix,codeium.com,auto-usa
host-suffix,godaddy.com,auto-usa
host-suffix,oaistatic.com,auto-usa
host-suffix,oaiusercontent.com,auto-usa
host-suffix,cdn.oaistatic.com,auto-usa

host-suffix,amysecure.com,GoalonezProxy
host-suffix,mojie.mx,GoalonezProxy

host-suffix,www.v2ex.com,GoalonezProxy
host-suffix,v2ex.com,GoalonezProxy
host-suffix,substack.com,GoalonezProxy
host-suffix,inoreader.com,GoalonezProxy
host-suffix,typora.io,GoalonezProxy
host-suffix,software.charliemonroe.net,GoalonezProxy
host-suffix,download.eclipse.org,GoalonezProxy
host-suffix,stackoverflow.com,GoalonezProxy
host-suffix,unsplash.com,GoalonezProxy
host-suffix,ycombinator.com,GoalonezProxy
host-suffix,dribbble.com,GoalonezProxy
host-suffix,quora.com,GoalonezProxy
host-suffix,poe.com,GoalonezProxy
host-suffix,theverge.com,GoalonezProxy
host-suffix,dcinside.com,GoalonezProxy
host-suffix,hostloc.com,GoalonezProxy
host-suffix,element-plus.org,GoalonezProxy
host-suffix,raycast.com,GoalonezProxy
host-suffix,minisforum.com,GoalonezProxy
host-suffix,mousefix.org,GoalonezProxy
host-suffix,karabiner-elements.pqrs.org,GoalonezProxy
host-suffix,axios-http.com,GoalonezProxy
host-suffix,spring.io,GoalonezProxy
host-suffix,echarts.apache.org,GoalonezProxy
host-suffix,macupdater-backend.com,GoalonezProxy
host-suffix,chatpdf.com,GoalonezProxy
host-suffix,corecode.io,GoalonezProxy
host-suffix,scamalytics.com,GoalonezProxy
host-suffix,text-gen.com,GoalonezProxy
host-suffix,porkbun.com,GoalonezProxy
host-suffix,cleanshot.com,GoalonezProxy
host-suffix,snoy.com,GoalonezProxy
host-suffix,yts.mx,GoalonezProxy
host-suffix,bcebos.com,GoalonezProxy
host-suffix,img.yts.mx,GoalonezProxy
host-suffix,0bt0.com,GoalonezProxy
host-suffix,visual-paradigm.com,GoalonezProxy
host-suffix,playcover.io,GoalonezProxy
host-suffix,twitter.com,GoalonezProxy
host-suffix,instagram.com,GoalonezProxy
host-suffix,discord.com,GoalonezProxy
host-suffix,reddit.com,GoalonezProxy
host-suffix,github.com,GoalonezProxy

# 国内网站
host-suffix,cn,direct
host-keyword,-cn,direct

## 最终规则
geoip, cn, direct
final, direct

[rewrite_local]
# 薄荷健康
^https?:\/\/api\.boohee\.com\/shop-interface\/api\/v1\/home\/index url reject-dict
^https?:\/\/bohe\.sfo-tx-shanghai-01\.saas\.sensorsdata\.cn\/api\/v2\/sfo\/user_popup_configs url reject-dict
^https?:\/\/api\.boohee\.com\/meta-interface\/v1\/index\/(discover_chosen|page_float_bubbles) url reject-dict
^https?:\/\/api\.boohee\.com\/app-interface\/v1\/record\/record_tool(_pop)?_ad url reject-dict
^https?:\/\/api\.boohee\.com\/meta-interface\/v1\/index\/record_index url response-body articles response-body random_body

[task_local]

[http_backend]

[mitm]
```

<gitalk/>
