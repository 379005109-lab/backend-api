#!/bin/bash

echo "======================================"
echo "  推送代码到 GitHub"
echo "======================================"
echo ""

cd /home/devbox/project

echo "📝 请粘贴您刚才复制的 Personal Access Token："
echo "   (以 ghp_ 开头)"
echo ""
read -s TOKEN

if [ -z "$TOKEN" ]; then
    echo "❌ Token 不能为空！"
    exit 1
fi

echo ""
echo "🚀 正在推送代码..."
echo ""

# 使用 Token 推送
git push https://3780010199-lzb:${TOKEN}@github.com/3780010199-lzb/backend-api.git main --set-upstream

if [ $? -eq 0 ]; then
    echo ""
    echo "✅✅✅ 代码推送成功！✅✅✅"
    echo ""
    echo "======================================"
    echo "  🎉 下一步：在 LAF 平台配置"
    echo "======================================"
    echo ""
    echo "📋 请在 LAF 平台填写以下信息："
    echo ""
    echo "1. Git 仓库地址:"
    echo "   https://github.com/3780010199-lzb/backend-api.git"
    echo ""
    echo "2. 分支: main"
    echo ""
    echo "3. 启动命令: node server.js"
    echo ""
    echo "4. 端口: 5000"
    echo ""
    echo "5. 环境变量（必须配置这3个）:"
    echo "   NODE_ENV=production"
    echo "   PORT=5000"
    echo "   MONGODB_URI=mongodb://root:q5rdw4tb@test-db-mongodb.ns-cxxiwxce.svc:27017/backend_db?authSource=admin"
    echo ""
    echo "6. ✅ 勾选 '启用自动部署' 或 'Auto Deploy'"
    echo ""
    echo "7. 点击 '部署' 按钮"
    echo ""
    echo "======================================"
    echo ""
else
    echo ""
    echo "❌ 推送失败！"
    echo ""
    echo "请检查："
    echo "1. Token 是否完整复制"
    echo "2. 网络连接是否正常"
    echo ""
fi
