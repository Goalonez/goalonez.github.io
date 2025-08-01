---
date: 2023-12-05 23:30:51
---
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

unified-delay: true
geodata-mode: false
geodata-loader: standard
geo-auto-update: true
geo-update-interval: 24
tcp-concurrent: true
find-process-mode: strict
global-client-fingerprint: chrome

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

ipv6: true
udp: true

# clash 的 RESTful API 监听地址
external-controller: 0.0.0.0:9090

# 存放配置文件的相对路径，或存放网页静态资源的绝对路径
# Clash core 将会将其部署在 http://{{external-controller}}/ui
external-ui: /metacubexd

# RESTful API 的口令 (可选)
# 通过 HTTP 头中 Authorization: Bearer ${secret} 参数来验证口令
# 当 RESTful API 的监听地址为 0.0.0.0 时，请务必设定口令以保证安全
secret: ""

# 出站网卡接口
# interface-name: en0

geox-url:
  # geoip: 'https://raw.githubusercontent.com/Loyalsoldier/v2ray-rules-dat/release/geoip.dat'
  # geosite: 'https://raw.githubusercontent.com/Loyalsoldier/v2ray-rules-dat/release/geosite.dat'
  mmdb: 'https://geodata.kelee.one/Country-Masaiki.mmdb'
  asn: 'https://geodata.kelee.one/GeoLite2-ASN-P3TERX.mmdb'

profile:
  store-selected: true
  store-fake-ip: true

sniffer:
  enable: true
  force-dns-mapping: true
  parse-pure-ip: true
  override-destination: true
  sniff:
    HTTP:
      ports: [80, 8080-8880]
      override-destination: true
    TLS:
      ports: [443, 8443]
    QUIC:
      ports: [443, 8443]
  force-domain:
    - +.v2ex.com

  skip-domain:
    - Mijia Cloud

tun:
  enable: true
  # 模式 mixed混合堆栈，tcp使用 system 栈，udp使用 gvisor 栈，使用体验可能相对更好。
  stack: system
  # DNS劫持
  dns-hijack:
    - any:53
  # 自动设置全局路由
  auto-route: true
  # 自动选择流量出口接口
  auto-detect-interface: true
# DNS 服务器和建立连接时的 静态 Hosts, 仅在 dns.enhanced-mode 模式为 redir-host 生效
# 支持通配符域名 (例如: *.clash.dev, *.foo.*.example.com )
# 不使用通配符的域名优先级高于使用通配符的域名 (例如: foo.example.com > *.example.com > .example.com )
# 注意: +.foo.com 的效果等同于 .foo.com 和 foo.com
#hosts:
# '*.clash.dev': 127.0.0.1
# '.dev': 127.0.0.1
# 'alpha.clash.dev': '::1'

# P2P下载端口
listeners:
- name: qb-socks
  type: socks
  port: 61413
  listen: 0.0.0.0
  udp: true
  users: []
  proxy: DIRECT
- name: tr-socks
  type: socks
  port: 41413
  listen: 0.0.0.0
  udp: true
  users: []
  proxy: DIRECT

