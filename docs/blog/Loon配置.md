---
date: 2025-07-26 13:35:24
---
# Loon配置

之前B站经常加载不出来评论区，发现是QuantumultX的B站去广告插件导致的。看Tg上的公告似乎没有解决办法，要么切到外区App要么换工具。结果白版App用了没多久，B站就发公告不维护了。于是，最近从QuantumultX切换到了Loon，目前使用下来体验非常不错。所以也分享一下我的配置。
## 图标
[Semporia图标库［彩色手绘］](https://www.nsloon.com/openloon/import?iconset=https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Semporia.json)
## 配置

```properties
[General]
ip-mode = dual
skip-proxy = 192.168.0.0/16,10.0.0.0/8,172.16.0.0/12,localhost,*.local,e.crashlynatics.com
bypass-tun = 10.0.0.0/8,100.64.0.0/10,127.0.0.0/8,169.254.0.0/16,172.16.0.0/12,192.0.0.0/24,192.0.2.0/24,192.88.99.0/24,192.168.0.0/16,198.51.100.0/24,203.0.113.0/24,224.0.0.0/4,255.255.255.255/32
# DNS server
# dns服务，system表示系统自带dns服务器
dns-server = system,119.29.29.29,223.5.5.5
# DNS over HTTPS服务器，用,隔开多个服务器
#doh-server = https://dns.alidns.com/dns-query,https://doh.pub/dns-query,https://223.5.5.5/dns-query,https://223.6.6.6/dns-query
# DNS over QUIC服务器，用,隔开多个服务器，默认端口784
#doq-server = quic://dns.alidns.com:853
# doh3-server:DNS over HTTPS服务器，用,隔开多个服务器
#doh3-server = h3://dns.alidns.com/dns-query,h3://223.5.5.5/dns-query,h3://223.6.6.6/dns-query
# 是否允许wifi下共享网络
allow-wifi-access = false
# wifi共享开启时http服务的端口
wifi-access-http-port = 7222
# wifi共享开启时socks5服务的端口
wifi-access-socks5-port = 7221
# 节点测速时的url
proxy-test-url = http://bing.com/generate_204
# 节点测速时的超时秒数
test-timeout = 3
# 检测网络可用性时的链接，一般填写可以直连访问的链接
internet-test-url = http://wifi.vivo.com.cn/generate_204
# 以下配置的域名不会使用fakeip进行映射
real-ip = *.apple.com,*apple.com
# 指定流量使用哪个网络接口进行转发，目前包含三种模式:
# Auto: 系统自动分配
# Cellular: 在WiFi和蜂窝数据都开启的情况下指定使用蜂窝网络
# Performace: 在WiFi和蜂窝数据都开启的情况下使用最优的网络接口
# Balance: 在WiFi和蜂窝数据都开启的情况下，均衡使用网络接口
interface-mode = auto
[Proxy]

[Remote Proxy]
Amy = 订阅地址,udp=false,block-quic=true,fast-open=false,vmess-aead=false,skip-cert-verify=default,enabled=true,flexible-sni=false,img-url=https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Universal/KittyLink.png
[Proxy Chain]

[Proxy Group]
# select 类型
AutoProxy = select,AutoHK,AutoUS,AutoJP,AutoTW,AutoSG,ALL_Filter,img-url = https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Universal/Auto_Speed.png
SpecialAutoProxy = select,AutoUS,AutoHK,AutoJP,AutoTW,AutoSG,img-url = https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Universal/Streaming.png
OpenAI = select,US_Filter,JP_Filter,img-url = https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Social_Media/Reddit.png
# 广告模式
Advertising = select,REJECT,DIRECT,img-url = https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Universal/Reject.orig.png
# 白名单模式 PROXY，黑名单模式 DIRECT
End = select,DIRECT,AutoProxy,img-url = https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Universal/Final.png
# url-test模式，给提供的url发出http header请求，根据返回结果，选择测速最快的节点，默认间隔600s，测速超时时间5s，为了避免资源浪费，建议节点数不要过多，只支持单个节点和远端节点，其他会被忽略
AutoHK = url-test,HK_Filter,url = http://bing.com/,interval = 600,img-url = https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Rounded_Rectangle/Hong_Kong.png
AutoUS = url-test,US_Filter,url = http://bing.com/,interval = 600,img-url = https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Rounded_Rectangle/United_States.png
AutoJP = url-test,JP_Filter,url = http://bing.com/,interval = 600,img-url = https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Rounded_Rectangle/Japan.png
AutoTW = url-test,TW_Filter,url = http://bing.com/,interval = 600,img-url = https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Rounded_Rectangle/China.png
AutoSG = url-test,SG_Filter,url = http://bing.com/,interval = 600,img-url = https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Rounded_Rectangle/Singapore.png

[Remote Filter]
ALL_Filter = NameRegex, FilterKey = ".*"
HK_Filter = NameRegex, FilterKey = "(?i)(港|HK|Hong)"
TW_Filter = NameRegex, FilterKey = "(?i)(台|TW|Tai)"
JP_Filter = NameRegex, FilterKey = "(?i)(日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan)"
US_Filter = NameRegex, FilterKey = "(?i)(美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States)"
SG_Filter = NameRegex, FilterKey = "(?i)(新加坡|坡|狮城|SG|Singapore)"

[Rule]
#Type:DOMAIN-SUFFIX,DOMAIN,DOMAIN-KEYWORD,USER-AGENT,URL-REGEX,IP-CIDR
#Strategy:DIRECT,PROXY,REJECT
#Options:no-resolve(only for IP-CIDR,IP-CIDR2,GEOIP,IP-ASN)

# 直连
DOMAIN-SUFFIX,gov.cn,DIRECT

# 拒绝

# 局域网
IP-CIDR,10.0.0.0/8,DIRECT,no-resolve
IP-CIDR,127.0.0.0/8,DIRECT,no-resolve
IP-CIDR,172.16.0.0/12,DIRECT,no-resolve
IP-CIDR,192.168.0.0/16,DIRECT,no-resolve
IP-CIDR,224.0.0.0/4,DIRECT,no-resolve

# PT
DOMAIN-SUFFIX,m-team.io,DIRECT

DOMAIN-KEYWORD,tracker,DIRECT
DOMAIN-KEYWORD,v6tracker,DIRECT

# 自定义
DOMAIN-SUFFIX,v2ex.com,AutoProxy

# 特定地区
DOMAIN-SUFFIX,codeium.com,SpecialAutoProxy

# 国内网站
DOMAIN-SUFFIX,cn,DIRECT
DOMAIN-KEYWORD,-cn,DIRECT

FINAL,End

[Remote Rule]
# 直连
https://rule.kelee.one/Loon/Direct.lsr, policy=DIRECT, tag=Direct, enabled=true
https://rule.kelee.one/Loon/ChinaMaxNoIP.lsr, policy=DIRECT, tag=ChinaMaxNoIP, enabled=true
https://rule.kelee.one/Loon/SteamCN.lsr, policy=DIRECT, tag=SteamCN, enabled=true
https://rule.kelee.one/Loon/PrivateTracker.lsr, policy=DIRECT, tag=PrivateTracker, enabled=true
https://rule.kelee.one/Loon/iCloud.lsr, policy=DIRECT, tag=iCloud, enabled=true

# 去广告
https://rule.kelee.one/Loon/AdvertisingLite.lsr, policy=Advertising, tag=AdvertisingLite, enabled=true
https://rule.kelee.one/Loon/AdvertisingMiTV.lsr, policy=Advertising, tag=AdvertisingMiTV, enabled=true

# OpenAI
https://rule.kelee.one/Loon/OpenAI.lsr, policy=OpenAI, tag=OpenAI, enabled=true

# 美区
https://rule.kelee.one/Loon/Microsoft.lsr, policy=SpecialAutoProxy, tag=Microsoft, enabled=true
https://rule.kelee.one/Loon/Jetbrains.lsr, policy=SpecialAutoProxy, tag=Jetbrains, enabled=true
https://rule.kelee.one/Loon/Claude.lsr, policy=SpecialAutoProxy, tag=Claude, enabled=true
https://rule.kelee.one/Loon/Spotify.lsr, policy=SpecialAutoProxy, tag=Spotify, enabled=true
https://rule.kelee.one/Loon/TikTok.lsr, policy=SpecialAutoProxy, tag=TikTok, enabled=true
https://rule.kelee.one/Loon/GitLab.lsr, policy=SpecialAutoProxy, tag=GitLab, enabled=true
https://rule.kelee.one/Loon/Docker.lsr, policy=SpecialAutoProxy, tag=Docker, enabled=true
https://rule.kelee.one/Loon/GoogleVoice.lsr, policy=SpecialAutoProxy, tag=GoogleVoice, enabled=true


# 默认代理
https://rule.kelee.one/Loon/Google.lsr, policy=AutoProxy, tag=Google, enabled=true
https://rule.kelee.one/Loon/GoogleEarth.lsr, policy=AutoProxy, tag=GoogleEarth, enabled=true
https://rule.kelee.one/Loon/Cloudflare.lsr, policy=AutoProxy, tag=Cloudflare, enabled=true
https://rule.kelee.one/Loon/Twitter.lsr, policy=AutoProxy, tag=Twitter, enabled=true
https://rule.kelee.one/Loon/Telegram.lsr, policy=AutoProxy, tag=Telegram, enabled=true
https://rule.kelee.one/Loon/GitHub.lsr, policy=AutoProxy, tag=GitHub, enabled=true
https://rule.kelee.one/Loon/YouTube.lsr, policy=AutoProxy, tag=YouTube, enabled=true
https://rule.kelee.one/Loon/Vercel.lsr, policy=AutoProxy, tag=Vercel, enabled=true
https://rule.kelee.one/Loon/Tumblr.lsr, policy=AutoProxy, tag=Tumblr, enabled=true
https://rule.kelee.one/Loon/Twitch.lsr, policy=AutoProxy, tag=Twitch, enabled=true
https://rule.kelee.one/Loon/Reddit.lsr, policy=AutoProxy, tag=Reddit, enabled=true
https://rule.kelee.one/Loon/Nvidia.lsr, policy=AutoProxy, tag=Nvidia, enabled=true
https://rule.kelee.one/Loon/Notion.lsr, policy=AutoProxy, tag=Notion, enabled=true
https://rule.kelee.one/Loon/Imgur.lsr, policy=AutoProxy, tag=Imgur, enabled=true
https://rule.kelee.one/Loon/GitBook.lsr, policy=AutoProxy, tag=GitBook, enabled=true
https://rule.kelee.one/Loon/Dropbox.lsr, policy=AutoProxy, tag=Dropbox, enabled=true
https://rule.kelee.one/Loon/Emby.lsr, policy=AutoProxy, tag=Emby, enabled=true
https://rule.kelee.one/Loon/Wikimedia.lsr, policy=AutoProxy, tag=Wikimedia, enabled=true
https://rule.kelee.one/Loon/Wikipedia.lsr, policy=AutoProxy, tag=Wikipedia, enabled=true
https://rule.kelee.one/Loon/BBC.lsr, policy=AutoProxy, tag=BBC, enabled=true
https://rule.kelee.one/Loon/Instagram.lsr, policy=AutoProxy, tag=Instagram, enabled=true
https://rule.kelee.one/Loon/Threads.lsr, policy=AutoProxy, tag=Threads, enabled=true
https://rule.kelee.one/Loon/Amazon.lsr, policy=AutoProxy, tag=Amazon, enabled=true
https://rule.kelee.one/Loon/Pinterest.lsr, policy=AutoProxy, tag=Pinterest, enabled=true
https://rule.kelee.one/Loon/Facebook.lsr, policy=AutoProxy, tag=Facebook, enabled=true
https://rule.kelee.one/Loon/Slack.lsr, policy=AutoProxy, tag=Slack, enabled=true
https://rule.kelee.one/Loon/Discord.lsr, policy=AutoProxy, tag=Discord, enabled=true
https://rule.kelee.one/Loon/Python.lsr, policy=AutoProxy, tag=Python, enabled=true
https://rule.kelee.one/Loon/Jsdelivr.lsr, policy=AutoProxy, tag=Jsdelivr, enabled=true
https://rule.kelee.one/Loon/Figma.lsr, policy=AutoProxy, tag=Figma, enabled=true
https://rule.kelee.one/Loon/Nintendo.lsr, policy=AutoProxy, tag=Nintendo, enabled=true
https://rule.kelee.one/Loon/Tmdb.lsr, policy=AutoProxy, tag=Tmdb, enabled=true
https://rule.kelee.one/Loon/Steam.lsr, policy=AutoProxy, tag=Steam, enabled=true
https://rule.kelee.one/Loon/Epic.lsr, policy=AutoProxy, tag=Epic, enabled=true

[Rewrite]

[Script]

[Plugin]
https://kelee.one/Tool/Loon/Lpx/BlockAdvertisers.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/Block_HTTPDNS.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/Remove_ads_by_keli.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/Bilibili_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/RedPaper_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/Amap_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/Weibo_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/NeteaseCloudMusic_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/Tieba_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/YouTube_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/Taobao_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/JD_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/JD_Price.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/PinDuoDuo_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/FleaMarket_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/Google.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/BaiduSearchWebpage_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/Weixin_Official_Accounts_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/WexinMiniPrograms_Remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/Weixin_external_links_unlock.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/smzdm_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/CosmosPodcast_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/Zhihu_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/HUPU_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/ColorfulClouds_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/XiaoHeiHe_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/DiDi_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/DragonRead_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/Cainiao_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/DingdongMaicai_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/XiaomiSpeaker_remove_ads.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/LoonGallery.lpx, policy=AutoProxy, enabled=true
https://kelee.one/Tool/Loon/Lpx/NodeLinkCheck.lpx, enabled=true
https://kelee.one/Tool/Loon/Lpx/Node_detection_tool.lpx, enabled=true
[Mitm]

```

<gitalk/>