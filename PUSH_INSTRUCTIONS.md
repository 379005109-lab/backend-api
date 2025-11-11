# 📤 推送代码到 GitHub

## 方法 1：手动推送（推荐）

在终端直接运行：

```bash
cd /home/devbox/project
git push -u origin main
```

### 如果提示需要认证：

**用户名**：`3780010199-lzb`

**密码**：需要使用 Personal Access Token（不是 GitHub 密码）

---

## 🔑 创建 Personal Access Token

### 步骤：

1. **访问**：https://github.com/settings/tokens

2. **点击**：`Generate new token` → `Generate new token (classic)`

3. **配置**：
   - Note（备注）：`LAF Backend Deploy`
   - Expiration（过期时间）：`90 days`
   - ✅ **勾选权限**：`repo`（勾选整个 repo 部分）

4. **生成**：点击底部绿色按钮 `Generate token`

5. **复制**：复制生成的 Token（以 `ghp_` 开头）
   - ⚠️ **只显示一次，请立即保存！**

6. **使用**：在推送时，将 Token 粘贴作为密码

---

## ✅ 推送成功后

您会看到类似这样的输出：

```
Enumerating objects: 150, done.
Counting objects: 100% (150/150), done.
Delta compression using up to 4 threads
Compressing objects: 100% (120/120), done.
Writing objects: 100% (150/150), 142.00 KiB | 7.47 MiB/s, done.
Total 150 (delta 25), reused 0 (delta 0), pack-reused 0
To https://github.com/3780010199-lzb/backend-api.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 🎯 推送成功后的下一步

### 在 LAF 平台配置：

1. **回到 LAF 云开发平台**
2. **点击**：`+ 新建应用`
3. **选择**：`从 Git 仓库导入`

4. **填写配置**：

   **Git 仓库地址**：
   ```
   https://github.com/3780010199-lzb/backend-api.git
   ```

   **分支**：`main`

   **根目录**：`/`

   **构建命令**：`npm install --production`

   **启动命令**：`node server.js`

   **端口**：`5000`

5. **配置环境变量**（点击 "添加环境变量"）：

   ```
   变量名: NODE_ENV
   变量值: production

   变量名: PORT
   变量值: 5000

   变量名: MONGODB_URI
   变量值: mongodb://root:q5rdw4tb@test-db-mongodb.ns-cxxiwxce.svc:27017/backend_db?authSource=admin
   ```

6. **启用自动部署**：
   - ✅ 勾选 "启用自动部署" 或 "Auto Deploy"

7. **点击**：`部署` 或 `Deploy`

---

## 🎉 完成后

LAF 会自动：
- ✅ 拉取您的 GitHub 代码
- ✅ 安装依赖
- ✅ 构建并启动应用
- ✅ 提供访问域名

以后每次您 `git push`，LAF 都会自动更新应用！

---

## 📞 需要帮助？

遇到问题随时截图告诉我！
