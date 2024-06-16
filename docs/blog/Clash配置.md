# Clash配置

## 概况

- 根据分组订阅节点
- 测试并自动切换速度快的节点
- 远程订阅常用软件分流规则
- 按需添加自定义网址
- 白名单模式,不在匹配规则里的不呆梨,保证大部分呆梨都在自己知情的情况下执行

## 配置节点订阅地址proxy-providers

```yaml
proxy-providers:
	# 随便取个名字,这里我是按地区来,可以写个hk
  hk:
    type: http
    # 你的节点订阅地址
    url: "节点订阅地址"
    interval: 3600
    # 随便取个名字demo-hk.yaml
    path: ./hk.yaml
    # 节点名称过滤条件
    filter: '地址*'
    health-check:
      enable: true
      interval: 600
      url: http://www.gstatic.com/generate_204
  # 有多个可以依次往后加,也可以只写一个
  # 我主要是为了不同地区的节点分开管理
  usa:
    type: http
    url: "节点订阅地址"
    interval: 3600
    path: ./usa.yaml
    filter: '地址*'
    health-check:
      enable: true
      interval: 600
      url: http://www.gstatic.com/generate_204
  # ......
  # 写一个不过滤节点的
  allnode:
    type: http
    url: "节点订阅地址"
    interval: 3600
    path: ./allnode.yaml
    health-check:
      enable: true
      interval: 600
      url: http://www.gstatic.com/generate_204
```

## 配置远程订阅规则组rule-providers

### 订阅地址获取

- https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/Clash
- 根据自己的使用情况去搜索应用地址

```yaml
rule-providers:
  # 取个名字
  YouTube:
    type: http
    behavior: classical
    # 对应的规则组订阅地址
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/YouTube/YouTube.yaml
    interval: 172800
    # 订阅到的规则文件路径
    path: ./remote/YouTube.yaml
  # 根据上面依次往下加即可
  GitHub:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/GitHub/GitHub.yaml
    interval: 172800
    path: ./remote/GitHub.yaml
```

## 配置呆梨组proxy-groups

```yaml
proxy-groups:
  - name: Proxy
    type: select
    # 使用总节点
    use:
      - allnode
    # 可选节点组,之前有多的就依次往里加
    proxies:
      - hk
      - usa

  # url-test 可以自动选择与指定 URL 测速后，延迟最短的服务器
  # 这个url-test会自动选择节点组里速度快的,所以自己配的组建议用这个模式
  - name: "hk"
    type: url-test
    use:
      - hk
    url: 'http://www.gstatic.com/generate_204'
    interval: 300
  # 依次往下写
  - name: "usa"
    type: url-test
    use:
      - usa
    url: 'http://www.gstatic.com/generate_204'
    interval: 300

```

## 配置具体呆梨规则(生效)

- 因为目前采用`白名单模式`,所以只有能在`远程订阅规则,cn网站,自定义规则`匹配到的才会走呆梨

- 常用的一般在远程订阅规则中已经提供了

- 有些特殊需求的网站需要对应地区,也在自定义规则中加

- 规则应该是按`从上到下匹配`的,比如cn域名指向了Github Page之类的,那就把这个cn域名的规则放到最前面,否则被cn匹配到就会直连

- 匹配规则具体参考https://dreamacro.github.io/clash/configuration/rules.html

### 呆梨方式

- DIRECT：通过interface-name直接连接到目标（不查找系统路由表）
- REJECT：丢弃数据包
- Proxy：将数据包路由到指定的呆梨服务器
- Proxy Group：将数据包路由到指定的呆梨组

