# Material 功能更新总结

## 完成时间
2024-11-10 22:15 UTC

## 更新内容

### 1. 新增数据库模型

#### Material 模型 (`models/Material.js`)
- 素材管理模型，支持图片、纹理、3D模型等多种类型
- 字段包括：名称、类型、图片、分类、标签、属性、描述、价格、状态、审核信息等
- 支持状态管理：pending（待审核）、approved（已通过）、rejected（已拒绝）、offline（已下线）

#### MaterialCategory 模型 (`models/MaterialCategory.js`)
- 素材分类模型，支持层级结构
- 字段包括：名称、父分类ID、图标、排序
- 支持构建树形分类结构

### 2. 新增控制器 (`controllers/materialController.js`)

#### 素材管理功能
- `getAllMaterials` - 获取素材列表（支持分类、类型、状态筛选和搜索）
- `getMaterialById` - 获取单个素材详情
- `createMaterial` - 创建新素材
- `updateMaterial` - 更新素材信息
- `deleteMaterial` - 删除单个素材
- `batchDeleteMaterials` - 批量删除素材
- `reviewMaterial` - 审核素材（管理员）
- `getMaterialStats` - 获取素材统计信息

#### 素材分类管理功能
- `getAllMaterialCategories` - 获取分类列表
- `getMaterialCategoryTree` - 获取分类树形结构
- `createMaterialCategory` - 创建新分类
- `updateMaterialCategory` - 更新分类信息
- `deleteMaterialCategory` - 删除分类（带完整性检查）

### 3. 更新路由 (`routes/materialRoutes.js`)

替换了原有的静态数据返回，改为完整的数据库驱动API：

#### 素材分类路由
- `GET /api/materials/categories/list` - 获取分类列表（公开）
- `GET /api/materials/categories/tree` - 获取分类树（公开）
- `POST /api/materials/categories` - 创建分类（需认证）
- `PUT /api/materials/categories/:id` - 更新分类（需认证）
- `DELETE /api/materials/categories/:id` - 删除分类（需认证）

#### 素材路由
- `GET /api/materials` - 获取素材列表（公开）
- `GET /api/materials/:id` - 获取单个素材（公开）
- `POST /api/materials` - 创建素材（需认证）
- `PUT /api/materials/:id` - 更新素材（需认证）
- `DELETE /api/materials/:id` - 删除素材（需认证）
- `POST /api/materials/batch-delete` - 批量删除（需认证）
- `PUT /api/materials/:id/review` - 审核素材（需认证）
- `GET /api/materials/stats` - 获取统计（需认证）

### 4. 新增认证中间件 (`controllers/authController.js`)

- `authenticate` - JWT token 验证中间件
- `authorize(...roles)` - 角色权限验证中间件

支持保护需要认证的路由，确保只有登录用户才能进行增删改操作。

## API 特性

### 查询参数支持
- `categoryId` - 按分类筛选
- `type` - 按类型筛选（image/texture/model）
- `status` - 按状态筛选
- `search` - 搜索素材名称和描述

### 认证要求
- 公开接口：GET 列表和详情
- 需要登录：POST、PUT、DELETE 操作
- 管理员专用：审核、批量操作、统计

### 响应格式
```json
{
  "success": true,
  "data": {...},
  "message": "操作成功"
}
```

## 数据库索引优化
- Material: categoryId、status、type、order
- MaterialCategory: parentId、order

## 部署说明

### 本地服务
当前 PM2 服务已更新并保存：
```bash
pm2 list
pm2 logs backend-api
```

### 部署包
已创建部署包：`/home/devbox/backend-material-update.tar.gz` (52KB)

### 云端部署步骤
1. 访问 https://cloud.sealos.run/
2. 打开 App Launchpad
3. 找到 `backend-api` 应用
4. 点击「更新」→「从代码」
5. 上传部署包
6. 等待重新部署完成

### 验证部署
```bash
# 测试分类列表
curl https://dlzrpxrppejh.sealoshzh.site/api/materials/categories/list

# 测试素材列表
curl https://dlzrpxrppejh.sealoshzh.site/api/materials

# 测试带参数查询
curl "https://dlzrpxrppejh.sealoshzh.site/api/materials?type=image&status=approved"
```

## 前后端对接说明

### 前端需要使用的API

1. **获取分类树** - 用于分类选择器
   ```javascript
   GET /api/materials/categories/tree
   ```

2. **获取素材列表** - 用于素材展示
   ```javascript
   GET /api/materials?categoryId=xxx&type=image
   ```

3. **创建素材** - 需要认证token
   ```javascript
   POST /api/materials
   Headers: { Authorization: 'Bearer <token>' }
   Body: { name, type, image, categoryId, ... }
   ```

4. **更新素材** - 需要认证token
   ```javascript
   PUT /api/materials/:id
   Headers: { Authorization: 'Bearer <token>' }
   Body: { ...更新字段 }
   ```

5. **删除素材** - 需要认证token
   ```javascript
   DELETE /api/materials/:id
   Headers: { Authorization: 'Bearer <token>' }
   ```

### 认证说明
所有需要认证的接口都需要在请求头中包含 JWT token：
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## 注意事项

1. **前端需要修复的 async/await 调用已对应**
   - MaterialCategoryModal 可以直接调用分类API
   - MaterialFormModal 可以直接调用素材API

2. **所有创建/更新操作都需要用户认证**
   - 确保前端正确传递 token
   - 处理 401/403 认证失败响应

3. **分类删除有完整性检查**
   - 有子分类的分类无法删除
   - 有素材关联的分类无法删除

4. **素材审核流程**
   - 新创建的素材默认状态为 pending
   - 管理员可以通过 review API 审核
   - 前端可根据状态显示不同的UI

## 后续优化建议

1. 添加素材文件上传功能
2. 实现分类图标上传
3. 添加素材标签自动建议
4. 实现素材搜索优化（全文索引）
5. 添加素材使用统计
6. 实现分类拖拽排序

## 文件清单

```
/home/devbox/project/
├── models/
│   ├── Material.js (新增)
│   └── MaterialCategory.js (新增)
├── controllers/
│   ├── materialController.js (新增)
│   └── authController.js (已更新 - 添加中间件)
├── routes/
│   └── materialRoutes.js (已更新 - 完整重写)
└── server.js (无需修改 - 路由已注册)
```

## 联系信息

如有问题，请查看：
- API文档: `/home/devbox/project/API_DOCUMENTATION.md`
- 认证文档: `/home/devbox/project/AUTH_SYSTEM_GUIDE.md`
- 部署脚本: `/home/devbox/project/quick-update.sh`
