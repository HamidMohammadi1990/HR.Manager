@echo off
cd /d C:\Users\40312758\Desktop\hr.manager.front.end-main\EditionProject
echo === JavidHrm build === > build-log.txt
dotnet build JavidHrm.sln >> build-log.txt 2>&1
findstr /C:"Build succeeded" build-log.txt >nul
if %ERRORLEVEL% EQU 0 (
  echo === EF migration === >> build-log.txt
  dotnet ef migrations add InitialHrSchema -p src\Infrastructure\Edition.Infrastructure.Persistence -s src\Presentation\Edition.Api >> build-log.txt 2>&1
  echo MIGRATION_DONE >> build-log.txt
) else (
  echo BUILD_FAILED >> build-log.txt
)
echo ALL_DONE >> build-log.txt
