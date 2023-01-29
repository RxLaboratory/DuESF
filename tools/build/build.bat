@echo off

cd ..
cd ..
del /s /q docs
rmdir /s /q docs
mkdir docs
cd tools
cd build
mkdir output
DuBuilder ..\..\DuESF.jsxinc -d jsdoc_conf.json output\DuESF.jsxinc
xcopy /Y jsdoc.css ..\..\docs\jsdoc.css
xcopy /S /I /Y ..\..\docs output\docs
cd output\docs
xcopy /Y DuESF.html index.html
cd ..
cd ..
cd ..
cd ..
cd docs
xcopy /Y DuESF.html index.html
pause