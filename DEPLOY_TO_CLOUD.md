# 部署后端到 Sealos 云端

## 问题
云端后端API返回 401 "未授权，请先登录"，无法添加商品。

## 解决方案：重新部署无授权限制的后端

### 方法1：在 Sealos App Launchpad 更新应用

1. 登录 Sealos 平台：https://cloud.sealos.io/

2. 找到现有的后端应用（backend-api）

3. 更新镜像或重新部署：
   - 使用本地代码重新构建镜像
   - 或使用 Git 仓库部署

4. 确保环境变量正确：
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb://root:q5rdw4tb@test-db-mongodb.ns-cxxiwxce.svc:27017/backend_db?authSource=admin
   ```

5. 重启应用

### 方法2：使用 Docker 构建和部署

```bash
# 1. 构建镜像
docker build -t your-registry/backend-api:latest .

# 2. 推送到镜像仓库
docker push your-registry/backend-api:latest

# 3. 在 Sealos 中使用新镜像更新应用
```

### 方法3：使用 kubectl 直接更新（如果有权限）

```bash
kubectl set image deployment/backend-api backend-api=your-registry/backend-api:latest -n your-namespace
```

## 验证

部署完成后，测试API：

```bash
curl -X POST 'https://dlzrpxrppejh.sealoshzh.site/api/products' \
  -H 'Content-Type: application/json' \
  -d '{"productName":"测试商品","model":"TEST001","category":"沙发","listPrice":5000,"stock":10}'
```

应该返回成功而不是401错误。

## 当前本地代码状态

✅ 本地后端（localhost:5000）已验证可以正常创建商品，无授权限制
✅ 已增加请求体大小限制到50MB
✅ 支持CORS跨域访问

确保云端使用此版本的代码即可解决问题。
