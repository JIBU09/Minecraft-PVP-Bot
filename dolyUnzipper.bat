@echo off
setlocal


echo -----Waiting 30 seconds till the download is complete-----
echo !!---DO NOT CLOSE THIS WINDOW---!!
timeout /t 30 /nobreak >nul

:startUnzipping
if not exist "%userprofile%\Downloads\Minecraft-PVP-Bot-main.zip" (
    echo !!---Error: File not found---!! 
    echo -----Trying again in 30 seconds-----
    timeout /t 30 /nobreak >nul
    goto startUnzipping
)


Call :UnZipFile "%~dp0" "%userprofile%\Downloads\Minecraft-PVP-Bot-main.zip"
exit /b

:UnZipFile <ExtractTo> <newzipfile>
set vbs="%temp%\_.vbs"
if exist %vbs% del /f /q %vbs%
echo Set fso = CreateObject("Scripting.FileSystemObject") >>%vbs%
echo If NOT fso.FolderExists(%1) Then >>%vbs%
echo     fso.CreateFolder(%1) >>%vbs%
echo End If >>%vbs%
echo set objShell = CreateObject("Shell.Application") >>%vbs%
echo set FilesInZip=objShell.NameSpace(%2).items >>%vbs%
echo objShell.NameSpace(%1).CopyHere(FilesInZip) >>%vbs%
echo Set fso = Nothing >>%vbs%
echo Set objShell = Nothing
cscript //nologo %vbs%
if exist %vbs% del /f /q %vbs%
del "%userprofile%\Downloads\Minecraft-PVP-Bot-main.zip"