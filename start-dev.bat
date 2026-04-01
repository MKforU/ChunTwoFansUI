@echo off
chcp 65001 >nul 2>&1
title MKforChunTwo 粉丝站

call "F:\APP\Tool\Node.js\nodevars.bat" >nul 2>&1

cd /d "F:\APP\小玩具\MKforChunTwo"

echo.
echo ========================================
echo   MKforChunTwo 粉丝站开发服务器
echo ========================================
echo.
echo 正在启动开发服务器...
echo 访问地址: http://localhost:3000
echo.
echo 按 Ctrl+C 停止服务器
echo.

call npm run dev
