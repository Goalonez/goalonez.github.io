# iOS杭州市民卡交通码URL_Scheme快捷打开

## 参考地址

> [记一次扒 iOS URL Scheme 的经历](https://juejin.cn/post/7232846086833111099?searchId=2023092109074885F152DBB420B86E3C65)

## 根据原文章获取到交通码地址

```
{
  "url": "smkapp://scanCodeRide"
}
```

## Base64后得到URL Scheme

`smkapplication://ewogICJ1cmwiOiAic21rYXBwOi8vc2NhbkNvZGVSaWRlMiIKfQo=`

## 配置

- 下载小组件App（这个App太多了，就不具体推荐了。应该都有可以配置URL Scheme打开对应app的功能）
- 配置后经过测试无法达到预期效果
  - 能够直接打开`杭州市民卡`App
  - 但是不会直接打开交通码
  - 测试效果是随便进入一个页面，再返回，才会触发进入交通码的效果

## 长辈版

经过一番尝试，发现切换App版本到`长辈版`，就可以通过点击小组件直接打开App并且触发进入`交通码`页面。

<gitalk/>