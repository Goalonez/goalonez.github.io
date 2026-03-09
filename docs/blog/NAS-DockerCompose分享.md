---
date: 2025-04-19 20:50:32
---
# NAS Docker Compose分享

## 服务

### openlist
- 一个支持多种存储的文件列表程序
- 分享文件及webdav

```yaml
services:
  openlist:
    image: openlistteam/openlist:latest
    container_name: openlist
    ports:
      - "自定义端口:5244"
    user: '0:0'
    volumes:
      - /本地存储配置目录/docker/OpenList/data:/opt/openlist/data
      - /本地存储配置目录/docker/aria2-pro/temp/aria2:/opt/openlist/data/temp/aria2
    environment:
      - UMASK=022
      - TZ=Asia/Shanghai
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 1g
    cpus: 2
    depends_on:
      - aria2-pro
  
  # 单独部署aria2，因为据说后续没有aio后缀的镜像了。
  aria2-pro:
    image: p3terx/aria2-pro
    container_name: aria2-pro
    ports:
      - "自定义端口:11445"
      # 不用BT所以注释
      # - '6888:6888'
      # - '6888:6888/udp'
    volumes:
      - /本地存储配置目录/docker/aria2-pro/config:/config
      - /本地存储配置目录/docker/aria2-pro/downloads:/downloads
      - /本地存储配置目录/docker/aria2-pro/temp/aria2:/opt/openlist/data/temp/aria2
    environment:
      - PUID=0
      - PGID=0
      - TZ=Asia/Shanghai
      - UMASK_SET=022
      # 设置密码
      - RPC_SECRET=123456
      - RPC_PORT=11445
      - LISTEN_PORT=6888
      - IPV6_MODE=true
      # 由于配置文件是从github拉取的，所以可以通过环境变量设置代理
      # - HTTP_PROXY=http://192.168.1.2:7890
      # - HTTPS_PROXY=http://192.168.1.2:7890
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 1g
    cpus: 2

  ariang:
    image: p3terx/ariang
    container_name: ariang
    network_mode: host
    environment:
      - PUID=0
      - PGID=0
      - TZ=Asia/Shanghai
    command: ["--port", "自定义端口", "--ipv6"]
    restart: unless-stopped
    mem_limit: 1g
    cpus: 2
    depends_on:
      - aria2-pro

networks:
  defaultnet:
    external: true
```

### gitea
- 代码仓库

```yaml
services:
  gitea:
    image: gitea/gitea:latest
    container_name: gitea
    ports:
      - "自定义端口:22"
      - "自定义端口:3000"
    volumes:
      - /本地存储配置目录/docker/gitea/data:/data
    environment:
      - USER_UID=1000
      - USER_GID=1000
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### qinglong
- 定时任务，配合dailycheckin签到

```yaml
services:
  qinglong:
    image: whyour/qinglong:debian
    container_name: qinglong
    ports:
      - "自定义端口:5700"
    volumes:
      - /本地存储配置目录/docker/qinglong/data:/ql/data
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### vaultwarden
- 密码管理器

```yaml
services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    ports:
      - "自定义端口:80"
    volumes:
      - /本地存储配置目录/docker/vaultwarden/data:/data
    environment:
      - SIGNUPS_ALLOWED=false
      - INVITATIONS_ALLOWED=false
      - EXPERIMENTAL_CLIENT_FEATURE_FLAGS=ssh-key-vault-item,ssh-agent
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### authentik
- 用于单点登录各个系统

```yaml
services:
  authentik-server:
    image: ghcr.io/goauthentik/server:2025.10.3
    container_name: authentik-server
    command: server
    restart: unless-stopped
    environment:
      AUTHENTIK_SECRET_KEY: 密钥
      AUTHENTIK_POSTGRESQL__HOST: postgresql地址
      AUTHENTIK_POSTGRESQL__PORT: postgresql端口
      AUTHENTIK_POSTGRESQL__NAME: authentik
      AUTHENTIK_POSTGRESQL__USER: authentik
      AUTHENTIK_POSTGRESQL__PASSWORD: postgresql密码
    ports:
      - 自定义端口:9000
      - 自定义端口:9443
    volumes:
      - - /本地存储配置目录/docker/authentik/media:/media
      - - /本地存储配置目录/docker/authentik/templates:/templates
    networks:
      - defaultnet
    mem_limit: 3g
    cpus: 3

  authentik-worker:
    image: ghcr.io/goauthentik/server:2025.10.3
    container_name: authentik-worker
    command: worker
    restart: unless-stopped
    user: root
    environment:
      AUTHENTIK_SECRET_KEY: 密钥
      AUTHENTIK_POSTGRESQL__HOST: postgresql地址
      AUTHENTIK_POSTGRESQL__PORT: postgresql端口
      AUTHENTIK_POSTGRESQL__NAME: authentik
      AUTHENTIK_POSTGRESQL__USER: authentik
      AUTHENTIK_POSTGRESQL__PASSWORD: postgresql密码
    volumes:
      # - /var/run/docker.sock:/var/run/docker.sock
      - - /本地存储配置目录/docker/authentik/media:/media
      - - /本地存储配置目录/docker/authentik/certs:/certs
      - - /本地存储配置目录/docker/authentik/templates:/templates
    networks:
      - defaultnet
    mem_limit: 3g
    cpus: 3
    
