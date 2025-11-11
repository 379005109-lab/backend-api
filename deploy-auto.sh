#!/bin/bash

set -e

echo "=========================================="
echo "  🚀 自动化云端部署脚本"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 配置
KUBECONFIG_PATH="/home/devbox/project/kubeconfig (4).yaml"
NAMESPACE="ns-cxxiwxce"
DEPLOYMENT_NAME="backend-api"
IMAGE_NAME="backend-api"
REGISTRY="registry.cn-shanghai.aliyuncs.com"
IMAGE_TAG="$(date +%Y%m%d-%H%M%S)"

echo -e "${BLUE}📋 部署配置${NC}"
echo "  命名空间: ${NAMESPACE}"
echo "  部署名称: ${DEPLOYMENT_NAME}"
echo "  镜像标签: ${IMAGE_TAG}"
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker 未安装，请先安装 Docker${NC}"
    exit 1
fi

# 检查 kubectl 是否安装
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl 未安装，请先安装 kubectl${NC}"
    exit 1
fi

# 设置 KUBECONFIG
export KUBECONFIG="${KUBECONFIG_PATH}"

echo -e "${BLUE}🔨 步骤 1: 构建 Docker 镜像${NC}"
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Docker 镜像构建失败${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker 镜像构建成功${NC}"
echo ""

# 可选：推送到镜像仓库（如果配置了）
read -p "是否推送镜像到远程仓库？(y/n): " PUSH_IMAGE
if [ "$PUSH_IMAGE" = "y" ]; then
    echo -e "${BLUE}📤 步骤 2: 推送 Docker 镜像${NC}"
    
    read -p "请输入镜像仓库用户名: " DOCKER_USERNAME
    
    # 标记镜像
    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY}/${DOCKER_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}
    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY}/${DOCKER_USERNAME}/${IMAGE_NAME}:latest
    
    # 登录仓库
    docker login ${REGISTRY}
    
    # 推送镜像
    docker push ${REGISTRY}/${DOCKER_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}
    docker push ${REGISTRY}/${DOCKER_USERNAME}/${IMAGE_NAME}:latest
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Docker 镜像推送失败${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker 镜像推送成功${NC}"
    echo ""
    
    FULL_IMAGE="${REGISTRY}/${DOCKER_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"
else
    echo -e "${YELLOW}⏭️  跳过镜像推送${NC}"
    FULL_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"
fi

echo -e "${BLUE}🔍 步骤 3: 检查 Kubernetes 连接${NC}"
kubectl cluster-info

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 无法连接到 Kubernetes 集群${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Kubernetes 连接成功${NC}"
echo ""

echo -e "${BLUE}📊 步骤 4: 检查当前部署状态${NC}"
kubectl get deployment ${DEPLOYMENT_NAME} -n ${NAMESPACE} || echo "部署不存在，将创建新部署"
echo ""

echo -e "${BLUE}🚀 步骤 5: 更新部署${NC}"

# 检查部署是否存在
if kubectl get deployment ${DEPLOYMENT_NAME} -n ${NAMESPACE} &> /dev/null; then
    # 更新现有部署
    echo "更新现有部署的镜像..."
    kubectl set image deployment/${DEPLOYMENT_NAME} \
        ${DEPLOYMENT_NAME}=${FULL_IMAGE} \
        -n ${NAMESPACE}
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 部署更新失败${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 部署已更新${NC}"
    echo ""
    
    echo -e "${BLUE}⏳ 等待滚动更新完成...${NC}"
    kubectl rollout status deployment/${DEPLOYMENT_NAME} -n ${NAMESPACE} --timeout=5m
    
else
    # 创建新部署
    echo "创建新的部署..."
    
    # 检查是否有部署配置文件
    if [ -f "k8s/backend-deployment.yaml" ]; then
        # 更新 YAML 中的镜像
        sed "s|image:.*backend-api.*|image: ${FULL_IMAGE}|g" k8s/backend-deployment.yaml | kubectl apply -f -
    else
        echo -e "${YELLOW}⚠️  未找到部署配置文件，使用 kubectl set image 命令${NC}"
        kubectl create deployment ${DEPLOYMENT_NAME} \
            --image=${FULL_IMAGE} \
            -n ${NAMESPACE}
    fi
fi

echo ""
echo -e "${BLUE}📋 步骤 6: 验证部署状态${NC}"
kubectl get pods -n ${NAMESPACE} -l app=${DEPLOYMENT_NAME}
echo ""
kubectl get deployment ${DEPLOYMENT_NAME} -n ${NAMESPACE}
echo ""

echo -e "${GREEN}=========================================="
echo "  ✅ 部署完成！"
echo "==========================================${NC}"
echo ""
echo "📝 部署信息："
echo "  • 镜像: ${FULL_IMAGE}"
echo "  • 命名空间: ${NAMESPACE}"
echo "  • 部署名称: ${DEPLOYMENT_NAME}"
echo ""
echo "🔗 访问地址："
echo "  • API: https://rtmfnnrfbmyt.sealoshzh.site/api"
echo "  • 健康检查: https://rtmfnnrfbmyt.sealoshzh.site/health"
echo ""
echo "📊 查看日志："
echo "  kubectl logs -f deployment/${DEPLOYMENT_NAME} -n ${NAMESPACE}"
echo ""
echo "🔄 查看 Pods："
echo "  kubectl get pods -n ${NAMESPACE} -l app=${DEPLOYMENT_NAME}"
echo ""
