---
date: 2026-06-26 16:08:49
---
# 记录一下目前用到的AI生态
## 客户端
### Codex App
- 目前通过官方授权登录 + 接入自己的api使用
    - 这样既能使用插件生态、远程控制等功能，也能使用自己的号池或者接入其他模型
![](assets/记录一下目前用到的AI生态-202606261528.png)

### ChatGPT
- 主要是用iOS端，通过移动端远程控制codex
![](assets/记录一下目前用到的AI生态-202606261529.png)
### [CC Switch](https://github.com/farion1231/cc-switch)
- 快速切换配置
- 统一管理多个agent的mcp、skills、全局提示词、会话记录
- 其他选择
    - [AI Toolbox](https://github.com/coulsontl/ai-toolbox)
![](assets/记录一下目前用到的AI生态-202606261533.png)
### [Kelivo](https://github.com/Chevey339/kelivo)
- 纯聊天客户端
- 支持mcp，例如可以把滴答清单mcp接入来编排TODO List
- 搜索引擎支持接入grok或者自己部署的[SearXNG](./NAS-DockerCompose分享.html#searxng)
- 目前没有找到一个完美支持多端同步的客户端
- 其他选择
    - [Cherry Studio](https://github.com/CherryHQ/cherry-studio)
    - [LobeHub](https://github.com/lobehub/lobehub)
    - [Open WebUI](https://github.com/open-webui/open-webui)
    - [HaloWebUI](https://github.com/ztx888/HaloWebUI)
    - [DEEIX](https://github.com/DEEIX-AI/DEEIX-Chat)
![](assets/记录一下目前用到的AI生态-202606261536.png)
### [DBX](https://github.com/t8y2/dbx)
- 支持[mcp](https://github.com/t8y2/dbx/blob/main/packages/mcp-server/README.md#%E4%B8%AD%E6%96%87%E8%AF%B4%E6%98%8E)和[cli](https://github.com/t8y2/dbx/blob/main/packages/cli/README.md)的方案接入到agent，可以让agent直接去稳定查询数据库
- 其实客户端大部分时候还是用的Datagrip，主要是看中他支持cli的形式接入agent，并且主流库不需要打开客户端直接支持接入
- 目前官方还没出skills,所以自己根据官方文档让agent生成了一份：[dbx-readonly-cli](https://github.com/Goalonez/dbx-readonly-cli)
- 其他选择
    - [universal-db-mcp](https://github.com/Anarkh-Lee/universal-db-mcp)

![](assets/记录一下目前用到的AI生态-202606261539.png)

## CLI
### Claude Code
- 体验最好，三方生态适配度和优先级都感觉高一些
### Codex
- CLI用得比较少，感觉细节上比较粗糙，一般codex就直接用客户端了，起码切换会话方便，可视化也舒服点
### OpenCode
- 切换模型方便
- 不过现在一般只拿来处理非coding场景

## 服务

> 对应docker compose可以从[NAS-DockerCompose分享](./NAS-DockerCompose分享.html)页面获取

### [CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI)
- 自用的号池反代
![](assets/记录一下目前用到的AI生态-202606261619.png)

### [Axonhub](https://github.com/looplj/axonhub)
- 自用的AI渠道聚合网关
- 省去本地配置改来改去的麻烦，可以把各种渠道的api都聚合起来统一出口，也能查看具体的请求记录
- CLIProxyAPI不直接对外提供api，通过Axonhub统一分发
![](assets/记录一下目前用到的AI生态-202606261617.png)
### [New API](https://github.com/QuantumNous/new-api)
- 主要用于对外分发api给朋友
    - 将Axonhub里的渠道接入New API来统一分发
- 其他选择
    - [sub2api](https://github.com/Wei-Shaw/sub2api)
![](assets/记录一下目前用到的AI生态-202606261621.png)
### [Hermes](https://github.com/NousResearch/hermes-agent)
- 私人agent
- 目前接入deepseek-v4-flash也不错，性价比高，虽然实际效果不如gpt
- 感觉任务执行其实不如openclaw，但是相对来说稳定点，以前用openclaw最大的感触就是更新完版本就崩，然后浪费token修bug
- 可以跑个docker[KasmVNC](https://github.com/kasmtech/KasmVNC)用CDP协议给hermes接入
![](assets/记录一下目前用到的AI生态-202606261625.png)

## MCP
### [滴答清单mcp](https://help.dida365.com/articles/7438132116019216384)
- 让Kelivo直接操作滴答清单
### ~~[chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)~~
- 控制浏览器
### ~~[universal-db-mcp](https://github.com/Anarkh-Lee/universal-db-mcp)~~
- 接入各种类型的数据库

## Skills
### [docx](https://github.com/anthropics/skills)
- 处理word
### [pdf](https://github.com/anthropics/skills)
- 处理pdf
### [pptx](https://github.com/anthropics/skills)
- 处理ppt
### [xlsx](https://github.com/anthropics/skills)
- 处理excel
### [skill-creator](https://github.com/anthropics/skills)
- 创建skills(codex自带了)
### [karpathy-guidelines](https://github.com/forrestchang/andrej-karpathy-skills)
- 编码规范
### [dbx-readonly-cli](https://github.com/Goalonez/dbx-readonly-cli)
- 搭配DBX的CLI使用，默认只读数据库
### [defuddle](https://github.com/kepano/obsidian-skills)
- 用于Obsidian
### [json-canvas](https://github.com/kepano/obsidian-skills)
- 用于Obsidian
### [obsidian-bases](https://github.com/kepano/obsidian-skills)
- 用于Obsidian
### [obsidian-cli](https://github.com/kepano/obsidian-skills)
- 用于Obsidian
### [obsidian-markdown](https://github.com/kepano/obsidian-skills)
- 用于Obsidian
### [grill-me](https://github.com/mattpocock/skills)
- 进行采访式问答进行需求明确
### [playwright-cli](https://github.com/microsoft/playwright-cli)
- 控制浏览器，搭配Playwright CLI使用
### [frontend-dev](https://github.com/MiniMax-AI/skills)
- 前端
### [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- 前端
### [find-docs](https://github.com/upstash/context7)
- 搭配context7的CLI使用
## AI编程工程框架
### [Trellis](https://github.com/mindfold-ai/Trellis)
- 基础用法
    - trellis init初始化一下项目
    - 默认会生成一个00-bootstrap-guidelines任务，直接跟agent说完成这个任务，会默认生成好基础规范
    - 开发新需求就是用trellis-brainstorm规划一下，落地prd（或者自然语言也行，会自动触发，小需求会自动跳过，不会出现改点小问题都完整跑一遍流程的情况）
    - 任务完成后用trellis-finish-work收尾一下任务状态（或者自然语言也行，会自动触发）
- 其他也用了一些，目前还是比较喜欢这个，对团队共享来说也比较友好

## 建议
>在选择工具的时候最好还是优先选择用户量大的产品，在AI极速迭代的情况下，很多产品可能初期保持频繁的更新，也会有很多亮点创新，但是长期下来，相对于用户体量大的产品来说，可能就很难跟上整体生态节奏。

<PostComments/>