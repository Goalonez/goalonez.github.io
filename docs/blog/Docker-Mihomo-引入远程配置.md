---
date: 2025-07-31 17:14:30
---
# Docker-Mihomo-引入远程配置

由于需要统一管理多设备上的配置文件，最近部署了一个Opengist，打算把整个配置文件都托管。

大部分clash客户端都自带了自动更新配置的功能，但是Docker mihomo似乎没法原生实现[issues](https://github.com/MetaCubeX/mihomo/issues/1536)，所以只能通过其他办法来实现了。

刚好部署了qinglong，就直接在上面搞了个脚本😂

## Opengist

- 安装[opengist](./NAS-DockerCompose分享.html#opengist)
- 新建`config.yaml`文件
- 获取`原始文件`url

## Qinglong
- 安装[qinglong](./NAS-DockerCompose分享.html#qinglong)
    - 记得映射mihomo配置文件的目录
- 脚本管理-新建脚本
- 新建定时任务`task download_mihomo_config.sh`

#### 脚本
- download_mihomo_config.sh
```sh
#!/bin/bash

# 下载配置文件
if curl -fsSL -o /mihomo/config/config.yaml "原始文件url"; then
  echo "✅ config.yaml 下载成功"
else
  echo "❌ config.yaml 下载失败"
  exit 1
fi

# 强制刷新 Mihomo 配置
if curl -s -X PUT "http://mihomo的ip和管理端口/configs?force=true" -H "Authorization: Bearer 密钥" -d '{"path": "", "payload": ""}'; then
  echo "✅ Mihomo 配置刷新成功"
else
  echo "❌ Mihomo 配置刷新失败"
  exit 1
fi

echo "🎉 脚本执行完成，无异常"
```

<PostComments/>