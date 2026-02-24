@echo off
echo ==========================================
echo       趣味拼音 - 本地测试服务器启动
echo ==========================================
echo.
echo 正在检查并安装必要的依赖，请稍等...
call npm install --silent

echo.
echo 启动本地服务器中...
echo 请在浏览器中访问 http://localhost:3000
echo (如需关闭服务器，请直接关闭此窗口)
echo.

call npm run dev

pause
