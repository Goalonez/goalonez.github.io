---
date: 2025-04-19 20:50:32
---
# NAS Docker Compose分享

## AI
### Axonhub
- AI渠道聚合网关
```
services:
  axonhub:
    image: looplj/axonhub:latest
    container_name: axonhub
    ports:
      - "自定义端口:8090"
    volumes:
      - /本地存储配置目录/data/docker/axonhub/config.yml:/app/config.yml:ro
    environment:
      - TZ=Asia/Shanghai
      - HTTP_PROXY=http://192.168.1.2:7890
      - HTTPS_PROXY=http://192.168.1.2:7890
      - NO_PROXY=localhost,127.0.0.1
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 4g
    cpus: 4

networks:
  defaultnet:
    external: true
```

### new-api
- AI渠道分发网关
```
services:
  new-api:
    image: calciumion/new-api:latest
    container_name: new-api
    ports:
      - 自定义端口:3000
    restart: unless-stopped
    environment:
      - TZ=Asia/Shanghai
      - STREAMING_TIMEOUT=300
    volumes:
      - /本地存储配置目录/data/docker/new-api/data:/data
    networks:
      - defaultnet
    mem_limit: 4g
    cpus: 3
networks:
  defaultnet:
    external: true
```

### sub2api
- AI渠道分发网关
- 暂时没用了，感觉new-api的配置操作更方便点，支持的模型也多一些。
```
services:
  sub2api:
    image: weishaw/sub2api:latest
    container_name: sub2api
    ports:
      - "自定义端口:8080"
    volumes:
      - /本地存储配置目录/data/docker/sub2api/data:/app/data
    environment:
      - TZ=Asia/Shanghai
      - AUTO_SETUP=true
      - SERVER_HOST=0.0.0.0
      - SERVER_PORT=8080
      - SERVER_MODE=release
      - RUN_MODE=standard
      - DATABASE_HOST=自定义
      - DATABASE_PORT=自定义
      - DATABASE_USER=自定义
      - DATABASE_PASSWORD=自定义
      - DATABASE_DBNAME=自定义
      - DATABASE_SSLMODE=disable
      - DATABASE_MAX_OPEN_CONNS=256
      - DATABASE_MAX_IDLE_CONNS=128
      - DATABASE_CONN_MAX_LIFETIME_MINUTES=30
      - DATABASE_CONN_MAX_IDLE_TIME_MINUTES=5
      - REDIS_HOST=自定义
      - REDIS_PORT=自定义
      - REDIS_PASSWORD=自定义
      - REDIS_DB=自定义
      - REDIS_POOL_SIZE=4096
      - REDIS_MIN_IDLE_CONNS=256
      - REDIS_ENABLE_TLS=false
      - ADMIN_EMAIL=自定义
      - ADMIN_PASSWORD=自定义
      - JWT_SECRET=自定义
      - JWT_EXPIRE_HOUR=24
      - TOTP_ENCRYPTION_KEY=自定义
      - SECURITY_URL_ALLOWLIST_ALLOW_PRIVATE_HOSTS=true
      - UPDATE_PROXY_URL=http://192.168.1.2:7890
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 4g
    cpus: 4

networks:
  defaultnet:
    external: true
```

### CLIProxyAPI
- 号池反代
```
services:
  cli-proxy-api:
    image: eceasy/cli-proxy-api:latest
    container_name: cli-proxy-api
    ports:
      - 自定义端口:8317
    volumes:
      - /本地存储配置目录/data/docker/CLIProxyAPI/config.yaml:/CLIProxyAPI/config.yaml
      - /本地存储配置目录/data/docker/CLIProxyAPI/auth-dir:/root/.cli-proxy-api
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 4g
    cpus: 3
networks:
  defaultnet:
    external: true
```

