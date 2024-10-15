---
outline: deep
---

# fnm-Node版本管理工具

### 1、安装
+ 假如安装scoop等包管理工具，可以直接通过 `scope install fnm` 下载安装。mac使用brew。
+ 直接下载 [fnm v1.32.0](https://github.com/Schniz/fnm/releases) 的可执行文件:
+ [Windows](https://github.com/Schniz/fnm/releases/download/v1.32.0/fnm-windows.zip)
+ [Linux](https://github.com/Schniz/fnm/releases/download/v1.32.0/fnm-linux.zip)
+ [macOS](https://github.com/Schniz/fnm/releases/download/v1.32.0/fnm-macos.zip)
+ [ARM 64](https://github.com/Schniz/fnm/releases/download/v1.32.0/fnm-arm64.zip)

### 2、配置
+ **bash,zsh**

在 ~/.bashrc、~/.zshrc(zsh)、~/.bash_profile(macOS) 文件添加以下一行代码:

`eval "$(fnm env --use-on-cd)"`

+ **Fish shell**

创建文件 ~/.config/fish/conf.d/fnm.fish, 并添加以下代码:

`fnm env --use-on-cd | source`

+ **PowerShell**

在 PowerShell Profile 文件添加以下代码:

--打开powerShell执行 <font style="color:#ED740C;">notepad $profile</font>

`fnm env --use-on-cd | Out-String | Invoke-Expression`

Powershell Profile 文件位置可以使用 echo $PROFILE 查看。

注意要直接使用 PowerShell 终端，不要在 cmd 终端中输入 powershell 命令的方式使用 PowerShell。

+ **Windows Command Prompt aka Batch aka WinCMD**

`FOR /f "tokens=*" %i IN ('fnm env --use-on-cd') DO CALL %i`

### 3、fnm使用
#### 3.1 用 fnm 安装 Node
```ruby
# 安装 LTS 版本
$ fnm install --lts

# 安装指定大版本的最新版本
$ fnm install 18

# 安装指定版本
$ fnm install 18.21.1
```

#### 3.2 通过 fnm 来指定 Node 版本
```ruby
# 使用系统版本
$ fnm use system

# 使用 fnm 所安装，且版本号为 18.21.1 的 Node 程序
$ fnm use 18.21.1

# 使用 fnm 所安装，且主版本号为 18 的最新版本的 Node 程序
$ fnm use 18
```

<font style="color:rgb(64, 64, 64);">只要用 fnm use <version> 指定后，每次启动 Shell 将会默认使用对应的 Node 版本。</font>

#### <font style="color:rgb(64, 64, 64);">3.3 设置别名</font>
```ruby
# 形式如：fnm alias <指定版本号> <别名>
$ fnm alias 18.21.1 v18

# 设置别名后，可以简化指令为：
$ fnm use v18
```

### 常用命令
```bash
# 命令帮助
fnm --help

# node 已安装列表
fnm list

# node 安装
fnm install 版本号(支持模糊/lts)

# node 卸载
fnm uninstall 版本号

# node 切换
fnm use 版本号

# node 设置默认
fnm default 版本号

# 执行fnm env查看
fnm env
```

### 
