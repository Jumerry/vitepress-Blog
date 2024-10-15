---
outline: deep
---

# Scoop操作命令

### 1、scoop简介

[Scoop](https://links.jianshu.com/go?to=https%3A%2F%2Fscoop.sh%2F)<font style="color:rgb(64, 64, 64);">是Windows的命令行安装程序，是一个强大的包管理工具。scoop会把软件下载、安装、配置等步骤全部帮你做完。</font>

### 2、scoop安装
```shell
# 启用远程脚本更改执行策略，选择" Y "
> Set-ExecutionPolicy RemoteSigned -Scope CurrentUser 
# 下载安装(不能以管理员身份运行PS)
> irm get.scoop.sh | iex
# 查看是否安装成功
> scoop help
Usage: scoop <command> [<args>]
Available commands are listed below.

Type 'scoop help <command>' to get more help for a specific command.

Command    Summary
-------    -------
alias      Manage scoop aliases
bucket     Manage Scoop buckets
cache      Show or clear the download cache
cat        Show content of specified manifest.
checkup    Check for potential problems
cleanup    Cleanup apps by removing old versions
config     Get or set configuration values
create     Create a custom app manifest
depends    List dependencies for an app, in the order they'll be installed
download   Download apps in the cache folder and verify hashes
export     Exports installed apps, buckets (and optionally configs) in JSON format
help       Show help for a command
hold       Hold an app to disable updates
home       Opens the app homepage
import     Imports apps, buckets and configs from a Scoopfile in JSON format
info       Display information about an app
install    Install apps
list       List installed apps
prefix     Returns the path to the specified app
reset      Reset an app to resolve conflicts
search     Search available apps
shim       Manipulate Scoop shims
status     Show status and check for new app versions
unhold     Unhold an app to enable updates
uninstall  Uninstall an app
update     Update apps, or Scoop itself
virustotal Look for app's hash or url on virustotal.com
which      Locate a shim/executable (similar to 'which' on Linux)
```

默认安装后，scoop在C:\Users\[user_name]\scoop目录。子目录中其他文件夹的含义如下：

+ apps——通过scoop安装的软件app都在里面，包括scoop自身。
+ buckets——管理软件的仓库，用于记录哪些软件可以安装、更新等信息，默认添加main仓库，可手动添加其他仓库或自建仓库。
+ cache——软件下载后安装包暂存目录。
+ persit——用于储存一些用户数据，不会随软件更新而替换。
+ shims——用于软链接应用，使应用之间不会互相干扰。

#### 2.1 将scoop安装到自定义目录
+ <font style="color:rgb(25, 27, 31);">打开 PowerShell</font>
+ <font style="color:rgb(25, 27, 31);">设置用户安装路径</font>

```powershell
$env:SCOOP='D:\Scoop' 
[Environment]::SetEnvironmentVariable('USERSCOOP', $env:SCOOP, 'User')
```

+ <font style="color:rgb(25, 27, 31);">设置全局安装路径（需要管理员权限）</font>

```powershell
$env:SCOOP_GLOBAL='D:\GlobalScoopApps' 
[Environment]::SetEnvironmentVariable('SCOOP_GLOBAL', $env:SCOOP_GLOBAL, 'Machine')
# 相当于在系统变量中设置： SCOOP_GLOBAL=D:\GlobalScoopApps；
# 默认是在C:\ProgramData\scoop。
```

+ <font style="color:rgb(25, 27, 31);">设置允许 PowerShell 执行本地脚本</font>

`Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

+ <font style="color:rgb(25, 27, 31);">安装 Scoop</font>

```ruby
# 然后下载安装 Scoop （如果使用默认安装路径则直接运行下面的命令）
iex (new-object net.webclient).downloadstring('https://get.scoop.sh')
# 或者使用下面的命令安装：
iwr -useb get.scoop.sh | iex
# 或者
iwr -useb get.glimmer.ltd | iex
# 或者
irm https://ghproxy.com/raw.githubusercontent.com/duzyn/scoop-cn/master/install.ps1 | iex
# 或者
irm https://cdn.jsdelivr.net/gh/duzyn/scoop-cn/install.ps1 | iex
```

+ 更换国内镜像源 [https://gitee.com/glsnames/scoop-installer](https://gitee.com/glsnames/scoop-installer)

```plain
# 更换scoop的repo地址
scoop config SCOOP_REPO "https://gitee.com/glsnames/scoop-installer"
# 拉取新库地址
scoop update
```

+ <font style="color:rgb(25, 27, 31);">使用 Scoop 安装 Aria2 ，Scoop 会自动调用 Aria2 进行多线程加速下载。安装完会自动启用(第一次安装会自动安装7zip)</font>

```powershell
scoop install aria2 
scoop config aria2-warning-enabled false
```

<font style="color:rgb(25, 27, 31);">与 Aria2 有关的设置选项：</font>

+ <font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">aria2-enabled</font><font style="color:rgb(25, 27, 31);">: 开启 Aria2 下载，默认</font><font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">true</font>
+ <font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">aria2-retry-wait</font><font style="color:rgb(25, 27, 31);">: 重试等待秒数，默认</font><font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">2</font>
+ <font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">aria2-split</font><font style="color:rgb(25, 27, 31);">: 单任务最大连接数，默认</font><font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">5</font>
+ <font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">aria2-max-connection-per-server</font><font style="color:rgb(25, 27, 31);">: 单服务器最大连接数，默认</font><font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">5</font><font style="color:rgb(25, 27, 31);"> </font><font style="color:rgb(25, 27, 31);">，最大</font><font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">16</font>
+ <font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">aria2-min-split-size</font><font style="color:rgb(25, 27, 31);">: 最小文件分片大小，默认</font><font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">5M</font>

<font style="color:rgb(25, 27, 31);">优化Aria2 设置，单任务最大连接数设置为 </font><font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">32</font><font style="color:rgb(25, 27, 31);">，单服务器最大连接数设置为 </font><font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">16</font><font style="color:rgb(25, 27, 31);">，最小文件分片大小设置为 </font><font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">1M</font>

```powershell
# aria2 在 Scoop 中默认开启
scoop config aria2-enabled true
# 关于以下参数的作用，详见aria2的相关资料
scoop config aria2-retry-wait 4
scoop config aria2-split 16
scoop config aria2-max-connection-per-server 16
scoop config aria2-min-split-size 4M
```

+ <font style="color:rgb(25, 27, 31);">使用 Scoop 安装 sudo ，如果要用管理员运行命令,无需用管理员打开cmd(or powershell) 直接在命令行前加一个sudo即可。</font>

```powershell
scoop install sudo
```

+ <font style="color:rgb(25, 27, 31);">scoop目录介绍</font>

![](https://cdn.nlark.com/yuque/0/2024/webp/40399471/1712729122632-d8eed3d2-bfcd-43bd-bf2d-3773f8c0eed6.webp)

<font style="color:rgb(145, 150, 161);">image-20230206215354961</font>

<font style="color:rgb(145, 150, 161);"></font>

+ <font style="color:rgb(25, 27, 31);">下载错误建议关闭 aria2</font>

```powershell
scoop config aria2-enabled false
# scoop config aria2-enabled true 开启
```

### 3、scoop常用命令
```shell
scoop help #查看帮助
scoop help <某个命令> # 具体查看某个命令的帮助

scoop install <app>   # 安装 APP
scoop uinstall <app>  # 卸载 APP

scoop list  # 列出已安装的 APP
scoop search # 搜索 APP
scoop status # 检查哪些软件有更新

scoop update # 更新 Scoop 自身
scoop update appName1 appName2 # 更新某些app
scoop update *  # 更新所有 app （前提是需要在apps目录下操作）

scoop bucket known #通过此命令列出已知所有 bucket（软件源）
scoop bucket add bucketName #添加某个 bucket

scoop cache rm <app> # 移除某个app的缓存

# 由于git依赖7zip，因此scoop自动下载并安装7zip，再安装git
Installed apps:
Name Version          Source Updated             Info
---- -------          ------ -------             ----
7zip 22.01            main   2023-06-06 10:49:04
git  2.41.0.windows.1 main   2023-06-06 10:49:30
```

#### <font style="color:rgb(25, 27, 31);">3.1初次安装 Scoop 后，建议安装的程序：</font>
```plain
# 但 scoop 进行全局安装时需要使用到 sudo 命令
scoop install sudo

# scoop下载程序时支持使用 aria2 来加速下载
scoop install aria2
```

#### 3.2安装卸载软件
```plain
# 安装之前，通过 search 搜索 APP, 确定软件名称
scoop search  xxx

# 安装 APP
scoop install AppName

# 安装特定版本的 APP；语法 AppName@[version]，示例
scoop install git@2.23.0.windows.1

# 卸载 APP 
scoop uninstall #卸载 APP
```

#### 3.3 更新
```plain
scoop update # 更新 Scoop 自身

scoop update appName1 appName2 # 更新某些app

# 更新所有 app （可能需要在apps目录下操作）
scoop update *

# 禁止某程序更新
scoop hold <app>
# 允许某程序更新
scoop unhold <app>
```

#### 3.4 清除缓存与旧版本
```plain
# 查看所有以下载的缓存信息
scoop cache show

# 清除指定程序的下载缓存
scoop cache rm <app>

# 清除所有缓存
scoop cache rm *

# 删除某软件的旧版本
scoop cleanup <app>

# 删除全局安装的某软件的旧版本
scoop cleanup <app> -g

# 删除过期的下载缓存
scoop cleanup <app> -k
```

#### 3.5 添加软件源 Bucket
<font style="color:rgb(25, 27, 31);">Scoop 可安装的软件信息存储在 Bucket（翻译为：桶）中，也可以称其为软件源。Scoop 默认的 Bucket 为 </font><font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">main</font><font style="color:rgb(25, 27, 31);"> ；官方维护的另一个 Bucket 为 </font><font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">extras</font><font style="color:rgb(25, 27, 31);">，我们需要手动添加。</font>

```plain
# bucket的用法
scoop bucket add|list|known|rm [<args>]
```

<font style="color:rgb(25, 27, 31);">添加 extras :</font>

```plain
scoop bucket add extras
```

<font style="color:rgb(25, 27, 31);">我们也可以添加第三方 bucket ，示例：</font>

```plain
scoop bucket add dorado https://github.com/h404bi/dorado
```

<font style="color:rgb(25, 27, 31);">并且明确指定安装此 bucket （软件源）中的的程序：</font>

```plain
scoop install dorado/<app_name>
# 下面是dorado中特有的软件，测试其是否添加成功
scoop search trash
```

<font style="color:rgb(25, 27, 31);">推荐的 Bucket（软件源）：</font>

+ <font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">extras</font><font style="color:rgb(25, 27, 31);">：Scoop 官方维护的一个仓库，涵盖了大部分因为种种原因不能被收录进主仓库的常用软件（在我看来是必须要添加的）。地址：</font>[lukesampson/scoop-extras](https://link.zhihu.com/?target=https%3A//github.com/lukesampson/scoop-extras/tree/master/bucket)
+ <font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">nirsoft</font><font style="color:rgb(25, 27, 31);">：是一个 NirSoft 开发的小工具的安装合集。NirSoft 制作了大量的小工具，包括系统工具、网络工具、密码恢复等等，孜孜不倦、持续更新。</font>
    - <font style="color:rgb(25, 27, 31);">Bucket 地址：</font>[kodybrown/scoop-nirsoft](https://link.zhihu.com/?target=https%3A//github.com/kodybrown/scoop-nirsoft)
    - <font style="color:rgb(25, 27, 31);">NirSoft 官网地址：</font>[NirSoft](https://link.zhihu.com/?target=http%3A//www.nirsoft.net/)

<font style="color:rgb(25, 27, 31);"></font>

+ <font style="color:rgb(25, 27, 31);">dorado（添加了一些国内的app，比如 qqplayer ️）</font>[h404bi/dorado](https://link.zhihu.com/?target=https%3A//github.com/h404bi/dorado)
+ <font style="color:rgb(25, 27, 31);">ash258：</font>[Ash258/scoop-Ash258](https://link.zhihu.com/?target=https%3A//github.com/Ash258/scoop-Ash258)
+ <font style="color:rgb(25, 27, 31);">java：添加后可以通过它安装各种 jdk 、 jre</font>
+ <font style="color:rgb(25, 27, 31);">nerd-fonts ：包含各种字体</font>

```plain
# 先添加bucket
scoop bucket add extras
scoop bucket add nirsoft
scoop bucket add dorado https://github.com/h404bi/dorado
scoop bucket add Ash258 'https://github.com/Ash258/Scoop-Ash258.git'
scoop bucket add nerd-fonts
# 对于开发人员，可添加下面的两个
scoop bucket add java
scoop bucket add versions
```