networks:
  defaultnet:
    external: true
```

### opengist
- 自部署文本托管，类似Github Gist

```yaml
services:
  opengist:
    image: thomiceli/opengist:latest
    container_name: opengist
    ports:
      - "自定义端口:6157"
    volumes:
      - /本地存储配置目录/docker/Opengist:/opengist
    environment:
      - TZ=Asia/Shanghai
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### rustDesk
- 远程桌面

```yaml
services:
  hbbs:
    image: rustdesk/rustdesk-server:latest
    container_name: hbbs
    command: hbbs
    ports:
      - "自定义端口:21115"
      - "自定义端口:21116/tcp"
      - "自定义端口:21116/udp"
    volumes:
      - /本地存储配置目录/docker/rustdesk/data:/root
    restart: unless-stopped
    networks:
      - defaultnet
    depends_on:
      - hbbr

  hbbr:
    image: rustdesk/rustdesk-server:latest
    container_name: hbbr
    command: hbbr
    ports:
      - "自定义端口:21117"
    volumes:
      - /本地存储配置目录/docker/rustdesk/data:/root
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### glance
- 主页导航，搭配sun-panel的浏览器插件使用

```yaml
services:
  glance:
    image: glanceapp/glance:latest
    container_name: glance
    ports:
      - 自定义端口:8080
    volumes:
      - /本地存储配置目录/docker/glance/config:/app/config
      - /本地存储配置目录/docker/glance/assets:/app/assets
      - /etc/localtime:/etc/localtime:ro
      - /var/run/docker.sock:/var/run/docker.sock
    restart: unless-stopped
    environment:
      - TZ=Asia/Shanghai
      # - HTTP_PROXY=http://192.168.1.2:7890
      # - HTTPS_PROXY=http://192.168.1.2:7890
    networks:
      - defaultnet
    mem_limit: 1g
    cpus: 2

networks:
  defaultnet:
    external: true
    
```

### dailyhot-api
- 各大平台热榜接口api、rss
- 搭配glance使用

```yaml
services:
  dailyhot-api:
    image: imsyy/dailyhot-api:latest
    container_name: dailyhot-api
    ports:
      - 自定义端口:6688
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 1g
    cpus: 2
networks:
  defaultnet:
    external: true
    
```
### HowToCook
- 菜谱

```yaml
services:
  how-to-cook:
    image: ghcr.io/anduin2017/how-to-cook:latest
    container_name: how-to-cook
    ports:
      - "自定义端口:5000"
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### sun-panel
- 导航页
- 暂时用的是glance，感觉信息更多一点

```yaml
services:
  sun-panel:
    image: hslr/sun-panel:latest
    container_name: sun-panel
    ports:
      - "自定义端口:3002"
    volumes:
      - /本地存储配置目录/docker/sun-panel/conf:/app/conf
    restart: unless-stopped
    networks:
      - defaultnet

  sun-panel-helper:
    image: madrays/sun-panel-helper:latest
    container_name: sun-panel-helper
    ports:
      - "自定义端口:80"
    volumes:
      - /本地存储配置目录/docker/sun-panel/sun-panel-helper/data:/app/backend/data
      - /本地存储配置目录/docker/sun-panel/sun-panel-helper/backups:/app/backend/backups
      - /本地存储配置目录/docker/sun-panel/conf/custom:/app/backend/custom
    environment:
      - BACKEND_PORT=3001
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

## RSS
### rsshub
- 万物皆可RSS

```yaml
services:
  rsshub:
    image: diygod/rsshub:chromium-bundled
    container_name: rsshub
    ports:
      - "自定义端口:1200"
    environment:
      - REDIS_URL=redis://192.168.1.2:6379/
      - PROXY_URI=http://192.168.1.2:7890
      - PUPPETEER_WS_ENDPOINT=ws://browserless:3000
      - ACCESS_KEY= #密钥
      - CACHE_TYPE=redis
    depends_on:
      - redis
      - browserless
    restart: unless-stopped
    networks:
      - defaultnet

  browserless:
    image: browserless/chrome:latest
    container_name: browserless
    ulimits:
      core:
        hard: 0
        soft: 0
    restart: unless-stopped
    networks:
      - defaultnet

  redis:
    image: redis:alpine
    container_name: redis
    volumes:
      - /本地存储配置目录/docker/redis/data:/data
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### freshrss
- 一个可自托管的RSS和 Atom 源聚合器