```yaml
rules:
  # 首先写远程规则订阅的呆梨方式
  # 第一个是匹配方式,第二个是匹配条件,第三个是呆梨方式
  # 呆梨方式可以选比如上面配置的hk,usa
  # 呆梨方式Proxy就是你clash里自己选择的Proxy里的方式
  - RULE-SET,YouTube,hk
  - RULE-SET,Github,usa
  - RULE-SET,ChinaMaxNoIP,DIRECT
  - RULE-SET,Google,Proxy
  
  # 国内网站
  - DOMAIN-SUFFIX,cn,DIRECT
  - DOMAIN-KEYWORD,-cn,DIRECT
  
  # 自定义规则(这个一般按域名匹配就好了,也就是只改中间的内容)
  - DOMAIN-SUFFIX,typora.io,Proxy
  - DOMAIN-SUFFIX,v2ex.com,Proxy
  - DOMAIN-SUFFIX,spotify.com,auto-usa
  
  # 最终规则
  - GEOIP,CN,DIRECT
  - MATCH,DIRECT
```

## 配置参考

- 直接配置一下节点订阅地址就可以了
- 当然根据地区配置的过滤组要根据你自己的情况调整一下

```yaml
# HTTP 代理端口
# port: 7890

# SOCKS5 代理端口
# socks-port: 7891

# Linux 和 macOS 的 redir 透明代理端口 (重定向 TCP 和 TProxy UDP 流量)
# redir-port: 7892

# Linux 的透明代理端口（适用于 TProxy TCP 和 TProxy UDP 流量)
# tproxy-port: 7893

# HTTP(S) and SOCKS5 共用端口
mixed-port: 7890

# 本地 SOCKS5/HTTP(S) 服务验证
# authentication:
#  - "user1:pass1"
#  - "user2:pass2"

# 允许局域网的连接（可用来共享代理）
allow-lan: true
# 此功能仅在 allow-lan 设置为 true 时生效，支持三种参数：
# "*"                           绑定所有的 IP 地址
# 192.168.122.11                绑定一个的 IPv4 地址
# "[aaaa::a8aa:ff:fe09:57d8]"   绑定一个 IPv6 地址
#bind-address: "*"

# Clash 路由工作模式
# 规则模式：rule（规则） / global（全局代理）/ direct（全局直连）
mode: rule

# Clash 默认将日志输出至 STDOUT
# 设置日志输出级别 (默认级别：silent，即不输出任何内容，以避免因日志内容过大而导致程序内存溢出）。
# 5 个级别：silent / info / warning / error / debug。级别越高日志输出量越大，越倾向于调试，若需要请自行开启。
log-level: info

# clash 的 RESTful API 监听地址
external-controller: 0.0.0.0:9090

# 存放配置文件的相对路径，或存放网页静态资源的绝对路径
# Clash core 将会将其部署在 http://{{external-controller}}/ui
# external-ui: folder

# RESTful API 的口令 (可选)
# 通过 HTTP 头中 Authorization: Bearer ${secret} 参数来验证口令
# 当 RESTful API 的监听地址为 0.0.0.0 时，请务必设定口令以保证安全
# secret: ""

# 出站网卡接口
# interface-name: en0

# DNS 服务器和建立连接时的 静态 Hosts, 仅在 dns.enhanced-mode 模式为 redir-host 生效
# 支持通配符域名 (例如: *.clash.dev, *.foo.*.example.com )
# 不使用通配符的域名优先级高于使用通配符的域名 (例如: foo.example.com > *.example.com > .example.com )
# 注意: +.foo.com 的效果等同于 .foo.com 和 foo.com
#hosts:
# '*.clash.dev': 127.0.0.1
# '.dev': 127.0.0.1
# 'alpha.clash.dev': '::1'

# DNS 服务器配置(可选；若不配置，程序内置的 DNS 服务会被关闭)
dns:
  enable: true
  prefer-h3: true
  listen: 0.0.0.0:53
  # 关闭ipv6，很多问题是由于ipv6导致的
  ipv6: false

  # 以下填写的 DNS 服务器将会被用来解析 DNS 服务的域名
  # 仅填写 DNS 服务器的 IP 地址
  default-nameserver:
    - 223.5.5.5
    - 223.6.6.6
  enhanced-mode: redir-host # redir-host 或 fake-ip 
  #fake-ip-range: 198.18.0.1/16 # Fake IP 地址池 (CIDR 形式)
  # use-hosts: true # 查询 hosts 并返回 IP 记录

  # 在以下列表的域名将不会被解析为 fake ip，这些域名相关的解析请求将会返回它们真实的 IP 地址
  # fake-ip-filter:
  #   # === LAN ===
  #   - "*"
  #   - "+.local"
  #   - '*.lan'
  #   # === NTP Service ===
  #   - 'time.*.com'
  #   - 'time.*.gov'
  #   - 'time.*.edu.cn'
  #   - 'time.*.apple.com'

  #   - 'time1.*.com'
  #   - 'time2.*.com'
  #   - 'time3.*.com'
  #   - 'time4.*.com'
  #   - 'time5.*.com'
  #   - 'time6.*.com'
  #   - 'time7.*.com'

  #   - 'ntp.*.com'
  #   - 'ntp.*.com'
  #   - 'ntp1.*.com'
  #   - 'ntp2.*.com'
  #   - 'ntp3.*.com'
  #   - 'ntp4.*.com'
  #   - 'ntp5.*.com'
  #   - 'ntp6.*.com'
  #   - 'ntp7.*.com'

  #   - '*.time.edu.cn'
  #   - '*.ntp.org.cn'
  #   - '+.pool.ntp.org'

  #   - 'time1.cloud.tencent.com'    
  #   # === Apple Software Update Service ===
  #   - 'swscan.apple.com'
  #   - 'mesu.apple.com'
  #   # === Windows 10 Connnect Detection ===
  #   - '*.msftconnecttest.com'
  #   - '*.msftncsi.com'
  #   ## NetEase
  #   - '+.music.163.com'
  #   - '*.126.net'
  #   ## Baidu
  #   - 'musicapi.taihe.com'
  #   - 'music.taihe.com'
  #   ## QQ
  #   - '+.y.qq.com'
  #   - '+.music.tc.qq.com'
  #   - 'aqqmusic.tc.qq.com'
  #   - '+.stream.qqmusic.qq.com'
  #   # === Game Service ===
  #   ## Nintendo Switch
  #   - '+.srv.nintendo.net'
  #   ## Sony PlayStation
  #   - '+.stun.playstation.net'
  #   ## Microsoft Xbox
  #   - 'xbox.*.microsoft.com'
  #   - '+.xboxlive.com'
  #   # === Other ===
  #   ## QQ Quick Login
  #   - 'localhost.ptlogin2.qq.com'
  #   ## STUN Server
  #   - 'stun.*.*'
  #   - 'stun.*.*.*'
  #   ## Bilibili CDN
  #   - '*.mcdn.bilivideo.cn'

  # 支持 UDP / TCP / DoT / DoH 协议的 DNS 服务，可以指明具体的连接端口号。
  # 所有 DNS 请求将会直接发送到服务器，不经过任何代理。
  # Clash 会使用最先获得的解析记录回复 DNS 请求
  nameserver:
    # - https://1.1.1.1/dns-query
    # - https://8.8.8.8/dns-query
    - https://223.5.5.5/dns-query
    - https://119.29.29.29/dns-query
  # nameserver-policy:
    # 'geosite:cn': 
    #   - https://223.5.5.5/dns-query
    #   - https://119.29.29.29/dns-query
  # 当 fallback 参数被配置时, DNS 请求将同时发送至上方 nameserver 列表和下方 fallback 列表中配置的所有 DNS 服务器.
  # 当解析得到的 IP 地址的地理位置不是 CN 时，clash 将会选用 fallback 中 DNS 服务器的解析结果。
  fallback:
    - https://1.1.1.1/dns-query
    - https://8.8.8.8/dns-query

  # 如果使用 `nameservers` 解析的 IP 地址在下面指定的子网中,
  # 则认为它们无效, 并使用 `fallback` 服务器的结果.
  #
  # 当 `fallback-filter.geoip` 为 true 且 IP 地址的 GEOIP 为 `CN` 时,
  # 将使用 `nameservers` 服务器解析的 IP 地址.
  #
  # 如果 `fallback-filter.geoip` 为 false, 且不匹配 `fallback-filter.ipcidr`,
  # 则始终使用 `nameservers` 服务器的结果
  fallback-filter:
    geoip: true
    geoip-code: CN
    ipcidr:
      - 240.0.0.0/4
    domain:
      - '+.google.com'
      - '+.youtube.com'
      - '+.github.com'
      - '+.v2ex.com'

proxy-groups:
  # 代理的转发链, 在 proxies 中不应该包含 relay. 不支持 UDP.
  # 流量: clash <-> http <-> vmess <-> ss1 <-> ss2 <-> 互联网
  # - name: "relay"
  #   type: relay
  #   use:
  #     - amy

  # select 用来允许用户手动选择 代理服务器 或 服务器组
  # 您也可以使用 RESTful API 去切换服务器，这种方式推荐在 GUI 中使用
  - name: Proxy
    type: select
    use:
      - amy
    proxies:
      - auto-hk
      - auto-usa

  # url-test 可以自动选择与指定 URL 测速后，延迟最短的服务器
  - name: "auto-hk"
    type: url-test
    use:
      - amy-hk
    url: 'http://www.gstatic.com/generate_204'
    interval: 300
  
  - name: "auto-usa"
    type: url-test
    use:
      - amy-usa
    url: 'http://www.gstatic.com/generate_204'
    interval: 300

  # fallback 可以尽量按照用户书写的服务器顺序，在确保服务器可用的情况下，自动选择服务器
  # - name: "fallback-auto"
  #   type: fallback
  #   use:
  #     - amy-hk
  #   url: 'http://www.gstatic.com/generate_204'
  #   interval: 300

  # load-balance 可以使相同 eTLD 请求在同一条代理线路上
  # - name: "load-balance"
  #   type: load-balance
  #   use:
  #     - amy
  #   url: 'http://www.gstatic.com/generate_204'
  #   interval: 300

proxy-providers:
  amy-hk:
    type: http
    url: "你的节点地址"
    interval: 3600
    path: ./amy-hk.yaml
    filter: '香港*'
    health-check:
      enable: true
      interval: 600
      url: http://www.gstatic.com/generate_204
  amy-usa:
    type: http
    url: "你的节点地址"
    interval: 3600
    path: ./amy-usa.yaml
    filter: '美国*'
    health-check:
      enable: true
      interval: 600
      url: http://www.gstatic.com/generate_204
  amy:
    type: http
    url: "你的节点地址"
    interval: 3600
    path: ./amy.yaml
    health-check:
      enable: true
      interval: 600
      url: http://www.gstatic.com/generate_204

rule-providers:
  ChinaMaxNoIP:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/ChinaMaxNoIP/ChinaMaxNoIP_Classical.yaml
    interval: 21600
    path: ./goalonez-remote/ChinaMaxNoIP.yaml
  Google:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Google/Google.yaml
    interval: 21600
    path: ./goalonez-remote/Google.yaml
  YouTube:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/YouTube/YouTube.yaml
    interval: 21600
    path: ./goalonez-remote/YouTube.yaml
  GitHub:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/GitHub/GitHub.yaml
    interval: 21600
    path: ./goalonez-remote/GitHub.yaml
  Telegram:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Telegram/Telegram.yaml
    interval: 21600
    path: ./goalonez-remote/Telegram.yaml
  Twitter:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Twitter/Twitter.yaml
    interval: 21600
    path: ./goalonez-remote/Twitter.yaml
  Cloudflare:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Cloudflare/Cloudflare.yaml
    interval: 21600
    path: ./goalonez-remote/Cloudflare.yaml
  Spotify:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Spotify/Spotify.yaml
    interval: 21600
    path: ./goalonez-remote/Spotify.yaml
  Wikipedia:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Wikipedia/Wikipedia.yaml
    interval: 21600
    path: ./goalonez-remote/Wikipedia.yaml
  Amazon:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Amazon/Amazon.yaml
    interval: 21600
    path: ./goalonez-remote/Amazon.yaml
  Instagram:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Instagram/Instagram.yaml
    interval: 21600
    path: ./goalonez-remote/Instagram.yaml
  BBC:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/BBC/BBC.yaml
    interval: 21600
    path: ./goalonez-remote/BBC.yaml
  Wikimedia:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Wikimedia/Wikimedia.yaml
    interval: 21600
    path: ./goalonez-remote/Wikimedia.yaml
  GoogleEarth:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/GoogleEarth/GoogleEarth.yaml
    interval: 21600
    path: ./goalonez-remote/GoogleEarth.yaml
  Emby:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Emby/Emby.yaml
    interval: 21600
    path: ./goalonez-remote/Emby.yaml
  Dropbox:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Dropbox/Dropbox.yaml
    interval: 21600
    path: ./goalonez-remote/Dropbox.yaml
  GitBook:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/GitBook/GitBook.yaml
    interval: 21600
    path: ./goalonez-remote/GitBook.yaml
  GitLab:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/GitLab/GitLab.yaml
    interval: 21600
    path: ./goalonez-remote/GitLab.yaml
  Imgur:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Imgur/Imgur.yaml
    interval: 21600
    path: ./goalonez-remote/Imgur.yaml
  Notion:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Notion/Notion.yaml
    interval: 21600
    path: ./goalonez-remote/Notion.yaml
  Nvidia:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Nvidia/Nvidia.yaml
    interval: 21600
    path: ./goalonez-remote/Nvidia.yaml
  Reddit:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Reddit/Reddit.yaml
    interval: 21600
    path: ./goalonez-remote/Reddit.yaml
  Twitch:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Twitch/Twitch.yaml
    interval: 21600
    path: ./goalonez-remote/Twitch.yaml
  Tumblr:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Tumblr/Tumblr.yaml
    interval: 21600
    path: ./goalonez-remote/Tumblr.yaml
  Vercel:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Vercel/Vercel.yaml
    interval: 21600
    path: ./goalonez-remote/Vercel.yaml
  Steam:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Steam/Steam.yaml
    interval: 21600
    path: ./goalonez-remote/Steam.yaml
  SteamCN:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/SteamCN/SteamCN.yaml
    interval: 21600
    path: ./goalonez-remote/SteamCN.yaml
  GameDownloadCN:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Game/GameDownloadCN/GameDownloadCN.yaml
    interval: 21600
    path: ./goalonez-remote/GameDownloadCN.yaml
  Microsoft:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Microsoft/Microsoft.yaml
    interval: 21600
    path: ./goalonez-remote/Microsoft.yaml
  Pinterest:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Pinterest/Pinterest.yaml
    interval: 21600
    path: ./goalonez-remote/Pinterest.yaml
  Facebook:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Facebook/Facebook.yaml
    interval: 21600
    path: ./goalonez-remote/Facebook.yaml
  OpenAI:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/OpenAI/OpenAI.yaml
    interval: 21600
    path: ./goalonez-remote/OpenAI.yaml
  Slack:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Slack/Slack.yaml
    interval: 21600
    path: ./goalonez-remote/Slack.yaml
  Discord:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Discord/Discord.yaml
    interval: 21600
    path: ./goalonez-remote/Discord.yaml
  Docker:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Docker/Docker.yaml
    interval: 21600
    path: ./goalonez-remote/Docker.yaml
  Python:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Python/Python.yaml
    interval: 21600
    path: ./goalonez-remote/Python.yaml
  Jetbrains:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Jetbrains/Jetbrains.yaml
    interval: 21600
    path: ./goalonez-remote/Jetbrains.yaml
  Claude:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Claude/Claude.yaml
    interval: 21600
    path: ./goalonez-remote/Claude.yaml
  Threads:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Threads/Threads.yaml
    interval: 21600
    path: ./goalonez-remote/Threads.yaml
  Jsdelivr:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Jsdelivr/Jsdelivr.yaml
    interval: 21600
    path: ./goalonez-remote/Jsdelivr.yaml
  Figma:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Figma/Figma.yaml
    interval: 21600
    path: ./goalonez-remote/Figma.yaml
  Nintendo:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Nintendo/Nintendo.yaml
    interval: 21600
    path: ./goalonez-remote/Nintendo.yaml
  Tmdb:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Tmdb/Tmdb.yaml
    interval: 21600
    path: ./goalonez-remote/Tmdb.yaml
  PrivateTracker:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/PrivateTracker/PrivateTracker.yaml
    interval: 21600
    path: ./goalonez-remote/PrivateTracker.yaml
  DirectRule:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Direct/Direct.yaml
    interval: 21600
    path: ./goalonez-remote/AdvertisingLite.yaml
  AdvertisingLite:
    type: http
    behavior: classical
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/AdvertisingLite/AdvertisingLite.yaml
    interval: 21600
    path: ./goalonez-remote/AdvertisingLite.yaml

rules:
  # 直连
  - RULE-SET,DirectRule,DIRECT
  - RULE-SET,ChinaMaxNoIP,DIRECT
  - RULE-SET,SteamCN,DIRECT
  - RULE-SET,GameDownloadCN,DIRECT
  - RULE-SET,PrivateTracker,DIRECT
  # 去广告
  - RULE-SET,AdvertisingLite,REJECT

  # PT
  - DOMAIN-SUFFIX,m-team.io,DIRECT
  
  - DOMAIN-KEYWORD,tracker,DIRECT
  - DOMAIN-KEYWORD,v6tracker,DIRECT
  
  # 自定义规则
  - DOMAIN-SUFFIX,jellow.site,DIRECT

  - DOMAIN-SUFFIX,amysecure.com,Proxy
  - DOMAIN-SUFFIX,mojie.mx,Proxy

  - DOMAIN-SUFFIX,www.v2ex.com,Proxy
  - DOMAIN-SUFFIX,v2ex.com,Proxy
  - DOMAIN-SUFFIX,substack.com,Proxy
  - DOMAIN-SUFFIX,inoreader.com,Proxy
  - DOMAIN-SUFFIX,typora.io,Proxy
  - DOMAIN-SUFFIX,software.charliemonroe.net,Proxy
  - DOMAIN-SUFFIX,download.eclipse.org,Proxy
  - DOMAIN-SUFFIX,stackoverflow.com,Proxy
  - DOMAIN-SUFFIX,unsplash.com,Proxy
  - DOMAIN-SUFFIX,ycombinator.com,Proxy
  - DOMAIN-SUFFIX,dribbble.com,Proxy
  - DOMAIN-SUFFIX,quora.com,Proxy
  - DOMAIN-SUFFIX,poe.com,Proxy
  - DOMAIN-SUFFIX,theverge.com,Proxy
  - DOMAIN-SUFFIX,dcinside.com,Proxy
  - DOMAIN-SUFFIX,hostloc.com,Proxy
  - DOMAIN-SUFFIX,element-plus.org,Proxy
  - DOMAIN-SUFFIX,raycast.com,Proxy
  - DOMAIN-SUFFIX,minisforum.com,Proxy
  - DOMAIN-SUFFIX,mousefix.org,Proxy
  - DOMAIN-SUFFIX,karabiner-elements.pqrs.org,Proxy
  - DOMAIN-SUFFIX,axios-http.com,Proxy
  - DOMAIN-SUFFIX,spring.io,Proxy
  - DOMAIN-SUFFIX,echarts.apache.org,Proxy
  - DOMAIN-SUFFIX,macupdater-backend.com,Proxy
  - DOMAIN-SUFFIX,chatpdf.com,Proxy
  - DOMAIN-SUFFIX,corecode.io,Proxy
  - DOMAIN-SUFFIX,scamalytics.com,Proxy
  - DOMAIN-SUFFIX,text-gen.com,Proxy
  - DOMAIN-SUFFIX,porkbun.com,Proxy
  - DOMAIN-SUFFIX,cleanshot.com,Proxy
  - DOMAIN-SUFFIX,snoy.com,Proxy
  - DOMAIN-SUFFIX,yts.mx,Proxy
  - DOMAIN-SUFFIX,bcebos.com,Proxy
  - DOMAIN-SUFFIX,img.yts.mx,Proxy
  - DOMAIN-SUFFIX,0bt0.com,Proxy
  - DOMAIN-SUFFIX,visual-paradigm.com,Proxy
  - DOMAIN-SUFFIX,playcover.io,Proxy
  - DOMAIN-SUFFIX,twitter.com,Proxy
  - DOMAIN-SUFFIX,instagram.com,Proxy
  - DOMAIN-SUFFIX,discord.com,Proxy
  - DOMAIN-SUFFIX,reddit.com,Proxy
  - DOMAIN-SUFFIX,github.com,Proxy

  # 特定区地址
  - DOMAIN-SUFFIX,sentry.io,auto-usa
  - DOMAIN-SUFFIX,codeium.com,auto-usa
  - DOMAIN-SUFFIX,godaddy.com,auto-usa
  - DOMAIN-SUFFIX,oaistatic.com,auto-usa
  - DOMAIN-SUFFIX,oaiusercontent.com,auto-usa
  - DOMAIN-SUFFIX,cdn.oaistatic.com,auto-usa

  # 远程规则订阅
  - RULE-SET,Microsoft,auto-usa
  - RULE-SET,Jetbrains,auto-usa
  - RULE-SET,Claude,auto-usa
  - RULE-SET,OpenAI,auto-usa
  - RULE-SET,Spotify,auto-usa
  
  - RULE-SET,Google,Proxy
  - RULE-SET,Steam,Proxy
  - RULE-SET,Cloudflare,Proxy
  - RULE-SET,Twitter,Proxy
  - RULE-SET,Telegram,Proxy
  - RULE-SET,GitHub,Proxy
  - RULE-SET,YouTube,Proxy
  - RULE-SET,Vercel,Proxy
  - RULE-SET,Tumblr,Proxy
  - RULE-SET,Twitch,Proxy
  - RULE-SET,Reddit,Proxy
  - RULE-SET,Nvidia,Proxy
  - RULE-SET,Notion,Proxy
  - RULE-SET,Imgur,Proxy
  - RULE-SET,GitLab,Proxy
  - RULE-SET,GitBook,Proxy
  - RULE-SET,Dropbox,Proxy
  - RULE-SET,Emby,Proxy
  - RULE-SET,GoogleEarth,Proxy
  - RULE-SET,Wikimedia,Proxy
  - RULE-SET,BBC,Proxy
  - RULE-SET,Instagram,Proxy
  - RULE-SET,Threads,Proxy
  - RULE-SET,Amazon,Proxy
  - RULE-SET,Wikipedia,Proxy
  - RULE-SET,Pinterest,Proxy
  - RULE-SET,Facebook,Proxy
  - RULE-SET,Slack,Proxy
  - RULE-SET,Discord,Proxy
  - RULE-SET,Docker,Proxy
  - RULE-SET,Python,Proxy
  - RULE-SET,Jsdelivr,Proxy
  - RULE-SET,Figma,Proxy
  - RULE-SET,Nintendo,Proxy
  - RULE-SET,Tmdb,Proxy

  # 国内网站
  - DOMAIN-SUFFIX,cn,DIRECT
  - DOMAIN-KEYWORD,-cn,DIRECT

  # 最终规则
  - GEOIP,CN,DIRECT
  - MATCH,DIRECT
```

<gitalk/>