# DNS 服务器配置(可选；若不配置，程序内置的 DNS 服务会被关闭)
dns:
  enable: true
  cache-algorithm: arc
  prefer-h3: false
  listen: 0.0.0.0:1053
  # 关闭ipv6，很多问题是由于ipv6导致的
  ipv6: true
  # 以下填写的 DNS 服务器将会被用来解析 DNS 服务的域名
  # 仅填写 DNS 服务器的 IP 地址
  default-nameserver:
    - 223.5.5.5
    - 119.29.29.29
  enhanced-mode: redir-host # redir-host 或 fake-ip 
  use-hosts: true # 查询 hosts 并返回 IP 记录

  # fake-ip-range: 198.18.0.1/16 # Fake IP 地址池 (CIDR 形式)
  # 在以下列表的域名将不会被解析为 fake ip，这些域名相关的解析请求将会返回它们真实的 IP 地址
  # fake-ip-filter:
    # === LAN ===
  #   - "+.local"
  #   - '*.lan'

  # 支持 UDP / TCP / DoT / DoH 协议的 DNS 服务，可以指明具体的连接端口号。
  # 所有 DNS 请求将会直接发送到服务器，不经过任何代理。
  # Clash 会使用最先获得的解析记录回复 DNS 请求
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
    # - 223.5.5.5
    # - 119.29.29.29
  nameserver-policy:
    'rule-set:ChinaMaxNoIP':
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  # 当 fallback 参数被配置时, DNS 请求将同时发送至上方 nameserver 列表和下方 fallback 列表中配置的所有 DNS 服务器.
  # 当解析得到的 IP 地址的地理位置不是 CN 时，clash 将会选用 fallback 中 DNS 服务器的解析结果。
  fallback:
    - tls://8.8.4.4
    - tls://1.1.1.1
  proxy-server-nameserver:
    - https://doh.pub/dns-query
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
      - '+.githubusercontent.com'
      - '+.jsdelivr.com'
      - '+.jsdelivr.net'
      - '+.v2ex.com'
      - '+.linux.do'
      - '+.twitter.com'
      - '+.instagram.com'
      - '+.discord.com'
      - '+.reddit.com'
      - '+.amytele.net'
      - '+.openai.com'
      - '+.reddit.com'
      - '+.cloudflare.com'
      - '+.imgur.com'
      - '+.themoviedb.org'
      - '+.tmdb.org'
      - '+.thetvdb.com'

# 锚点 - 节点订阅的参数 [每小时更新一次订阅节点，每 6 秒一次健康检查]
NodeParam: &NodeParam {type: http, interval: 3600000, health-check: {enable: true, url: 'http://www.google.com/blank.html', interval: 6}}

proxy-providers:
  amy:
    url: '订阅地址'
    <<: *NodeParam
    path: './proxy_providers/amy.yaml'
    override:
      additional-prefix: "[amy] " # 为订阅节点添加机场名称前缀

# 锚点 - 节点筛选组
FilterHK: &FilterHK '^(?=.*((?i)🇭🇰|香港|(\b(HK|HKG|Hong)(\d+)?\b)))(?!.*((?i)回国|校园|游戏|🎮|(\b(GAME)\b))).*$'
FilterTW: &FilterTW '^(?=.*((?i)🇹🇼|台湾|(\b(TW|TWN|Tai|Taiwan)(\d+)?\b)))(?!.*((?i)回国|校园|游戏|🎮|(\b(GAME)\b))).*$'
FilterJP: &FilterJP '^(?=.*((?i)🇯🇵|日本|川日|东京|大阪|泉日|埼玉|(\b(JP|JPN|Japan)(\d+)?\b)))(?!.*((?i)回国|校园|游戏|🎮|(\b(GAME)\b))).*$'
FilterSG: &FilterSG '^(?=.*((?i)🇸🇬|新加坡|狮|(\b(SG|SGP|Singapore)(\d+)?\b)))(?!.*((?i)回国|校园|游戏|🎮|(\b(GAME)\b))).*$'
FilterUS: &FilterUS '^(?=.*((?i)🇺🇸|美国|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|(\b(US|USA|United States)(\d+)?\b)))(?!.*((?i)回国|校园|游戏|🎮|(\b(GAME)\b))).*$'
FilterOpenAI: &FilterOpenAI '^(?=.*((?i)🇺🇸|美国|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|🇯🇵|日本|川日|东京|大阪|泉日|埼玉|(\b(US|USA|United States|JP|JPN|Japan)(\d+)?\b)))(?!.*((?i)回国|校园|游戏|🎮|(\b(GAME)\b))).*$'
FilterAll: &FilterAll '^(?=.*(.))(?!.*((?i)群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|超时|收藏|福利|邀请|好友|(\b(USE|USED|TOTAL|EXPIRE|EMAIL|Panel|Channel|Author|Traffic)(\d+)?\b|(\d{4}-\d{2}-\d{2}|\dG)))).*$'

