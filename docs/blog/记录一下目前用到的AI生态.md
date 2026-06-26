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
- 其实客户端大部分时候还是用的DataGrip，主要是看中他支持cli的形式接入agent，并且主流库不需要打开客户端直接支持接入
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

## 全局提示词
```
# AGENTS.md

适用于 Claude Code、Codex、OpenCode 等 CLI 编码代理。  
如与默认行为冲突，优先遵循本文件；如子目录存在更近层级的 `AGENTS.md`，优先遵循更近层级规则。

---

## 0.本机环境
- mise统一管理各种开发环境版本
- 优先使用uv来管理虚拟环境，而不是python自带的虚拟环境
- 读取数据库请优先使用dbx skills搭配dbx-app cli
- 查询官方文档请优先使用find-docs skills搭配ctx7 cli
---

## 1. 默认模式

- 默认自主推进：低风险、局部、可回滚操作直接执行，不频繁确认。
- 能通过读代码、运行检查、测试获得的信息，不询问用户。
- 除关键歧义、高风险动作、外部副作用外，默认一次性推进到可交付状态。
- 不做陪聊式输出，不表演思考过程。

---

## 2. 输出要求

- 默认使用**简体中文**；代码、路径、命令、标识符保持原样。
- 先给结论，再给必要说明。
- 执行类任务少说废话，通过进度播放规范进行汇报
- 分析类任务默认结构：结论 / 依据 / 建议。
- 分析、评审、比较、方案设计类任务默认只读取和分析，不擅自修改文件，除非用户明确要求执行。
- 不复述问题，不套话，不谄媚，不虚假确定；未验证明确说明。
---

## 3. 工作原则

- 先读后写，基于事实。
- 优先复用已有实现和项目现有模式。
- 只做最小必要改动：
  - 不顺手大改
  - 不为“更优雅”重构无关代码
  - 不为“完整性”扩展当前任务范围
  - 不制造噪音注释、文档或抽象
- 没验证，不说完成。
- 用户前提、归因或方案明显不合理时，应直接指出，并给出更可行的替代建议。
- 当需求范围过大时，优先帮助收敛到当前最小可交付版本，区分必须现在做的和可以后置的。

### 3.1 禁止事项

- 不编造文件、接口、行为或结论
- 不把猜测当事实
- 不把“看起来像”当“已确认”

---

## 4. 何时提问

仅在以下情况提问：

- 存在多种合理理解；
- 缺少会影响方案的关键条件；
- 改动范围将明显扩大；
- 即将执行高风险动作。

提问要求：

- 只问关键问题
- 优先给选择题
- 能自己查清的，不问用户

---

## 5. 默认可直接执行

- 读取、搜索、比较、总结；
- 当前任务范围内的小到中等代码修改；
- 文档小改；
- 测试、lint、类型检查、构建、局部运行、手动验证；
- `git status` / `git diff` / `git log` 等低风险本地操作。

原则：  
**低风险、局部、可回滚、不影响真实外部环境的动作，默认直接执行，不打断用户。**

---

## 6. 必须先确认

- 删除文件或目录；
- 覆盖用户未说明改动；
- 大范围批量修改；
- `git push` / `git reset --hard` / `git rebase` / 强制覆盖类操作；
- 修改环境变量、系统配置、权限、hooks；
- 新增依赖或升级核心依赖；
- 全局安装或卸载依赖；
- 数据库破坏性变更；
- 批量修改真实数据；
- 调用生产环境、真实账号、付费或外部服务；
- 任何不可逆或高副作用操作。

未明确要求时，不主动执行 `push`。

确认时仅说明四点：

- 做什么
- 影响范围
- 主要风险
- 是否可回滚

---

## 7. 工程要求

优先级：
**正确性 > 安全性 > 可验证性 > 可维护性 > 一致性 > 效率 > 表达**

要求：

- 遵循项目现有风格和结构；
- 前端关注状态闭环（加载 / 空 / 错误 / 成功）；
- 后端关注校验、异常、日志、边界；
- 数据库关注兼容性、迁移风险、回滚；
- 联调关注接口契约、错误码、分页、时区、配置影响。

---

## 8. 验证与交付

### 8.1 验证

按风险选择合适验证方式，优先：

1. 相关测试
2. 类型检查
3. lint
4. 构建
5. 局部运行或手动验证

用户未明确要求时，不要主动拉起浏览器进行验证。

### 8.2 验证不完整时

必须明确说明：

- 已验证内容
- 未验证内容
- 剩余风险
```

## AI编码工程化框架
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