---
date: 2025-04-19 20:50:32
---
# NAS Docker Compose分享

好久没写Blog了，忙着研究装修。最近极空间更新了Docker Compose，抽时间把原先跑的镜像都切换成了Docker Compose的形式运行，以后也方便更新和迁移。

目前看更新的Docker Compose也只是勉强能用，还是有不少Bug。但是又不想把SSH放出去，而且以前刚放开SSH的时候遇到Docker Compose跑的容器没法在图形界面操作的问题，所以还是希望通过这次更新的Compose图形化的界面来管理YAML配置。

## 问题
### 团队空间的目录无法映射
一开始还以为是中文目录导致的问题，结果测试发现所有团队空间的目录都没法映射。由于极影视的分享逻辑，我的Mp、Qb、Tr的资源都放在团队空间里，要是没法映射的话直接就玩不下去了。

好在经过一番测试，发现可以只映射其他配置之类的个人空间的目录，先去掉团队空间那些下载盘的目录。等正常跑起来了，再把团队空间的目录补回YAML配置里然后重新构建，这才算真正跑完。

### 配置文件管理
无论是手动写进去还是电脑导入或者本地导入选项，都是在默认的目录下生成一个新的YAML文件，而不是自己定义的位置或者其他目录引用，导致目前这个YAML文件只能通过图形化界面管理，很难备份。

### 没法限制性能
限制内存和CPU的参数似乎没法生效

## YAML分享
### alist
- 分享文件及webdav
```yaml
services:
  alist:
    image: xhofe/alist:latest
    container_name: alist
    ports:
      - "11444:5244"
    volumes:
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/alist/data:/opt/alist/data
      - # 剩下的自己加本地存储的映射
    environment:
      - PUID=0
      - PGID=0
      - UMASK=022
      - TZ=Asia/Shanghai
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### freshrss
- 聚合RSS链接统一管理
```yaml
services:
  freshrss:
    image: linuxserver/freshrss:latest
    container_name: freshrss
    ports:
      - "15222:80"
    volumes:
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/FreshRSS/config:/config
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

### gitea
- 代码仓库
```yaml
services:
  gitea:
    image: gitea/gitea:latest
    container_name: gitea
    ports:
      - "11776:22"
      - "11777:3000"
    volumes:
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/gitea/data:/data
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
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/HomeAssistant/config:/config
    environment:
      - TZ=Asia/Shanghai
    restart: unless-stopped
```

### icloudpd
- icloud照片备份
```yaml
services:
  icloudpd:
    image: boredazfcuk/icloudpd:latest
    container_name: icloudpd
    network_mode: host
    volumes:
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/icloudpd/config:/config
      - /tmp/zfsv3/硬盘名/账号手机号/data/Goalonez/Photos/iCloud:/iCloud
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

### lucky
- 反代
```yaml
services:
  lucky:
    image: gdy666/lucky:latest
    container_name: lucky
    network_mode: host
    volumes:
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/lucky/luckyconf:/goodluck
    restart: unless-stopped
```

### mihomo
```yaml
services:
  mihomo:
    image: metacubex/mihomo:latest
    container_name: mihomo
    ports:
      - "7890:7890"
      - "11666:9090"
    volumes:
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/mihomo/metacubexd:/metacubexd #默认不用，图形化界面需要单独去git拉代码映射
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/mihomo/config:/root/.config/mihomo
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### moviepilot
- 媒体库管理
```yaml
services:
  moviepilot:
    image: jxxghp/moviepilot-v2:latest
    container_name: moviepilot
    ports:
      - "11111:3000"
    volumes:
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/tr/config/torrents:/tr
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/qb/qBittorrent/BT_backup:/qb
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/MoviePilot-v2/config:/config
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/MoviePilot-v2/core:/moviepilot/.cache/ms-playwright
      - # 剩下的自己加本地存储的映射
    environment:
      - PGID=0
      - PUID=0
      - UMASK=000
      - TZ=Asia/Shanghai
      - AUTH_SITE= #你的认证方式，现在似乎也可以不填，跑起来直接去网页里填
      - # 对应的认证密钥
      - PROXY_HOST=http://mihomo:7890
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

### qbittorrent
- 下载
```yaml
services:
  qbittorrent:
    image: linuxserver/qbittorrent:4.6.7
    container_name: qbittorrent
    network_mode: host
    volumes:
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/qb:/config
      - # 剩下的自己加本地存储的映射
    environment:
      - WEBUI_PORT=11333
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
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/tr/watch:/watch
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/tr/web:/web #默认不用加，需要单独去下UI仓库的代码
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/tr/config:/config
      - # 剩下的自己加本地存储的映射
    environment:
      - PGID=0
      - PUID=0
      - TZ=Asia/Shanghai
      - PEERPORT=12345
      - USER= #账号
      - PASS= #密码
      - TRANSMISSION_WEB_HOME=/web #默认不用加，有UI才需要
    restart: unless-stopped
