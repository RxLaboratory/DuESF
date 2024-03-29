﻿/**
	* Paths related methods
	* @namespace
	* @category DuESF
*/
var DuPath = {}

/**
 * Units to use for sizes.
 * @readonly
 * @enum {string}
 */
DuPath.SizeUnit = {
	BIT: "b",
	BYTE: "B",
	KB: "kB",
	MB: "MB",
	GB: "GB",
	TB: "TB"
}

/**
	* Joins multiple paths togetther.
	* @param {string[]}	 [parts]	- The parts to join togehter
	* @param {String}	[sep="/"]	- The separator to use. If not defined, will look for the first sep in the path.
	* @return {String} The final path
*/
DuPath.join = function(parts, sep)
{
   var separator = sep || false;
   if(!separator)
   {
       // Find first "/" or "\"
       if(parts[0].indexOf('/') != -1) separator = '/';
       if(parts[0].indexOf('\\') != -1) separator = '\\';
   }
   if(!separator) separator = '/';
   var replace   = new RegExp(separator+'{1,}', 'g');  // Replace ///// with /
   return parts.join(separator).replace(replace, separator);
}

/**
 * Converts a number of Bytes to kB or MB or GB or TB
 * For conversion to bits, a Byte is considered to be 8 bits.
 * @param {int} size The size in Bytes to convert
 * @param {DuPath.SizeUnit} [to=DuPath.SizeUnit.MB] The unit to convert to, one of: b, kB, MB, GB, TB
 * @param {int} [decimals=2] The number of decimals to round the result
 * @return {float} The result of the conversion
 */
DuPath.sizeFromBytes = function(size,  to, decimals )
{
	to = def(to, DuPath.SizeUnit.MB);
	decimals = def(decimals, 0);

	var result = size;
	if (to == DuPath.SizeUnit.BIT) result = result * 8;
	if (to == DuPath.SizeUnit.KB || to == DuPath.SizeUnit.MB || to == DuPath.SizeUnit.GB || to == DuPath.SizeUnit.TB) result = result / 1024;
	if (to == DuPath.SizeUnit.MB || to == DuPath.SizeUnit.GB || to == DuPath.SizeUnit.TB) result = result / 1024;
	if (to == DuPath.SizeUnit.GB || to == DuPath.SizeUnit.TB) result = result / 1024;
	if (to == DuPath.SizeUnit.TB) result = result / 1024;
	var round = 1;
	for (var i = 0; i < decimals; i++)
	{
		round = round * 10;
	}
	result = Math.round(result*round)/round;
	return result;
}

/**
	* Returns the name of the given path or file, as displayed by the filesystem
	* @example
	* DuPath.getName(new File("D:\\code\\open\\Duik\\shape test.test")) // "shape test.test"
	* DuPath.getName("D:/code/open/Duik/other shape.test") // "other shape.test"
	* @param {String|File|Folder}  [pathOrFile]	- The file or the path
	* @return {String} The basename
*/
DuPath.getName = function(pathOrFile)
{
    if (pathOrFile instanceof File || pathOrFile instanceof Folder) pathOrFile = pathOrFile.fsName;
	else {
		//make sure it's the fsName we use
		pathOrFile = new File(pathOrFile).fsName;
	}
    var name = pathOrFile.split("/").pop();
    name = name.split("\\").pop();
    return name;
}

/**
	* Returns the basename of the given path or file
	* @example
	* DuPath.getBasename(new File("D:/code/open/Duik/shape.test")) // "shape"
	* DuPath.getBasename("D:/code/open/Duik/shape.test") // "shape"
	* @param {String|File}	 [pathOrFile]	- The file or the path
	* @return {String} The basename
*/
DuPath.getBasename = function(pathOrFile)
{
    if (pathOrFile instanceof File) pathOrFile = pathOrFile.fsName;
	else {
		//make sure it's the fsName we use
		pathOrFile = new File(pathOrFile).fsName;
	}
    var name = pathOrFile.split("/").pop();
    name = name.split("\\").pop();
    if(name.lastIndexOf(".") > 0) return name.slice(0, name.lastIndexOf("."));
    return name;
}