# 策略组参数锚点
# 锚点 - 时延优选参数 [每 6 秒一次惰性健康检查，容差 20ms，时延超过 2 秒判定为失败，失败 3 次则自动触发健康检查]
UrlTest: &UrlTest {type: url-test, interval: 6, tolerance: 20, lazy: true, url: 'http://www.google.com/blank.html', disable-udp: false, timeout: 2000, max-failed-times: 3, hidden: true, include-all-providers: true}
# 锚点 - 故障转移参数 [每 6 秒一次惰性健康检查，时延超过 2 秒判定为失败，失败 3 次则自动触发健康检查]
FallBack: &FallBack {type: fallback, interval: 6, lazy: true, url: 'http://www.google.com/blank.html', disable-udp: false, timeout: 2000, max-failed-times: 3, hidden: true, include-all-providers: true}
# 锚点 - 负载均衡参数 [每 6 秒一次惰性健康检查，时延超过 2 秒判定为失败，失败 3 次则自动触发健康检查]
LoadBalance: &LoadBalance {type: load-balance, interval: 6, lazy: true, url: 'http://www.google.com/blank.html', disable-udp: false, strategy: consistent-hashing, timeout: 2000, max-failed-times: 3, hidden: true, include-all-providers: true}

proxy-groups:
  - {name: AutoProxy, type: select, include-all-providers: true, proxies: [香港自动, 美国自动, 日本自动, 台湾自动, 新加坡自动]}
  - {name: SpecialAutoProxy, type: select, include-all-providers: false, proxies: [香港自动, 美国自动, 日本自动, 台湾自动, 新加坡自动]}
  - {name: OpenAI, type: select, include-all-providers: true, filter: *FilterOpenAI}
  - {name: Advertising, type: select, include-all-providers: false, proxies: [REJECT,DIRECT]}
  - {name: End, type: select, include-all-providers: false, proxies: [DIRECT, AutoProxy]}

  # 时延优选策略组
  - {name: 香港自动, <<: *UrlTest, filter: *FilterHK}
  - {name: 美国自动, <<: *UrlTest, filter: *FilterUS}
  - {name: 日本自动, <<: *UrlTest, filter: *FilterJP}
  - {name: 台湾自动, <<: *UrlTest, filter: *FilterTW}
  - {name: 新加坡自动, <<: *UrlTest, filter: *FilterSG}


  # 代理的转发链, 在 proxies 中不应该包含 relay. 不支持 UDP.
  # 流量: clash <-> http <-> vmess <-> ss1 <-> ss2 <-> 互联网
  # - name: "relay"
  #   type: relay
  #   use:
  #     - amy

  # select 用来允许用户手动选择 代理服务器 或 服务器组
  # 您也可以使用 RESTful API 去切换服务器，这种方式推荐在 GUI 中使用
  # - name: Proxy
  #   type: select
  #   use:
  #     - amy
  #   proxies:
  #     - auto-hk
  #     - auto-usa

  # url-test 可以自动选择与指定 URL 测速后，延迟最短的服务器
  # - name: "auto-hk"
  #   type: url-test
  #   use:
  #     - amy-hk
  #   url: 'http://www.gstatic.com/generate_204'
  #   interval: 300
  
  # - name: "auto-usa"
  #   type: url-test
  #   use:
  #     - amy-usa
  #   url: 'http://www.gstatic.com/generate_204'
  #   interval: 300

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

# 锚点 - 规则参数 [每小时更新一次订阅规则，更新规则时使用直连策略]
RuleProviders: &RuleProviders {type: http, behavior: classical, interval: 3600, format: yaml}

