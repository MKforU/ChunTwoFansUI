@echo off
chcp 65001 >nul
set PATH=F:\APP\Tool\Node.js;%PATH%

echo ========================================
echo   MKforChunTwo 粉丝站构建
echo ========================================
echo.

cd /d "F:\APP\小玩具\MKforChunTwo"

echo 正在构建生产版本...
call npm run build

echo.
echo ========================================
echo   构建完成！
echo   输出目录: F:\APP\小玩具\MKforChunTwo\dist
echo ========================================
pause