### hermes
```
services:
  hermes:
    image: nousresearch/hermes-agent:latest
    container_name: hermes
    ports:
      - "自定义端口:8642"
    volumes:
      - /本地存储配置目录/data/docker/hermes/data:/opt/data
    environment:
      - TZ=Asia/Shanghai
      - HERMES_TELEGRAM_HTTP_POOL_TIMEOUT=8.0
      - HERMES_TELEGRAM_HTTP_CONNECT_TIMEOUT=10.0
      - HERMES_TELEGRAM_HTTP_READ_TIMEOUT=20.0
      - HERMES_TELEGRAM_HTTP_WRITE_TIMEOUT=20.0
      - HTTP_PROXY=http://192.168.1.2:7890
      - HTTPS_PROXY=http://192.168.1.2:7890
      - NO_PROXY=localhost,127.0.0.1
    command: gateway run
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 4g
    cpus: 4
  hermes-dashboard:
    image: nousresearch/hermes-agent:latest
    container_name: hermes-dashboard
    ports:
      - "自定义端口:9119"
    volumes:
      - /本地存储配置目录/data/docker/hermes/data:/opt/data
    environment:
      - GATEWAY_HEALTH_URL=http://192.168.1.2:hermes自定义端口
    command: dashboard --host 0.0.0.0 --insecure
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 2g
    cpus: 2

networks:
  defaultnet:
    external: true
```

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
### kasm-chrome
- docker浏览器
```
services:
  kasm-chrome:
    image: kasmweb/chrome:1.18.0
    container_name: kasm-chrome
    user: root
    ports:
      - "自定义端口:6901"    # VNC 访问
      - "自定义端口:24334"    # CDP 协议
    volumes:
      - /本地存储配置目录/data/docker/kasm-chrome/Downloads:/home/kasm-user/Downloads
      - /本地存储配置目录/data/docker/kasm-chrome/startup.sh:/startup.sh:ro
    environment:
      - TZ=Asia/Shanghai
      - VNC_PW=自定义密码
      - APP_ARGS=--remote-debugging-port=9222 --user-data-dir=remote-profile --remote-allow-origins=* --start-maximized
      - HTTP_PROXY=http://192.168.1.2:7890
      - HTTPS_PROXY=http://192.168.1.2:7890
      - NO_PROXY=localhost,127.0.0.1
    entrypoint: /startup.sh
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 4g
    cpus: 4

networks:
  defaultnet:
    external: true
```

### outlook-mail-reader
- 邮箱批量管理
```
services:
  outlook-mail-reader:
    image: ghcr.io/assast/outlookemail:latest
    container_name: outlook-mail-reader
    ports:
      - "自定义端口:5000"
    volumes:
      - /本地存储配置目录/data/docker/outlook-mail-reader/app/data:/app/data
    environment:
      - LOGIN_PASSWORD=自定义密码
      - SECRET_KEY=自定义密钥
      - FLASK_ENV=production
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 1g
    cpus: 2

networks:
  defaultnet:
    external: true
```

### postgres
- 数据库
```
services:
  postgres:
    image: postgres:18-trixie
    container_name: postgres
    ports:
      - "自定义端口:5432"
    volumes:
      - /本地存储配置目录/data/docker/postgres/postgresql:/var/lib/postgresql
    environment:
      - TZ=Asia/Shanghai
      - POSTGRES_PASSWORD=自定义密码
      - POSTGRES_USER=自定义用户名
      - POSTGRES_DB=自定义默认库
      - POSTGRES_INITDB_ARGS=--data-checksums
    shm_size: 128mb
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 4g
    cpus: 4

networks:
  defaultnet:
    external: true
```

### rustfs
- 对象存储
```
services:
  rustfs:
    image: rustfs/rustfs:latest
    container_name: rustfs
    ports:
      - "自定义端口:9000"
      - "自定义端口:9001"
    volumes:
      - /本地存储配置目录/data/docker/rustfs/data:/data
    environment:
      - TZ=Asia/Shanghai
      - RUSTFS_CONSOLE_ENABLE=true
      - RUSTFS_ACCESS_KEY=自定义账号
      - RUSTFS_SECRET_KEY=自定义密码
    command:
      ['--access-key', '自定义账号', '--secret-key', '自定义密码', '/data']
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 2g
    cpus: 3

networks:
  defaultnet:
    external: true
```

### searxng
- 聚合搜索引擎
```
services:
  searxng:
    image: searxng/searxng:latest
    container_name: searxng
    ports:
      - "自定义端口:8080"
    volumes:
      - /本地存储配置目录/data/docker/searxng/searxng-settings.yml:/etc/searxng/settings.yml
    environment:
      - TZ=Asia/Shanghai
      - SEARXNG_SETTINGS_FILE=/etc/searxng/settings.yml
      - HTTP_PROXY=http://192.168.1.2:7890
      - HTTPS_PROXY=http://192.168.1.2:7890
      - NO_PROXY=localhost,127.0.0.1
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 1g
    cpus: 2

networks:
  defaultnet:
    external: true
```

