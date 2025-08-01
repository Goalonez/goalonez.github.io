---
date: 2023-12-04 23:30:51
---
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
- 也可以直接在`app界面`操作

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
server_check_url=http://www.google.com/generate_204
server_check_timeout=3000
excluded_routes=192.168.0.0/16, 172.16.0.0/12, 100.64.0.0/10, 10.0.0.0/8

[dns]
prefer-doh3
no-system
;no-ipv6
;doh-server=https://223.5.5.5/dns-query,https://119.29.29.29/dns-query
server=119.29.29.29
server=223.5.5.5

[policy]
static=AutoProxy, AutoHK, AutoUS, AutoJP, AutoTW, AutoSG, proxy, img-url=https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Universal/Auto_Speed.png
static=SpecialProxy, AutoUS, AutoHK, AutoJP, AutoTW, AutoSG, proxy, img-url=https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Universal/Streaming.png
static=OpenAI, server-tag-regex=(?i)(美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States|日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan)(?!.*优化), img-url=https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Social_Media/Reddit.png
static=Advertising, reject, direct, img-url=https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Universal/Reject.orig.png
static=End, direct, AutoProxy, img-url=https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Universal/Final.png
url-latency-benchmark=AutoHK, server-tag-regex=(?i)(港|HK|Hong)(?!.*优化), check-interval=900, tolerance=0, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/HK.png
url-latency-benchmark=AutoUS, server-tag-regex=(?i)(美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States)(?!.*优化), check-interval=900, tolerance=0, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/US.png
url-latency-benchmark=AutoJP, server-tag-regex=(?i)(日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan)(?!.*优化), check-interval=900, tolerance=0, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/JP.png
url-latency-benchmark=AutoTW, server-tag-regex=(?i)(台|TW|Tai)(?!.*优化), check-interval=900, tolerance=0, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/CN.png
url-latency-benchmark=AutoSG, server-tag-regex=(?i)(新加坡|坡|狮城|SG|Singapore)(?!.*优化), check-interval=900, tolerance=0, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/SG.png

[server_remote]
订阅地址, tag=节点, update-interval=3600, opt-parser=false, enabled=true

[filter_remote]
# 直连
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Direct/Direct.list, tag=直连, force-policy=direct, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/ChinaMaxNoIP/ChinaMaxNoIP.list, tag=国内域名, force-policy=direct, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/SteamCN/SteamCN.list, tag=SteamCN, force-policy=direct, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/PrivateTracker/PrivateTracker.list, tag=PT, force-policy=direct, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/iCloud/iCloud.list, tag=iCloud, force-policy=direct, update-interval=172800, opt-parser=false, enabled=true

# 去广告
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/AdvertisingLite/AdvertisingLite.list, tag=去广告, force-policy=Advertising, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/AdvertisingMiTV/AdvertisingMiTV.list, tag=小米电视去广告, force-policy=Advertising, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/app2smile/rules/master/rule/tieba-ad-qx.list, tag=贴吧广告, force-policy=Advertising, update-interval=172800, opt-parser=false, enabled=true

# OpenAI
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/OpenAI/OpenAI.list, tag=OpenAI, force-policy=OpenAI, update-interval=172800, opt-parser=false, enabled=true

# 美区
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Microsoft/Microsoft.list, tag=Microsoft, force-policy=SpecialProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Jetbrains/Jetbrains.list, tag=Jetbrains, force-policy=SpecialProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Claude/Claude.list, tag=Claude, force-policy=SpecialProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Spotify/Spotify.list, tag=Spotify, force-policy=SpecialProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/TikTok/TikTok.list, tag=TikTok,force-policy=SpecialProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GitLab/GitLab.list, tag=GitLab, force-policy=SpecialProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Docker/Docker.list, tag=Docker, force-policy=SpecialProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GoogleVoice/GoogleVoice.list, tag=GoogleVoice, force-policy=SpecialProxy, update-interval=172800, opt-parser=false, enabled=true

https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Google/Google.list, tag=Google, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Cloudflare/Cloudflare.list, tag=Cloudflare, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Twitter/Twitter.list, tag=Twitter, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Telegram/Telegram.list, tag=Telegram, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GitHub/GitHub.list, tag=GitHub, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/YouTube/YouTube.list, tag=YouTube, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Vercel/Vercel.list, tag=Vercel, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Tumblr/Tumblr.list, tag=Tumblr, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Twitch/Twitch.list, tag=Twitch, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Reddit/Reddit.list, tag=Reddit, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Nvidia/Nvidia.list, tag=Nvidia, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Notion/Notion.list, tag=Notion, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Imgur/Imgur.list, tag=Imgur, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GitBook/GitBook.list, tag=GitBook, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Dropbox/Dropbox.list, tag=Dropbox, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Emby/Emby.list, tag=Emby, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GoogleEarth/GoogleEarth.list, tag=GoogleEarth, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Wikimedia/Wikimedia.list, tag=Wikimedia, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Wikipedia/Wikipedia.list, tag=Wikipedia, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/BBC/BBC.list, tag=BBC, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Instagram/Instagram.list, tag=Instagram, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Threads/Threads.list, tag=Threads, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Amazon/Amazon.list, tag=Amazon, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Pinterest/Pinterest.list, tag=Pinterest, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Facebook/Facebook.list, tag=Facebook, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Slack/Slack.list, tag=Slack, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Discord/Discord.list, tag=Discord, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Python/Python.list, tag=Python, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Jsdelivr/Jsdelivr.list, tag=Jsdelivr, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Figma/Figma.list, tag=Figma, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Nintendo/Nintendo.list, tag=Nintendo, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Tmdb/Tmdb.list, tag=Tmdb,force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Steam/Steam.list, tag=Steam, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Epic/Epic.list, tag=Epic, force-policy=AutoProxy, update-interval=172800, opt-parser=false, enabled=true

