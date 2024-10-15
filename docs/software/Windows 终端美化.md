---
outline: deep
---

# Windows终端美化


## 一、powerShell + oh my posh
### 1、安装oh my posh
<font style="color:rgb(25, 27, 31);">oh-my-posh 是一个 Powershell 的主题项目，可以将 Powershell 美化成类似 ohmyzsh 的效果。安装 oh-my-posh 也很简单，运行下面的命令即可。</font><font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">posh-git</font><font style="color:rgb(25, 27, 31);"> 是一个在提示符中显示 git 仓库信息的包，建议同时安装。</font>

```plain
# 使用winget方式安装
winget install JanDeDobbeleer.OhMyPosh -s winget

# 使用scoop方式安装
scoop install https://github.com/JanDeDobbeleer/oh-my-posh/releases/latest/download/oh-my-posh.json
scoop install posh-git
```



> 安装过程
>

![](https://cdn.nlark.com/yuque/0/2024/png/40399471/1718155447304-a2dcdc56-2e5c-46ee-86b4-997c11ec4690.png)



> 查看是否安装成功
>

<font style="color:rgb(85, 86, 102);background-color:rgb(238, 240, 244);">安装后输入命令</font><font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">oh-my-posh</font><font style="color:rgb(85, 86, 102);background-color:rgb(238, 240, 244);">，看到帮助命令则表示安装成功</font>

```plain
PS C:\Users\23013> oh-my-posh
oh-my-posh is a cross platform tool to render your prompt.
It can use the same configuration everywhere to offer a consistent
experience, regardless of where you are. For a detailed guide
on getting started, have a look at the docs at https://ohmyposh.dev

Usage:
  oh-my-posh [flags]
  oh-my-posh [command]

Available Commands:
  cache       Interact with the oh-my-posh cache
  completion  Generate the autocompletion script for the specified shell
  config      Interact with the config
  debug       Print the prompt in debug mode
  disable     Disable a feature
  enable      Enable a feature
  font        Manage fonts
  get         Get a value from oh-my-posh
  help        Help about any command
  init        Initialize your shell and config
  notice      Print the upgrade notice when a new version is available.
  print       Print the prompt/context
  prompt      Set up the prompt for your shell (deprecated)
  toggle      Toggle a segment on/off
  version     Print the version

Flags:
  -c, --config string   config file path
  -h, --help            help for oh-my-posh
  -i, --init            init (deprecated)
  -s, --shell string    shell (deprecated)
      --version         version

Use "oh-my-posh [command] --help" for more information about a command.
PS C:\Users\23013>


```



> 安装成功后，打开新终端，输入下面的命令就可以显示主题
>

```plain
# 首先需要加载oh-my-posh模块和默认主题
oh-my-posh init pwsh | Invoke-Expression
# 默认主题一般不好看，不过有一大坨预配置主题可供挑选
Get-PoshThemes
# 找到喜欢的主题之后，打开新终端，用下面的命令就能应用主题了
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH/1_shell.omp.json" | Invoke-Expression
```

<font style="color:rgb(25, 27, 31);">当然这里还有很多其他主题可供选择，</font>[https://ohmyposh.dev/docs/themes](https://link.zhihu.com/?target=https%3A//ohmyposh.dev/docs/themes)<font style="color:rgb(25, 27, 31);">。如果你不喜欢这些主题，甚至还可以自己编写 ohmyposh 主题。</font>

<font style="color:rgb(25, 27, 31);"></font>

> 对所有终端生效
>

<font style="color:rgb(25, 27, 31);">在终端中配置的 oh-my-posh 只能在当前终端生效，为了让它能够在所有 Powershell 中永久生效，需要在配置文件中编辑。</font>

<font style="color:rgb(25, 27, 31);">在 Powershell 中运行以下命令，用 vscode 打开 Powershell 的配置文件，如果你没有 vscode，也可以改成 notepad 用记事本来编辑配置文件。</font>

```plain
code $PROFILE
```

<font style="color:rgb(25, 27, 31);">在配置文件中添加的所有命令，都将在每次打开 Powershell 时运行，这样一来配置就可以对所有 Powershell 窗口生效了。</font>

```plain
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH/1_shell.omp.json" | Invoke-Expression
```

<font style="color:rgb(25, 27, 31);">配置完毕后，打开一个新的终端，应当可以看到新终端也同时应用了我们刚才设置的主题，这样 oh-my-posh 就配置成功了。</font>

### 2、安装字体
<font style="color:rgb(77, 77, 77);">Oh My Posh 有一个 CLI 来帮助您选择和安装 Nerd 字体。</font><font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">此命令最好以管理员身份执行，以便在整个系统范围内安装字体。 如果您没有管理员权限，则可以通过添加标志来安装字体。 请注意，在使用某些应用程序时，这可能会产生副作用。</font><font style="color:rgb(77, 77, 77);">–user``</font>

```plain
oh-my-posh font install
```

<font style="color:rgb(77, 77, 77);">oh-my-posh官方推荐的字体为</font><font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">MesloLG Nerd Font</font><font style="color:rgb(77, 77, 77);">，所以选择</font><font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">Meslo</font><font style="color:rgb(77, 77, 77);">字体进行安装</font>

![](https://cdn.nlark.com/yuque/0/2024/png/40399471/1718195637713-b6f2a1b0-0b9d-430f-80b5-319c875b72cd.png)

<font style="color:rgb(77, 77, 77);">下载完成后如下图</font>

![](https://cdn.nlark.com/yuque/0/2024/png/40399471/1718195649573-4320e17f-ab6d-4aa0-80c3-bb6fee98942c.png)

你也可以选择其他字体进行下载。

配置字体的方式有两种：

命令行方式：通过快捷键CTRL + SHIFT + ,打开setting.json文件，然后对其进行相关设置

![](https://cdn.nlark.com/yuque/0/2024/png/40399471/1718195757607-d3708d4d-0bc2-481d-8670-b25bb78be9e2.png)

UI界面方式：打开Windows PowerShell–>设置–>windows PowerShell–>其他设置–>外观–>文本–>字体–>将字体选择为MesloGLM Nerd Font即可

### 3、主题配置
<font style="color:rgb(85, 86, 102);background-color:rgb(238, 240, 244);">oh-my-posh安装后，默认的主题位置为</font><font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">C:\用户\用户名\AppData\Local\Programs\oh-my-posh\themes</font><font style="color:rgb(85, 86, 102);background-color:rgb(238, 240, 244);">，如：</font><font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">C:\Users\23013\AppData\Local\Programs\oh-my-posh\themes</font>

#### 3.1 默认主题
> <font style="color:rgb(85, 86, 102);background-color:rgb(238, 240, 244);">默认的主题可在安装文件夹中找到。 可用 PowerShell 对主题进行初始化配置，配置的命令如下。</font>
>

```plain
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH/amro.omp.json" | Invoke-Expression
```

#### 3.2 更改PowerShell组织运行本地脚本的策略
> <font style="color:rgb(85, 86, 102);background-color:rgb(238, 240, 244);">PowerShell 能是阻止运行本地脚本。若要解决此问题，请将 PowerShell 设置为 仅要求使用 对远程脚本进行签名，或</font>[对配置文件进行签名](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_signing?view=powershell-7.3#methods-of-signing-scripts)<font style="color:rgb(85, 86, 102);background-color:rgb(238, 240, 244);">。</font>
>

<font style="color:rgb(77, 77, 77);">以管理员身份打开PowerShell，执行下面命令</font>

```plain
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
```



### 4、安装<font style="color:rgb(25, 27, 31);">Terminal-Icons</font>
<font style="color:rgb(25, 27, 31);">Terminal-Icons 是一个为 Powershell 显示文件类型图标的 Powershell 模块，显示的图标同样基于 nerd-fonts。不过刚才我们已经安装并在终端中使用了 nerd-fonts，所以放心安装就可以了。</font>

```plain
scoop intall terminal-icons
```

<font style="color:rgb(25, 27, 31);">安装完毕后，在终端中导入模块，再运行一下</font><font style="color:rgb(25, 27, 31);"> </font><font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">Show-TerminalIconsTheme</font><font style="color:rgb(25, 27, 31);"> </font><font style="color:rgb(25, 27, 31);">命令，就可以看到 Terminal-Icons 为文件类型显示图标的例子了。</font>

```plain
Import-Module -Name Terminal-Icons
Show-TerminalIconsTheme
```

<font style="color:rgb(25, 27, 31);">同样的，为了让所有终端都能生效，应该将下面一行添加到</font><font style="color:rgb(25, 27, 31);"> </font><font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">$PROFILE</font><font style="color:rgb(25, 27, 31);"> </font><font style="color:rgb(25, 27, 31);">中。这样，以后再使用</font><font style="color:rgb(25, 27, 31);"> </font><font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">dir</font><font style="color:rgb(25, 27, 31);"> </font><font style="color:rgb(25, 27, 31);">等命令显示文件的时候，都会显示出对应的图标。</font>

```plain
Import-Module -Name Terminal-Icons
```



### 5、安装z.lua
<font style="color:rgb(25, 27, 31);">z 是一个 linux 下知名的终端目录跳转插件，可以智能的帮助我们在多个目录中跳转。不过这个插件是用 shell 语言写成的，所以速度并不理想。因此就有了 z.lua 这个项目，是用 lua 脚本语言重新实现 z 的功能，速度更快，兼容性也更好。作者还是咱们知乎的大佬</font><font style="color:rgb(25, 27, 31);"> </font>[@韦易笑](https://www.zhihu.com/people/225cbdbbfac26810c6b71ce96f55de2f)<font style="color:rgb(25, 27, 31);">。</font>

<font style="color:rgb(25, 27, 31);">因为是用 lua 语言写成的，所以首先需要安装 lua 语言，这很简单，直接用 scoop 安装即可。</font>

```plain
scoop install lua
```

<font style="color:rgb(25, 27, 31);">然后需要下载 z.lua 项目，这里推荐直接用 git 将项目克隆到用户主目录下。</font>

```powershell
git clone https://github.com/skywind3000/z.lua.git $HOME/z.lua
```

<font style="color:rgb(25, 27, 31);">然后在</font><font style="color:rgb(25, 27, 31);"> </font><font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">$PROFILE</font><font style="color:rgb(25, 27, 31);"> </font><font style="color:rgb(25, 27, 31);">中添加下面一行，这样以后在使用终端的时候都可以用</font><font style="color:rgb(25, 27, 31);"> </font><font style="color:rgb(25, 27, 31);background-color:rgb(248, 248, 250);">z</font><font style="color:rgb(25, 27, 31);"> </font><font style="color:rgb(25, 27, 31);">命令来实现跳转了。</font>

```plain
Invoke-Expression (& { (lua $HOME/z.lua/z.lua --init powershell once enhanced) -join "`n" })
```

> <font style="color:rgb(25, 27, 31);">使用 z.lua</font>
>

<font style="color:rgb(25, 27, 31);">那么这个东西到底要怎么用呢？其实很简单。</font>

```plain
# 首先需要在终端中切换几次不同的目录，ab是两个路径不同的目录
cd a
cd b
# 然后z.lua就会记住切换的选择，下次直接输入目录名甚至一部分即可实现跳转
z a
z b
```

