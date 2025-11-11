#!/bin/bash

# 服务状态检查脚本
# 用于验证所有服务是否正常运行

echo "=========================================="
echo "    系统服务状态检查"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 检查PM2服务
echo "1️⃣  检查PM2进程管理器"
echo "----------------------------------------"
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✅ PM2已安装${NC}"
    pm2 list
    echo ""
else
    echo -e "${RED}❌ PM2未安装${NC}"
fi

# 2. 检查后端API
echo "2️⃣  检查后端API (端口5000)"
echo "----------------------------------------"
if curl -s http://localhost:5000/health > /dev/null; then
    HEALTH=$(curl -s http://localhost:5000/health)
    echo -e "${GREEN}✅ 后端API运行正常${NC}"
    echo "响应: $HEALTH"
else
    echo -e "${RED}❌ 后端API无响应${NC}"
fi
echo ""

# 3. 检查前端服务
echo "3️⃣  检查前端服务 (端口3000)"
echo "----------------------------------------"
if curl -s -I http://localhost:3000 | head -1 | grep 200 > /dev/null; then
    echo -e "${GREEN}✅ 前端服务运行正常${NC}"
else
    echo -e "${RED}❌ 前端服务无响应${NC}"
fi
echo ""

# 4. 检查MongoDB连接
echo "4️⃣  检查MongoDB数据库连接"
echo "----------------------------------------"
if node /home/devbox/project/query-db.js 2>&1 | grep -q "成功连接"; then
    echo -e "${GREEN}✅ MongoDB连接正常${NC}"
    node /home/devbox/project/query-db.js 2>&1 | head -5
else
    echo -e "${RED}❌ MongoDB连接失败${NC}"
fi
echo ""

# 5. 检查端口监听
echo "5️⃣  检查端口监听状态"
echo "----------------------------------------"
if netstat -tuln 2>/dev/null | grep -q ":5000"; then
    echo -e "${GREEN}✅ 端口5000 (后端) 正在监听${NC}"
else
    echo -e "${RED}❌ 端口5000未监听${NC}"
fi

if netstat -tuln 2>/dev/null | grep -q ":3000"; then
    echo -e "${GREEN}✅ 端口3000 (前端) 正在监听${NC}"
else
    echo -e "${RED}❌ 端口3000未监听${NC}"
fi
echo ""

# 6. 检查PM2配置文件
echo "6️⃣  检查PM2配置持久化"
echo "----------------------------------------"
if [ -f ~/.pm2/dump.pm2 ]; then
    SIZE=$(ls -lh ~/.pm2/dump.pm2 | awk '{print $5}')
    MODIFIED=$(ls -l ~/.pm2/dump.pm2 | awk '{print $6, $7, $8}')
    echo -e "${GREEN}✅ PM2进程列表已保存${NC}"
    echo "文件大小: $SIZE"
    echo "最后保存: $MODIFIED"
else
    echo -e "${RED}❌ PM2进程列表未保存${NC}"
    echo -e "${YELLOW}⚠️  请运行: pm2 save${NC}"
fi
echo ""

# 7. 检查ecosystem配置
echo "7️⃣  检查PM2 ecosystem配置"
echo "----------------------------------------"
if [ -f /home/devbox/project/ecosystem.config.js ]; then
    echo -e "${GREEN}✅ ecosystem.config.js 存在${NC}"
    echo "配置的服务:"
    grep "name:" /home/devbox/project/ecosystem.config.js | sed 's/^/  - /'
else
    echo -e "${RED}❌ ecosystem.config.js 不存在${NC}"
fi
echo ""

# 8. API快速测试
echo "8️⃣  API功能测试"
echo "----------------------------------------"
PRODUCT_COUNT=$(curl -s http://localhost:5000/api/products | grep -o '"total":[0-9]*' | grep -o '[0-9]*')
if [ ! -z "$PRODUCT_COUNT" ]; then
    echo -e "${GREEN}✅ API查询正常${NC}"
    echo "数据库中共有 $PRODUCT_COUNT 个商品"
else
    echo -e "${YELLOW}⚠️  无法获取商品数量${NC}"
fi
echo ""

# 总结
echo "=========================================="
echo "    检查完成"
echo "=========================================="
echo ""
echo "💡 提示:"
echo "  - 查看日志: pm2 logs"
echo "  - 重启服务: pm2 restart all"
echo "  - 详细文档: cat /home/devbox/project/AUTO-START.md"
echo ""
