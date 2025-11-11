# 📝 GitHub 连接指南

## 快速推送代码到 GitHub

### 方法 1：使用自动脚本（推荐）

```bash
cd /home/devbox/project
./push-to-github.sh
```

按提示输入您的 GitHub 用户名即可。

---

### 方法 2：手动推送

```bash
cd /home/devbox/project

# 替换 YOUR_USERNAME 为您的 GitHub 用户名
git remote add origin https://github.com/YOUR_USERNAME/backend-api.git

# 推送代码
git push -u origin main
```

---

## 🔐 如果遇到认证问题

### GitHub 要求使用 Personal Access Token

如果推送时提示需要密码，您需要：

1. **创建 Personal Access Token**：
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 勾选权限：`repo`（所有仓库权限）
   - 点击 "Generate token"
   - **复制生成的 Token**（只显示一次！）

2. **使用 Token 推送**：
   ```bash
   # 使用 Token 作为密码
   git push -u origin main
   
   # 用户名：您的 GitHub 用户名
   # 密码：粘贴刚才复制的 Token
   ```

---

## 🌐 在 LAF 平台配置

推送成功后，返回 LAF 平台：

### 1. 点击 "+ 新建应用"

### 2. 选择 "从 Git 仓库导入"

### 3. 填写配置：

```
Git 仓库地址: https://github.com/YOUR_USERNAME/backend-api.git

分支: main

根目录: /

构建命令: npm install --production

启动命令: node server.js

端口: 5000
```

### 4. 配置环境变量（重要！）：

点击 "添加环境变量"，添加以下内容：

```
变量名: NODE_ENV
变量值: production

变量名: PORT
变量值: 5000

变量名: MONGODB_URI
变量值: mongodb://root:q5rdw4tb@test-db-mongodb.ns-cxxiwxce.svc:27017/backend_db?authSource=admin
```

### 5. 配置资源（可选）：

- CPU: 0.1 - 0.5 核
- 内存: 256Mi - 512Mi
- 副本数: 1-2

### 6. 启用自动部署：

✅ 勾选 "自动部署" 或 "Auto Deploy"

这样每次 git push 都会自动更新！

### 7. 点击 "部署" 或 "Deploy"

---

## ✅ 部署成功后

LAF 会提供：
- 应用访问域名
- 实时日志查看
- 监控面板

测试 API：
```bash
curl https://YOUR_APP_DOMAIN/health
```

应该返回：
```json
{"success":true,"message":"服务运行正常","timestamp":"..."}
```

---

## 🔄 以后如何更新

```bash
cd /home/devbox/project

# 修改代码后
git add .
git commit -m "更新功能"
git push

# ✅ LAF 自动部署！
```

---

## 📞 常见问题

### Q: GitHub 推送失败？
A: 
1. 检查仓库是否创建成功
2. 确认用户名拼写正确
3. 使用 Personal Access Token 而不是密码

### Q: LAF 部署失败？
A: 
1. 检查环境变量是否正确配置
2. 查看 LAF 的构建日志
3. 确认启动命令是否正确

### Q: 如何查看应用日志？
A: 在 LAF 应用详情页，点击 "日志" 或 "Logs" 标签

---

**🎉 配置完成后，您就可以享受全自动部署了！**