```yaml
services:
  freshrss:
    image: linuxserver/freshrss:latest
    container_name: freshrss
    ports:
      - "自定义端口:80"
    volumes:
      - /本地存储配置目录/docker/FreshRSS/config:/config
    environment:
      - TZ=Asia/Shanghai
      - PUID=1000
      - PGID=1000
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### rss-to-telegram
- 将RSS推送到Tg

```yaml
services:
  rss-to-telegram:
    image: rongronggg9/rss-to-telegram:latest
    container_name: rss-to-telegram
    volumes:
      - /本地存储配置目录/docker/rsstt/config:/app/config
    environment:
      - TOKEN= #你的机器人token
      - MANAGER= #你的tgid
      - T_PROXY=socks5://192.168.1.2:7890
      - R_PROXY=socks5://192.168.1.2:7890
      - MULTIUSER=0
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### wewe-rss
- 微信公众号RSS

```yaml
services:
  wewe-rss:
    image: cooderl/wewe-rss-sqlite:latest
    container_name: wewe-rss
    ports:
      - "自定义端口:4000"
    volumes:
      - /本地存储配置目录/docker/wewe-rss/data:/app/data
    environment:
      - SERVER_ORIGIN_URL= #你的域名
      - MAX_REQUEST_PER_MINUTE=60
      - AUTH_CODE= #你的密钥
      - DATABASE_URL=file:../data/wewe-rss.db
      - AUTH_DATABASE_TYPECODE=sqlite
      - FEED_MODE=fulltext
      - ENABLE_CLEAN_HTML=true
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

## 影视
### moviepilot
- 媒体库自动化管理

```yaml
services:
  moviepilot:
    image: jxxghp/moviepilot-v2:latest
    container_name: moviepilot
    ports:
      - "自定义端口:3000"
    volumes:
      - /本地存储配置目录/docker/tr/config/torrents:/tr
      - /本地存储配置目录/docker/qb/qBittorrent/BT_backup:/qb
      - /本地存储配置目录/docker/MoviePilot-v2/config:/config
      - /本地存储配置目录/docker/MoviePilot-v2/core:/moviepilot/.cache/ms-playwright
      - # 剩下的自己加本地存储的映射
    environment:
      - PGID=0
      - PUID=0
      - UMASK=000
      - TZ=Asia/Shanghai
      - AUTH_SITE= #你的认证方式，现在似乎也可以不填，跑起来直接去网页里填
      - # 对应的认证密钥
      - PROXY_HOST=http://192.168.6.2:7890
      - MOVIEPILOT_AUTO_UPDATE=release
      - PORT=3001
      - NGINX_PORT=3000
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### jellyfin
- 媒体库

```yaml
services:
  jellyfin:
    image: jellyfin/jellyfin
    container_name: jellyfin
    ports:
      - "自定义端口:8096"
    volumes:
      - /本地存储配置目录/docker/jellyfin/path/to/config:/config
      - /本地存储配置目录/docker/jellyfin/path/to/cache:/cache
      # :ro只读模式
      - /本地存储配置目录/public/公共下载:/downloads:ro
      - /本地存储配置目录/public/公共下载1:/downloads1:ro
    environment:
      # 外部访问地址
      - JELLYFIN_PublishedServerUrl=https://example.com
      # 为了刮削，添加代理
      - HTTP_PROXY=http://192.168.1.2:7890
      - HTTPS_PROXY=http://192.168.1.2:7890
    # 调用核心显卡  
    devices:
      - /dev/dri:/dev/dri
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 2g
    cpus: 2

networks:
  defaultnet:
    external: true

```

