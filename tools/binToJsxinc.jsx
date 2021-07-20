/*
	binToJsxinc, DuBinary Converter
    Small tool to convert binary files to .jsxinc files 
	Copyright (c) 2017-2021 Nicolas Dufresne
	https://rxlaboratory.org
*/

(function()
{
    #include "../DuESF.jsxinc"

    var file = File.openDialog ("Select File(s)",undefined,true);
    if (!file) return;

    for (var i = 0 ; i < file.length ; i++)
    {
        DuBinary.toJsxincFile(file[i],file[i].parent.name);
    }
})();