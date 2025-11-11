# PM2 常用命令

## 启动和停止
```bash
# 启动应用
pm2 start ecosystem.config.js

# 停止应用
pm2 stop backend-api

# 重启应用
pm2 restart backend-api

# 删除应用
pm2 delete backend-api
```

## 查看状态
```bash
# 查看所有进程
pm2 list

# 查看详细信息
pm2 show backend-api

# 查看日志
pm2 logs backend-api

# 查看实时日志
pm2 logs backend-api --lines 100

# 查看错误日志
pm2 logs backend-api --err

# 查看输出日志
pm2 logs backend-api --out
```

## 监控
```bash
# 实时监控
pm2 monit

# 查看进程状态
pm2 status
```

## 保存和恢复
```bash
# 保存当前进程列表
pm2 save

# 恢复保存的进程列表
pm2 resurrect

# 清空已保存的进程列表
pm2 cleardump
```

## 重载和更新
```bash
# 零停机重载（推荐用于生产环境）
pm2 reload backend-api

# 更新 PM2
pm2 update
```

## 日志管理
```bash
# 清空所有日志
pm2 flush

# 安装日志轮转模块
pm2 install pm2-logrotate
```