### qbittorrent
- 下载器

```yaml
services:
  qbittorrent:
    image: linuxserver/qbittorrent:4.6.7
    container_name: qbittorrent
    network_mode: host
    volumes:
      - /本地存储配置目录/docker/qb:/config
      - # 剩下的自己加本地存储的映射
    environment:
      - WEBUI_PORT=自定义端口
      - PGID=0
      - PUID=0
    restart: unless-stopped
```

### transmission
- 保种

```yaml
services:
  transmission:
    image: linuxserver/transmission:4.0.4
    container_name: transmission
    network_mode: host
    volumes:
      - /本地存储配置目录/docker/tr/watch:/watch
      - /本地存储配置目录/docker/tr/web:/web #默认不用加，需要单独去下UI仓库的代码
      - /本地存储配置目录/docker/tr/config:/config
      - # 剩下的自己加本地存储的映射
    environment:
      - PGID=0
      - PUID=0
      - TZ=Asia/Shanghai
      - PEERPORT=自定义端口
      - USER= #账号
      - PASS= #密码
      - TRANSMISSION_WEB_HOME=/web #默认不用加，有UI才需要
    restart: unless-stopped
```

### omnibox
- 影视综合管理，集成影视站，网盘搜索，iptv，直播平台，支持tvbox订阅

```yaml
services:
  omnibox:
    image: lampon/omnibox:latest
    container_name: omnibox
    ports:
      - 自定义端口:7023
    volumes:
      - /本地存储配置目录/docker/omnibox/data:/app/data
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 1g
    cpus: 2

networks:
  defaultnet:
    external: true
    
```

### pansou
- 网盘搜索api，搭配OmniBox使用
```yaml
services:
  pansou:
    image: ghcr.io/fish2018/pansou:latest
    container_name: pansou
    ports:
      - 自定义端口:8888
    environment:
      - PORT=8888
      - CHANNELS=tgsearchers3,Aliyun_4K_Movies,bdbdndn11,yunpanx,bsbdbfjfjff,yp123pan,sbsbsnsqq,yunpanxunlei,tianyifc,BaiduCloudDisk,txtyzy,peccxinpd,gotopan,PanjClub,kkxlzy,baicaoZY,MCPH01,bdwpzhpd,ysxb48,jdjdn1111,yggpan,MCPH086,zaihuayun,Q66Share,ucwpzy,shareAliyun,alyp_1,dianyingshare,Quark_Movies,XiangxiuNBB,ydypzyfx,ucquark,xx123pan,yingshifenxiang123,zyfb123,tyypzhpd,tianyirigeng,cloudtianyi,hdhhd21,Lsp115,oneonefivewpfx,qixingzhenren,taoxgzy,Channel_Shares_115,tyysypzypd,vip115hot,wp123zy,yunpan139,yunpan189,yunpanuc,yydf_hzl,leoziyuan,pikpakpan,Q_dongman,yoyokuakeduanju,TG654TG,WFYSFX02,QukanMovie,yeqingjie_GJG666,movielover8888_film3,Baidu_netdisk,D_wusun,FLMdongtianfudi,KaiPanshare,QQZYDAPP,rjyxfx,PikPak_Share_Channel,btzhi,newproductsourcing,cctv1211,duan_ju,QuarkFree,yunpanNB,kkdj001,xxzlzn,pxyunpanxunlei,jxwpzy,kuakedongman,liangxingzhinan,xiangnikanj,solidsexydoll,guoman4K,zdqxm,kduanju,cilidianying,CBduanju,SharePanFilms,dzsgx,BooksRealm
      # 必须指定启用的插件，多个插件用逗号分隔
      - ENABLED_PLUGINS=labi,zhizhen,shandian,duoduo,muou,wanou,hunhepan,jikepan,panwiki,pansearch,panta,qupansou,hdr4k,pan666,susu,thepiratebay,xuexizhinan,panyq,ouge,huban,cyg,erxiao,miaoso,fox4k,pianku,clmao,wuji,cldi,xiaozhang,libvio,leijing,xb6v,xys,ddys,hdmoli,yuhuage,u3c3,javdb,clxiong,jutoushe,sdso,xiaoji,xdyh,haisou,bixin,djgou,nyaa,xinjuc,aikanzy,qupanshe,xdpan,discourse,yunsou
      - CACHE_ENABLED=true
      - CACHE_PATH=/app/cache
      - CACHE_MAX_SIZE=100
      - CACHE_TTL=60
      - ASYNC_PLUGIN_ENABLED=true
      - ASYNC_RESPONSE_TIMEOUT=4
      - ASYNC_MAX_BACKGROUND_WORKERS=20
      - ASYNC_MAX_BACKGROUND_TASKS=100
      - ASYNC_CACHE_TTL_HOURS=1
      # 认证配置（可选）
      # - AUTH_ENABLED=true
      # - AUTH_USERS=admin:admin123,user:pass456
      # - AUTH_TOKEN_EXPIRY=24
      # - AUTH_JWT_SECRET=your-secret-key-here
      # 如果需要代理，取消下面的注释并设置代理地址
      # - PROXY=socks5://192.168.1.2:7890
    volumes:
      - /本地存储配置目录/docker/pansou/app/cache.env:/app/cache
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 1g
    cpus: 2

networks:
  defaultnet:
    external: true
    
```