### reader
- 阅读
```
services:
  reader:
    image: hectorqin/reader:latest
    container_name: reader
    ports:
      - 自定义端口:8080
    volumes:
      - /本地存储配置目录/data/docker/reader/storage:/storage
      - /本地存储配置目录/data/docker/reader/logs:/logs
    environment:
      - TZ=Asia/Shanghai
      - SPRING_PROFILES_ACTIVE=prod
      - READER_APP_CACHECHAPTERCONTENT=true #开启缓存章节内容 V2.0
      - READER_APP_SECURE=true #开启登录鉴权，开启后将支持多用户模式
      - READER_APP_SECUREKEY=自定义密钥 #管理员密码  建议修改
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 2g
    cpus: 2
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
      - PROXY_HOST=http://192.168.1.2:7890
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
### pansou
- 网盘搜索api
```yaml
services:
  pansou-app:
    image: ghcr.io/fish2018/pansou-web:latest
    container_name: pansou-app
    ports:
      - 自定义端口:8888
      - 自定义端口:80
    environment:
      - DOMAIN=localhost
      - PANSOU_PORT=8888
      - PANSOU_HOST=127.0.0.1
      # 数据目录配置（统一在/app/data下）
      - CACHE_PATH=/app/data/cache
      - LOG_PATH=/app/data/logs
      # Telegram频道配置（镜像已包含这些默认频道，如需自定义可取消注释）
      # - CHANNELS=tgsearchers6,Aliyun_4K_Movies,bdbdndn11,yunpanx,bsbdbfjfjff,yp123pan,sbsbsnsqq,yunpanxunlei,tianyifc,BaiduCloudDisk,txtyzy,peccxinpd,gotopan,PanjClub,kkxlzy,baicaoZY,MCPH01,MCPH02,MCPH03,bdwpzhpd,ysxb48,jdjdn1111,yggpan,MCPH086,zaihuayun,Q66Share,ucwpzy,shareAliyun,alyp_1,dianyingshare,Quark_Movies,XiangxiuNBB,ydypzyfx,ucquark,xx123pan,yingshifenxiang123,zyfb123,tyypzhpd,tianyirigeng,cloudtianyi,hdhhd21,Lsp115,oneonefivewpfx,qixingzhenren,taoxgzy,Channel_Shares_115,tyysypzypd,vip115hot,wp123zy,yunpan139,yunpan189,yunpanuc,yydf_hzl,leoziyuan,Q_dongman,yoyokuakeduanju,TG654TG,WFYSFX02,QukanMovie,yeqingjie_GJG666,movielover8888_film3,Baidu_netdisk,D_wusun,FLMdongtianfudi,KaiPanshare,QQZYDAPP,rjyxfx,PikPak_Share_Channel,btzhi,newproductsourcing,cctv1211,duan_ju,QuarkFree,yunpanNB,kkdj001,xxzlzn,pxyunpanxunlei,jxwpzy,kuakedongman,liangxingzhinan,xiangnikanj,solidsexydoll,guoman4K,zdqxm,kduanju,cilidianying,CBduanju,SharePanFilms,dzsgx,BooksRealm,Oscar_4Kmovies,douerpan,baidu_yppan,Q_jilupian,Netdisk_Movies,yunpanquark,ammmziyuan,ciliziyuanku,cili8888,jzmm_123pan,Q_dianying,domgmingapk,dianying4k,q_dianshiju,tgbokee,ucshare,godupan,gokuapan,gimy115,WFYSFX03,peccxin,Movie888035,xlwpzy,zyywpzy,wydwpzy,gimy100,ucshare,gimy115iso,aliyunys,clouddriveresources,XunLeiPinDao,ydwpzy,a123fxme,WPpindao,kuyupan,djya5,pan_guangya
      # 插件配置（镜像已包含推荐插件，如需自定义可取消注释并修改）
      # - ENABLED_PLUGINS=labi,zhizhen,shandian,duoduo,muou,wanou,hunhepan,jikepan,panwiki,pansearch,panta,qupansou,hdr4k,pan666,susu,thepiratebay,xuexizhinan,panyq,ouge,huban,cyg,erxiao,miaoso,fox4k,pianku,clmao,wuji,cldi,xiaozhang,libvio,leijing,xb6v,xys,ddys,hdmoli,clxiong,jutoushe,sdso,xiaoji,xdyh,haisou,bixin,djgou,nyaa,xinjuc,aikanzy,qupanshe,xdpan,discourse,yunsou,ahhhhfs,nsgame,quark4k,quarksoo,sousou,ash,feikuai,kkmao,alupan,ypfxw,mikuclub,daishudj,dyyj,meitizy,jsnoteclub,mizixing,lou1,yiove,zxzj,qingying,kkv,yulinshufa,duanjuw,jupansou,lingjisp,quarktv,dyyjpro,gaoqing888,panlian,panzun
      # 认证配置（可选）
      - AUTH_ENABLED=true
      - AUTH_USERS=自定义账号:自定义密码
      - AUTH_TOKEN_EXPIRY=24
      - AUTH_JWT_SECRET=自定义
      # 如果需要代理，取消下面的注释并设置代理地址
      - PROXY=socks5://192.168.1.2:7890
    volumes:
      - /本地存储配置目录/data/docker/pansou-web/app/cache:/app/data/cache
      - /本地存储配置目录/data/docker/pansou-web/app/logs:/app/data/logs
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

