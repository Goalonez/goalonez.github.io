# MacOS单独调用IDEA的文本对比工具.md

## 命令

```shell
open -na "/Users/你的用户名/Applications/IntelliJ IDEA Ultimate.app/Contents/MacOS/idea" $wait --args diff
```

## 别名

为了方便使用可以在终端配置中添加别名

```shell
alias ideadiff='open -na "/Users/goalonez/Applications/IntelliJ IDEA Ultimate.app/Contents/MacOS/idea" $wait --args diff' 
```

## 其他系统

参考地址
[命令行打开文本对比工具](https://www.jetbrains.com/help/idea/2024.1/command-line-differences-viewer.html#macos)

[命令行脚本配置](https://www.jetbrains.com/help/idea/2024.1/working-with-the-ide-features-from-command-line.html)