/**
	* File related methods
	* @namespace
	* @category DuESF
*/
var DuFile = {};

/**
 * The list of legit characters for base64 encoding
 * @type {string[]}
 */
DuFile.base64Chars = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"+",
	"/",
];

/**
	* Checks if the given path exists
	* @param {string}	 [path]	- The file path
	* @return {boolean} True or false
*/
DuFile.exists = function(path)
{
	var file;
	if (path instanceof File) file = path;
	else file = new File(path);
	return file.exists;
}

/**
	* Reads the first line of a file and return its content
	* @param {File|string}	 file	- The file
	* @return {string} The content
*/
DuFile.readFirstLine = function(file)
{
    if (jstype(file) == 'string') file = new File(file);
	//open and parse file
	if (!file.open('r')) return '';
	var data = file.readln();
	file.close();
	return data;
}

/**
	* Reads a whole file and return its content
	* @param {File|string}	 file	- The file
	* @param {string}	 [encoding='UTF-8']	- The text encoding
	* @return {string} The content
*/
DuFile.read = function(file,encoding)
{
    if (jstype(file) == 'string') file = new File(file);
	encoding =  def(encoding, 'UTF-8');
	//open and parse file
	file.encoding = encoding;
	if (!file.open('r')) return '';
	var data = file.read();
	file.close();
	return data;
}

/**
	* Writes a text file
	* @param {File}	 file	- The file
	* @param {string}	 content	- The content to write
	* @param {boolean}	 [append=false]	- Appends instead of replacing
	* @param {string}	 [encoding='UTF-8']	- The text encoding
    * @return {boolean} true if the file has been correctly written
*/
DuFile.write = function(file, content, append, encoding)
{
	if (!(file instanceof File)) file = new File(file);
	append = def(append, false);
	encoding = def(encoding, 'UTF-8');

	file.encoding = encoding;
	var mode = 'w';
	if (append) mode = 'a';
	
	try
	{
		if (!file.open(mode)) return false;
		file.write(content);
		file.close();
		return true;
	}
	catch (e)
	{
		DuDebug.throwError( "Can't write file" , 'DuFile.write', e);
	}
	
    return false;
}

/**
	* Writes a line in a text file
	* @param {File}	 file	- The file
	* @param {string}	 content	- The content to write
	* @param {boolean}	 [append=false]	- Appends instead of replacing
	* @param {string}	 [encoding='UTF-8']	- The text encoding
    * @return {boolean} true if the file has been correctly written
*/
DuFile.writeln = function(file, content, append, encoding)
{
	append = def(append, false);
	encoding = def(encoding, 'UTF-8');
	//open and parse file
	file.encoding = encoding;
	var mode = 'w';
	if (append) mode = 'a';
	
	try
	{
		if (!file.open(mode)) return false;
		file.writeln(content);
		file.close();
		return true;
	}
	catch (e)
	{
		DuDebug.throwError( "Can't write file" , 'DuFile.write', e);
	}
	
    return false;
}

/**
	* Parses a JSON file
	* @param {File}	 file	- The file
	* @return {Object|null} The content or null if the file couldn't be parsed
*/
DuFile.parseJSON = function(file)
{
	if (!(file instanceof File)) file = new File(file);
	if (!file.exists) return {};
	//open and parse file
	var json = DuFile.read(file);
	if (json == '') return null;
	var data = {};

	try { data = JSON.parse(json); } catch (e) { if (DuESF.debug) alert(e.description + '\n\nJSON DATA:\n\n' + json); }
	return data;
}

/**
	* Saves a js object to a JSON file
	* @param {Object} obj - The object to save
	* @param {File|string} file - The file or URI
	* @return {boolean} true if the file has been correctly written
*/
DuFile.saveJSON = function (obj,file)
{
	if (!(file instanceof File)) file = new File(file);
	var data = JSON.stringify(obj,null,4);
    return DuFile.write( file, data );
}

