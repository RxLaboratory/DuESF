@echo off

:: The version
IF "%~1"=="" (
    SET version=1.0.3
) ELSE (
    SET version=%~1
)

:: The repo (current dir)
SET repoPath=%~dp0..\..

:: The build path
SET build_path=%~dp0output
:: The dist path to copy the result
SET dist_path="%repoPath%\dist"
:: The docs path
SET docs_path="%repoPath%\docs"
:: The types path
SET types_path="%repoPath%\types\duesf"

echo Building DuESF version %version%...

:: Clean
echo __Cleaning build paths

rd /s /q "%build_path%"
md "%build_path%"
rd /s /q "%dist_path%"
md "%dist_path%"
rd /s /q "%docs_path%"
md "%docs_path%"
rd /s /q "%types_path%"
md "%types_path%"

:: Build
echo __Building library
DuBuilder "%repoPath%\src\DuESF.jsxinc" --no-banner -r "{duesfVersion}:%version%" "%build_path%\DuESF.jsxinc"

:: Generate doc
echo __Generating docs
cmd /c jsdoc -c jsdoc_conf.json
echo " " > "%docs_path%\jsdoc.css"
xcopy /Y jsdoc.css "%docs_path%\jsdoc.css"

:: Generate type defs
echo __Generating type defs
cmd /c jsdoc -c jsdoc_ts_conf.json

:: Include the doc in the output folder and
:: Replace indexes
echo __Finishing...
xcopy /Y "%docs_path%\DuESF.html" "%docs_path%\index.html"
xcopy /S /I /Y "%docs_path%" "%build_path%\docs"
xcopy /S /I /Y "%types_path%\.." "%build_path%\types"
echo " " > "%dist_path%\DuESF.jsxinc"
xcopy /Y "%build_path%\DuESF.jsxinc" "%dist_path%\DuESF.jsxinc"

pause