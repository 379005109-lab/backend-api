#!/bin/bash

echo "======================================"
echo "  推送代码到 GitHub"
echo "======================================"
echo ""

# 检查是否已设置 remote
if git remote get-url origin 2>/dev/null; then
    echo "⚠️  已存在 remote origin，先删除..."
    git remote remove origin
fi

echo "📝 请输入您的 GitHub 用户名："
read GITHUB_USERNAME

echo ""
echo "正在添加 remote origin..."
git remote add origin https://github.com/${GITHUB_USERNAME}/backend-api.git

echo ""
echo "正在推送代码到 GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 代码已成功推送到 GitHub！"
    echo ""
    echo "📝 您的仓库地址："
    echo "https://github.com/${GITHUB_USERNAME}/backend-api"
    echo ""
    echo "======================================"
    echo "  下一步：在 LAF 平台配置"
    echo "======================================"
    echo ""
    echo "1. 在 LAF 点击 '新建应用'"
    echo "2. 选择 '从 Git 仓库导入'"
    echo "3. 输入仓库地址："
    echo "   https://github.com/${GITHUB_USERNAME}/backend-api.git"
    echo "4. 分支：main"
    echo "5. 配置环境变量（重要）："
    echo "   NODE_ENV=production"
    echo "   PORT=5000"
    echo "   MONGODB_URI=mongodb://root:q5rdw4tb@test-db-mongodb.ns-cxxiwxce.svc:27017/backend_db?authSource=admin"
    echo ""
else
    echo ""
    echo "❌ 推送失败！"
    echo ""
    echo "可能的原因："
    echo "1. 用户名输入错误"
    echo "2. 仓库不存在或未创建"
    echo "3. 需要 GitHub 认证"
    echo ""
    echo "请先在 GitHub 创建仓库，然后重试"
fi
