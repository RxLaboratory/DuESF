
/**
 * Folder related methods
 * @namespace
 * @category DuESF
 */
var DuFolder = {};

/**
 * Recursively remove all content from folder and the folder itself. Warning, this does not move files to the recycle bin and can not be undone.
 * @param {string|Folder} folder - the path or Folder object to wipe.
 */
DuFolder.wipeFolder = function(folder)
{
	if ( jstype(folder) == 'string' && folder != '') folder = new Folder(folder);
	if ( !folder.exists ) return;

	//get content and remove 
	var files = folder.getFiles();
	var it = new DuList(files);
	it.do(function (file)
	{
		if ( jstype(file) == 'folder' ) DuFolder.wipeFolder(file);
		else file.remove();
	});
	folder.remove();
}

/**
	* Recursively gets all files in a folder using a name filter
	* Returns an array of File objects.
	* @param {Folder}	folder	- The Folder
	* @param {string|function}	[filter="*"]	- A search mask for file names, specified as a string or a function.
	* A mask string can contain question mark (?) and asterisk (*) wild cards. Default is "*", which matches all file names.
	* Can also be the name of a function that takes a File or Folder object as its argument. It is called for each file or folder found in the search; if it returns true, the object is added to the return array.
	* @return {Array}	The files found.
*/
DuFolder.getFiles = function (folder,filter)
{
	function isFolder(f) { return f instanceof Folder; }

	if (!isdef( folder )) return [];
	if (!(folder instanceof Folder)) return [];

	var files = folder.getFiles(filter);
	if (files === null) files = [];

	var folders = folder.getFiles( isFolder );

	for (var i = 0, num = folders.length ; i < num ; i++)
	{
		files = files.concat(DuFolder.getFiles(folders[i],filter));
	}
	return files;
}

/**
 * Tests if a folder can be read
 * @param {Folder|string} folder The folder
 * @return {bool}
 */
DuFolder.canRead = function (folder) {
	if ( jstype(folder) == 'string' && folder != '') folder = new Folder(folder);
	if ( !folder.exists ) return false;

	function isFile(f) { return f instanceof File; }

	// Try to list files
	try {
		f = folder.getFiles( isFile );
		/*if (f.length > 0) {
			if (f[0].open('r')){
				f.read();
				f.close();
				return true;
			}
			return false;
		}//*/
		return true;
	}
	catch (e) { return false; }
}

/**
 * Tests if a folder can be written
 * @param {Folder|string} folder The folder
 * @return {bool}
 */
DuFolder.canWrite = function (folder) {
	if ( jstype(folder) == 'string' && folder != '') folder = new Folder(folder);
	if ( !folder.exists ) return false;

	var content = 'test-write-access';
	var f = new File(folder.absoluteURI + '/' + content);

	if (f.open('w')) {
		try {
			f.write(content);
			f.close();
			f.remove();
			return true;
		}
		catch(e) { return false };
	} else return false;
}

// Low-level undocumented function. Called by DuESF.init()
DuFolder.init = function()
{
	DuFolder.duesfData = new Folder( DuPath.join( [
		DuFolder.userData.absoluteURI,
		DuESF.companyName,
		'AdobeScripts',
		DuESF.scriptName
		] ) );

}
DuESF.initMethods.push( DuFolder.init );

/**
 * The default user data folder.<br />
 * Replaces the Folder.userData provided by ESTK which does not work properly with mac network sessions.<br />
 * In windows, the value of %APPDATA% ("C:\Documents and Settings\username\Application Data")<br />
 * In Mac OS, "~/Library/Application Support"
 * @type {Folder}
 */
DuFolder.userData = Folder.userData;
if (DuSystem.mac) DuFolder.userData = new Folder('~/Library/Application Support');
// We absolutely need write access... If not, use a temp folder
if (!DuFolder.canWrite(DuFolder.userData)) DuFolder.userData = Folder.temp;

DuFolder.duesfData = new Folder( DuPath.join( [
		DuFolder.userData.absoluteURI,
		DuESF.companyName,
		'AdobeScripts',
		DuESF.scriptName
		] ) );
