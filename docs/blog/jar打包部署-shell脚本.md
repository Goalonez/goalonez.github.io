# jar打包部署-shell脚本

## 原流程

由于安全限制，开发环境与生产环境的网络隔离，只能通过U盘传递文件。

初期部署流程极度麻烦

- maven打包项目
  - mvn clean package -Dmaven.test.skip=true -Pprod
- docker镜像构建
  - docker build -t 项目名:版本 .
- docker镜像持久化
  - docker save -o 项目名.tar 项目名:版本
- U盘传递
- 加载docker镜像
  - docker load -i 项目名.tar
- docker镜像打标签
  - docker tag 镜像id 镜像仓库地址/镜像名
- 推送docker镜像
  - docker push 镜像仓库地址/镜像名
- k8s部署

## 脚本编写

暂时没有找到合适的自动化部署方案。本来想通过jenkins实现，但感觉在这个流程下不会有太大优化空间，并且也没有多余机器。

于是抽时间编写了一下脚本，稍微减少了一点敲命令行的时间。

- 在win下需要配合wsl2的docker来打包。
- 脚本中如果直接用wsl命令会导致后续脚本命令失效，因为这时候其实会打开一个新终端，需要使用`wsl docker --version`才可以保持脚本命令继续运行。
- 在wsl中需要使用`wsl docker image ls`类似的，在命令行前加`wsl`，所以在判断系统的时候做了区分。

打包完成后会在docker目录生成docker镜像tar包和推送镜像脚本。

```shell
#!/bin/bash

# 定义变量
APP_NAME="项目名"
# 获取时间戳当包版本
DOCKER_IMAGE_TAG=$(date +%s)
DOCKER_IMAGE_NAME="$APP_NAME:$DOCKER_IMAGE_TAG"
DOCKER_IMAGE_FILE="$APP_NAME.tar"

# 打出jar包
if ! mvn clean package -Dmaven.test.skip=true -Pprod; then
  # mvn命令执行失败，输出错误信息并退出脚本
  echo "mvn command failed"
  exit 1
fi

# 如果是win，需要先进入wsl,如果是mac则不做操作
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "This is a Mac system,Do nothing"
	# mac下直接用docker命令
  docker_command="docker"
elif [[ "$OS" == "Windows_NT" ]]; then
	# win的wsl下需要使用wsl docker命令
  docker_command="wsl docker"
  # 直接使用wsl命令会打开新终端，导致后续脚本命令无法执行（注意！）
  wsl docker --version
else
  # 系统识别失败，输出错误信息并退出脚本
   echo "system recognition failed"
   exit 1
fi

# 执行docker build命令
if ! $docker_command build -t $DOCKER_IMAGE_NAME .; then
  # docker build命令执行失败，输出错误信息并退出脚本
  echo "docker build command failed"
  exit 1
fi

# 执行docker save命令
if ! $docker_command save -o "./docker/$DOCKER_IMAGE_FILE" $DOCKER_IMAGE_NAME; then
  # docker save命令执行失败，输出错误信息并退出脚本
  echo "docker save command failed"
  exit 1
fi

# 执行docker rm命令
if ! $docker_command image rm $DOCKER_IMAGE_NAME; then
  # docker rm命令执行失败，输出错误信息并退出脚本
  echo "docker image rm command failed"
  exit 1
fi

# 进入docker目录
cd docker || exit 1

# 生成推送文件
rm pushImage.sh
touch pushImage.sh
chmod +x pushImage.sh

# 生成推送文件
cat << EOF > pushJzsImage.sh
#!/bin/bash

# 加载镜像
if ! docker load -i $DOCKER_IMAGE_FILE; then
  echo "docker load command failed"
  exit 1
fi


# 获取镜像ID
if ! IMAGE_ID=\$(docker inspect --format='{{.Id}}' $DOCKER_IMAGE_NAME); then
  echo "docker inspect command failed"
  exit 1
fi


# 打Tag
if ! docker tag "\$IMAGE_ID" 仓库地址/$DOCKER_IMAGE_NAME; then
  echo "docker tag command failed"
  exit 1
fi

# 推送镜像
if ! docker push 仓库地址/$DOCKER_IMAGE_NAME; then
  echo "docker push command failed"
  exit 1
fi

docker rmi -f "\$IMAGE_ID"

rm $DOCKER_IMAGE_FILE
EOF

# 如果是win，退出wsl,如果是mac则不做操作
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "This is a Mac system,Do nothing"
elif [[ "$OS" == "Windows_NT" ]]; then
  # 退出wsl
  exit
else
  # 系统识别失败，输出错误信息并退出脚本
  echo "system recognition failed"
  exit 1
fi
```

