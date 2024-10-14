# git常用命令
下面是常用的 Git 命令列表：

1. 初始化一个新的 Git 仓库：
   ```
   git init
   ```

2. 克隆（Clone）一个远程仓库到本地：
   ```
   git clone [远程仓库 URL]
   ```

3. 添加文件到暂存区（Stage）：
   ```
   git add [文件名]
   
   要撤销（取消或移除）已经添加到暂存区的文件更改，可以使用以下命令：
   git restore --staged [文件名]
   ```
   
4. 提交文件到本地仓库：
   ```
   git commit -m "提交说明"
   ```

5. 查看当前文件的状态：
   ```
   git status
   ```

6. 查看文件更改的差异：
   ```
   git diff [文件名]
   ```

7. 查看提交日志：
   ```
   git log
   ```

8. 切换到不同的分支：
   ```
   git checkout [分支名]
   
   检查当前所在的分支：
   git branch
   ```
   
9. 创建并切换到新的分支：
   ```
   git checkout -b [新分支名]
   ```

10. 合并指定分支到当前分支：
    ```
    git merge [分支名]
    ```

11. 删除指定分支：
    ```
    git branch -d [分支名]
    ```

12. 拉取远程仓库的更新：
    ```
    git pull
    
    要从远程仓库拉取（pull）master分支的更新，可以使用以下命令：
    git pull origin master
    
    这将从名为"origin"的远程仓库拉取最新的master分支的代码更新到你的本地仓库。如果你正在当前所在的分支上工作，并且想将master分支的更新合并到当前分支，可以在拉取更新之后使用git merge命令：
    git merge origin/master
    ```
    
13. 推送本地提交到远程仓库：
    ```
    git push
    ```

14. 创建一个轻量级标签（Tag）：
    ```
    git tag [标签名]
    ```

15. 列出所有标签：
    ```
    git tag
    ```

16. 切换到指定标签的提交：
    ```
    git checkout [标签名]
    ```

17. 撤销文件在暂存区的修改：
    ```
    git restore --staged [文件名]
    ```

18. 撤销对文件的修改（恢复到上一次提交的状态）：
    ```
    git restore [文件名]
   ```

这些是常用的 Git 命令，你可以根据需要使用它们来管理你的代码仓库。

