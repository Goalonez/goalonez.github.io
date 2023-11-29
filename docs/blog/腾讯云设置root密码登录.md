# 腾讯云设置密码或密钥登录

## 密码登录

```bash
//设置密码
sudo passwd root

//修改配置
sudo vi /etc/ssh/sshd_config

PermitRootLogin 这项 将其改为 yes

//重启
sudo service ssh restart
```

## 密钥登录

```bash
//进入密钥文件夹
cd /home/ubuntu/.ssh/

//复制生成的密钥
cp -i authorized_keys /root/.ssh/

//设置密钥文件权限
sudo chmod -R 700 密钥路径

//重启
sudo service ssh restart
```