```

### Qinglong
- 定时任务，配合dailycheckin签到
```yaml
services:
  qinglong:
    image: whyour/qinglong:debian
    container_name: qinglong
    ports:
      - "11999:5700"
    volumes:
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/qinglong/data:/ql/data
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
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/rsstt/config:/app/config
    environment:
      - TOKEN= #你的机器人token
      - MANAGER= #你的tgid
      - T_PROXY=socks5://mihomo:7890
      - R_PROXY=socks5://mihomo:7890
      - MULTIUSER=0
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### rsshub
- 万物皆可RSS
```yaml
services:
  rsshub:
    image: diygod/rsshub:chromium-bundled
    container_name: rsshub
    ports:
      - "15111:1200"
    environment:
      - REDIS_URL=redis://redis:6379/
      - PROXY_URI=http://mihomo:7890
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
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/redis/data:/data
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### sun-panel
- 导航页
- 美化
```yaml
services:
  sun-panel:
    image: hslr/sun-panel:latest
    container_name: sun-panel
    ports:
      - "11888:3002"
    volumes:
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/sun-panel/conf:/app/conf
    restart: unless-stopped
    networks:
      - defaultnet

  sun-panel-helper:
    image: madrays/sun-panel-helper:latest
    container_name: sun-panel-helper
    ports:
      - "11887:80"
    volumes:
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/sun-panel/sun-panel-helper/data:/app/backend/data
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/sun-panel/sun-panel-helper/backups:/app/backend/backups
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/sun-panel/conf/custom:/app/backend/custom
    environment:
      - BACKEND_PORT=3001
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
      - "11555:80"
    volumes:
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/vaultwarden/data:/data
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

### syncthing
- 同步，代替文档同步功能
```yaml
services:
  syncthing:
    image: syncthing/syncthing:latest
    container_name: syncthing
    ports:
      - 8384:8384 # Web UI
      - 22000:22000/tcp # TCP file transfers
      - 22000:22000/udp # QUIC file transfers
      - 21027:21027/udp # Receive local discovery broadcasts
    volumes:
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/syncthing:/var/syncthing
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

### wewe-rss
- 微信公众号RSS
```yaml
services:
  wewe-rss:
    image: cooderl/wewe-rss-sqlite:latest
    container_name: wewe-rss
    ports:
      - "15333:4000"
    volumes:
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/wewe-rss/data:/app/data
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

### HowToCook
- 菜谱
```yaml
services:
  how-to-cook:
    image: ghcr.io/anduin2017/how-to-cook:latest
    container_name: how-to-cook
    ports:
      - "12333:5000"
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### duplicati
- 跨盘备份、备份到云盘（代替备份中心，极空间的备份中心只能支持增量备份，不会同步删除）
```yaml
services:
  duplicati:
    image: duplicati/duplicati:latest
    container_name: duplicati
    ports:
      - 8200:8200
    volumes:
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/duplicati/data:/data
      - /tmp/zfsv3/硬盘名/账号手机号/data/:/sourcessd
      - /tmp/zfsv3/硬盘名/账号手机号/data/backup:/backup
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

### Opengist
- 自部署类似Github Gist
```
services:
  opengist:
    image: thomiceli/opengist:latest
    container_name: opengist
    ports:
      - "6157:6157"
    volumes:
      - /tmp/zfsv3/硬盘名/账号手机号/data/docker/Opengist:/opengist
    environment:
      - TZ=Asia/Shanghai
    restart: unless-stopped
    networks:
      - defaultnet

networks:
  defaultnet:
    external: true
```

<gitalk/>