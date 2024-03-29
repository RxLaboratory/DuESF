﻿/**
 * Constructs a new string representation of a binary file
 * @class DuBinary
 * @classdesc Represents a binary file as a string and a filename.
 * @param	{string}	binAsString			- The string representation.
 * @param	{string}	fileName			- The name of the original file.
 * @param	{string}	[category='']			- A Category for the file, will be used as a subfolder to extract files. Can have subcategories like "category/subcategory".
 * @category DuESF
 */
function DuBinary( binAsString, fileName, category)
{
    /**
        * The string representation of the binary file.
        * @memberof DuBinary
        * @type {string}
        * @name binAsString
        */
	this.binAsString = binAsString;

	fileName = DuString.replace(fileName,'%20','_');
    /**
        * The name of the original file.
        * @memberof DuBinary
        * @type {string}
        * @name fileName
        */
	this.fileName = fileName;

	if (category === undefined) category = '';
    /**
        * A Category for the file, will be used as a subfolder to extract files. Can have subcategories like "category/subcategory".
        * @memberof DuBinary
        * @type {string}
        * @name category
        */
	this.category = category;
}

/**
 * Returns a string representation of the {@link DuBinary} which can be written in a jsxinc file.
 * @returns {string} The source.
 */
DuBinary.prototype.toSource = function ()
{
    return 'new DuBinary( "' + this.binAsString + '", "' + this.fileName + '", "' + this.category + '" )';
}

/**
 * Writes the file.
 * @param {string}			[outputFileName=DuFolder.duesfData/category/binaryfilename]	- The output filename.
 * @param {boolean}			[onlyAtFirstRun=true]	- Does not extract the file if it already exists and this is not the first time this version of the script is being used.<br />
 * The file will be extracted only if the script is new or has just been updated (the version changed).
 * @return {File|null} The file created, null if the file could not be written.<br />
 * If the file is not written, check user permissions, and check if the file and network access preference is checked.
 * @example
 * //First, include the text representation of the file (Add a # before the include word)
 * include executable.exe.jsxinc
 * // Now, a variable called `executable` (the original file name without extension) is available, it's an instance of DuBinary.
 * var execFile = executable.extract();
 * //Now, the file exists in the file system, and execFile is an ExtendScript File object.
 * // The `DuBinary.extract()` method extracts the file to the Application Data folder by default.
 * execFile.fsName; // C:\users\duduf\appData\Roaming\RxMaboratory\AdobeScripts\DuESF\icon.png (Example on Windows)
 * @example
 * //You can specify the output file name. (Add a # before the include word)
 * include preset.ffx.jsxinc
 * var presetFile = preset.extract("C:/test/test_preset.ffx");
 * presetFile.fsName; // C:\test\test_preset.exe");
 */
DuBinary.prototype.toFile = function( outputFileName, onlyAtFirstRun )
{
    onlyAtFirstRun = def( onlyAtFirstRun, true );

    var rootFolder = DuFolder.duesfData.absoluteURI;
    outputFileName = def( outputFileName, rootFolder + '/' + this.category + '/' + this.fileName )

    var file = new File(outputFileName);

    // performance
    // do not extract if the file exists and we're not in the first run (or debug mode)
    if (file.exists && !DuESF.scriptFirstRun && !DuESF.debug && onlyAtFirstRun)
    {
        return file;
    }

	if (!file.exists)
	{
		var folder = new Folder(file.path);
		if (!folder.exists)
		{
			folder.create();
		}
	}

    DuFile.write( file, this.binAsString, false, 'BINARY');

    return file;
}

/**
 * Writes the DuBinary to a jsxinc file
 * @param {string} outputFilePath  - The file path for the output.
 * @param {any} [varName=File name without extension]	- The name of the variable used to store the javascript object.
 * @returns {File} the new jsxinc file.
 */
DuBinary.prototype.toJsxincFile = function( outputFilePath, varName )
{
    var fileName = DuPath.getBasename(outputFilePath);
    varName = def (varName, fileName.replace(/\..+/,'') );
	varName = DuString.replace(varName,'%20','_');

    var jsString = 'var ' + varName + ' = ' + this.toSource() + ';\r\n' + varName + ';\r\n';

	var outputFile = new File( outputFilePath );
	outputFile.encoding = 'UTF8';
	if (outputFile.open("w", "TEXT", "????"))
	{
		outputFile.write(jsString);
		outputFile.close();
	}
    
    return outputFile;
}

// =============== STATIC =====================

/**
 * Creates a {@link DuBinary} object from an existing file
 * @static
 * @param {File}    file      - The File to convert
 * @param {string}  [category]  - A Category for the file, will be used as a subfolder to extract files. Can have subcategories like "category/subcategory".
 * @return {DuBinary} The {@link DuBinary} object containing the file as a string
 */