/**
	* Parses a CSV file
	* @param {File}	 file	- The file
	* @param {string}	 [delimiter=',']	- The delimiter used
	* @param {string}	 [textSeparator='"']	- The separator for texts
	* @return {string[]|null} The content (a two-dimensionnal Array) or null if the file couldn't be parsed
*/
DuFile.parseCSV = function(file,delimiter,textSeparator)
{
	if (!isdef( delimiter )) delimiter = ',';
	if (!isdef( textSeparator )) textSeparator = '"';
	var reQuoted = new RegExp("(" + textSeparator + ")((?:\\\\\\1|(?:(?!\\1).))*)\\1");
	//open and parse file
	var data = DuFile.read(file);
	if (data == '') return null;
	data = data.split('\n');
	for (var i = 0, num = data.length; i < num; i++)
	{
		//get quoted values
		var quotedValues = [];
		var line = data[i];
		var quoted = reQuoted.exec(line);
		while (quoted)
		{
			quotedValues.push(quoted[2]);
			line = line.replace(quoted[0],'%%');
			quoted = reQuoted.exec(line);
		}
		data[i] = line.split(delimiter);
		for (var j = 0, numJ = data[i].length; j < numJ; j++)
		{
			data[i][j] = DuString.trim(data[i][j]);
			if (data[i][j] == '%%')
			{
				data[i][j] = quotedValues.shift();
			}
		}
	}
	return data;
}

/**
 * Encodes a file to a base64 string.
 * @param {string|File} file The file or its path
 * @return {string} The base64 string
 */
DuFile.toBase64 = function( file )
{
	if (!(file instanceof File)) file = new File(file);
    if (!file.exists) return "";

    file.encoding = "binary";
    file.open("r");
    var bin = file.read();
    file.close();

    var ecdStr = Base64.btoa(bin);

    return ecdStr;
}

/**
 * Checks if the base64 string seems valid
 * @param {string} b64 The string to check
 * @return {bool}
 */
DuFile.checkBase64 = function ( b64 )
{
	var len = b64.length

    if (len % 4 > 0) {
        return false;
    }

    // If there's a dot, that's probably a file name
    if ( b64.indexOf(".") >= 0 )
        return false;

    return true;
}

/**
 * Writes a file from a base64 string.
 * @param {string} b64 The base64 string
 * @param {string|File} file The destination file or its path
 * @return {File|null} The File object or null if it fails
 */
DuFile.fromBase64 = function( b64, file )
{
	if (b64 == "") return null;
    if (!DuFile.checkBase64(b64)) return null;

    // Convert to bin
    var bin = Base64.atob(b64);

    // Write to file
    if (!(file instanceof File)) file = new File( file );
    file.encoding = 'BINARY';

    try
	{
        if (!file.open('w')) return null;
        file.write(bin);
		file.close();
		return file;
    }
    catch (e) { return null; }
}

/**
	* Shows the default save file dialog and returns the file selected by the user.<r />
	* If the user ommits the extension, the default extension will be appended (Mac OS fix).
	* @param {string}	 prompt	- The prompt text, displayed if the dialog allows a prompt.
	* @param {string}	 [filter='']	- The file type filter (windows only)
	* @param {string}	 [defaultExtension='']	- The default extension
	* @return {File|null} The file or null if the user cancels
*/
DuFile.saveDialog = function(prompt, filter, defaultExtension)
{
	defaultExtension = def( defaultExtension, '' );

	var saveFile = File.saveDialog(prompt, filter);
	if (!saveFile) return null;

	if (saveFile.name.indexOf('.') < 1 && defaultExtension != '')
	{
		if (defaultExtension.indexOf('.') != 0) defaultExtension = '.' + defaultExtension;
		saveFile = new File(saveFile.parent.absoluteURI + '/' + saveFile.name + defaultExtension);
	}

	return saveFile;
}

/**
	* Gets the number of a frame from an file/image sequence<br />
	* The number must be right before the extension.
	* @param {string}	path	- The path of the frame
*/
DuFile.getSequenceNumber = function(path)
{
	var string_noExt = path.substring(0,path.lastIndexOf('.'));
	var numberi = 0;
	var namei = 0;
	for(var i = string_noExt.length-1;i>=0;i--)
	{
		if(isNaN(parseInt(string_noExt.charAt(i))))
		{
			numberi = i+1;
			break;
		}
	}
	number = string_noExt.substring(numberi,string_noExt.length);
	return number;
}

/**
 * Moves a file to a new location
 * @param {string|File} file The file
 * @param {string|File} newURI The new URI/Path (including file name)
 * @return {File|null} the new file object, or null if it could not be moved
 */
DuFile.move = function(file, newURI) {
	if (!(file instanceof File)) file = new File(file);

	if (!file.exists) return null;

	if (file.copy(newURI)) {
		file.remove();
		var f = new File(newURI);
		if (f.exists) return f;
		else return null;
	}
	return null;
}