### danmu-api
- 弹幕api，搭配OmniBox使用

```yaml
services:
  danmu-api:
    image: logvar/danmu-api:latest
    container_name: danmu-api
    ports:
      - 自定义端口:9321
    volumes:
      - /本地存储配置目录/docker/danmu-api/config.yaml:/app/config.yaml
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 1g
    cpus: 2

networks:
  defaultnet:
    external: true
    
```

## 管理
### dockge
- 一个美观、易用且响应迅速的自托管 Docker compose.yaml 堆栈管理器。

```yaml
services:
  dockge:
    image: louislam/dockge:latest
    container_name: dockge
    ports:
      - "自定义端口:5001"
    volumes:
      - /本地存储配置目录/docker/dockge/data:/app/data
      - /var/run/docker.sock:/var/run/docker.sock
      - /本地存储配置目录/docker/dockge/opt/stacks:/opt/stacks
    environment:
      - DOCKGE_STACKS_DIR=/opt/stacks
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 1g
    cpus: 2

networks:
  defaultnet:
    external: true
    
```

### portainer
- docker管理面板
- 暂时弃用了，没有遮罩层，web页面用得很难受

```yaml
services:
  portainer:
    image: 6053537/portainer-ce:latest
    container_name: portainer
    ports:
      - "自定义端口:9000"
    volumes:
      - /本地存储配置目录/docker/portainer/data:/data
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - HTTP_PROXY=http://192.168.1.2:7890
      - HTTPS_PROXY=http://192.168.1.2:7890
      - NO_PROXY=localhost,127.0.0.1,::1,docker.internal
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 1g
    cpus: 2

networks:
  defaultnet:
    external: true
    
```

### home-assistant
- 智能家居

```yaml
services:
  home-assistant:
    image: ghcr.io/home-assistant/home-assistant:stable
    container_name: home-assistant
    network_mode: host
    privileged: true
    volumes:
      - /本地存储配置目录/docker/HomeAssistant/config:/config
      - /本地存储配置目录/docker/HomeAssistant/ssh:/root/.ssh
    environment:
      - TZ=Asia/Shanghai
    restart: unless-stopped
```

## 备份
### icloudpd
- icloud照片备份

```yaml
services:
  icloudpd:
    image: boredazfcuk/icloudpd:latest
    container_name: icloudpd
    network_mode: host
    volumes:
      - /本地存储配置目录/docker/icloudpd/config:/config
      - /本地存储配置目录/Goalonez/Photos/iCloud:/iCloud
    environment:
      - apple_id= #你的appid
      - download_path=/iCloud
      - icloud_china=true
      - auth_china=true
      - auto_delete=true
      - skip_check=true #跳过检测，处理全部文件，否则只有在有新的照片的时候才能触发删除
      - notification_type=Telegram #默认不需要，通知
      - telegram_token= #你的机器人token
      - telegram_chat_id= #你的tgid
      - telegram_polling=true
      - telegram_server= #反代tg api地址。当然你也可以直接HTTP_PROXY去走代理
      - telegram_http=false
      - TZ=Asia/Shanghai
    restart: unless-stopped
```

### duplicati
- 跨盘备份、备份到云盘

