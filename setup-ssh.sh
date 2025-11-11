#!/bin/bash

echo "======================================"
echo "  配置 GitHub SSH 密钥"
echo "======================================"
echo ""

# 生成 SSH 密钥
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "正在生成 SSH 密钥..."
    ssh-keygen -t ed25519 -C "3780010199-lzb@github.com" -f ~/.ssh/id_ed25519 -N ""
    echo "✅ SSH 密钥已生成"
else
    echo "✅ SSH 密钥已存在"
fi

echo ""
echo "======================================"
echo "  您的 SSH 公钥"
echo "======================================"
echo ""
cat ~/.ssh/id_ed25519.pub
echo ""
echo "======================================"
echo "  下一步操作"
echo "======================================"
echo ""
echo "1. 复制上面的 SSH 公钥（从 ssh-ed25519 到最后）"
echo ""
echo "2. 访问 GitHub SSH 设置页面："
echo "   https://github.com/settings/keys"
echo ""
echo "3. 点击 'New SSH key'"
echo ""
echo "4. 填写："
echo "   - Title: LAF Backend Deploy"
echo "   - Key: 粘贴刚才复制的公钥"
echo ""
echo "5. 点击 'Add SSH key'"
echo ""
echo "6. 配置完成后，运行："
echo "   git remote set-url origin git@github.com:3780010199-lzb/backend-api.git"
echo "   git push -u origin main"
echo ""
