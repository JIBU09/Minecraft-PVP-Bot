@echo off
set currentDir=%~dp0
powershell -ExecutionPolicy Bypass -File "%currentDir%dolyStarter.ps1"
echo As long as this window is open Doly will stay on the server.