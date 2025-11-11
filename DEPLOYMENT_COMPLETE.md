# 🎉 云端自动化部署已完成！

## ✅ 部署状态

您的后端应用已成功部署到 **Sealos 云平台**！

---

## 🌐 访问信息

### 应用域名
```
https://backend-api-ns-cxxiwxce.sealoshzh.site
```

### API 端点
- 健康检查：`https://backend-api-ns-cxxiwxce.sealoshzh.site/health`
- API 基础路径：`https://backend-api-ns-cxxiwxce.sealoshzh.site/api/`

---

## 📊 部署详情

### Kubernetes 配置
- **命名空间**: `ns-cxxiwxce`
- **Deployment**: `backend-api`
- **副本数**: 2
- **Service**: ClusterIP (内部端口 5000)
- **Ingress**: HTTPS 自动证书

### 资源配置
- **CPU**: 100m (请求) - 500m (限制)
- **内存**: 256Mi (请求) - 512Mi (限制)

### 代码来源
- **GitHub 仓库**: https://github.com/379005109-lab/backend-api.git
- **分支**: main
- **部署方式**: Git clone + npm install (容器启动时自动拉取最新代码)

---

## 🔍 查看应用状态

### 查看 Pods
```bash
export KUBECONFIG="/home/devbox/project/kubeconfig (4).yaml"
kubectl get pods -n ns-cxxiwxce -l app=backend-api
```

### 查看日志
```bash
kubectl logs -f -n ns-cxxiwxce -l app=backend-api
```

### 查看服务
```bash
kubectl get svc -n ns-cxxiwxce backend-api
```

### 查看 Ingress
```bash
kubectl get ingress -n ns-cxxiwxce backend-api
```

---

## 🧪 测试 API

### 测试健康检查
```bash
curl https://backend-api-ns-cxxiwxce.sealoshzh.site/health
```

预期返回：
```json
{
  "success": true,
  "message": "服务运行正常",
  "timestamp": "2025-11-11T..."
}
```

### 测试其他API
```bash
# 获取商品列表
curl https://backend-api-ns-cxxiwxce.sealoshzh.site/api/products

# 获取分类列表
curl https://backend-api-ns-cxxiwxce.sealoshzh.site/api/categories
```

---

## 🔄 更新应用

### 方式 1：推送代码到 GitHub（自动更新）

```bash
cd /home/devbox/project

# 修改代码
git add .
git commit -m "更新功能"
git push

# Pod 会在下次重启时自动拉取最新代码
```

### 方式 2：手动重启 Deployment

```bash
export KUBECONFIG="/home/devbox/project/kubeconfig (4).yaml"
kubectl rollout restart deployment/backend-api -n ns-cxxiwxce
```

### 方式 3：修改部署配置

```bash
# 编辑 sealos-deployment.yaml
# 然后应用更新
kubectl apply -f sealos-deployment.yaml
```

---

## 📈 扩容/缩容

### 调整副本数
```bash
kubectl scale deployment/backend-api --replicas=3 -n ns-cxxiwxce
```

### 调整资源限制
编辑 `sealos-deployment.yaml` 中的 resources 部分，然后：
```bash
kubectl apply -f sealos-deployment.yaml
```

---

## 🔧 故障排查

### 查看 Pod 详情
```bash
kubectl describe pod -n ns-cxxiwxce -l app=backend-api
```

### 进入容器调试
```bash
POD_NAME=$(kubectl get pods -n ns-cxxiwxce -l app=backend-api -o jsonpath='{.items[0].metadata.name}')
kubectl exec -it -n ns-cxxiwxce $POD_NAME -- sh
```

### 查看事件
```bash
kubectl get events -n ns-cxxiwxce --sort-by='.lastTimestamp'
```

---

## 🎯 与前端对接

### 前端 API 配置

在前端代码中，将 API 地址配置为：
```javascript
const API_BASE_URL = 'https://backend-api-ns-cxxiwxce.sealoshzh.site/api';
```

### CORS 配置

后端已配置 CORS，允许以下来源：
- `http://localhost:3000`
- `https://dlzrpxrppejh.sealoshzh.site`
- 所有 `.sealoshzh.site` 子域名

---

## 📝 环境变量

当前配置的环境变量：
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://root:q5rdw4tb@test-db-mongodb.ns-cxxiwxce.svc:27017/backend_db?authSource=admin
```

如需修改环境变量：
1. 编辑 `sealos-deployment.yaml`
2. 修改 `env` 部分
3. 运行 `kubectl apply -f sealos-deployment.yaml`
4. 重启 Deployment

---

## 🎊 总结

您现在拥有：
- ✅ 代码托管在 GitHub
- ✅ 自动部署到 Sealos 云端
- ✅ HTTPS 安全访问
- ✅ 高可用（2个副本）
- ✅ 自动重启和健康检查
- ✅ 连接到云端 MongoDB
- ✅ 支持滚动更新

**🎉 再也不需要手动更新 Pod 了！每次 `git push` 后，重启 Deployment 即可更新代码！**

---

## 📞 常用命令速查

```bash
# 设置 kubeconfig
export KUBECONFIG="/home/devbox/project/kubeconfig (4).yaml"

# 查看 Pods
kubectl get pods -n ns-cxxiwxce -l app=backend-api

# 查看日志
kubectl logs -f -n ns-cxxiwxce -l app=backend-api

# 重启应用
kubectl rollout restart deployment/backend-api -n ns-cxxiwxce

# 查看部署状态
kubectl rollout status deployment/backend-api -n ns-cxxiwxce

# 扩容到3个副本
kubectl scale deployment/backend-api --replicas=3 -n ns-cxxiwxce

# 查看服务和域名
kubectl get ingress -n ns-cxxiwxce backend-api
```

---

**🚀 恭喜！您的后端已成功部署并运行在 Sealos 云平台上！**
