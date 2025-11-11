#!/bin/bash

# 自动部署更新后的后端代码到云端
set -e

echo "🚀 开始部署后端代码到云端..."

# 设置 kubeconfig
export KUBECONFIG="/home/devbox/project/kubeconfig (4).yaml"

# 云端 Pod 名称
POD_NAME="houduanceshi-zj6rz"
NAMESPACE="ns-cxxiwxce"

echo "📦 复制更新后的 orderController.js 到云端..."
kubectl cp /home/devbox/project/controllers/orderController.js \
  ${NAMESPACE}/${POD_NAME}:/home/devbox/project/controllers/orderController.js

echo "🔍 查找当前运行的后端进程..."
OLD_PID=$(kubectl exec ${POD_NAME} -n ${NAMESPACE} -- bash -c "ps aux | grep 'node /home/devbox/project/server.js' | grep -v grep | awk '{print \$2}' | head -1" 2>/dev/null || echo "")

if [ ! -z "$OLD_PID" ]; then
  echo "⏹️  停止旧进程 (PID: $OLD_PID)..."
  kubectl exec ${POD_NAME} -n ${NAMESPACE} -- bash -c "kill $OLD_PID" 2>/dev/null || true
  sleep 2
fi

echo "🔄 启动新的后端服务..."
kubectl exec ${POD_NAME} -n ${NAMESPACE} -- bash -c "cd /home/devbox/project && nohup node server.js > /home/devbox/project/logs/server.log 2>&1 &"

echo "⏳ 等待服务启动..."
sleep 3

echo "✅ 检查服务状态..."
kubectl exec ${POD_NAME} -n ${NAMESPACE} -- bash -c "netstat -tlnp 2>/dev/null | grep 5000 || ss -tlnp | grep 5000"

echo "✅ 部署完成！"
echo "📝 后端API地址: https://rtmfnnrfbmyt.sealoshzh.site/api"
echo "🔍 查看日志: kubectl exec ${POD_NAME} -n ${NAMESPACE} -- tail -f /home/devbox/project/logs/server.log"
