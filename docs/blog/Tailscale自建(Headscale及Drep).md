# Tailscale自建(Headscale及Drep)

## Headscale安装

### 下载二进制文件

[https://github.com/juanfont/headscale/releases/](https://github.com/juanfont/headscale/releases/)

- 将下载好的二进制文件移动到`/usr/ local/bin/`目录下并改名名 `headscale`，然后进行部署准备：

  ```shell
  # 附加可运行属性
  chmod +x /usr/local/bin/headscale
  # 创建配置目录
  mkdir -p /etc/headscale
  # 创建证书和数据目录
  mkdir -p /var/lib/headscale
  # 创建空数据库
  touch /var/lib/headscale/db.sqlite
  ```

### 打开服务器端口

- 8080
- 9090

### 配置文件设置

- 下载示例配置文件存放到`/etc/headscale/` 目录下并改名 `config.yaml`，需要修改的配置项如下：

  ```yaml
  修改以下的节点信息
  server_url: http://XXX.XXX.XXX.XXX:8080  # 这里填写你的实际外网地址,域名或ip都可以
  listen_addr: 0.0.0.0:8080
  metrics_listen_addr: 0.0.0.0:9090
  ip_prefixes:
    - fd7a:115c:a1e0::/48
    - 10.1.0.0/16
  randomize_client_port: true
  # 修改对自己来说方便的DNS，可以保持默认
  dns_config:
  	nameservers:
  		- 223.5.5.5
  # 建议关闭Magic DNS，否则有可能造成客户端无法正常上网
  magic_dns: false
  # 修改Socket存储位置
  unix_socket: /var/run/headscale/headscale.sock
  ```

### 创建sock

  ```shell
  # 创建文件夹
  mkdir /var/run/headscale
  # 创建文件
  touch /var/run/headscale/headscale.sock
  ```

### 创建Headscale 用户

```shell
adduser --no-create-home --disabled-login --shell /sbin/nologin --disabled-password headscale
```

### 修改数据库的Owner

```shell
chown -R headscale:headscale /var/lib/headscale
```

### 测试运行

```shell
headscale serve
```

## 设置自启动

### 新建Service文件

```shell
touch /etc/systemd/system/headscale.service
```

### 配置内容

```properties
[Unit]
Description=headscale controller
After=syslog.target
After=network.target

[Service]
Type=simple
User=headscale
Group=headscale
ExecStart=/usr/local/bin/headscale serve
Restart=always
RestartSec=5

# 可选的权限和安全配置
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/var/lib/headscale /var/run/headscale
AmbientCapabilities=CAP_NET_BIND_SERVICE
RuntimeDirectory=headscale

[Install]
WantedBy=multi-user.target
```

### 自启动常用命令行

```shell
# 启动服务
systemctl start headscale
# 关闭服务
systemctl stop headscale
# 开机自启
systemctl enable headscale
# 查看状态
systemctl status headscale
```

## Headscale命名空间设置

### 创建命名空间

```shell
# <namespace>替换为你自定义的租户名称
headscale namespaces create <namespace>
# 列出所有命名空间
headscale namespaces list
```

## Nginx配置(如果是域名的话,ip则省略)

```nginx
server {                                                                                     listen       80;                                                
  server_name  域名;
  location / {                              
    proxy_pass http://127.0.0.1:8080;                                    
    proxy_read_timeout  600;                     
    proxy_send_timeout 600;                                      
}
```

## Headscale常用命令

```shell
# 显示节点列表
headscale nodes ls
# 删除节点
headscale nodes delete -i <id>
# mac系统 ping节点
/Applications/Tailscale.app/Contents/MacOS/Tailscale ping 100.64.0.2
```

## 自建Drep节点

### 登录节点服务器(跟Headscale同一台就没事了)

### 安装Tailscale

```shell
# 安装
curl -fsSL https://tailscale.com/install.sh | sh
# 注册节点
tailscale up --login-server=http://你自己的域名或ip:8080 --accept-dns=false
# 在headscale的服务器添加节点(跟Headscale同一台就直接执行)
headscale -n 命名空间 nodes register --key nodekey:上面这行命令返回结果的key
```

### 使用Docker Compose运行drep镜像

- 以下是`docker-drep.yaml`配置文件

  ```yaml
  version: '3.5'
  services:
    derper:
      container_name: derper
      image: fredliang/derper
      restart: always
      volumes:
        - ./cert:/cert
        - /var/run/tailscale/tailscaled.sock:/var/run/tailscale/tailscaled.sock
      ports:
        - 3478:3478/udp
        - 23479:23479
      environment:
        DERP_DOMAIN: 你的域名
        DERP_ADDR: ":23479"
        DERP_CERT_MODE: manual
        DERP_CERT_DIR: /cert
        DERP_VERIFY_CLIENTS: "true"
  ```

###  在`docker-drep.yaml`目录下运行

```
docker-compose up -d
```

### 在Headscale配置节点信息

- 配置文件`/etc/headscale/derp.yaml`

  ```yaml
  regions:
    901:
      regionid: 901
      regioncode: sh
      regionname: Tencent ShangHai
      nodes:
        - name: 901a
          regionid: 901
          hostname: '你的域名'
          stunport: 3478
          stunonly: false
          derpport: 23479
  ```

- 修改headscale配置`/etc/headscale/config.yaml`

  ```yaml
  derp:
    # List of externally available DERP maps encoded in JSON
    urls:
      - https://controlplane.tailscale.com/derpmap/default
  
    # Locally available DERP map files encoded in YAML
    #
    # This option is mostly interesting for people hosting
    # their own DERP servers:
    # https://tailscale.com/kb/1118/custom-derp-servers/
    #
    # paths:
    #   - /etc/headscale/derp-example.yaml
    paths:
      - /etc/headscale/derp.yaml
  
    # If enabled, a worker will be set up to periodically
    # refresh the given sources and update the derpmap
    # will be set up.
    auto_update_enabled: true
  
    # How often should we check for DERP updates?
    update_frequency: 24h
  ```

### 开放端口

- udp 3478

- tcp 23479

## 各终端加入节点方法

### Mac

```shell
# 下载官方Tailscale客户端(去其他区,例如美区)
# 浏览器打开
http://你的域名或ip:8080/apple
# 执行页面中的命令行
tailscale login --login-server http://你的域名或ip:8080
# 获取返回的命令
headscale -n 命名空间 nodes register --key nodekey:上面这行命令返回结果的key
# 到Headscale服务器上执行返回的命令
```

### Windows

```shell
# 下载官方Tailscale客户端(官网)
# 浏览器打开
http://你的域名或ip:8080/windows
# 执行页面中的命令行
tailscale login --login-server http://你的域名或ip:8080
# 获取返回的命令
headscale -n 命名空间 nodes register --key nodekey:上面这行命令返回结果的key
# 到Headscale服务器上执行返回的命令
```

### Linux

```shell
# 执行命令行
tailscale up --login-server=http://你的域名或ip:8080 --accept-routes=true --accept-dns=false
# 获取返回的命令
headscale -n 命名空间 nodes register --key nodekey:上面这行命令返回结果的key
# 到Headscale服务器上执行返回的命令
```

### iOS

```shell
# 下载官方Tailscale客户端(去其他区,例如美区)
# 设置-往下拉到Tailscale
# 如果之前打开过APP登录过,需要打开Reset Keychain
# 在最下方ALTERNATE COORDINATION SERVER URL中设置自己的Headscale地址(域名或ip:8080)
# 然后开启Tailscale应该会进入到自己的页面而非官方的授权页面
# 具体参考https://headscale.net/iOS-client/#configuring-the-headscale-url
```



<gitalk/>

