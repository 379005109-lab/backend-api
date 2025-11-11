#!/bin/bash

# 后端部署脚本 - Sealos平台
# 用法: ./deploy.sh

set -e

echo "🚀 开始部署后端到 Sealos..."

# 1. 创建部署包
echo "📦 创建部署包..."
DEPLOY_DIR="deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p $DEPLOY_DIR

# 复制必要文件
cp -r src $DEPLOY_DIR/
cp package.json $DEPLOY_DIR/
cp .env.production.example $DEPLOY_DIR/.env
echo "NODE_ENV=production" >> $DEPLOY_DIR/.env

# 创建压缩包
tar -czf "${DEPLOY_DIR}.tar.gz" -C $DEPLOY_DIR .
rm -rf $DEPLOY_DIR

echo "✅ 部署包已创建: ${DEPLOY_DIR}.tar.gz"
echo ""
echo "📝 手动部署步骤："
echo "1. 登录 Sealos: https://cloud.sealos.io/"
echo "2. 找到后端应用: rtmfnnrfbmyt"
echo "3. 点击'重新构建'或'更新代码'"
echo "4. 或上传部署包: ${DEPLOY_DIR}.tar.gz"
echo ""
echo "🌐 后端地址: https://rtmfnnrfbmyt.sealoshzh.site/"
echo ""
echo "🔍 验证命令:"
echo "curl https://rtmfnnrfbmyt.sealoshzh.site/api/"
echo "curl https://rtmfnnrfbmyt.sealoshzh.site/api/materials/categories/tree"
