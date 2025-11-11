# 服务器自动启动指南

## 问题解决 ✅

现在服务器会在您打开Windsurf项目时**自动启动**！

## 如何工作

### 方案1: VSCode自动任务（已配置）
- 打开项目时，VSCode会自动运行PM2启动服务器
- 配置文件：`.vscode/tasks.json` 和 `.vscode/settings.json`
- 服务器在后台运行，不会阻塞您的工作

### 方案2: PM2持久化运行
PM2让服务器持续在后台运行，即使关闭Windsurf也不会停止。

#### PM2常用命令：
```bash
# 启动服务器
npm run pm2:start
# 或
pm2 start ecosystem.config.js

# 停止服务器
npm run pm2:stop
# 或
pm2 stop backend-api

# 重启服务器
npm run pm2:restart

# 查看服务器状态
npm run pm2:status

# 查看服务器日志
npm run pm2:logs
```

## 当前服务器状态

✅ 服务器已启动并运行在 **http://localhost:5000**

## 手动控制

如果需要手动控制服务器，可以：

1. **使用VSCode任务**：
   - 按 `Ctrl+Shift+P` (或 `Cmd+Shift+P`)
   - 输入 "Tasks: Run Task"
   - 选择相应的任务（启动/停止/重启/查看状态/查看日志）

2. **使用npm脚本**：
   ```bash
   npm run pm2:start    # 启动
   npm run pm2:stop     # 停止
   npm run pm2:restart  # 重启
   npm run pm2:status   # 状态
   npm run pm2:logs     # 日志
   ```

3. **直接使用PM2命令**（如上所示）

## 注意事项

- **首次使用**：关闭并重新打开Windsurf，服务器会自动启动
- **PM2后台运行**：服务器会一直运行，即使关闭Windsurf
- **完全停止**：如果要彻底停止服务器，运行 `pm2 stop backend-api`
- **查看日志**：日志文件在 `./logs/` 目录下

## 故障排查

如果服务器没有自动启动：
1. 确保 `.vscode/settings.json` 中 `task.allowAutomaticTasks` 设置为 `"on"`
2. Windsurf可能会提示是否允许自动任务，请选择"允许"
3. 手动运行 `npm run pm2:start` 启动服务器

## 系统启动时自动运行（可选）

如果希望系统启动时自动运行服务器：
```bash
# 保存当前PM2进程列表
pm2 save

# 生成开机启动脚本
pm2 startup
# 然后按照提示运行显示的命令
```
