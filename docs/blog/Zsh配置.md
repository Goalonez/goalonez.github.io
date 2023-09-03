

# Zsh配置

## 安装Zsh

```shell
sudo apt install zsh

chsh -s /bin/zsh
```

## 安装Oh My Zsh

```shell
wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh

sh install.sh
```

## 安装主题spaceship

```shell
git clone https://github.com/spaceship-prompt/spaceship-prompt.git "$ZSH_CUSTOM/themes/spaceship-prompt" --depth=1

ln -s "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"
```

## 安装常用插件

```shell
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

## 配置主题及插件

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



<git-talk/>