#!/bin/bash

set -e  # 遇到错误立即退出

echo "🚀 开始一键更新云端后端..."
echo ""

# 设置 kubeconfig
export KUBECONFIG="/home/devbox/project/kubeconfig (4).yaml"

# 1. 提交并推送代码到 GitHub
echo "📦 步骤 1: 提交并推送代码到 GitHub..."
cd /home/devbox/project
git add .
git commit -m "更新: $(date '+%Y-%m-%d %H:%M:%S')" || echo "没有新的更改需要提交"
git push

echo ""
echo "☁️  步骤 2: 拉取最新代码到云端..."
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "cd /home/devbox/project && git pull"

echo ""
echo "🔄 步骤 3: 重启后端服务..."
kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "pkill -f 'node.*server.js'; sleep 2; cd /home/devbox/project && nohup node server.js > /home/devbox/project/logs/server.log 2>&1 &"

echo ""
echo "⏳ 步骤 4: 等待服务启动（5秒）..."
sleep 5

echo ""
echo "✅ 步骤 5: 测试健康检查..."
if kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "curl -sf http://localhost:5000/health" > /dev/null; then
    echo "✅ 后端服务启动成功！"
    kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c "curl -s http://localhost:5000/health"
else
    echo "❌ 后端服务可能启动失败，请查看日志："
    echo "kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c 'tail -50 /home/devbox/project/logs/server.log'"
    exit 1
fi

echo ""
echo "🎉 更新完成！"
echo ""
echo "📋 域名: https://rtmfnnrfbmyt.sealoshzh.site"
echo ""
echo "💡 如需查看日志："
echo "   kubectl exec -n ns-cxxiwxce houduanceshi-c6l85 -- sh -c 'tail -100 /home/devbox/project/logs/server.log'"
echo ""
