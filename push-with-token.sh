#!/bin/bash

echo "======================================"
echo "  使用 Token 推送到 GitHub"
echo "======================================"
echo ""

cd /home/devbox/project

echo "📝 请输入您刚创建的 Personal Access Token："
echo "   (以 ghp_ 开头的字符串)"
echo ""
read -s TOKEN

echo ""
echo "正在推送代码..."
echo ""

# 使用 Token 推送
git push https://3780010199-lzb:${TOKEN}@github.com/3780010199-lzb/backend-api.git main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 代码推送成功！"
    echo ""
    echo "======================================"
    echo "  下一步：在 LAF 平台配置"
    echo "======================================"
    echo ""
    echo "1. 回到 LAF 云开发平台"
    echo "2. 点击 '+ 新建应用'"
    echo "3. 选择 '从 Git 仓库导入'"
    echo ""
    echo "📋 配置信息："
    echo ""
    echo "Git 仓库地址:"
    echo "https://github.com/3780010199-lzb/backend-api.git"
    echo ""
    echo "分支: main"
    echo "启动命令: node server.js"
    echo "端口: 5000"
    echo ""
    echo "🔧 环境变量（必须配置）:"
    echo "NODE_ENV=production"
    echo "PORT=5000"
    echo "MONGODB_URI=mongodb://root:q5rdw4tb@test-db-mongodb.ns-cxxiwxce.svc:27017/backend_db?authSource=admin"
    echo ""
    echo "✅ 记得勾选 '启用自动部署'！"
    echo ""
else
    echo ""
    echo "❌ 推送失败！"
    echo ""
    echo "请检查："
    echo "1. Token 是否正确复制（完整的，包括 ghp_ 前缀）"
    echo "2. Token 权限是否包含 repo"
    echo "3. 网络连接是否正常"
    echo ""
fi
