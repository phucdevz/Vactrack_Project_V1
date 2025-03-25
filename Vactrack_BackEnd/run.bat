@echo off
echo Vactrack Backend Builder & Runner

:: Tìm file pom.xml trong thư mục chứa file batch này hoặc thư mục cha của nó
set PROJECT_DIR=%~dp0
if exist "%PROJECT_DIR%pom.xml" (
    echo Tìm thấy file pom.xml trong thư mục: %PROJECT_DIR%
) else (
    if exist "%PROJECT_DIR%..\pom.xml" (
        set PROJECT_DIR=%PROJECT_DIR%..
        echo Tìm thấy file pom.xml trong thư mục cha: %PROJECT_DIR%
    ) else (
        echo ERROR: Không tìm thấy file pom.xml. Hãy đặt file batch này trong thư mục dự án Maven.
        pause
        exit /b 1
    )
)

:: Di chuyển đến thư mục dự án
cd /d "%PROJECT_DIR%"
echo Thư mục dự án hiện tại: %cd%

:: Build ứng dụng
echo Building Vactrack Backend...
call mvn clean package -DskipTests

:: Kiểm tra kết quả build
if %ERRORLEVEL% NEQ 0 (
    echo Build thất bại!
    pause
    exit /b 1
)

:: Chạy ứng dụng
echo Starting Vactrack Backend...
java -jar target\Vactrack_BackEnd-0.0.1-SNAPSHOT.jar

pause