```yaml
services:
  duplicati:
    image: duplicati/duplicati:latest
    container_name: duplicati
    ports:
      - 自定义端口:8200
    volumes:
      - /本地存储配置目录/docker/duplicati/data:/data
      - /本地存储配置目录/:/sourcessd
      - /本地存储配置目录/backup:/backup
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### bili-sync
- 哔哩哔哩收藏视频备份

```yaml
services:
  bili-sync-rs:
    image: amtoaer/bili-sync-rs:latest
    container_name: bili-sync-rs
    ports:
      - 自定义端口:12345
    volumes:
      - /本地存储配置目录/docker/bili-sync-rs/config:/app/.config/bili-sync
      - /本地存储配置目录/public/videos/Bilibilis:/Bilibilis
      # - /本地存储配置目录/docker/jellyfin/path/to/config/metadata/People:/app/.config/bili-sync/upper_face
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 1g
    cpus: 2

networks:
  defaultnet:
    external: true
    
```

### syncthing
- 同步文件

```yaml
services:
  syncthing:
    image: syncthing/syncthing:latest
    container_name: syncthing
    ports:
      - 自定义端口:8384 # Web UI
      - 自定义端口:22000/tcp # TCP file transfers
      - 自定义端口:22000/udp # QUIC file transfers
      - 自定义端口:21027/udp # Receive local discovery broadcasts
    volumes:
      - /本地存储配置目录/docker/syncthing:/var/syncthing
    environment:
      - PUID=1000
      - PGID=1000
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### immich
- 照片管理

```yaml
services:
  immich-server:
    image: ghcr.io/immich-app/immich-server:release
    container_name: immich_server
    ports:
      - '自定义端口:2283'
    volumes:
      - /本地存储配置目录/docker/immich/data:/data
      # 中文地理编码https://github.com/ZingLix/immich-geodata-cn
      - /本地存储配置目录/docker/immich/geodata:/build/geodata
      - /本地存储配置目录/docker/immich/i18n-iso-countries/langs:/usr/src/app/server/node_modules/i18n-iso-countries/langs
      - /本地存储配置目录/Goalonez/Photos:/Photos
    environment:
      - DB_HOSTNAME=immich_postgres
      - DB_PORT=5432
      - DB_USERNAME=postgres
      - DB_PASSWORD=自定义密码
      - DB_DATABASE_NAME=immich
      # 我是复用了rsshub的redis，请自行参考上方rsshub中的redis镜像
      - REDIS_HOSTNAME=redis
      - REDIS_PORT=6379
      # 同实例不同库
      - REDIS_DBINDEX=1
      - TZ=Asia/Shanghai
    depends_on:
      - immich_postgres
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 2g
    cpus: 3

  immich-machine-learning:
    image: ghcr.io/immich-app/immich-machine-learning:release
    container_name: immich_machine_learning
    volumes:
      - /本地存储配置目录/docker/immich/model-cache:/cache
    environment:
      # 代理
      - HTTP_PROXY=http://192.168.5.2:7890
      - HTTPS_PROXY=http://192.168.5.2:7890
      - NO_PROXY=localhost,127.0.0.1,immich
      - TZ=Asia/Shanghai
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 4g
    cpus: 4

  immich_postgres:
    image: ghcr.io/immich-app/postgres:14-vectorchord0.4.3-pgvectors0.2.0@sha256:32324a2f41df5de9efe1af166b7008c3f55646f8d0e00d9550c16c9822366b4a
    container_name: immich_postgres
    ports:
      - '5432:5432'
    volumes:
      - /本地存储配置目录/docker/immich/postgresql/data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=自定义密码
      - POSTGRES_USER=postgres
      - POSTGRES_DB=immich
      - POSTGRES_INITDB_ARGS=--data-checksums
      - TZ=Asia/Shanghai
    restart: unless-stopped
    networks:
      - defaultnet
    shm_size: 128mb
    mem_limit: 3g
    cpus: 2

networks:
  defaultnet:
    external: true
    
```

## 网络
### lucky
- 自动续ssl证书，反代
- 还有一堆功能

```yaml
services:
  lucky:
    image: gdy666/lucky:latest
    container_name: lucky
    network_mode: host
    volumes:
      - /本地存储配置目录/docker/lucky/luckyconf:/goodluck
    restart: unless-stopped
```

### mihomo
- 🪜

```yaml
services:
  mihomo:
    image: metacubex/mihomo:latest
    container_name: mihomo
    ports:
      - "自定义端口:7890"
      - "自定义端口:9090"
    volumes:
      - /本地存储配置目录/docker/mihomo/metacubexd:/metacubexd #默认不用，图形化界面需要单独去git拉代码映射
      - /本地存储配置目录/docker/mihomo/config:/root/.config/mihomo
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```


<PostComments/>