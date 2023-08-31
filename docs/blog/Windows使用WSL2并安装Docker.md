# Windows使用WSL2并安装Docker.md

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

## 配置zsh(个人习惯,也可以直接使用bash)

### 安装zsh

```shell
sudo apt install zsh

chsh -s /bin/zsh
```

### 安装oh my zsh

```shell
wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh

sh install.sh
```

### 安装主题spaceship

```shell
git clone https://github.com/spaceship-prompt/spaceship-prompt.git "$ZSH_CUSTOM/themes/spaceship-prompt" --depth=1

ln -s "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"
```

### 安装常用插件

```shell
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

### 配置主题及插件

```shell
进入用户目录
cd ~/

#先ls,如果有直接配置,没有则新建配置文件
touch .zshrc

#找到主题设置行,修改主题为spaceship
ZSH THEME="spaceship"

#找到插件行,加入插件
plugins=(git zsh-syntax-highlighting zsh-autosuggestions)

#生效配置
source .zshrc
```

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

