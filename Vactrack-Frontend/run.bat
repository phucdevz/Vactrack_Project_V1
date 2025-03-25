@echo off
title Trinh Khoi Dong Du An Node.js
color 0B
cls
echo.
echo    ---------------------------------------------------
echo    /                                                 /           
echo    /           HE THONG KHOI DONG TU DONG            /           
echo    /         DU AN VACTRACK NHOM TRUONGPHUC          /        
echo    /                                                 /            
echo    ---------------------------------------------------
echo.

echo    [*] Dang khoi tao moi truong phat trien...
ping -n 2 127.0.0.1 >nul

echo    [*] Dang phan tich cau truc du an...
ping -n 2 127.0.0.1 >nul

echo    [*] Dang kiem tra thu muc node_modules...

if not exist "node_modules\" (
    color 0E
    echo    [!] CANH BAO: Thu muc node_modules khong ton tai.
    echo    [*] Dang cai dat cac goi phu thuoc...
    echo    ───────────────────────────────────────────────────────────────
    npm install
    echo    ───────────────────────────────────────────────────────────────
    color 0A
    echo    [DONE] CAI DAT HOAN TAT!
) else (
    echo    [DONE] Da tim thay thu muc node_modules.
    echo    [*] Dang kiem tra tinh toan ven cua cac goi...
    ping -n 2 127.0.0.1 >nul
    echo    [DONE] Kiem tra hoan tat - Moi truong san sang.
)

echo.
echo    ---------------------------------------------------
echo    /                                                 /           
echo    /              KHOI DONG MOI TRUONG               /           
echo    /              PHAT TRIEN BY SV UTH               /        
echo    /                                                 /            
echo    ---------------------------------------------------
echo.


:: Hieu ung dem nguoc nho
echo    [*] Khoi dong trong:
echo    [*] 3...
ping -n 2 127.0.0.1 >nul
echo    [*] 2...
ping -n 2 127.0.0.1 >nul
echo    [*] 1...
ping -n 2 127.0.0.1 >nul

color 0A
echo    [RUN] DANG KHOI DONG DU AN...
echo    --------------------------------------------------
npm run dev