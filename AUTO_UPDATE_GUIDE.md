# 🚀 后端自动更新指南

## ✅ 当前部署状态

您的后端应用运行在 Sealos Devbox 中：
- **Pod**: `houduanceshi-c6l85`
- **命名空间**: `ns-cxxiwxce`
- **域名**: `https://rtmfnnrfbmyt.sealoshzh.site`
- **Service**: `houduanceshi` (端口 5000)

---

## 🔄 更新代码流程

### 方法 1：推送到 GitHub + 手动拉取（当前方式）

#### 1️⃣ 提交并推送代码
```bash
cd /home/devbox/project

# 修改代码
git add .
git commit -m "更新功能"
git push
```

#### 2️⃣ 在云端拉取最新代码
```bash
export KUBECONFIG="/home/devbox/project/kubeconfig (4).yaml"

# 进入 Pod 并更新代码
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "cd /home/devbox/project && git pull"
```

#### 3️⃣ 重启后端服务
```bash
# 方式 A：杀死旧进程并启动新进程
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "pkill -f 'node.*server.js' && sleep 2 && cd /home/devbox/project && nohup node server.js > /home/devbox/project/logs/server.log 2>&1 &"

# 方式 B：重启整个 Pod（如果上面的方式不行）
kubectl delete pod houduanceshi-c6l85 -n ns-cxxiwxce
# 注意：Pod 会自动重启，但可能需要重新进入 Devbox 启动服务
```

---

### 方法 2：一键更新脚本（推荐）

创建自动化脚本：

```bash
#!/bin/bash
# update-cloud-backend.sh

export KUBECONFIG="/home/devbox/project/kubeconfig (4).yaml"

echo "📦 推送代码到 GitHub..."
git add .
git commit -m "更新: $(date '+%Y-%m-%d %H:%M:%S')"
git push

echo ""
echo "☁️  拉取云端代码..."
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "cd /home/devbox/project && git pull"

echo ""
echo "🔄 重启后端服务..."
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "pkill -f 'node.*server.js'; sleep 2; cd /home/devbox/project && nohup node server.js > /home/devbox/project/logs/server.log 2>&1 &"

echo ""
echo "⏳ 等待服务启动..."
sleep 5

echo ""
echo "✅ 测试健康检查..."
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "curl -s http://localhost:5000/health" | jq .

echo ""
echo "🎉 更新完成！"
echo "域名: https://rtmfnnrfbmyt.sealoshzh.site"
```

使用方法：
```bash
chmod +x update-cloud-backend.sh
./update-cloud-backend.sh
```

---

## 📊 验证更新

### 检查服务状态
```bash
export KUBECONFIG="/home/devbox/project/kubeconfig (4).yaml"

# 查看 Pod 状态
kubectl get pod houduanceshi-c6l85 -n ns-cxxiwxce

# 查看进程
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "ps aux | grep 'node.*server.js' | grep -v grep"

# 查看日志
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "tail -50 /home/devbox/project/logs/server.log"
```

### 测试 API
```bash
# 健康检查
curl https://rtmfnnrfbmyt.sealoshzh.site/health

# 测试其他 API
curl https://rtmfnnrfbmyt.sealoshzh.site/api/products
curl https://rtmfnnrfbmyt.sealoshzh.site/api/categories
```

---

## 🔍 故障排查

### 问题 1：git pull 失败
```bash
# 检查 git 状态
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "cd /home/devbox/project && git status"

# 强制重置（慎用！会丢失本地修改）
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "cd /home/devbox/project && git reset --hard origin/main"
```

### 问题 2：服务无法启动（端口被占用）
```bash
# 查看占用端口的进程
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "lsof -i :5000" || \
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "netstat -tulpn | grep 5000"

# 杀死所有 node 进程
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "pkill -9 -f 'node'"

# 重新启动
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "cd /home/devbox/project && nohup node server.js > /home/devbox/project/logs/server.log 2>&1 &"
```

### 问题 3：Pod 不存在或名称变化
```bash
# 查找当前的后端 Pod
kubectl get pods -n ns-cxxiwxce

# 如果 Pod 名称改变了，更新脚本中的 Pod 名称
```

---

## 📝 注意事项

1. **不要在本地和云端同时修改代码**
   - 始终在本地修改，然后推送到 GitHub，再拉取到云端

2. **数据库连接**
   - 云端自动使用环境变量中的 MongoDB 连接
   - 不需要额外配置

3. **环境变量**
   - 如需修改环境变量，在 Devbox 中设置
   - 或在启动命令中指定：
     ```bash
     NODE_ENV=production PORT=5000 node server.js
     ```

4. **日志查看**
   - 日志文件：`/home/devbox/project/logs/server.log`
   - 实时查看：
     ```bash
     kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "tail -f /home/devbox/project/logs/server.log"
     ```

---

## 🎯 快速命令速查

```bash
# 设置 kubeconfig
export KUBECONFIG="/home/devbox/project/kubeconfig (4).yaml"

# 推送代码
git push

# 云端拉取
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "cd /home/devbox/project && git pull"

# 重启服务
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "pkill -f 'node.*server.js'; sleep 2; cd /home/devbox/project && nohup node server.js > /home/devbox/project/logs/server.log 2>&1 &"

# 查看日志
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "tail -50 /home/devbox/project/logs/server.log"

# 测试健康
curl https://rtmfnnrfbmyt.sealoshzh.site/health
```

---

## 🚀 推荐工作流

1. 在本地开发和测试
2. 提交代码：`git add . && git commit -m "描述"`
3. 推送到 GitHub：`git push`
4. 运行更新脚本：`./update-cloud-backend.sh`
5. 刷新前端测试功能

---

**✅ 您的后端现在可以通过 GitHub 进行版本管理，并快速更新到云端！**