[rewrite_remote]
https://gist.githubusercontent.com/ddgksf2013/12ef6aad209155e7eb62c5b00c11b9dd/raw/StartUpAds.conf, tag=墨鱼去开屏, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/AdBlock/XiaoHongShuAds.conf, tag=小红书, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/ZenmoFeiShi/Qx/main/TB.snippet, tag=贴吧, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/AdBlock/BilibiliAds.conf, tag=B站, update-interval=172800, opt-parser=false, enabled=false
https://github.com/ddgksf2013/Rewrite/raw/master/AdBlock/Weibo.conf, tag=微博, update-interval=172800, opt-parser=false, enabled=true
https://github.com/ddgksf2013/Rewrite/raw/master/AdBlock/YoutubeAds.conf, tag=YouTube, update-interval=172800, opt-parser=false, enabled=true
https://github.com/ddgksf2013/Rewrite/raw/master/AdBlock/Amap.conf, tag=高德, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/AdBlock/NeteaseAds.conf, tag=网易云, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/script/zheye/zheye.snippet, tag=知乎, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/AdBlock/CainiaoAds.conf, tag=菜鸟, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/AdBlock/KeepAds.conf, tag=Keep, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/AdBlock/CaiYunAds.conf, tag=彩云天气, update-interval=172800, opt-parser=false, enabled=true
https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/Function/UnblockURLinWeChat.conf, tag=微信解锁被屏蔽的URL@zZPiglet, update-interval=86400, opt-parser=false, enabled=true
https://raw.githubusercontent.com/limbopro/Adblock4limbo/main/Adblock4limbo.conf, tag=百度搜索去广告, update-interval=172800, opt-parser=false, enabled=true

[server_local]

[filter_local]
# 直连
host-suffix,gov.cn,direct

#拒绝

# 局域网
ip-cidr, 10.0.0.0/8, direct
ip-cidr, 127.0.0.0/8, direct
ip-cidr, 172.16.0.0/12, direct
ip-cidr, 192.168.0.0/16, direct
ip-cidr, 224.0.0.0/4, direct

# PT
host-suffix,m-team.io,direct

host-keyword,tracker,direct
host-keyword,v6tracker,direct

# 重写需要用到的分流
host,sdkapp.uve.weibo.com,direct
host,amdc.m.taobao.com,reject
host,amdc.m.taobao.com,reject
host,afd.baidu.com,reject
host,mobads.baidu.com,reject

# 自定义
host-suffix,v2ex.com,AutoProxy

# 特定地区
host-suffix,codeium.com,SpecialProxy

# 国内网站
host-suffix,cn,direct
host-keyword,-cn,direct

## 最终规则
geoip, cn, End
final, End

[rewrite_local]
## 虎扑
^https?:\/\/games\.mobileapi\.hupu\.com\/.+?\/(interfaceAdMonitor|interfaceAd)\/ url reject
^https?:\/\/games\.mobileapi\.hupu\.com\/.+?\/(search|interfaceAdMonitor|status|hupuBbsPm)/(hotkey|init|hupuBbsPm)\. url reject-img
^https?:\/\/games\.mobileapi\.hupu\.com\/.+?\/status\/init url reject
^https?:\/\/games\.mobileapi\.hupu\.com\/\d\/(?:\d\.){2}\d\/status\/init url reject
^https?:\/\/du\.hupucdn\.com\/\w+h\d{4} url reject-img
^https?:\/\/i\d\.hoopchina\.com\.cn/blogfile\//d+\//d+\/BbsImg\.(?<=(big.(png|jpg)))$ url reject-img
^https?:\/\/goblin\.hupu\.com\/.+\/interfaceAd\/getOther url reject
^https?:\/\/i1\.hoopchina\.com\.cn\/blogfile\/.+_\d{3}x\d{4} url reject-img
^https:\/\/(raw|gist)\.githubusercontent\.com\/ url request-header (\r\n)Accept-Language:.+(\r\n) request-header $1Accept-Language: en-us$2
^https:\/\/github\.com\/ url request-header (\r\n)Accept-Language:.+(\r\n) request-header $1Accept-Language: en-us$2

[task_local]

[http_backend]

[mitm]
hostname = games.mobileapi.hupu.com, du.hupucdn.com, i*.hoopchina.com.cn, goblin.hupu.com,raw.githubusercontent.com,gist.githubusercontent.com,github.com
```

<gitalk/>
