#!/bin/bash

echo "=========================================="
echo "  后端 Material 功能更新部署"
echo "=========================================="
echo ""

# 创建部署包
echo "📦 创建部署包..."
cd /home/devbox/project

tar -czf /home/devbox/backend-material-update.tar.gz \
  --exclude='node_modules' \
  --exclude='logs' \
  --exclude='.git' \
  --exclude='*.md' \
  --exclude='*.sh' \
  --exclude='*.tar.gz' \
  --exclude='test-*.js' \
  --exclude='query-*.js' \
  --exclude='create-*.js' \
  --exclude='add-*.js' \
  --exclude='verify-*.js' \
  --exclude='init-*.js' \
  .

echo "✅ 部署包已创建："
ls -lh /home/devbox/backend-material-update.tar.gz

echo ""
echo "=========================================="
echo "  手动部署说明"
echo "=========================================="
echo ""
echo "方式A: Sealos Web 控制台部署"
echo "  1. 访问 https://cloud.sealos.run/"
echo "  2. 打开 App Launchpad"
echo "  3. 找到 backend-api 应用"
echo "  4. 点击「更新」→「从代码」"
echo "  5. 上传 /home/devbox/backend-material-update.tar.gz"
echo "  6. 等待重新部署完成"
echo ""
echo "方式B: 使用 roudaunce.shi (如果已配置)"
echo "  访问: https://cloud.sealos.run/"
echo "  使用命令: roudaunce.shi"
echo ""
echo "=========================================="
echo ""
echo "📋 更新内容："
echo "  ✓ Material 模型 (models/Material.js)"
echo "  ✓ MaterialCategory 模型 (models/MaterialCategory.js)"
echo "  ✓ Material 控制器 (controllers/materialController.js)"
echo "  ✓ Material 路由更新 (routes/materialRoutes.js)"
echo "  ✓ 认证中间件 (controllers/authController.js)"
echo ""
echo "📡 新增 API 端点："
echo "  GET  /api/materials/categories/list"
echo "  GET  /api/materials/categories/tree"
echo "  POST /api/materials/categories"
echo "  PUT  /api/materials/categories/:id"
echo "  DELETE /api/materials/categories/:id"
echo "  GET  /api/materials"
echo "  GET  /api/materials/:id"
echo "  POST /api/materials"
echo "  PUT  /api/materials/:id"
echo "  DELETE /api/materials/:id"
echo "  POST /api/materials/batch-delete"
echo "  PUT  /api/materials/:id/review"
echo "  GET  /api/materials/stats"
echo ""
