/**
	* Constructs a new DuSettings instance.
	* @class DuSettings
	* @classdesc A class to manage settings.<br />
	 * Warning: DuESF stores the settings in json files and needs the right to write files, but it does not check if it has write access on the files, you should check that first using methods specific to the host application.
	* @param {string}	  [namespace=DuESF.scriptName]     - A namespace to group your settings.
	* @param {File|string}    [file=Folder.myDocuments/namespace/namespace_settings.json]    - The file to store the settings
	* @property {string}	  namespace	- A namespace to group your settings.
	* @property {File}		file	- The file to store the settings
	* @property {Object}	data	- The settings as a js object
	* @category DuESF
	*/
function DuSettings( namespace, file, dontSavePath )
{
	dontSavePath = def(dontSavePath, false);
	namespace = def(namespace, DuESF.scriptName);
	if ( DuDebug.checkVar( namespace, 'namespace', 'string', DuSettings ) !== true ) throw "Sorry, an error has occured in `new DuSettings()`.";

	if (namespace == "") throw "new Dusettings( namespace, file ): error\n\nnamespace can not be an empty string";

	// Get path from duesf settings
	if ( !isdef( file ) )
	{
		var filePath = DuESF.settings.get(namespace + "/scriptSettingsFile");
		if ( filePath ) file = new File( filePath );
	}

	// Generate default path
	if (!isdef( file ))
	{
		if (DuFolder.canWrite(Folder.myDocuments))
			file = new File( Folder.myDocuments.absoluteURI + "/" + namespace + "/" + namespace + "_settings.json" );
		else
			file = new File( Folder.temp.absoluteURI + "/" + namespace + "/" + namespace + "_settings.json" );
	}

	this.namespace = namespace;
	if (file instanceof File) this.file = file;
	else this.file = new File(file);
	this.file.encoding = 'UTF-8';
	this.folder = this.file.parent;
	
	if (!dontSavePath)
	{
		DuESF.settings.set(namespace + "/scriptSettingsFile", this.file.absoluteURI);
		DuESF.settings.save();
	}
	

	this.data = {};
	this.load();
}

/**
 * loads data from the settings file
 * @memberof DuSettings
 */
DuSettings.prototype.load = function()
{
	//load file
	if (this.file.exists)
	{
		this.data = DuFile.parseJSON( this.file );
		if (!this.data) this.data = {};
	}
}

/**
 * Saves data to the file.<br />
 * Warning: DuESF does not check if it has write access on the files, you should check that first using methods specific to the host application.
 * @memberof DuSettings
 * @return {boolean} true if the file has been correctly written
 */
DuSettings.prototype.save = function()
{
	try 
	{
		if ( !this.folder.exists ) this.folder.create();
	}
	catch (e)
	{
		DuDebug.throwError("Can't create folder", 'DuSettings.prototype.save', e);
		return false;
	}
	return DuFile.saveJSON(this.data, this.file);
}

/**
 * Sets the file to be used to save the settings
 * @param {File|string} file The file or path to the file
 */
DuSettings.prototype.setFile = function(file, dontSavePath)
{
	if (file instanceof File) this.file = file;
	else this.file = new File(file);
	if (file.exists) this.load();
	else this.save();
	if (!dontSavePath) {
		DuESF.settings.set(namespace + "/scriptSettingsFile", this.file.absoluteURI);
		DuESF.settings.save();
	}
}

/**
	* Reset the settings to their default values (removes the settings file!)
	*/
DuSettings.prototype.reset = function()
{
	this.file.remove();
	this.data = {};
}

/**
 * Gets a value from the settings. The key can be a path separated by /
 * @param {string} key The setting to get
 * @param {*} [defaultValue=null] The default value if the key is not set in the settings
 * @return {*} The value
 */
DuSettings.prototype.get = function( key, defaultValue )
{
	defaultValue = def(defaultValue, null);
	var keyArray = key.split("/")
	var numKeys = keyArray.length;
	var data = this.data;
	for( var i = 0; i < numKeys -1; i++) {
		data = def( data[keyArray[i]], {});
	}
	return def( data[keyArray[numKeys-1]], defaultValue);
}

/**
 * Sets a value to the settings. The key can be a path separated by /
 * @property {string} key The setting to set
 * @property {*} value The value to set
 */
DuSettings.prototype.set = function( key, value )
{
	var keyArray = key.split("/")
	var numKeys = keyArray.length;
	var data = this.data;
	for( var i = 0; i < numKeys -1; i++) {
		data[keyArray[i]] = def( data[keyArray[i]], {});
		data = data[keyArray[i]];
	}
	data[keyArray[numKeys-1]] = value;
}

// Low-level undocumented function. Called by DuESF.init()
DuSettings.init = function() {
	DuDebug.log("DuSettings: loading settings...");

	DuESF.settings = new DuSettings( 'DuESF', DuFolder.duesfData.absoluteURI + '/duesf_settings.json', true  );

	/**
	 * The settings to store the script specific settings.
	 * @type {DuSettings}
	 * @memberof DuESF
	 * @static
	 */
	DuESF.scriptSettings = new DuSettings( DuESF.scriptName );
	
	// Load defaults
	var debug = DuESF.scriptSettings.get("common/debug", false);

	// Debug mode
	DuESF.debug = debug;
	// Create a debug log
    if (DuESF.debug) DuDebug.debugLog = new DuDebugLog();

	DuDebug.log("DuSettings: Settings ready!");
}
