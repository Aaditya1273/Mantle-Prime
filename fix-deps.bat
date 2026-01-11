@echo off
echo 🔧 Fixing dependency conflicts...

echo 🗑️  Removing node_modules and package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo 🧹 Clearing npm cache...
npm cache clean --force

echo 📦 Installing dependencies with legacy peer deps...
npm install --legacy-peer-deps

if %errorlevel% equ 0 (
    echo ✅ Dependencies fixed successfully!
    echo 🚀 You can now run: npm run build
) else (
    echo ❌ Error fixing dependencies
    echo 💡 Try running these commands manually:
    echo    rmdir /s /q node_modules
    echo    del package-lock.json
    echo    npm cache clean --force
    echo    npm install --legacy-peer-deps
)