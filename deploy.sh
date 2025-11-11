#!/bin/bash

# Sealos 云端部署脚本
# 此脚本帮助您将最新的代码部署到 Sealos 平台

echo "=========================================="
echo "  Sealos 云端部署助手"
echo "=========================================="
echo ""

# 检查部署包
echo "📦 检查部署包..."
if [ ! -f "/home/devbox/backend-deploy.tar.gz" ]; then
    echo "❌ 后端部署包不存在"
    exit 1
fi

if [ ! -f "/home/devbox/frontend-deploy.tar.gz" ]; then
    echo "❌ 前端部署包不存在"
    exit 1
fi

echo "✅ 部署包已准备好："
ls -lh /home/devbox/*-deploy.tar.gz

echo ""
echo "=========================================="
echo "  部署说明"
echo "=========================================="
echo ""
echo "请按以下步骤操作："
echo ""
echo "1️⃣  登录 Sealos 平台"
echo "   访问：https://cloud.sealos.io/"
echo ""
echo "2️⃣  更新后端应用"
echo "   - 找到 'backend-api' 应用"
echo "   - 点击「变更」或「重新部署」"
echo "   - 上传：/home/devbox/backend-deploy.tar.gz"
echo "   - 确认环境变量："
echo "     NODE_ENV=production"
echo "     PORT=5000"
echo "     MONGODB_URI=mongodb://root:q5rdw4tb@test-db-mongodb.ns-cxxiwxce.svc:27017/backend_db?authSource=admin"
echo ""
echo "3️⃣  更新前端应用"
echo "   - 找到 'frontend-app' 应用"
echo "   - 点击「变更」或「重新部署」"
echo "   - 上传：/home/devbox/frontend-deploy.tar.gz"
echo "   - 确认环境变量："
echo "     NODE_ENV=production"
echo "     PORT=3000"
echo ""
echo "4️⃣  等待部署完成（约1-2分钟）"
echo ""
echo "5️⃣  验证部署"
echo "   curl https://dlzrpxrppejh.sealoshzh.site/api/materials"
echo "   curl https://dlzrpxrppejh.sealoshzh.site/api/products"
echo ""
echo "=========================================="
echo ""
echo "📝 详细文档：/home/devbox/DEPLOY_NOW.md"
echo ""