rule-providers:
  ChinaMaxNoIP:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ChinaMaxNoIP/ChinaMaxNoIP_Classical.yaml
    path: ./rule-remote/ChinaMaxNoIP.yaml
  Google:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Google/Google.yaml
    path: ./rule-remote/Google.yaml
  YouTube:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/YouTube/YouTube.yaml
    path: ./rule-remote/YouTube.yaml
  GitHub:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitHub/GitHub.yaml
    path: ./rule-remote/GitHub.yaml
  Telegram:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Telegram/Telegram.yaml
    path: ./rule-remote/Telegram.yaml
  Twitter:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Twitter/Twitter.yaml
    path: ./rule-remote/Twitter.yaml
  Cloudflare:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Cloudflare/Cloudflare.yaml
    path: ./rule-remote/Cloudflare.yaml
  Spotify:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Spotify/Spotify.yaml
    path: ./rule-remote/Spotify.yaml
  Wikipedia:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Wikipedia/Wikipedia.yaml
    path: ./rule-remote/Wikipedia.yaml
  Amazon:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Amazon/Amazon.yaml
    path: ./rule-remote/Amazon.yaml
  Instagram:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Instagram/Instagram.yaml
    path: ./rule-remote/Instagram.yaml
  BBC:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/BBC/BBC.yaml
    path: ./rule-remote/BBC.yaml
  Wikimedia:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Wikimedia/Wikimedia.yaml
    path: ./rule-remote/Wikimedia.yaml
  GoogleEarth:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GoogleEarth/GoogleEarth.yaml
    path: ./rule-remote/GoogleEarth.yaml
  Emby:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Emby/Emby.yaml
    path: ./rule-remote/Emby.yaml
  Dropbox:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Dropbox/Dropbox.yaml
    path: ./rule-remote/Dropbox.yaml
  GitBook:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitBook/GitBook.yaml
    path: ./rule-remote/GitBook.yaml
  GitLab:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitLab/GitLab.yaml
    path: ./rule-remote/GitLab.yaml
  Imgur:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Imgur/Imgur.yaml
    path: ./rule-remote/Imgur.yaml
  Notion:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Notion/Notion.yaml
    path: ./rule-remote/Notion.yaml
  Nvidia:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Nvidia/Nvidia.yaml
    path: ./rule-remote/Nvidia.yaml
  Reddit:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Reddit/Reddit.yaml
    path: ./rule-remote/Reddit.yaml
  Twitch:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Twitch/Twitch.yaml
    path: ./rule-remote/Twitch.yaml
  Tumblr:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Tumblr/Tumblr.yaml
    path: ./rule-remote/Tumblr.yaml
  Vercel:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Vercel/Vercel.yaml
    path: ./rule-remote/Vercel.yaml
  Steam:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Steam/Steam.yaml
    path: ./rule-remote/Steam.yaml
  SteamCN:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/SteamCN/SteamCN.yaml
    path: ./rule-remote/SteamCN.yaml
  Epic:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Epic/Epic.yaml
    path: ./rule-remote/Epic.yaml
  Microsoft:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Microsoft/Microsoft.yaml
    path: ./rule-remote/Microsoft.yaml
  Pinterest:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Pinterest/Pinterest.yaml
    path: ./rule-remote/Pinterest.yaml
  Facebook:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Facebook/Facebook.yaml
    path: ./rule-remote/Facebook.yaml
  OpenAI:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OpenAI/OpenAI.yaml
    path: ./rule-remote/OpenAI.yaml
  Slack:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Slack/Slack.yaml
    path: ./rule-remote/Slack.yaml
  Discord:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Discord/Discord.yaml
    path: ./rule-remote/Discord.yaml
  Docker:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Docker/Docker.yaml
    path: ./rule-remote/Docker.yaml
  Python:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Python/Python.yaml
    path: ./rule-remote/Python.yaml
  Jetbrains:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Jetbrains/Jetbrains.yaml
    path: ./rule-remote/Jetbrains.yaml
  Claude:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Claude/Claude.yaml
    path: ./rule-remote/Claude.yaml
  Threads:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Threads/Threads.yaml
    path: ./rule-remote/Threads.yaml
  Jsdelivr:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Jsdelivr/Jsdelivr.yaml
    path: ./rule-remote/Jsdelivr.yaml
  Figma:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Figma/Figma.yaml
    path: ./rule-remote/Figma.yaml
  Nintendo:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Nintendo/Nintendo.yaml
    path: ./rule-remote/Nintendo.yaml
  Tmdb:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Tmdb/Tmdb.yaml
    path: ./rule-remote/Tmdb.yaml
  TikTok:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/TikTok/TikTok.yaml
    path: ./rule-remote/TikTok.yaml
  iCloud:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/iCloud/iCloud.yaml
    path: ./rule-remote/iCloud.yaml
  PrivateTracker:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/PrivateTracker/PrivateTracker.yaml
    path: ./rule-remote/PrivateTracker.yaml
  DirectRule:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Direct/Direct.yaml
    path: ./rule-remote/DirectRule.yaml
  AdvertisingLite:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/AdvertisingLite/AdvertisingLite.yaml
    path: ./rule-remote/AdvertisingLite.yaml
  AdvertisingMiTV:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/AdvertisingMiTV/AdvertisingMiTV.yaml
    path: ./rule-remote/AdvertisingMiTV.yaml
  GoogleVoice:
    <<: *RuleProviders
    url: https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GoogleVoice/GoogleVoice.yaml
    path: ./rule-remote/GoogleVoice.yaml