/**
	* Returns the extension of the given path or file
	* @example
	* DuPath.getExtension(new File("D:/code/open/Duik/shape.other.test")) // "test"
	* DuPath.getExtension("D:/code/open/Duik/shape.test") // "test"
	* @param {String|File}	 [pathOrFile]	- The file or the path
	* @return {String} The extension
*/
DuPath.getExtension = function(pathOrFile)
{
	if (pathOrFile instanceof Folder) return '';
    if (pathOrFile instanceof File) pathOrFile = pathOrFile.absoluteURI;
    var name = pathOrFile.split("/").pop();
    name = name.split("\\").pop();
    if(name.indexOf(".") > 0) return name.split(".").pop();
    return '';
}

/**
	* Switch the extension of the given path. Create a new path from a given path and a given extension.
	* @param {String|File}	 [pathOrFile]	- The file or the path
	* @param {String}	     [newExtension]	- The new extension
	* @return {String}  The new path
*/
DuPath.switchExtension = function(pathOrFile, newExtension)
{
	// Remove leading .
	if (newExtension.indexOf('.') == 0) newExtension = newExtension.substring(1);
    if (pathOrFile instanceof File) pathOrFile = pathOrFile.absoluteURI;
    var point = pathOrFile.lastIndexOf(".");
    if (point == -1) return pathOrFile + "." + newExtension;
    return pathOrFile.slice(0, point) + "." + newExtension;
}

/**
 * Generates a new unique name for a file
 * @param {string} newName	- The wanted new name
 * @param {Folder} folder 	- The folder
 * @param {boolean} [increment=true] - true to automatically increment the new name if it already ends with a digit
 * @return {string}	The unique name, with a new number at the end if needed.
 */
DuPath.newUniqueName = function ( newName, folder ) {   
	var file = new File(folder.absoluteURI + "/" + newName);
	while (file.exists)
	{
		file = new File(folder.absoluteURI + "/" + DuPath.incrementName(file) );
	}
	return DuPath.getName(file);
}

/**
 * Increments the last number before the extension in a filename
 * @param {File} file The file
 * @return {string} The incremented fileName
 */
DuPath.incrementName = function (file) {

	var ext = DuPath.getExtension(file);
	var baseName = DuPath.getBasename(file);

	var regex = /(\d*)$/
	var match = baseName.match(regex);
	var num = '_01';
	var numDigits = 0;
	if (match) {
		var n = match[0];
		numDigits = n.length;
		var n = parseInt(n);
		if (!isNaN(n)) {
			n++;
			num = DuNumber.toString(n,numDigits);
		}
	}

	return baseName.substring(0, baseName.length - numDigits) + num + '.' + ext;

}

/**
 * Removes all forbidden characters from a string to be used as a filename
 * @param {string} name - The filename to fix
 * @param {string} [placeholder='.'] - The string used to replace the forbidden characters
 * @return {string} The fixed filename
 */
DuPath.fixName = function (name, placeholder ) {
	placeholder = def( placeholder, '.');
	
	return name.replace( /([\/\\:*?"<>|])/g, placeholder);
}

/**
 * Checks if the given path represents an existing file
 * @param {File|Folder|string} path The path to check
 * @return {bool}
 */
DuPath.isFile = function(path) {
	if (jstype(path) == 'string')
	{
		path == new File(path);
		if (path.exists) return true;
		return false;
	}
	if (path instanceof File) return path.exists;
	return false;
}

/**
 * Checks if the given path represents an existing folder
 * @param {File|Folder|string} path The path to check
 * @return {bool}
 */
DuPath.isFolder = function(path) {
	if (jstype(path) == 'string')
	{
		path == new Folder(path);
		if (path.exists) return true;
		return false;
	}
	if (path instanceof Folder) return path.exists;
	return false;
}