### arcane
- docker管理面板
```
services:
  arcane:
    image: ghcr.io/getarcaneapp/arcane:latest
    container_name: arcane
    ports:
      - "自定义端口:3552"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /本地存储配置目录/data/docker/arcane/data:/app/data
    environment:
      - TZ=Asia/Shanghai
      - APP_URL=http://localhost:3552
      - PUID=1000
      - PGID=1000
      - ENCRYPTION_KEY=自定义
      - JWT_SECRET=自定义
      - HTTP_PROXY=http://192.168.1.2:7890
      - HTTPS_PROXY=http://192.168.1.2:7890
      - ALL_PROXY=socks5://192.168.1.2:7890
      - NO_PROXY=localhost,127.0.0.1
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 2g
    cpus: 3

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
      - /本地存储配置目录/Photos/iCloud:/iCloud
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
      - /本地存储配置目录/Photos:/Photos
    environment:
      - DB_HOSTNAME=immich_postgres
      - DB_PORT=自定义端口
      - DB_USERNAME=自定义账号
      - DB_PASSWORD=自定义密码
      - DB_DATABASE_NAME=immich
      - REDIS_HOSTNAME=自定义
      - REDIS_PORT=6379
      - REDIS_DBINDEX=0
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
      - HTTP_PROXY=http://192.168.1.2:7890
      - HTTPS_PROXY=http://192.168.1.2:7890
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
      - '自定义端口:5432'
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

### fast-note-sync-service
- Obsidian多端同步
```
services:
  fast-note-sync-service:
    image: haierkeys/fast-note-sync-service:latest
    container_name: fast-note-sync-service
    ports:
      - 自定义端口:9000
      - 自定义端口:9001
    volumes:
      - /本地存储配置目录/data/docker/fast-note-sync/storage:/fast-note-sync/storage
      - /本地存储配置目录/data/docker/fast-note-sync/config:/fast-note-sync/config
    environment:
      - TZ=Asia/Shanghai  
      - HTTP_PROXY=http://192.168.1.2:7890
      - HTTPS_PROXY=http://192.168.1.2:7890
      - NO_PROXY=localhost,127.0.0.1
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 1g
    cpus: 2
networks:
  defaultnet:
    external: true
```
## 网络

### z-caddy
- caddy自己集成了Cloudflare DNS 和 caddy-security
```
services:
  z-caddy:
    image: goalonez/z-caddy:latest
    container_name: z-caddy
    ports:
      - "自定义端口:自定义端口"
      - "自定义端口:自定义端口/udp"
    volumes:
      - /本地存储配置目录/data/docker/caddy/conf:/etc/caddy
      - /本地存储配置目录/data/docker/caddy/data:/data
      - /本地存储配置目录/data/docker/caddy/config:/config
    environment:
      - HTTP_PROXY=http://192.168.1.2:7890
      - HTTPS_PROXY=http://192.168.1.2:7890
      - ALL_PROXY=socks5://192.168.1.2:7890
      - NO_PROXY=localhost,127.0.0.1,192.168.1.2
      - JWT_SHARED_KEY=自定义
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 2g
    cpus: 3

networks:
  defaultnet:
    external: true
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

### cloudflared
- 隧道
```
services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared
    environment:
      - TZ=Asia/Shanghai
    command: tunnel --no-autoupdate run --token 令牌
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 2g
    cpus: 4

networks:
  defaultnet:
    external: true
```

### ddns-go
- 动态ip解析
```
services:
  ddns-go:
    image: jeessy/ddns-go:latest
    container_name: ddns-go
    ports:
      - "自定义端口:9876"
    volumes:
      - /本地存储配置目录/data/docker/ddns-go/root:/root
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 1g
    cpus: 2

networks:
  defaultnet:
    external: true
```

## Vibe 的小工具
### smart-harbor
- 我根据自己需求vibe coding的导航页
- 主要是为了解决在家或外面的时候，打开书签自动使用公网地址或者局域网地址

```yaml
services:
  smart-harbor:
    image: goalonez/smart-harbor:latest
    container_name: smart-harbor
    ports:
      - 自定义端口:80
    volumes:
      - /本地存储配置目录/data/docker/smart-harbor/config:/app/config
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 4g
    cpus: 3

networks:
  defaultnet:
    external: true
```

### z-dev-toolbox
- 开发者工具箱
```
services:
  z-dev-toolbox:
    image: goalonez/z-dev-toolbox:latest
    container_name: z-dev-toolbox
    ports:
      - 自定义端口:80
    restart: unless-stopped
    networks:
      - defaultnet
    mem_limit: 1g
    cpus: 2
networks:
  defaultnet:
    external: true
```


<PostComments/>