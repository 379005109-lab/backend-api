# 🚀 LAF 平台部署配置

## ✅ 您的信息

- **GitHub 用户名**: 3780010199-lzb
- **Git 仓库地址**: https://github.com/3780010199-lzb/backend-api.git
- **分支**: main

---

## 📝 在 LAF 平台填写的配置

### 1. 基本配置

```
应用名称: backend-api

Git 仓库地址: https://github.com/3780010199-lzb/backend-api.git

分支: main

根目录: /
```

### 2. 构建配置

```
构建命令: npm install --production

启动命令: node server.js

端口: 5000
```

### 3. 环境变量（重要！必须配置）

点击 "添加环境变量"，逐个添加：

```
变量名: NODE_ENV
变量值: production

变量名: PORT  
变量值: 5000

变量名: MONGODB_URI
变量值: mongodb://root:q5rdw4tb@test-db-mongodb.ns-cxxiwxce.svc:27017/backend_db?authSource=admin
```

### 4. 资源配置（推荐值）

```
CPU 请求: 0.1 核
CPU 限制: 0.5 核

内存请求: 256Mi
内存限制: 512Mi

副本数: 2
```

### 5. 自动部署

✅ **务必勾选** "启用自动部署" 或 "Auto Deploy"

这样每次 git push 都会自动更新应用！

---

## 🎯 操作步骤

### 步骤 1: 确保 GitHub 仓库已创建

访问: https://github.com/3780010199-lzb/backend-api

如果显示 404，说明还没创建，请先创建仓库：
1. 访问 https://github.com/new
2. Repository name: `backend-api`
3. 选择 Public
4. 点击 Create repository

### 步骤 2: 推送代码到 GitHub

在终端运行：

```bash
cd /home/devbox/project
git push -u origin main
```

**如果提示需要认证**，您需要创建 Personal Access Token：
1. 访问: https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 复制生成的 Token
5. 推送时用 Token 作为密码

### 步骤 3: 在 LAF 平台部署

1. 回到 LAF 平台: https://laf.run/ （或您刚才的页面）
2. 点击 "+ 新建应用"
3. 选择 "从 Git 仓库导入"
4. 按照上面的配置填写
5. 特别注意：**必须配置环境变量**
6. ✅ 勾选 "启用自动部署"
7. 点击 "部署"

---

## ✅ 部署成功后

LAF 会自动：
- 拉取 GitHub 代码
- 安装 npm 依赖
- 构建 Docker 镜像
- 启动应用
- 提供访问域名

您可以：
- 查看实时日志
- 查看应用状态
- 查看资源使用情况

---

## 🔄 以后如何更新

```bash
cd /home/devbox/project

# 修改代码
# ... 编辑文件 ...

# 提交并推送
git add .
git commit -m "更新功能描述"
git push

# ✅ LAF 自动部署，无需任何手动操作！
```

---

## 📊 测试 API

部署成功后，LAF 会提供一个访问域名，例如：
- https://your-app.laf.run/health

测试：
```bash
curl https://your-app.laf.run/health
```

应该返回：
```json
{
  "success": true,
  "message": "服务运行正常",
  "timestamp": "..."
}
```

---

## 🎉 完成！

配置完成后，您就拥有了：
- ✅ 代码托管在 GitHub
- ✅ 自动化 CI/CD 部署
- ✅ 云端运行的后端 API
- ✅ 每次 push 自动更新

**再也不需要手动复制文件到 Pod 了！**
