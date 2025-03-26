@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

:: ================================
:: Vactrack Backend - Build & Run
:: ================================
echo.
echo [36m======================================[0m
echo   [32mVactrack Backend Builder & Runner[0m
echo [36m======================================[0m
echo.

:: Xác định thư mục dự án Maven
set "PROJECT_DIR=%~dp0"
if exist "%PROJECT_DIR%pom.xml" (
    echo [32m[INFO][0m Found pom.xml in: %PROJECT_DIR%
) else if exist "%PROJECT_DIR%..\pom.xml" (
    set "PROJECT_DIR=%PROJECT_DIR%.."
    echo [32m[INFO][0m Found pom.xml in parent directory: %PROJECT_DIR%
) else (
    echo [31m[ERROR][0m pom.xml not found! Please place this script in a Maven project directory.
    pause
    exit /b 1
)

:: Di chuyển vào thư mục dự án
cd /d "%PROJECT_DIR%"
echo [32m[INFO][0m Project directory: %cd%

echo.
echo [36m======================================[0m
echo           [33mBuilding Project[0m
echo [36m======================================[0m
echo.
:: Thực hiện build với Maven
call mvn clean package -DskipTests

:: Kiểm tra kết quả build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [31m[ERROR][0m Build failed! Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo [36m======================================[0m
echo         [32mStarting Application[0m
echo [36m======================================[0m
echo.
:: Chạy ứng dụng
java -jar target\Vactrack_BackEnd-0.0.1-SNAPSHOT.jar

:: Giữ cửa sổ mở sau khi chạy
pause
endlocal