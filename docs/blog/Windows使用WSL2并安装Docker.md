# Windows使用WSL2并安装Docker

## 安装WSL2

### 检查是否开启虚拟化

- 任务管理器 -> 性能 -> CPU -> 右下角 虚拟化:已启用
- 未开启则进入BIOS开启VT

### 启动Windows子系统(二选一)

#### 可视化操作

- 打开「控制面板」，进入「程序和功能」。
- 点击「启用或关闭 Windows 功能」。
- 勾选「适用于 Linux 的 Windows 子系统」。
- 勾选「虚拟机平台」。
- 点击「确定」即可。

#### 命令行操作

```shell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

### 更新WSL

```shell
wsl --update
```

- 可能需要先install

```shell
wsl --install
```

### 设置默认版本位WSL2

```shell
wsl --set-default-version 2
```

### 下载Linux子系统

- 打开`Microsoft Store`，搜索`Ubuntu`，下载

- 下载完成后打开，根据提示配置好账号密码

### 这时候应该可以直接使用wsl命令进入linux系统了

```shell
wsl
```

## WSL2使用Clash代理

### 在.bashrc或者.zshrc配置文件中设置

```
hostip=$(cat /etc/resolv.conf |grep -oP '(?<=nameserver\ ).*')
export https_proxy="http://${hostip}:7890"
export http_proxy="http://${hostip}:7890"
export all_proxy="socks5://${hostip}:7890"
```

## 配置Zsh(个人习惯,也可以直接使用bash)

具体可以参考Blog

> [Zsh配置](./Zsh配置)

## 安装Dcoker

### 安装

```shell
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

### 加入用户组

```shell
#添加docker用户组
sudo groupadd docker
#将登陆用户加入到docker用户组中
sudo gpasswd -a $USER docker
#更新用户组
newgrp docker
```



<gitalk/>
