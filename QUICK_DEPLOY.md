# ⚡ 快速部署参考卡

## 🎯 三种自动化部署方式

### 1️⃣ Sealos Git 自动部署（推荐⭐⭐⭐⭐⭐）

```bash
# 1. 推送代码到 Git
git add .
git commit -m "Update"
git push

# 2. 在 Sealos 控制台配置 Git 自动构建
# ✅ 完全自动化，无需手动操作
```

**配置一次，永久自动更新！**

---

### 2️⃣ 本地一键部署脚本

```bash
cd /home/devbox/project
./deploy-auto.sh
```

**适合快速测试和手动控制部署时机**

---

### 3️⃣ GitHub Actions CI/CD

```bash
# 1. 推送代码
git push

# 2. GitHub Actions 自动：
#    - 构建镜像
#    - 推送镜像
#    - 更新 K8s
```

**需要配置 GitHub Secrets**

---

## 🔄 快速命令

### 查看状态
```bash
export KUBECONFIG="/home/devbox/project/kubeconfig (4).yaml"
kubectl get pods -n ns-cxxiwxce -l app=backend-api
```

### 查看日志
```bash
kubectl logs -f deployment/backend-api -n ns-cxxiwxce
```

### 重启应用
```bash
kubectl rollout restart deployment/backend-api -n ns-cxxiwxce
```

### 回滚版本
```bash
kubectl rollout undo deployment/backend-api -n ns-cxxiwxce
```

---

## 📝 访问地址

- 🌐 前端: https://dlzrpxrppejh.sealoshzh.site
- 🔌 后端 API: https://rtmfnnrfbmyt.sealoshzh.site/api
- ❤️ 健康检查: https://rtmfnnrfbmyt.sealoshzh.site/health
- 🎛️ Sealos: https://cloud.sealos.run/

---

## 📚 详细文档

- **完整指南**: [CLOUD_AUTO_DEPLOY.md](./CLOUD_AUTO_DEPLOY.md)
- **Sealos 专用**: [SEALOS_DEPLOY_GUIDE.md](./SEALOS_DEPLOY_GUIDE.md)

---

**💡 提示**: 推荐使用 Sealos Git 自动部署，配置一次后永久自动化！
