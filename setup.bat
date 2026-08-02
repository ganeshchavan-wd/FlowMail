@echo off
REM Run this once after unzipping, before opening the project in Android Studio.
echo Installing dependencies...
call npm install
if errorlevel 1 goto :error

echo Syncing Capacitor Android project...
call npx cap sync android
if errorlevel 1 goto :error

echo.
echo Done. Now open the 'android' folder in Android Studio and build.
goto :eof

:error
echo.
echo Something failed above - scroll up to see the error.
pause