DuBinary.fromFile = function ( file, category )
{
    var content = '';

    file.encoding = "BINARY";
    if (file.open("r"))
    {
        content = file.read().toSource();
        content = content.substr(content.indexOf("\"")+1, content.length);
        content = content.substr(0, content.lastIndexOf("\""));
        file.close();
    }

    return new DuBinary(content,file.name,category);
}

/**
 * Converts a file to a jsxinc file
 * @static
 * @param {File}    file      - The binary file to convert
 * @param {string}  [category]        - A Category for the file, will be used as a subfolder to extract files. Can have subcategories like "category/subcategory". Default is the name of the folder containing the file.
 * @param {string}  [outputFilePath=Same folder, same name with .json extension]  - The file name for the output.
 * @param {string}	[varName=File name without extension]	- The name of the variable used to store the javascript object.
 * @return {File} The jsxinc file created
 */
DuBinary.toJsxincFile = function(file,category,outputFilePath,varName)
{
    category = def (category, file.parent.name );
    outputFilePath = def (outputFilePath, file.absoluteURI + '.jsxinc' );
	var duBinary = DuBinary.fromFile(file,category);
	return duBinary.toJsxincFile( outputFilePath, varName );
}

// ============== DEPRECATED ==================

/**
 * Creates a file from a DuBinary object representation.
 * @static
 * @deprecated
 * @param {DuBinary}	DuBinary  	- The DuBinary object containing the string representation.<br />
 * This object will be replaced by the File object created.<br />
 * If a file object is provided (the file has already been extracted), does nothing.
 * @param {string}			[outputFileName=DuFolder.duesfData/DuAEF/scriptName/category/binaryfilename]	- The output filename.
 * @param {boolean}			[onlyAtFirstRun=true]	- Does not extract the file if it already exists and this is not the first time this version of the script is being used.<br />
 * The file will be extracted only if the script is new or has just been updated (the version changed).
 * @return {File|null} The file created, null if the file could not be written.<br />
 * If the file is not written, check user permissions, and check if the file and network access preference is checked.
 * @example
 * //First, include the text representation of the file (Add a # before the include word)
 * include executable.exe.jsxinc
 * // Now, a variable called `executable` (the original file name without extension) is available, you can pass this object to the `DuBinary.toFile()` method to extract it and get an ExtendScript File object representation of it.
 * // Note: This object is an instance of a `DuBinary` class, which contains all information and a string representation of the original binary file
 * var execFile = DuBinary.toFile(executable);
 * //Now, the file exists in the file system, and execFile is an ExtendScript File object.
 * // The `DuBinary.toFile()` method extracts the file to the Application Data folder by default.
 * execFile.fsName; // C:\users\duduf\appData\Roaming\DuAEF\icon.png (Example on Windows)
 * @example
 * //You can specify the output file name. (Add a # before the include word)
 * include preset.ffx.jsxinc
 * var presetFile = DuBinary.toFile(preset,"C:/test/test_preset.ffx");
 * presetFile.fsName; // C:\test\test_preset.exe");
 * @category DuESF
 */
DuBinary.toFile = function(DuBinary,outputFileName,onlyAtFirstRun)
{
    onlyAtFirstRun = def( onlyAtFirstRun, true );
    if (!isdef( DuBinary )) return;
	if (DuBinary instanceof File) return;
    var rootFolder = DuFolder.duesfData.absoluteURI;
    if (DuESF.scriptName != '') rootFolder += '/'  + DuESF.scriptName;
	if (!isdef( outputFileName )) outputFileName = rootFolder + '/' + DuBinary.category + '/' + DuBinary.fileName;
	var file = new File(outputFileName);

  // performance
  // do not extract if the file exists and we're not in the first run (or debug mode)
  if (file.exists && !DuESF.scriptFirstRun && !DuESF.debug)
  {
    return file;
  }

	if (!file.exists)
	{
		var folder = new Folder(file.path);
		if (!folder.exists)
		{
			folder.create();
		}
	}

	file.encoding = 'BINARY';
	if (file.open('w'))
	{
		success = file.write(DuBinary.binAsString);
		file.close();
	}

	DuBinary = file;

	return file;
}

/**
 * Converts a JS file to a binary file
 * @deprecated
 * @static
 * @param {File}    jsFile        - The JS file to convert
 * @param {string}	[outputFileName=DuFolder.duesfData/category/binaryfilename]	- The output filename.
 * @return {File} The binary file created, or null if failed
 * @example
 * //If you don't want to include the file in the script. (Add a # before the include word)
 * var stringFile = new File("C:\test\image.jpg.jsxinc");
 * var jpgFile = DuBinary.convertToBinaryFile(stringFile);
 * // Warning, this method uses `$.eval()` which is a bad security issue.
 * // Do not use this method for anything else than debugging and testing.
 */
DuBinary.convertToBinaryFile = function(jsFile,outputFileName)
{
	//TODO parse instead of eval
	var obj = $.eval(jsFile);
	return this.toFile(obj);
}

