export default `--------------------------------------------
### 本脚本内容会存储在本地，可按自己需要随意修改 ###
##### 可以先组织好多行命令，选择多行批量执行  #####
--------------------------------------------

# 您的工作区












--------------------------------------------

# 切换项目目录
  cd /Users/stevenchen/gerrit/designercenter
  cd /Users/stevenchen/gerrit/businesssystem

--------------------------------------------

# npm
  # 项目初始安装
  npm config set @tumax:registry http://192.168.1.69:4873
  npm i --registry=http://npm.tumax.we.com/
  # 安装指定包
  npm i three --save --registry=http://npm.tumax.we.com/ --save
  # 开发构建
  npm run start

--------------------------------------------

# gerrit
  # 提审相关
  git commit --amend
  git push origin HEAD:refs/for/release/3.8.0
  # 经过gerrit直接推送到gitlab（要有权限）
  git push origin HEAD:refs/heads/feature/3.8.0-feature-name
  # 上面的命令等同于 
  git push origin

--------------------------------------------

# git常用命令
  git pull
  git add .
  git commit -m 'update'
  git push origin
  # 分支操作
  git branch 分支名 # 新建分支
  git branch # 查看当前所有分支
  git checkout 分支名 # 检出分支
  git checkout -b 分支名 # 创建并切换分支
  git checkout commitId 文件名 #（文件路径下的文件名） 还原这个文件到对应的commitId的版本
  git branch -v # 查看分支以及提交hash值和commit信息
  git merge 分支名 # 把该分支的内容合并到现有分支上
  git branch -d 分支名 # 删除分支
  git branch -D 分支名 # 强制删除 若没有其他分支合并就删除 d会提示 D不会
  git branch -m 旧分支名 新分支名 # 修改分支名
  git branch -M 旧分支名 新分支名 # 修改分支名 M强制修改 若与其他分支有冲突也会创建(慎用)
  git branch -r # 列出远程分支(远程所有分支名)
  git branch -a # 查看远程分支(列出远程分支以及本地分支名)
  git fetch # 更新remote索引
  git push -u origin 分支名 # 将本地分支推送到origin主机，同时指定origin为默认主机，后面就可以不加任何参数使用git push 也可解决 git建立远程分支关联时出现fatal ... upstram的问题
  git push --set-upstream origin master # The current branch master has no upstream branch
  # stash
  git stash # 把暂存区的内容 暂时放在其他中 使暂存区变空
  git stash list # 查看stash了哪些存储
  git stash pop # 将stash中的内容恢复到当前目录，将缓存堆栈中的对应stash删除
  git stash apply # 将stash中的内容恢复到当前目录，不会将缓存堆栈中的对应stash删除
  # tag 
  git tag # 查看列出所有打过的标签名
  git tag -d 标签名 # 删除对应标签
  git tag 标签名字 # 在当前仓库打个标签
  git tag foo -m "message" # 在当前提交上，打标签foo 并给message信息注释
  git tag 标签名 哈希值 -m "message" # 在某个哈希值上打标签并且写上标签的信息
  git tag foo HEAD~4 # 在当前提交之前的第4个版本上 打标签foo
  git push origin --tags # 把所有打好的标签推送到远程仓库
  git push origin :refs/tags/tag-name # 删除远程仓库的标签
  # reset
  git reset HEAD~2 --hard // 回撤2步
  git reset --files // 从仓库回撤到暂存区
  git reset HEAD // 回撤暂存区内容到工作目录
  git reset HEAD --soft 回撤提交到暂存区
  git reset HEAD --hard // 回撤提交 放弃变更 (慎用)
  git reset HEAD^  // 回撤仓库最后一次提交
  git reset --hard commitid // 回撤到该次提交id的位置
  git push -f -u origin 分支名 所有内容都回撤完了 将回撤后的操作强制推送到远程分支
  # 子模块
  git clone --recursive https://github.com/example/example.git
  # 添加子模块
  git submodule add -f http://git.xxxx/xxx/ZHM_Web.git Submodules/ZHM_Web
  git submodule --init --recursive
  git submodule update
  git submodule foreach git pull
  git submodule foreach git checkout master

--------------------------------------------

# 日常
  ls # 查看当前路径下面的所有文件名
  ls 文件夹名 # 查看对应文件夹中的内容
  ls -l # 拉出最近git提交记录以及对应修改的文件名
  ls -l -a # 拉出最近git提交记录以及对应修改的文件名，隐藏的文件也会显示
  touch a # 创建一个a文件
  echo 1234 >> a # 把1234这个内容放入a文件
  cat a # 打开a文件 读取出a文件中的内容
  mkdir test # 创建test文件夹
  rm 文件名 # 删除文件
  pwd # 打印当前工作路径

--------------------------------------------

# 服务器登录
  ssh root@192.168.1.33
  # 退出登录
  exit

# 机器间拷贝文件
  scp -r ./build root@192.168.1.33:/usr/local/

--------------------------------------------

# 生成sshkey
  git config --global user.name "xxx"
  git config --global user.email "xxx@corp.to8to.com"
  # 执行后enter几次即可，不用输入密码
  ssh-keygen -t rsa -C "xxx@corp.to8to.com" 
  # 读取公钥
  cat ~/.ssh/id_rsa.pub
  # 读取git设置
  git config --global user.name
  git config --global user.email



`