rules:
  # 直连
  - DOMAIN-SUFFIX,gov.cn,DIRECT

  # 拒绝

  # 进程
  - PROCESS-NAME,Telegram,AutoProxy

  # 局域网（no-resolve不进行dns解析）
  - IP-CIDR,192.168.0.0/16,DIRECT,no-resolve
  - IP-CIDR,10.0.0.0/8,DIRECT,no-resolve
  - IP-CIDR,172.16.0.0/12,DIRECT,no-resolve
  - IP-CIDR,127.0.0.0/8,DIRECT,no-resolve
  - IP-CIDR,224.0.0.0/4,DIRECT,no-resolve

  # PT
  - DOMAIN-SUFFIX,m-team.io,DIRECT

  - DOMAIN-KEYWORD,tracker,DIRECT
  - DOMAIN-KEYWORD,v6tracker,DIRECT
  
  # 自定义规则
  - DOMAIN-SUFFIX,www.v2ex.com,AutoProxy

  # 特定区地址
  - DOMAIN-SUFFIX,codeium.com,SpecialAutoProxy

  # 远程规则订阅
  # 直连
  - RULE-SET,DirectRule,DIRECT
  - RULE-SET,ChinaMaxNoIP,DIRECT
  - RULE-SET,SteamCN,DIRECT
  - RULE-SET,PrivateTracker,DIRECT
  - RULE-SET,iCloud,DIRECT

  # 去广告
  - RULE-SET,AdvertisingLite,Advertising
  - RULE-SET,AdvertisingMiTV,Advertising

  # OpenAI
  - RULE-SET,OpenAI,OpenAI

  # 美区
  - RULE-SET,Microsoft,SpecialAutoProxy
  - RULE-SET,Jetbrains,SpecialAutoProxy
  - RULE-SET,Claude,SpecialAutoProxy
  - RULE-SET,Spotify,SpecialAutoProxy
  - RULE-SET,TikTok,SpecialAutoProxy
  - RULE-SET,GitLab,SpecialAutoProxy
  - RULE-SET,Docker,SpecialAutoProxy
  - RULE-SET,GoogleVoice,SpecialAutoProxy

  # 默认
  - RULE-SET,Google,AutoProxy
  - RULE-SET,Cloudflare,AutoProxy
  - RULE-SET,Twitter,AutoProxy
  - RULE-SET,Telegram,AutoProxy
  - RULE-SET,GitHub,AutoProxy
  - RULE-SET,YouTube,AutoProxy
  - RULE-SET,Vercel,AutoProxy
  - RULE-SET,Tumblr,AutoProxy
  - RULE-SET,Twitch,AutoProxy
  - RULE-SET,Reddit,AutoProxy
  - RULE-SET,Nvidia,AutoProxy
  - RULE-SET,Notion,AutoProxy
  - RULE-SET,Imgur,AutoProxy
  - RULE-SET,GitBook,AutoProxy
  - RULE-SET,Dropbox,AutoProxy
  - RULE-SET,Emby,AutoProxy
  - RULE-SET,GoogleEarth,AutoProxy
  - RULE-SET,Wikimedia,AutoProxy
  - RULE-SET,BBC,AutoProxy
  - RULE-SET,Instagram,AutoProxy
  - RULE-SET,Threads,AutoProxy
  - RULE-SET,Amazon,AutoProxy
  - RULE-SET,Wikipedia,AutoProxy
  - RULE-SET,Pinterest,AutoProxy
  - RULE-SET,Facebook,AutoProxy
  - RULE-SET,Slack,AutoProxy
  - RULE-SET,Discord,AutoProxy
  - RULE-SET,Python,AutoProxy
  - RULE-SET,Jsdelivr,AutoProxy
  - RULE-SET,Figma,AutoProxy
  - RULE-SET,Nintendo,AutoProxy
  - RULE-SET,Tmdb,AutoProxy
  - RULE-SET,Steam,AutoProxy
  - RULE-SET,Epic,AutoProxy

  # 国内网站
  - DOMAIN-SUFFIX,cn,DIRECT
  - DOMAIN-KEYWORD,-cn,DIRECT

  # 最终规则
  - GEOIP,CN,End
  - MATCH,End
```

<gitalk/>

