/**
 * The Open Cut Out library
 * @namespace
 * @requires yaml.jsxinc
 * @requires json.jsxinc
 * @category OCO
 */
var OCO = {};

/**
 * Types of OCO armatures
 * @enum {string}
 */
OCO.Type = {
    /**
     * A meta-rig, used to automatically create a default armature to be used with an auto-rig.
     */
    META: 'meta',
    /**
     * An actual (rigged) character.
     */
    CHARACTER: 'character'
}

/**
 * Predefined limbs
 * @enum {string}
 */
OCO.Limb = {
    SPINE: 'spine',
    ARM: 'arm',
    LEG: 'leg',
    TAIL: 'tail',
    WING: 'wing',
    HAIR: 'hair',
    SNAKE_SPINE: 'snakeSpine',
    FISH_SPINE: 'fishSpine',
    FIN: 'fin',
    CUSTOM: 'custom'
}

/**
 * Some bone identifierss
 * @enum {string}
 */
OCO.Bone = {
    CUSTOM: 'custom',
    TIP: 'tip',
    CLAVICLE: 'clavicle',
    HUMERUS: 'humerus',
    RADIUS: 'radius',
    CARPUS: 'carpus',
    FINGER: 'finger',
    HEEL: 'heel',
    FEMUR: 'femur',
    TIBIA: 'tibia',
    TARSUS: 'tarsus',
    TOE: 'toe',
    HIPS: 'hips',
    SPINE: 'spine',
    TORSO: 'torso',
    NECK: 'neck',
    SKULL_TIP: 'skullTip',
    SKULL: 'skull',
    TAIL: 'tail',
    TAIL_ROOT: 'tail1',
    TAIL_MID: 'tail2',
    TAIL_END: 'tail3',
    FEATHER: 'feather',
    SNAKE_SPINE_ROOT: 'snakeSpine1',
    SNAKE_SPINE_MID: 'snakeSpine2',
    SNAKE_SPINE_END: 'snakeSpine3',
    FISH_SPINE_ROOT: 'fishSpine1',
    FISH_SPINE_MID: 'fishSpine2',
    FISH_SPINE_END: 'fishSpine3',
    HAIR: 'hair',
    HAIR_ROOT: 'hair1',
    HAIR_MID: 'hair2',
    HAIR_END: 'hair3',
    FIN: 'fin',
    FIN_FISHBONE: 'finBone'
}

/**
 * Types of limbs
 * @enum {string}
 */
OCO.LimbType = {
    HOMINOID: 'hominoid',
    PLANTIGRADE: 'plantigrade',
    DIGITIGRADE: 'digitigrade',
    UNGULATE: 'ungulate',
    ARTHROPOD: 'arthropod',
    CUSTOM: 'custom'
}

/**
 * Sides for the limbs Use these with {@link OCO.Location} to differenciate similar limbs,<br />
 * for example, a leg can be Front-Right, Front-Left, Back-Right, Back-Left, etc.
 * @enum {string}
 */
OCO.Side = {
    LEFT: "L",
    RIGHT: "R",
    NONE: ''
}

/**
 * Locations for the limbs. Use these with {@link OCO.Side} to differenciate similar limbs,<br />
 * for example, a leg can be Front-Right, Front-Left, Back-Right, Back-Left, etc.
 * @enum {string}
 */
OCO.Location = {
    FRONT: "Fr",
    BACK: "Bk",
    TAIL: "Tl",
    MIDDLE: "Md",
    ABOVE: "Ab",
    UNDER: "Un",
    NONE: ''
}

/**
 * View axis for limbs.
 * @enum {int}
 */
OCO.View = {
    FRONT: 0,
    LEFT: 1,
    RIGHT: 2,
    BACK: 3,
    TOP: 4,
    BOTTOM: 5
}

/**
 * How images are encoded in the OCO file
 * @enum {string}
 */
OCO.ImageEncoding = {
    PNG_BASE64: 'PNG/BASE64',
    RELATIVE_PATH: 'PATH',
    ABSOLUTE_PATH: 'ABS_PATH'
}

/**
 * The OCO Configuration. This is changed everytime a new OCOConfig object is instantiated.
 * @example
 * new OCOConfig('path/to/the/OCO.config');
 * OCO.config === ocoConf; // This is true, OCO.config has been changed by the previous line.
 * var configPath = OCO.config.path(); // Returns the path of the current config file.
 * @type {OCOConfig}
 */
OCO.config = null;

/**
 * Gets the boundaries of an armature (a chain of bones)
 * @param {OCOBone[]} armature The chain of bones
 * @returns {float[]} [left, top, right, bottom]
 */
OCO.getBounds = function ( armature )
{
    var left = 9999;
    var right = -9999;
    var top = 9999;
    var bottom = -9999;

    for (var i = 0, n = armature.length; i < n; i++)
    {
        var b = armature[i];
        // Check current bone
        if (b.x < left) left = b.x;
        if (b.x > right) right = b.x;
        if (b.y < bottom) bottom = b.y;
        if (b.y > top) top = b.y;
        // Check children
        var childBounds = OCO.getBounds( b.children );
        if (childBounds[0] < left) left = childBounds[0];
        if (childBounds[1] < top) top = childBounds[1];
        if (childBounds[2] < right) right = childBounds[2];
        if (childBounds[3] < bottom) bottom = childBounds[3];
        // Check other limbs
        for ( var j = 0, nL = b.limbs.length; j < nL; j++ )
        {
            var limbBounds = b.limbs[i].bounds();
            if (limbBounds[0] < left) left = limbBounds[0];
            if (limbBounds[1] < top) top = limbBounds[1];
            if (limbBounds[2] < right) right = limbBounds[2];
            if (limbBounds[3] < bottom) bottom = limbBounds[3];
        }
    }

    return [left, top, right, bottom];
}

// === PRIVATE ===

// Initializes OCO with the default values
OCO._init = function() 
{
    var hostName = BridgeTalk.appName;
    var hostVersion = BridgeTalk.appVersion;
    // On Ae, app.version is more precise
    if (hostName == 'aftereffects') hostVersion = app.version;
    OCO._host = hostName + ' (' + hostVersion + ')';

    // Set the default config path
    new OCOConfig();
}

// Gets a value or a default value if it is undefined
OCO._d = function( val, defaultVal )
{
	return typeof val !== 'undefined' ? val : defaultVal;
}

// Escapes a string to be used in a regex
OCO._escapeRegEx = function (string)
{
	return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

// Generates a unique string
OCO._uniqueString = function( newString, stringList, increment)
{
    increment = def(increment, true);
    if (!increment) newString += ' ';

    //detect digits
    var reg = "( *)(\\d+)([.,]?\\d*)$";
    //clean input
    var regexClean = new RegExp(reg);
    newString = newString.replace(regexClean, "");
    //go!
    var regex = new RegExp(OCO._escapeRegEx(newString) + reg);
    //The greatest number found
    var greatestNumber = 0;
    //The number of digits for the number as string
    var numDigits = 0;
    var spaceString = "";
    for (var i = 0; i < stringList.length; i++) {
        var currentNumberMatch = stringList[i].match(regex);
        if (stringList[i] === newString && greatestNumber == 0) greatestNumber++;
        else if (currentNumberMatch !== null) {
            //if its a decimal number, keep only the integer part
            var numberAsString = currentNumberMatch[2];
            //convert to int
            var numberAsInt = parseInt(currentNumberMatch[2], 10);
            if (isNaN(numberAsInt)) continue;
            if (numberAsInt >= greatestNumber) {
                greatestNumber = numberAsInt + 1;
                spaceString = currentNumberMatch[1];
            }
            //check if there are zeroes before the number, count the digits
            if (numberAsInt.toString().length < numberAsString.length && numDigits < numberAsString.length) numDigits = numberAsString.length;
        }
    }

    //add leading 0 if needed
    if (greatestNumber > 0) {
        //convert to string with leading zeroes
        if (greatestNumber == 1) {
            greatestNumber++;
            spaceString = " ";
        }
        newString += spaceString;
        greatestNumber = OCO._numberToString(greatestNumber, numDigits);
        newString += greatestNumber;
    }

    if (!increment) newString = newString.substr(0, newString.length - 1);

    return newString;
}

// Converts a number to a string, with leading zeroes
OCO._numberToString = function (num, numDigits, base)
{
    if (base == undefined) base = 10;
	var result = num.toString(base);
	while(numDigits > result.length)
	{
		result  = "0" + result ;
	}
	return result;
}

// Interpolates a value
OCO._linearInterpolation = function(value, min, max, targetMin, targetMax, clamp) {
    min = def(min, 0);
    max = def(max, 1);
    targetMin = def(targetMin, 0);
    targetMax = def(targetMax, 1);
    clamp = def(clamp, false);

    // Handle stupid values
    if (min == targetMin && max == targetMax) return value;
    if (min == max) return value;
    if (targetMin == targetMax) return targetMin;
    if (value == min) return targetMin;
    if (value == max) return targetMax;

    var result = targetMin + (value - min) / (max - min) * (targetMax - targetMin);
    if (clamp) result = OCO._clamp(value, targetMin, targetMax);
    return result;
}

// Clamps the value
OCO._clamp = function(values, min, max) {
    if (!isdef( min )) min = 0;
    if (!isdef( max )) max = 1;

    if (max < min) {
        var t = max;
        max = min;
        min = t;
    }

    var isArray = true;
    var result = [];
    if (!(values instanceof Array)) {
        isArray = false;
        values = [values];
    }
    for (var i = 0, num = values.length; i < num; i++) {
        var v = values[i];
        if (v < min) v = min;
        if (v > max) v = max;
        result.push(v);
    }
    if (isArray) return result;
    else return result[0];
}

// Checks if the script can write files in the folder
OCO._canWrite = function( folder ) {
    if ( !(folder instanceof Folder) ) folder = new Folder(folder);
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

// Encodes a file as a base64 string
OCO._base64 = function( file ) {
    if (!(file instanceof File)) file = new File(file);
    if (!file.exists) return "";

    file.encoding = "binary";
    file.open("r");
    var bin = file.read();
    file.close();

    var ecdStr = Base64.btoa(bin);

    return ecdStr;
}

// Checks if this is a valid base64 encoding
OCO._checkBase64 = function( b64 ) {
    var len = b64.length;

    if (len % 4 > 0) {
        return false;
    }

    // If there's a dot, that's probably a file name
    if ( b64.indexOf(".") >= 0 )
        return false;

    return true;
}

// Decodes base64 content to a file; returns the File object or null
OCO._fromBase64 = function( b64, file )
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

// Makes a path relative to a file
OCO._relativePath = function ( path, destinationFile )
{
    if (!(destinationFile instanceof File)) destinationFile = new File(destinationFile);
    var sourceFile = new File( path );
    var sourceFolder = sourceFile.parent;
    var destFolder = destinationFile.parent;
    var destPath = destFolder.absoluteURI;
    var sourcePath = sourceFolder.absoluteURI;
    var count = 0;
    while (sourcePath.indexOf(destPath) != 0)
    {
        // Up one folder and check again
        count++;
        destFolder = destFolder.parent;
        if (!destFolder) destPath = "";
        else destPath = destFolder.absoluteURI;
    }
    // Add ups
    var relativePath = "";
    for (var i = 0; i < count; i++)
    {
        relativePath += '../';
    }
    if (destPath.length > 0)
        relativePath += sourcePath.substr( destPath.length + 1 ) + '/';
    else
        relativePath += sourcePath + '/';
    relativePath += sourceFile.name;
    return relativePath;
}

// Makes a path absolute
OCO._absolutePath = function ( path, relativeTo )
{
    if (path.indexOf('~') == 0) {
        path = new File(path);
        return path.absoluteURI;
    }
    if (!(relativeTo instanceof File)) relativeTo = new File(relativeTo);
    var absFolder = relativeTo.parent;
    while (path.indexOf("../") == 0)
    {
        path = path.substr(3);
        absFolder = absFolder.parent;
    }
    var absPath = absFolder.absoluteURI + '/' + path;
    return absPath;
}

OCO._sanitize_path = function( path ) {
    path = OCO._path_join([path]);
    if (path.indexOf('~') == 0) {
        path = new File(path);
        return path.absoluteURI;
    }
}

// Checks if a path is absolute
OCO._is_path_absolute = function( path )
{
    var re = /^(?:[\/\\]|[a-zA-Z]:)/;
    return re.test(path);
}

OCO._path_join = function( pathElements ) {
    var path = pathElements.join('/');
    path = path.split('/');
    OCO._array_remove_empty_strings(path);
    path = path.join('/').split('\\');
    OCO._array_remove_empty_strings(path);
    return path.join('/');
}

OCO._array_remove_empty_strings = function(arr, inplace) {
    if(typeof inplace === 'undefined') inplace = true;
    var newArr = [];
    for (var i = arr.length-1; i >= 0; i--) {
        if (arr[i] === '') {
            if (!inplace) continue;
            arr.splice(i,1);
        }
        if (!inplace) newArr.push(arr[i]);
    }
    if (!inplace) return newArr;
}

OCO._parseJsonFile = function (file )
{
    if (!(file instanceof File)) file = new File(file);
    file.encoding = 'UTF-8';
    if (!file.open('r')) return null;
    var json = file.read();
    file.close();
    if (json == '') return null;
    var data = {};
    try { data  = JSON.parse(json); } catch (e) { return null; }
    return data;
}

// Measures the vector length between two points
OCO._length = function(value1, value2) {
    if (typeof value1 !== typeof value2) {
        return null;
    }
    if (value1.length > 0) {
        var result = 0;
        for (var dim = 0; dim < value1.length; dim++) {
            result += (value1[dim] - value2[dim]) * (value1[dim] - value2[dim]);
        }
        result = Math.sqrt(result);
        return result;
    } else return Math.abs(value1 - value2);
}

// Clamp values between min and max
OCO._clamp = function(values, min, max) {
    min = OCO._d(min, 0);
    max = OCO._d(max, 1);

    if (max < min) {
        var t = max;
        max = min;
        min = t;
    }

    var isArray = true;
    var result = [];
    if (!(values instanceof Array)) {
        isArray = false;
        values = [values];
    }
    for (var i = 0, num = values.length; i < num; i++) {
        var v = values[i];
        if (v < min) v = min;
        if (v > max) v = max;
        result.push(v);
    }
    if (isArray) return result;
    else return result[0];
}

// Linear interpolation
OCO._linear = function(value, min, max, targetMin, targetMax, clamp) {
    min = OCO._d(min, 0);
    max = OCO._d(max, 1);
    targetMin = OCO._d(targetMin, 0);
    targetMax = OCO._d(targetMax, 1);
    clamp = OCO._d(clamp, false);

    // Handle stupid values
    if (min == targetMin && max == targetMax) return value;
    if (min == max) return value;
    if (targetMin == targetMax) return targetMin;
    if (value == min) return targetMin;
    if (value == max) return targetMax;

    var result = targetMin + (value - min) / (max - min) * (targetMax - targetMin);
    if (clamp) result = DuMath.clamp(value, targetMin, targetMax);
    return result;
}

// === Classes ===

/**
 * Sets a new config file to be used by OCO
 * @class
 * @classdesc Handles the global configuration of OCO
 * @param {string|File} [ocoConfigFile] The config file to be used. If not set, will use the default file in the user's documents OCO folder.
 * @category OCO
 */
function OCOConfig( ocoConfigFile )
{
    this.setConfig(ocoConfigFile);
}

/**
 * Sets the config file to be used by OCO
 * @param {string|File} [ocoConfigFile] The config file to be used. If not set, will use the default file in the user's documents OCO folder.<br/>
 * If this is a File object, it's encoding will be ignored and always be set to UTF-8, as per the OCO specifications.
 * @return {boolean} Success.
 */
OCOConfig.prototype.setConfig = function( ocoConfigFile ) {

    this._file = null;

    // Get default path
    if (typeof ocoConfigFile === 'undefined') {
        ocoConfigFile = Folder.myDocuments.absoluteURI + "/OCO/";
        if (!OCO._canWrite( ocoConfigFile )) ocoConfigFile = Folder.temp.absoluteURI + "/OCO/";
        ocoConfigFile += 'OCO.config';
    }
    // Make it a File object
    if (!(ocoConfigFile instanceof File)) ocoConfigFile = new File(ocoConfigFile);

    // Create path if it doesn't exists
    var folder = ocoConfigFile.parent;
    if (!folder.exists) folder.create();

    // Set the file.
    this._file = ocoConfigFile;
    this._file.encoding = 'UTF-8';

    // Create file if it doesn't exists
    if (!this._file.exists) {
        this.set('metadata/created', new Date());
        this.set('metadata/created by', OCO._host);
    }
    OCO.config = this;
}

/**
 * Get the current config file
 * @return {File|null} The File object representing the config file.
 */
OCOConfig.prototype.absoluteURI = function() {
    return this._file.absoluteURI;
}

/**
 * Sets a new Key/Value pair in the config.
 * The key 
 * @param {string} key The key. It can be a path-like string (i.e. 'after effects/bone type').
 * @param {*} value The value to set
 */
OCOConfig.prototype.set = function( key, value ) {
    // Checks
    if (typeof key === 'undefined') 
        throw "OCOConfig: ArgError: missing key.";
    if (typeof value === 'undefined')
        throw "OCOConfig: ArgError: missing value.";
    if (typeof key !== 'string' && !(key instanceof String))
        throw "OCOConfig: TypeError: key must be a string."
    if (key === '')
        throw "OCO: ValueError: can't use an empty string as a key.";

    // Update data
    var root = this._load();
    var data = root;
    var keyArray = key.split('/');
    var numKeys = keyArray.length;
    for( var i = 0; i < numKeys -1; i++) {
		data[keyArray[i]] = OCO._d( data[keyArray[i]], {});
		data = data[keyArray[i]];
	}

    // Sanitize data
    var key = keyArray[numKeys-1];
    if (key == 'path') value = OCO._sanitize_path(value);

    // Already the same value, return
	if (data[keyArray[numKeys-1]] === value) return;

    data[keyArray[numKeys-1]] = value;

    root['metadata'] = OCO._d( root['metadata'], {});
    root['metadata']['modified'] = new Date();
    root['metadata']['modified by'] = OCO._host;

    var fileContent = [
        "---",
        "# This is an Open Cut-Out Config file.",
        ''
    ].join('\n');

    fileContent += YAML.dump(root, 2);

    if (!this._file.open('w'))
        throw "OCOConfig: IOError: The config file '" + this._file.absoluteURI + "' can't be opened in writing mode.";
    this._file.write(fileContent);
    this._file.close();
}

/**
 * Gets a value from the config. The key can be a path separated by /
 * @param {string} key The setting to get
 * @param {*} [defaultValue=null] The default value if the key is not set in the settings
 * @return {*} The value
 */
OCOConfig.prototype.get = function( key, defaultValue ) {
    // Checks
    if (typeof key === 'undefined') 
        throw "OCOConfig: ArgError: missing key.";
    if (typeof key !== 'string' && !(key instanceof String))
        throw "OCOConfig: TypeError: key must be a string."
    if (key === '')
        throw "OCO: ValueError: can't use an empty string as a key.";

    defaultValue = OCO._d(defaultValue, null);

    var data = this._load();
	var keyArray = key.split("/")
	var numKeys = keyArray.length;
	for( var i = 0; i < numKeys -1; i++) {
		data = OCO._d( data[keyArray[i]], {});
	}
	return OCO._d( data[keyArray[numKeys-1]], defaultValue);
}

// === Private ===

// Loads the config file
OCOConfig.prototype._load = function() {
    if (!this._file.exists) return {};
    if (!this._file.open('r')) return {};
    var data = this._file.read();
    this._file.close();
    data = YAML.load(data);
    if (!data) data = {};
    return data;
}

/**
 * Creates a new OCO Library
 * @class
 * @classdesc A library is used to store and get metarigs
 * @param {string|Folder} [path] The path of the library. If omitted, it will use the current path as saved in the current OCO.config; else it will be saved in the current OCO.config.
 * @category OCO
 */
function OCOLibrary( path ) {
    if(typeof path === 'undefined') path = this.absoluteURI();
    this.setPath(path);
}

OCOLibrary.prototype.setPath = function( path ) {
    OCO.config.set("library/path", path);
    if (!OCO._is_path_absolute(path))
        path = OCO._absolutePath(path, OCO.config._file );
    var folder = new Folder(path);
    if (!folder.exists) folder.create();
}

OCOLibrary.prototype.absoluteURI = function() {
    var libPath = OCO.config.get("library/path", "OCO Library");
    if (OCO._is_path_absolute(libPath)) return libPath;
    return OCO._absolutePath(libPath, OCO.config._file);
}

OCOLibrary.prototype.settingsAbsoluteURI = function() {
    return OCO._path_join([
        this.absoluteURI(),
        "OCO_library.json"
        ]);
}

/**
 * Creates a new OCO Document.
 * @class
 * @classdesc An Open Cut-Out character or meta-rig document.
 * @param {string} name The name of the character or the meta rig
 * @category OCO
 */
function OCODoc(name)
{
    /**
     * The type of this OCO Doc
     * @name type
     * @memberof OCODoc
     * @type {string}
     */
    this.type = OCO.Type.META;
    /**
     * The name of this OCO Doc
     * @name name
     * @memberof OCODoc
     * @type {string}
     */
    this.name = name;
    /**
     * The height of the character. Should always be 1!
     * @name height
     * @memberof OCODoc
     * @type {float}
     */
    this.height = 185.0;
    /**
     * The width of the character.
     * @name width
     * @memberof OCODoc
     * @type {float}
     */
    this.width = 60.0,
    /**
     * The coordinates of the center of mass of the character. [X, Y].
     * @name centerOfMass
     * @memberof OCODoc
     * @type {float[]}
     */
    this.centerOfMass = [0.0, 107.0];
    /**
     * The limbs/ Armatures
     * @name limbs
     * @memberof OCOLimb
     * @type {OCOLimb[]}
     */
    this.limbs = [];
    /**
     * The resolution, in pixels, of the document
     * @type {int[]}
     */
    this.resolution = [1920,1080];
    /**
     * The world origin in pixels in the document
     * @type {float[]}
     */
    this.world = [960,980];
    /**
     * The definition
     * @type {float}
     */
    this.pixelsPerCm = 4.22;
    /**
     * An icon or thumbnail path
     * @type {string}
     */
    this.icon = ""
    /**
     * How images should be encoded when exporting the doc to a file/folder
     * @type {OCO.ImageEncoding}
     */
    this.imageEncoding = OCO.ImageEncoding.PATH;

    // Private: Converts a pixel coordinate relative to the world to a coordinate relative to the top left corner
    this.fromWorld = function( point )
    {
        var x = point[0] + this.world[0];
        var y = this.world[1] - point[1];
        return [x,y];
    }

    // Private: Converts a pixel coordinate relative to the top left corner to a coordinate relative to the world
    this.toWorld = function( point )
    {
        var x = point[0] - this.world[0];
        var y = this.world[1] - point[1];
        return [x, y];
    }
}

/**
 * Finds the spine
 * @return {OCOLimb|null} The spine.
 */
OCODoc.prototype.getSpine = function()
{
    for (var i = 0, ni = this.limbs.length; i < ni; i++)
    {
        var limb = this.limbs[i];
        if (limb.limb == OCO.Limb.SPINE || limb.limb == OCO.Limb.FISH_SPINE)
            return limb;
    }
    return null;
}

/**
 * Recursively gets all the limbs contained in the doc
 * @return {OCOLimb[]} The array of all limbs
 */
OCODoc.prototype.getLimbs = function()
{
    var limbs = this.limbs;
    for (var i = 0, n = this.limbs.length; i < n; i++) 
    {
        limbs = limbs.concat( this.limbs[i].getLimbs() );
    }
    return limbs;
}

/**
    * Counts the total number of bones in this doc
    * @return {int}
    */
OCODoc.prototype.numBones = function ()
{
    var count = 0;
    for (var i = 0, ni = this.limbs.length; i < ni; i++ )
    {
        count += this.limbs[i].numBones();
    }
    return count;
}

/**
    * Counts the total number of limbs in this doc
    * @return {int}
    */
OCODoc.prototype.numLimbs = function ()
{
    var count = 0;
    for (var i = 0, ni = this.limbs.length; i < ni; i++ )
    {
        count += this.limbs[i].numLimbs();
    }
    return count;
}

/**
 * Gets the boundaries of the doc
 * @returns {float[]} [left, top, right, bottom]
 */
OCODoc.prototype.bounds = function ()
{
    var left = 9999;
    var right = -9999;
    var top = 9999;
    var bottom = -9999;

    for (var i = 0, n = this.limbs.length; i < n; i++)
    {
        var limbBounds = this.limbs[i].bounds();
        if (limbBounds[0] < left) left = limbBounds[0];
        if (limbBounds[1] < top) top = limbBounds[1];
        if (limbBounds[2] < right) right = limbBounds[2];
        if (limbBounds[3] < bottom) bottom = limbBounds[3];
    }

    return [left, top, right, bottom];
}

/**
 * Updates the width and height of the character, according to the content.<br />
 * This method should be called each time a limb/bone is added/removed/edited and the bounds may change.
 */
OCODoc.prototype.updateSize = function()
{
    // Update doc width & height
    var bounds = this.bounds();
    // right - left
    this.width = this.bounds[2] - this.bounds[0];
    // top - bottom
    this.height = this.bounds[1] - this.bounds[3];
}

/**
 * Creates a new limb and adds it to the doc
 * @param {OCO.Limb} [limb=OCO.Limb.CUSTOM] A Predefined limb
 * @param {OCO.Side} [side=OCO.Side.NONE] - The side of the limb
 * @param {OCO.Location} [location=OCO.Location.NONE] - The location of the limb
 * @param {OCO.LimbType} [type=OCO.LimbType.CUSTOM] - The type of the limb
 * @return {OCOLimb} The new limb
 */
OCODoc.prototype.newLimb = function( limb, side, location, type )
{
    var l = new OCOLimb( limb, side, location, type );
    this.limbs.push(l);
    return l;
}

/**
 * Creates a new arm.
 * @param {OCO.LimbType} [type=OCO.LimbType.HOMINOID] The type of limb
 * @param {OCO.Side} [side=OCO.Side.LEFT] The side
 * @param {Boolean} [shoulder=false] Whether to create a shoulder
 * @param {Boolean} [arm=true]  Whether to create an arm / humerus
 * @param {Boolean} [forearm=true]  Whether to create a forearm
 * @param {Boolean} [hand=true]  Whether to create a hand
 * @param {Boolean} [claws=false]  Whether to add claws
 * @param {float[]} [position] The position of the first bone of the arm.<br />
 * If omitted, computed automatically according to the current character in the doc.
 * @param {OCO.Location} [location=OCO.Location.FRONT] The location of the limb
 * @param {OCO.View} [view] The view
 * @returns {OCOLimb} The arm
 */
OCODoc.prototype.newArm = function( type, side, shoulder, arm, forearm, hand, claws, position, location, view )
{
    side = OCO._d(side, OCO.Side.LEFT);
    type = OCO._d(type, OCO.LimbType.HOMINOID);
    location = OCO._d(location, OCO.Location.FRONT);

    shoulder = OCO._d( shoulder, false );
    arm = OCO._d( arm, true );
    forearm = OCO._d( forearm, true );
    hand = OCO._d( hand, true );
    claws = OCO._d( claws, false );

    // Unit
    var u = this.height;

    // type
    var hum = type == OCO.LimbType.HOMINOID;
    var hum = type == OCO.LimbType.PLANTIGRADE && !claws;
    var plan = type == OCO.LimbType.PLANTIGRADE && claws;
    var dig = type == OCO.LimbType.DIGITIGRADE;
    var ung = type == OCO.LimbType.UNGULATE;
    var artF = type == OCO.LimbType.ARTHROPOD && location != OCO.Location.MIDDLE && location != OCO.Location.BACK;
    var artM = type == OCO.LimbType.ARTHROPOD && location == OCO.Location.MIDDLE;
    var artB = type == OCO.LimbType.ARTHROPOD && location == OCO.Location.BACK;
    if ( !hum && !plan && !dig && !ung && !artF && !artM && !artB ) hum = true;

    // View
    if (typeof view === 'undefined')
    {
        if (type == OCO.LimbType.PLANTIGRADE && !claws) view = OCO.View.FRONT;
        else view = OCO.View.RIGHT;
    }

    // count how many bones we need
    var num = 1;
    if ( shoulder ) num++;
    if ( arm ) num++;
    if ( forearm ) num++;
    if ( hand ) num++;
    if ( claws ) num++;

    if (num == 1) return null;

    // Create limb
    var limb = this.newLimb( OCO.Limb.ARM, side, location, type );
    var b = limb.newArmature( i18n._("Arm"), num );

    // side
    var s = 1;
    if ( side == OCO.Side.RIGHT && view == OCO.View.FRONT ) s = -1;
    else if ( side == OCO.Side.LEFT && view == OCO.View.BACK ) s = -1;
    else if ( view == OCO.View.LEFT ) s = -1;  

    // shoulder position
    var x, y;
    var ox = 0;
    var oy = 0;
    if (hum)
    {
        x = s * u * .02;
        y = u * .78;
    }
    else if (plan)
    {
        x = s * u * .40;
        y = u * .92;
    }
    else if (dig)
    {
        x = s * u * .45;
        y = u * .86;
    }
    else if (ung)
    {
        x = s * u * .33;
        y = u * .80;
    }
    else if (artF)
    {
        x = s * u * .33;
        y = u * .65;
    }
    else if (artM)
    {
        x = s * u * .09;
        y = u * .50;
    }
    else if (artB)
    {
        x = s * u * -.03;
        y = u * .48;
    }

    // offset
    if (typeof position !== 'undefined' )
    {
        ox = position[0] - x;
        oy = position[1] - y;
    }

    // for each part, set the location
    if ( shoulder )
    {
        b.name = i18n._("Shoulder");
        b.type = OCO.Bone.CLAVICLE;
        b.x = x + ox;
        b.y = y + oy;
        if (b.children.length > 0) b = b.children[0];
    }
    if ( arm )
    {
        b.name = i18n._("Arm");
        b.type = OCO.Bone.HUMERUS;
        if (hum)
        {
            b.x = s * u * .12 + ox;
            b.y = u * .77 + oy;
        }
        else if (plan)
        {
            b.x = s * u * .48 + ox;
            b.y = u*.74 + oy;
        }
        else if (dig)
        {
            b.x = s * u * .45 + ox;
            b.y = u*.66 + oy;
        }
        else if (ung)
        {
            b.x = s * u * .35 + ox;
            b.y = u*.63 + oy;
        }
        else if (artF)
        {
            b.x = s * u * .24 + ox;
            b.y = u*.45 + oy;
        }
        else if (artM)
        {
            b.x = s * u * -.01 + ox;
            b.y = u*.44 + oy;
        }
        else if (artB)
        {
            b.x = s * u * -.17 + ox;
            b.y = u*.43 + oy;
        }
        if (b.children.length > 0) b = b.children[0];
    }
    if ( forearm )
    {
        b.name = i18n._("Forearm");
        b.type = OCO.Bone.RADIUS;
        if (hum)
        {
            b.x = s * u * .15 + ox;
            b.y = u *.65 + oy;
        }
        else if (plan)
        {
            b.x = s * u * .36 + ox;
            b.y = u*.44 + oy;
        }
        else if (dig)
        {
            b.x = s * u * .21 + ox;
            b.y = u*.45 + oy;
        }
        else if (ung)
        {
            b.x = s * u * .24 + ox;
            b.y = u*.53 + oy;
        }
        else if (artF)
        {
            b.x = s * u * .55 + ox;
            b.y = u*.80 + oy;
        }
        else if (artM)
        {
            b.x = s * u * -.08 + ox;
            b.y = u*.82 + oy;
        }
        else if (artB)
        {
            b.x = s * u * -.44 + ox;
            b.y = u*.92 + oy;
        }
        if (b.children.length > 0) b = b.children[0];
    }
    if ( hand )
    {
        b.name = i18n._("Hand");
        b.type = OCO.Bone.CARPUS;
        if (hum)
        {
            b.x = s * u * .12 + ox;
            b.y = u * .51 + oy;
        }
        else if (plan)
        {
            b.x = s * u * .38 + ox;
            b.y = u*.05 + oy;
        }
        else if (dig)
        {
            b.x = s * u * .45 + ox;
            b.y = u*.14 + oy;
        }
        else if (ung)
        {
            b.x = s * u * .19 + ox;
            b.y = u*.31 + oy;
        }
        else if (artF)
        {
            b.x = s * u * .77 + ox;
            b.y = u*.28 + oy;
        }
        else if (artM)
        {
            b.x = s * u * -.17 + ox;
            b.y = u*.42 + oy;
        }
        else if (artB)
        {
            b.x = s * u * -.77 + ox;
            b.y = u*.47 + oy;
        }
        if (b.children.length > 0) b = b.children[0];
    }
    if ( claws )
    {
        b.name = i18n._("Claws");
        b.type = OCO.Bone.FINGER;
        if (plan)
        {
            b.x = s * u * .455 + ox;
            b.y = u*.035 + oy;
        }
        else if (dig)
        {
            b.x = s * u * .49 + ox;
            b.y = u*.03 + oy;
        }
        else if (ung)
        {
            b.x = s * u * .19 + ox;
            b.y = u*.14 + oy;
        }
        else if (artF)
        {
            b.x = s * u * .86 + ox;
            b.y = u*.07 + oy;
        }
        else if (artM)
        {
            b.x = s * u * -.25 + ox;
            b.y = u*.07 + oy;
        }
        else if (artB)
        {
            b.x = s * u * -.98 + ox;
            b.y = u*.07 + oy;
        }
        if (b.children.length > 0) b = b.children[0];
    }
    // Tip
    b.name = i18n._("Arm") +
        '_' + i18n._("Tip");
    b.type = OCO.Bone.TIP;
    if (hum)
    {
        b.x = s * u * .08 + ox;
        b.y = u * .42 + oy;
    }
    else if (plan)
    {
        b.x = s * u * .585 + ox;
        b.y = 0 + oy;
    }
    else if (dig)
    {
        b.x = s * u * .59 + ox;
        b.y = u*.03 + oy;
    }
    else if (ung)
    {
        b.x = s * u * .21 + ox;
        b.y = oy;
    }
    else if (artF)
    {
        b.x = s * u * .93 + ox;
        b.y = oy;
    }
    else if (artM)
    {
        b.x = s * u * -.31 + ox;
        b.y = oy;
    }
    else if (artB)
    {
        b.x = s * u * -1.06 + ox;
        b.y = oy;
    }

    //Heel
    if (plan)
    {
        var heelBone = new OCOBone( i18n._("Heel") );
        heelBone.type = OCO.Bone.HEEL;
        heelBone.x = s * u * .38 + ox;
        heelBone.y = 0 + oy;
        b.children.push(heelBone);
    }

    return limb;
}

/**
 * Creates a new leg.
 * @param {OCO.LimbType} [type=OCO.LimbType.HOMINOID] The type of limb
 * @param {OCO.Side} [side=OCO.Side.LEFT] The side
 * @param {Boolean} [thigh=true]  Whether to create a thigh
 * @param {Boolean} [calf=true]  Whether to create a calf
 * @param {Boolean} [foot=true]  Whether to create a foot
 * @param {Boolean} [claws=false]  Whether to add claws
 * @param {float[]} [position] The position of the first bone of the arm.<br />
 * If omitted, computed automatically according to the current character in the doc.
 * @param {OCO.Location} [location=OCO.Location.BACK] The location of the limb
 * @param {OCO.View} [view] The view
 * @returns {OCOLimb} The leg
 */
OCODoc.prototype.newLeg = function( type, side, thigh, calf, foot, claws, position, location, view )
{
    side = OCO._d(side, OCO.Side.LEFT);
    type = OCO._d(type, OCO.LimbType.HOMINOID);
    location = OCO._d(location, OCO.Location.BACK);

    thigh = OCO._d( thigh, true );
    calf = OCO._d( calf, true );
    foot = OCO._d( foot, true );
    claws = OCO._d( claws, false );

    // Unit
    var u = this.height;

    // type
    var plan = type == OCO.LimbType.PLANTIGRADE;
    var dig = type == OCO.LimbType.DIGITIGRADE;
    var ung = type == OCO.LimbType.UNGULATE;
    var hum = type == OCO.LimbType.HOMINOID;

    // View
    if (typeof view === 'undefined')
    {
        if (type == OCO.LimbType.PLANTIGRADE) view = OCO.View.FRONT;
        else view = OCO.View.RIGHT;
    }

    // count how many bones we need
    var num = 1;
    if ( thigh ) num++;
    if ( calf ) num++;
    if ( foot ) num++;
    if ( claws ) num++;

    if (num == 1) return null;

    // Create limb
    var limb = this.newLimb( OCO.Limb.LEG, side, location, type );
    var b = limb.newArmature( i18n._("Leg"), num );

    // side
    var s = 1;

    if ( side == OCO.Side.RIGHT && view == OCO.View.FRONT ) s = -1;
    else if ( side == OCO.Side.LEFT && view == OCO.View.BACK ) s = -1;
    else if ( view == OCO.View.LEFT ) s = -1;

    // thigh position
    var x, y;
    var ox = 0;
    var oy = 0;
    if (plan || hum)
    {
        x = s * u * .04;
        y = u * .53;
    }
    else if (dig)
    {
        x = s * u * -.45;
        y = u * .73;
    }
    else if (ung)
    {
        x = s * u * -.26;
        y = u * .69;
    }

    // offset
    if (typeof position !== 'undefined' )
    {
        ox = position[0] - x;
        oy = position[1] - y;
    }

    // for each part, set the location
    if ( thigh )
    {
        b.name = i18n._("Thigh");
        b.type = OCO.Bone.FEMUR;
        b.x = x + ox;
        b.y = y + oy;
        if (b.children.length > 0) b = b.children[0];
    }
    if ( calf )
    {
        b.name = i18n._("Calf");
        b.type = OCO.Bone.TIBIA;
        if (plan || hum)
        {
            b.x = s * u * .05 + ox;
            b.y = u*.28 + oy;
        }
        else if (dig)
        {
            b.x = s * u * -.16 + ox;
            b.y = u*.54 + oy;
        }
        else if (ung)
        {
            b.x = s * u * -.2 + ox;
            b.y = u*.52 + oy;
        }
        if (b.children.length > 0) b = b.children[0];
    }
    if ( foot )
    {
        b.name = i18n._("Foot");
        b.type = OCO.Bone.TARSUS;
        if (plan || hum)
        {
            b.x = s * u * .036 + ox;
            b.y = u*.027 + oy;
        }
        else if (dig)
        {
            b.x = s * u * -.5 + ox;
            b.y = u*.24 + oy;
        }
        else if (ung)
        {
            b.x = s * u * -.38 + ox;
            b.y = u*.33 + oy;
        }
        if (b.children.length > 0) b = b.children[0];
    }
    if ( claws )
    {
        b.name = i18n._("Claws");
        if (hum) b.name = i18n._("Toes");
        b.type = OCO.Bone.TOE;
        if (plan || hum)
        {
            b.x = s * u * .10 + ox;
            b.y = u*.0125 + oy;
        }
        else if (dig)
        {
            b.x = s * u * -.37 + ox;
            b.y = u*.03 + oy;
        }
        else if (ung)
        {
            b.name = i18n._("Hoof");
            b.x = s * u * -.37 + ox;
            b.y = u*.08 + oy;
        }
        if (b.children.length > 0) b = b.children[0];
    }
    // Tip
    b.name = i18n._("Leg") +
        '_' + i18n._("Tip");
    b.type = OCO.Bone.TIP;
    if (plan || hum)
    {
        b.x = s * u * .145 + ox;
        b.y = oy;
    }
    else if (dig)
    {
        b.x = s * u * -.25 + ox;
        b.y = oy;
    }
    else if (ung)
    {
        b.x = s * u * -.34 + ox;
        b.y = oy;
    }

    //Heel
    if ((plan || hum) && claws)
    {
        var heelBone = new OCOBone( i18n._("Heel") );
        heelBone.type = OCO.Bone.HEEL;
        heelBone.x = s * u * .01 + ox;
        heelBone.y = oy;
        b.children.push(heelBone);
    }

    return limb;
}

/**
 * Creates a new spine.
 * @param {Boolean} [head=true]  Whether to create a head
 * @param {int} [neck=1] Number of neck bones
 * @param {int} [spine=2] Number of spine bones
 * @param {Boolean} [hips=true]  Whether to create hips
 * @param {float[]} [position] The position of the first bone of the arm.<br />
 * If omitted, computed automatically according to the current character in the doc.
 * @param {OCO.View} [view] The view
 * @returns {OCOLimb} The spine
 */
OCODoc.prototype.newSpine = function( head, neck, spine, hips, position )
{
    head = OCO._d( head, true );
    neck = OCO._d( neck, 1 );
    spine = OCO._d( spine, 2 );
    hips = OCO._d( hips, false );

    // Unit
    var u = this.height;

    // count how many bones we need
    var num = 1;
    if ( head ) num++;
    num += neck;
    num += spine;
    if ( hips ) num++;

    if (num == 1) return null;

    // Create limb
    var limb = this.newLimb( OCO.Limb.SPINE, OCO.Side.NONE, OCO.Location.NONE );
    var b = limb.newArmature( i18n._("Spine"), num );

    // hips position
    var ox = 0;
    var oy = 0;
    var x = 0;
    var y = u * .53;

    // offset
    if (typeof position !== 'undefined' )
    {
        ox = position[0] - x;
        oy = position[1] - y;
    }

    // for each part, set the location
    if ( hips )
    {
        b.name = i18n._("Hips");
        b.type = OCO.Bone.HIPS;
        b.x = x + ox;
        b.y = y + oy;
        if (b.children.length > 0) b = b.children[0];
    }
    if (spine > 1)
    {
        var totalSpineLength = u*.27;
        var torsoLength = totalSpineLength*.5;
        var spineLength = (totalSpineLength - torsoLength) / (spine-1);
        var spineStart = u*.56;
        for (var i = 0; i < spine-1; i++)
        {
            b.name = i18n._("Spine");
            b.type = OCO.Bone.SPINE;
            b.y = spineStart + i*spineLength + oy;
            b.x = ox;
            if (b.children.length > 0) b = b.children[0];
        }
        // Torso
        b.name = i18n._("Torso");
        b.type = OCO.Bone.TORSO;
        b.y = spineStart + (spine-1)*spineLength + oy;
        b.x = ox;
        if (b.children.length > 0) b = b.children[0];
    }
    else if (spine == 1)
    {
        // Torso
        b.name = i18n._("Torso");
        b.type = OCO.Bone.TORSO;
        b.x = ox;
        b.y = u*.56 + oy;
        if (b.children.length > 0) b = b.children[0];
    }
    if (neck > 0)
    {
        var neckLength = u*.06 / neck;
        var neckStart = u*.83;
        for (var i = 0; i < neck; i++)
        {
            b.name = i18n._("Neck");
            b.type = OCO.Bone.NECK;
            b.y = neckStart + i*neckLength + oy;
            b.x = ox;
            if (b.children.length > 0) b = b.children[0];
        }
    }  
    if ( head )
    {
        b.name = i18n._("Head");
        b.type = OCO.Bone.SKULL;
        b.x = ox;
        b.y = u*.89 + oy;
        if (b.children.length > 0) b = b.children[0];
    }

    // Tip
    b.name = i18n._("Spine") +
        '_' + i18n._("Tip");
    b.type = OCO.Bone.TIP;
    b.x = ox;
    b.y = u + oy;

    return limb;
}

/**
 * Creates a new tail.
 * @param {int} [numBones=3] Number of tail bones
 * @returns {OCOLimb} The spine
 */
OCODoc.prototype.newTail = function( numBones )
{
    numBones = OCO._d( numBones, 3 );

    // Unit
    var u = this.height;

    // count how many bones we need
    var num = numBones+1;

    if (num == 1) return null;

    // Create limb
    var limb = this.newLimb( OCO.Limb.TAIL, OCO.Side.NONE, OCO.Location.NONE );
    var b = limb.newArmature( i18n._("Tail"), num );

    // for each part, adjust name and type
    for (var i = 0, n = num-1; i < n; i++)
    {
        b.name = i18n._("Tail");
        if ( i <= (n-1) / 3) b.type = OCO.Bone.TAIL_ROOT;
        else if ( i <= (n-1)*2 / 3) b.type = OCO.Bone.TAIL_MID;
        else b.type = OCO.Bone.TAIL_END;
        
        if (b.children.length > 0) b = b.children[0];
    }

    b.name = i18n._("Tail") +
        '_' + i18n._("Tip");
    b.type = OCO.Bone.TIP;

    return limb;
}

/**
 * Creates a new hair strand.
 * @param {int} [numBones=3] Number of hair bones
 * @returns {OCOLimb} The hair
 */
OCODoc.prototype.newHairStrand = function( numBones )
{
    numBones = OCO._d( numBones, 3 );

    // Unit
    var u = this.height;

    // count how many bones we need
    var num = numBones+1;

    if (num == 1) return null;

    // Create limb
    var limb = this.newLimb( OCO.Limb.HAIR, OCO.Side.NONE, OCO.Location.NONE );
    var b = limb.newArmature( i18n._("Hair"), num );

    var l = 100 / numBones;

    // for each part, adjust name and type
    for (var i = 0, n = num-1; i < n; i++)
    {
        b.name = i18n._("Hair");
        if ( i <= (n-1) / 3) b.type = OCO.Bone.HAIR_ROOT;
        else if ( i <= (n-1)*2 / 3) b.type = OCO.Bone.HAIR_MID;
        else b.type = OCO.Bone.HAIR_END;

        b.x = 0;
        b.y = 150 - i*l;
        
        if (b.children.length > 0) b = b.children[0];
    }

    b.name = i18n._("Hair") +
        '_' + i18n._("Tip");
    b.type = OCO.Bone.TIP;
    b.x = 0;
    b.y = 50;

    return limb;
}

/**
 * Creates a new wing.
 * @param {OCO.Side} [side=OCO.Side.LEFT] The side
 * @param {Boolean} [arm=true]  Whether to create an arm / humerus
 * @param {Boolean} [forearm=true]  Whether to create a forearm
 * @param {Boolean} [hand=true]  Whether to create a hand
 * @param {int} [feathers=5]  Number of feathers
 * @param {float[]} [position] The position of the first bone of the arm.<br />
 * If omitted, computed automatically according to the current character in the doc.
 * @param {OCO.View} [view=OCO.View.TOP] The view
 * @returns {OCOLimb} The wing
 */
OCODoc.prototype.newWing = function( side, arm, forearm, hand, feathers, position, view )
{
    side = OCO._d(side, OCO.Side.LEFT);
    view = OCO._d(view, OCO.View.TOP);

    arm = OCO._d( arm, true );
    forearm = OCO._d( forearm, true );
    hand = OCO._d( hand, true );
    feathers = OCO._d( feathers, 5 );

    // Unit
    var u = this.height;

    // count how many bones we need
    var num = 1;
    if (arm) num++;
    if (forearm) num++;
    if (hand) num++;

    if (num == 1) return null;

    // Create limb
    var limb = this.newLimb( OCO.Limb.WING, side, OCO.Location.NONE );
    var b = limb.newArmature( i18n._("Wing"), num );

    // side
    var s = 1;
    if ( side == OCO.Side.RIGHT && (view == OCO.View.TOP || view == OCO.View.BACK) ) s = -1;
    else if ( side == OCO.Side.LEFT && (view == OCO.View.BOTTOM || view == OCO.View.FRONT) ) s = -1;
    else if ( view == OCO.View.LEFT ) s = -1;

    // arm position
    var x, y;
    if ( view == OCO.View.TOP || view == OCO.View.BOTTOM )
    {
        x = s * u * -.12;
        y = u * .64;
    }
    else return limb; // not supported yet
    var ox = 0;
    var oy = 0;

    // offset
    if (typeof position !== 'undefined' )
    {
        ox = position[0] - x;
        oy = position[1] - y;
    }

    // We need to keep the parents of the feathers
    var parent1, parent2;

    // for each part, set the location
    if ( arm )
    {
        b.name = i18n._p("Anatomy", "Arm");
        b.type = OCO.Bone.HUMERUS;
        b.x = x + ox;
        b.y = y + oy;

        if (!forearm && !hand)
        {
            parent1 = b;
            parent2 = b;
        }

        if (b.children.length > 0) b = b.children[0];
    }
    if (forearm)
    {
        b.name = i18n._p("Anatomy", "Forearm");
        b.type = OCO.Bone.RADIUS;
        b.x = s * u * -.22 + ox;
        b.y = u * .53 + oy;

        parent1 = b;
        if (!hand) parent2 = b;

        if (b.children.length > 0) b = b.children[0];
    }
    if (hand)
    {
        b.name = i18n._p("Anatomy", "Hand");
        b.type = OCO.Bone.CARPUS;
        b.x = s * u * -.37 + ox;
        b.y = u * .64 + oy;

        parent2 = b;
        if (!forearm) parent1 = b;

        if (b.children.length > 0) b = b.children[0];
    }

    // Tip
    b.name = i18n._p("Anatomy", "Wing") +
        '_' + i18n._p("Anatomy", "Tip");
    b.type = OCO.Bone.TIP;
    b.x = s * u * -.53 + ox;
    b.y = u * .66 + oy;

    // Add Feathers
    if (feathers == 0) return limb;

    function createFeather( xr, yr, xt, yt, p )
    {
        var boneName = OCO._uniqueString( i18n._p("Anatomy", "Feather"), names);
        b = new OCOBone( boneName );
        b.type = OCO.Bone.FEATHER;
        b.x = s * u * xr + ox;
        b.y = u * yr + oy;

        // tip
        var boneName = OCO._uniqueString( i18n._p("Anatomy", "Feather") +
            '_' + i18n._("Tip"), names);
        var bt = new OCOBone( boneName );
        bt.type = OCO.Bone.TIP;
        bt.x = s * u * xt + ox;
        bt.y = u * yt + oy;


        bt.attached = true;

        b.children.push(bt);
        p.children.push(b);
    }

    var names = [];
    // Single one, add in the middle
    if (feathers == 1)
    {
        createFeather( -.38, .63, -.56, .28, parent1 );
        return limb;
    }

    for (var i = 0, n = feathers; i < n; i++)
    {
        if ( i < n/2)
        {
            var x = OCO._linearInterpolation( i, 0, n/2, -.54, -.38);
            var y = OCO._linearInterpolation( i, 0, n/2, .66, .63);
            var xt = OCO._linearInterpolation( i, 0, n/2, -.96, -.56);
            var yt = OCO._linearInterpolation( i, 0, n/2, .62, .28);
            createFeather( x, y, xt, yt, parent2 );
        }
        else 
        {
            var x = OCO._linearInterpolation( i, n/2, n-1, -.38, -.22);
            var y = OCO._linearInterpolation( i, n/2, n-1, .63, .51);
            var xt = OCO._linearInterpolation( i, n/2, n-1, -.56, -.08);
            var yt = OCO._linearInterpolation( i, n/2, n-1, .28, .39);
            createFeather( x, y, xt, yt, parent1 );
        }
    }

    return limb;
}

/**
 * Creates a new snake spine.
 * @param {Boolean} [head=true]  Whether to create a head
 * @param {int} [spine=5] Number of spine bones
 * @param {float[]} [position] The position of the first bone of the arm.<br />
 * If omitted, computed automatically according to the current character in the doc.
 * @returns {OCOLimb} The snake spine
 */
OCODoc.prototype.newSnakeSpine = function( head, spine, position )
{
    head = OCO._d( head, true );
    spine = OCO._d( spine, 5 );

    // Unit
    var u = this.height;

    // count how many bones we need
    var num = spine+1;

    if (num == 1) return null;

    // Create limb
    var limb = this.newLimb( OCO.Limb.SNAKE_SPINE, OCO.Side.NONE, OCO.Location.NONE );
    var b = limb.newArmature( i18n._p("Anatomy", "Spine"), num );

    // hips position
    var ox = 0;
    var oy = 0;
    var x = u *.75;
    var y = u * .5;

    // offset
    if (typeof position !== 'undefined' )
    {
        ox = position[0] - x;
        oy = position[1] - y;
    }

    // for each part, set the location
    var spineLength = u*1.5 / spine;
    for (var i = 0; i < spine; i++)
    {
        b.name = i18n._p("Anatomy", "Spine");
        if ( i <= (spine-1) / 3) b.type = OCO.Bone.SNAKE_SPINE_ROOT;
        else if ( i <= (spine-1)*2 / 3) b.type = OCO.Bone.SNAKE_SPINE_MID;
        else b.type = OCO.Bone.SNAKE_SPINE_END;
        b.y = y + oy;
        b.x = x - spineLength*i - ox;
        if (b.children.length > 0) b = b.children[0];
    }

    // Tip
    b.name = i18n._p("Anatomy", "Spine") +
        '_' + i18n._p("Anatomy", "Tip");
    b.type = OCO.Bone.TIP;
    b.x = -u *.75;
    b.y = y + oy;

    // Head
    if (head)
    {
        var b = new OCOBone( i18n._("Head") );
        b.type = OCO.Bone.SKULL;
        b.x = x;
        b.y = y;

        var s = limb.armature.pop();

        limb.armature.push(b);
        b.children.push(s);

        var bt = new OCOBone( i18n._p("Anatomy", "Head") +
            '_' + i18n._p("Anatomy", "Tip") );
        bt.type = OCO.Bone.SKULL_TIP;
        bt.x = x + u*.2;
        bt.y = y;
        bt.attached = true;

        b.children.push(bt);
    }

    return limb;
}

/**
 * Creates a new fish spine.
 * @param {Boolean} [head=true]  Whether to create a head
 * @param {int} [spine=3] Number of spine bones
 * @param {float[]} [position] The position of the first bone of the spine.<br />
 * If omitted, computed automatically according to the current character in the doc.
 * @returns {OCOLimb} The fish spine
 */
OCODoc.prototype.newFishSpine = function( head, spine, position )
{
    head = OCO._d( head, true );
    spine = OCO._d( spine, 3 );

    // Unit
    var u = this.height;

    // count how many bones we need
    var num = spine+1;

    if (num == 1) return null;

    // Create limb
    var limb = this.newLimb( OCO.Limb.FISH_SPINE, OCO.Side.NONE, OCO.Location.NONE );
    var b = limb.newArmature( i18n._p("Anatomy", "Spine"), num );

    // hips position
    var ox = 0;
    var oy = 0;
    var x = u *.75;
    var y = u * .5;

    // offset
    if (typeof position !== 'undefined')
    {
        ox = position[0] - x;
        oy = position[1] - y;
    }

    // for each part, set the location
    var spineLength = u / spine;
    for (var i = 0; i < spine; i++)
    {
        b.name = i18n._p("Anatomy", "Spine");
        if ( i <= (spine-1) / 3) b.type = OCO.Bone.FISH_SPINE_ROOT;
        else if ( i <= (spine-1)*2 / 3) b.type = OCO.Bone.FISH_SPINE_MID;
        else b.type = OCO.Bone.FISH_SPINE_END;
        b.y = y + oy;
        b.x = x - spineLength*i - ox;
        if (b.children.length > 0) b = b.children[0];
    }

    // Tip
    b.name = i18n._p("Anatomy", "Spine") +
        '_' + i18n._p("Anatomy", "Tip");
    b.type = OCO.Bone.TIP;
    b.x = -u *.25;
    b.y = y + oy;

    // Head
    if (head)
    {
        var b = new OCOBone( i18n._p("Anatomy", "Head") );
        b.type = OCO.Bone.SKULL;
        b.x = x;
        b.y = y;

        var s = limb.armature.pop();

        limb.armature.push(b);
        b.children.push(s);

        var bt = new OCOBone( i18n._p("Anatomy", "Head") +
            '_' + i18n._p("Anatomy", "Tip") );
        bt.type = OCO.Bone.SKULL_TIP;
        bt.x = x + u*.3;
        bt.y = y;
        bt.attached = true;

        b.children.push(bt);
    }

    return limb;
}

/**
 * Creates a new fin.
 * @param {OCO.Side} [side=OCO.Side.LEFT] The side
 * @param {int} [fishbones=5]  Number of feathers
 * @param {float[]} [position] The position of the first bone of the arm.<br />
 * If omitted, computed automatically according to the current character in the doc.
 * @param {OCO.View} [view=OCO.View.RIGHT] The view
 * @returns {OCOLimb} The fin
 */
OCODoc.prototype.newFin = function( side, fishbones, view, position )
{
    side = OCO._d(side, OCO.Side.LEFT);
    view = OCO._d(view, OCO.View.RIGHT);

    fishbones = OCO._d( fishbones, 5 );

    // Unit
    var u = this.height;

    // Create limb
    var limb = this.newLimb( OCO.Limb.FIN, side, OCO.Location.NONE );

    // side
    var s = 1;
    if ( side == OCO.Side.RIGHT && (view == OCO.View.TOP || view == OCO.View.BACK) ) s = -1;
    else if ( side == OCO.Side.LEFT && (view == OCO.View.BOTTOM || view == OCO.View.FRONT) ) s = -1;
    else if ( view == OCO.View.LEFT ) s = -1;

    // arm position
    var x = s * u * -.17;
    var y = u * .47;
    var ox = 0;
    var oy = 0;

    // offset
    if ( typeof position !== 'undefined' )
    {
        ox = position[0] - x;
        oy = position[1] - y;
    }

    // Create root
    var rootBone = new OCOBone( i18n._p("Anatomy", "Fin") );
    rootBone.type = OCO.Bone.FIN;
    rootBone.x = x + ox;
    rootBone.y = y + oy;
    limb.armature.push(rootBone);
    // Tip
    var bt = new OCOBone( i18n._p("Anatomy", "Fin") +
        '_' + i18n._p("Anatomy", "Tip") );
    bt.type = OCO.Bone.TIP;
    bt.x = s * u * -.24 + ox;
    bt.y = u * .62 + oy;
    bt.attached = true;
    rootBone.children.push(bt);

    // Add FishBones
    if (fishbones == 0) return limb;

    var names = [];

    function createFishbone( xr, yr, xt, yt )
    {
        var boneName = OCO._uniqueString( i18n._p("Anatomy", "Fishbone"), names);
        b = new OCOBone( boneName );
        b.type = OCO.Bone.FIN_FISHBONE;
        b.x = s * u * xr + ox;
        b.y = u * yr + oy;

        // tip
        var boneName = OCO._uniqueString( i18n._p("Anatomy", "Fishbone") +
            '_' + i18n._p("Anatomy", "Tip"), names);
        var bt = new OCOBone( boneName );
        bt.type = OCO.Bone.TIP;
        bt.x = s * u * xt + ox;
        bt.y = u * yt + oy;
        bt.attached = true;

        b.children.push(bt);
        rootBone.children.push(b);
    }

    // Single one, add in the middle
    if (fishbones == 1)
    {
        createFishbone( -.22, .43, -.77, .60 );
        return limb;
    }

    for (var i = 0, n = fishbones; i < n; i++)
    {
        var x = OCO._linearInterpolation( i, 0, n-1, -.24, -.15);
        var y = OCO._linearInterpolation( i, 0, n-1, .63, .41);
        var xt = OCO._linearInterpolation( i, 0, n-1, -.82, -.17);
        var yt = OCO._linearInterpolation( i, 0, n-1, .60, .29);
        createFishbone( x, y, xt, yt );
    }

    return limb;
}

/**
 * Converts a doc coordinate/value in centimeters to pixel coordinates.<br/>
 * For multidimensionnal values (coordinates), the origin is adjusted from doc to image.
 * @param {float[]} point The coordinate to convert
 * @returns {int[]} The coordinates in pixels
 */
OCODoc.prototype.toPixels = function( point )
{
    if (point.length)
    {
        // First, convert to pixels
        var x = point[0]*this.pixelsPerCm;
        var y = point[1]*this.pixelsPerCm;
        // We're relative to the world, adjust
        return this.fromWorld( [x, y] );
    }
    return point * this.pixelsPerCm;
}

/**
 * Converts coordinates in pixels in the world to centimeters coordinates in the doc<br/>
 * For multidimensionnal values (coordinates), the origin is adjusted image to doc.
 * @param {float[]|float} point The coordinate to convert
 * @returns {float[]|float} The coordinates in centimeters relative to the doc
 */
OCODoc.prototype.fromPixels = function( point )
{
    if (point.length)
    {
        // We need to be relative to the world
        point = this.toWorld(point);
        var x = point[0];
        var y = point[1];
        // Convert to cm
        x /= this.pixelsPerCm;
        // Y coordinate is at bottom in OCO, top in 2D docs
        y /= this.pixelsPerCm;
        return [x, y];
    }
    return point / this.pixelsPerCm;
}

/**
 * Creates a js object containing this document data.<br/>
 * This object could then be exported to JSON for example.
 * @return {Object} the JS Object
 */
OCODoc.prototype.toObject = function()
{
    var data = {
        'type': this.type,
        'name': this.name,
        'height': this.height,
        'width': this.width,
        'centerOfMass': this.centerOfMass,
        'limbs': [],
        'resolution': this.resolution,
        'world': this.world,
        'pixelsPerCm': this.pixelsPerCm,
        'icon': this.icon,
        'imageEncoding': this.imageEncoding
    }

    for (var i = 0, n  = this.limbs.length; i < n; i++)
    {
        var limbData = this.limbs[i].toObject();
        data['limbs'].push(limbData);
    }

    return data;
}

/**
 * Creates a JSON string representing this document
 * @param {OCO.ImageEncoding} [imageEncoding=OCO.ImageEncoding.PATH] How to encode images in the OCO File
 * @param {File} [destinationFile] If imageEncoding is `OCO.ImageEncoding.PATH`, you must provide the OCO file to make the paths relative to it.
 * @return {string} the JSON document
 */
OCODoc.prototype.toJson = function( destinationFile )
{
    var data  = this.toObject();

    if (data.imageEncoding == OCO.ImageEncoding.PNG_BASE64) {
        data.icon = OCO._base64( data.icon );
    }
    else if (data.imageEncoding == OCO.ImageEncoding.PATH) {
        data.icon = OCO._relativePath( data.icon, destinationFile );
    }
    else if (data.imageEncoding == OCO.ImageEncoding.ABS_PATH) {
        var iconFile = new File( data.icon );
        data.icon = iconFile.absoluteURI();
    }

    return JSON.stringify(data, null, 4);
}

/**
 * Exports the current document to an oco file
 * @param {File|string} file The file.
 * @return {File} the file.
 */
OCODoc.prototype.toFile = function ( file )
{
    if (!(file instanceof File)) file = new File(file);
    file.encoding = 'UTF-8';
    var data = this.toJson( );

    if (!file.open('w')) return file;
    file.write(data);
    file.close();

    return file;
}

/**
 * Gets all the bones sorted by z index
 * @return {OCOBone[]} The list of bones
 */
OCODoc.prototype.getBones = function ()
{
    var allBones = [];
    for (var i = 0, ni = this.limbs.length; i < ni; i++)
    {
        allBones = allBones.concat(this.limbs[i].getBones());
    }

    allBones.sort( OCOBone._zSorter );

    return allBones;
}

/**
 * Normalizes the Z indices of all bones so they're positive (including 0) and continuous integers.
 * @param {int} [offset=0] An offset/start number
 * @return {int} The highest index
 */
OCODoc.prototype.normalizeZIndices = function( offset )
{
    offset = OCO._d(offset, 0);
    var numBones = this.numBones();
    // List all bones
    var bs = this.getBones();
    // Update indices
    for(var i = 0, ni = bs.length; i < ni; i++)
    {
        bs[i].zIndex = offset + i;
    }
}

/**
 * Finds the maximum and minimum Z index from all bones
 * @return {int[]} The [min, max] Z indices
 */
OCODoc.zBounds = function()
{
    var maxZ = Number.NEGATIVE_INFINITY;
    var minZ = Number.POSITIVE_INFINITY;
    for (var i = 0, ni = this.limbs.length; i < ni; i++)
    {
        var zb = this.limbs[i].zBounds();
        if (zb[0] < minZ) minZ = zb[0];
        if (zb[1] > maxZ) maxZ = zb[1];
    }
    return [minZ, maxZ];
}

/**
 * Extracts the icon from the OCO file
 * @param {string|File} file The OCO file
 * @param {string|File} [destination] The destination file if the file is included in the OCO file. Next to the OCO file by default.
 * @return {File} The icon file, or null if there was no icon/the file could not be written.
 */
OCODoc.extractIcon = function( file, destination )
{
    if (!(file instanceof File)) file = new File(file);

    // Check if there's an icon to extract
    var data = OCO._parseJsonFile( file );
    if (data.icon == "") return null;
    if (data.imageEncoding == OCO.ImageEncoding.ABS_PATH) return new File(data.icon);
    if (data.imageEncoding == OCO.ImageEncoding.PATH)
    {
        destination = OCO._absolutePath( data.icon, file);
        return new File(destination);
    }
    if (data.icon != "" && data.imageEncoding == OCO.ImageEncoding.PNG_BASE64) 
    {
        destination = OCO._d(destination, file.parent.absoluteURI + "/" + file.displayName.replace(".oco", ".png"));
        return OCO._fromBase64(data.icon, destination);
    }
    return null;
 
}

/**
 * Creates a new doc by reading a file
 * @param {File|string} file The file
 * @return {OCODoc|null} The document or null if the file couldn't be read or parsed
 */
OCODoc.fromFile = function ( file )
{
    var data = OCO._parseJsonFile( file );
    
    var doc = new OCODoc( OCO._d( data.name, "Character" ) );
    doc.type = OCO._d( data.type, OCO.Type.META );
    doc.height = OCO._d( data.height, 185 );
    doc.width = OCO._d( data.width, 60 );
    doc.centerOfMass = OCO._d( data.centerOfMass, [0.0, 107.0] );
    doc.resolution = OCO._d( data.resolution, [1920, 1080] );
    doc.world = OCO._d( data.world, [960, 980] );
    doc.pixelsPerCm = OCO._d( data.pixelsPerCm, 4.22 );
    doc.icon = OCO._d( data.icon, "" );
    doc.imageEncoding = OCO._d( data.imageEncoding, OCO.ImageEncoding.PATH );

    // Check Data
    if (doc.resolution[0] <= 0 || doc.resolution[0] > 30000)
        throw "Invalid resolution; the width must be in the range [0, 30000]";

    if (doc.resolution[1] <= 0 || doc.resolution[1] > 30000)
        throw "Invalid resolution; the height must be in the range [0, 30000]";


    // Parse limbs
    data.limbs = OCO._d( data.limbs, [] );
    for (var i = 0, ni = data.limbs.length; i < ni; i++)
    {
        doc.limbs.push( OCOLimb.fromObject(data.limbs[i]) );
    }


    return doc;
}

/**
 * Creates a new OCO Limb.
 * @class
 * @classdesc A limb contained in an OCO Doc.
 * @param {OCO.Limb} [limb=OCO.Limb.CUSTOM] A Predefined limb
 * @param {OCO.Side} [side=OCO.Side.NONE] - The side of the limb
 * @param {OCO.Location} [location=OCO.Location.NONE] - The location of the limb
 * @param {OCO.LimbType} [type=OCO.LimbType.CUSTOM] - The type of the limb
 * @category OCO
 */
function OCOLimb(limb, side, location, type )
{
    /**
     * The predefined limb
     * @name limb
     * @memberof OCOLimb
     * @type {OCO.Limb}
     */
    this.limb = OCO._d(limb, OCO.Limb.CUSTOM);
    /**
     * The type of the limb
     * @name type
     * @memberof OCOLimb
     * @type {OCO.LimbType}
     */
    this.type = OCO._d(type, OCO.LimbType.CUSTOM);
    /**
     * The sided of the limb
     * @name side
     * @memberof OCOLimb
     * @type {OCO.Side}
     */
    this.side = OCO._d( side, OCO.Side.NONE);
    /**
     * The location of the limb
     * @name location
     * @memberof OCOLimb
     * @type { OCO.Location}
     */
    this.location = OCO._d( location, OCO.Location.NONE);
    /**
     * The bones of the limb
     * @name location
     * @memberof OCOLimb
     * @type {OCOBone[]}
     */
    this.armature = [];
}

/**
    * Counts the total number of bones in this limb
    * @return {int}
    */
OCOLimb.prototype.numBones = function ()
{
    var count = 0;
    for (var i = 0, ni = this.armature.length; i < ni; i++ )
    {
        count += this.armature[i].numBones();
    }
    return count;
}

/**
    * Counts the total number of limbs in this limb
    * @return {int}
    */
OCOLimb.prototype.numLimbs = function ()
{
    var count = 1; // myself
    for (var i = 0, ni = this.armature.length; i < ni; i++ )
    {
        count += this.armature[i].numLimbs();
    }
    return count;
}

/**
 * Recursively gets all the children limbs of this limb
 * @return {OCOLimb[]} The array of all limbs
 */
OCOLimb.prototype.getLimbs = function()
{
    var limbs = [];
    for (var i = 0, n = this.armature.length; i < n; i++) 
    {
        limbs = limbs.concat( this.armature[i].getLimbs() );
    }
    return limbs;
}

/**
 * Gets the boundaries of the limb
 * @returns {float[]} [left, top, right, bottom]
 */
OCOLimb.prototype.bounds = function( )
{
    return OCO.getBounds( this.armature );
}

/**
 * Creates a new chain of bones and adds it to the limb.
 * @param {string} name The name of the bones (will increment if needed)
 * @param {int} [num=2] The number of bones in the chain
 * @param {float} [length=100.0] The length in centimeters
 * @return {OCOBone} The root bone.
 */
OCOLimb.prototype.newArmature = function( name, num, length )
{
    num = OCO._d(num, 2);
    length = OCO._d(length, 100.0);
    var boneLength = length / (num-1);

    var x = -length / 2;
    var b = null;
    var root = null;
    var names = [];

    for (var i = 0; i < num; i++)
    {
        var boneName = OCO._uniqueString(name, names);
        var bone = new OCOBone( boneName );
        names.push(boneName);
        bone.y = 100;
        bone.x = x;
        bone.zIndex = length - i;

        if (b != null)
        {
            b.children.push( bone );
            bone.attached = true;
        }
        else
        {
            this.armature.push( bone );
            root = bone;
        }

        x += boneLength;
        b = bone;
    }

    return root;
}

/**
 * Creates a js object containing this limb data.<br/>
 * This object could then be exported to JSON for example.
 * @return {Object} The JS Object
 */
OCOLimb.prototype.toObject = function()
{
    var data = {
        'limb': this.limb,
        'type': this.type,
        'side': this.side,
        'location': this.location,
        'armature': []
    }

    for (var i = 0, n = this.armature.length; i < n; i++)
    {
        var boneData = this.armature[i].toObject();
        data['armature'].push(boneData);
    }

    return data;
}

/**
 * Normalizes the Z indices of all bones so they're positive (including 0) and continuous integers
 * @param {int} [offset=0] An offset/start number
 * @return {int} The highest index
 */
OCOLimb.prototype.normalizeZIndices = function( offset )
{
    offset = OCO._d(offset, 0);
    var numBones = this.numBones();
    // List all bones
    var bs = this.getBones();
    // Update indices
    for(var i = 0, ni = bs.length; i < ni; i++)
    {
        bs[i].zIndex = offset + i;
    }
}

/**
 * Gets all the bones sorted by z index
 * @return {OCOBone[]} The list of bones
 */
OCOLimb.prototype.getBones = function ()
{
    var allBones = [];
    for (var i = 0, ni = this.armature.length; i < ni; i++)
    {
        allBones = allBones.concat(this.armature[i].getBones());
    }

    allBones.sort( OCOBone._zSorter );

    return allBones;
}

/**
 * Finds the maximum and minimum Z index from all bones
 * @return {int[]} The [min, max] Z indices
 */
OCOLimb.prototype.zBounds = function()
{
    var maxZ = Number.NEGATIVE_INFINITY;
    var minZ = Number.POSITIVE_INFINITY;
    for (var i = 0, ni = this.armature.length; i < ni; i++)
    {
        var zb = this.armature[i].zBounds();
        if (zb[0] < minZ) minZ = zb[0];
        if (zb[1] > maxZ) maxZ = zb[1];
    }
    return [minZ, maxZ];
}

/**
 * Creates a limb from a js object.
 * @param {Object} data The js object representing the limb
 * @return {OCOLimb} The new limb
 */
OCOLimb.fromObject = function( data )
{
    var limb = OCO._d( data.limb, OCO.Limb.CUSTOM);
    var side = OCO._d( data.side, OCO.Side.NONE);
    var location = OCO._d( data.location, OCO.Location.NONE);
    var type = OCO._d( data.type, OCO.LimbType.CUSTOM);
    var l = new OCOLimb( limb, side, location, type);

    // Parse armature
    data.armature = OCO._d( data.armature, [] );
    for (var i = 0, ni = data.armature.length; i < ni; i++)
    {
        l.armature.push( OCOBone.fromObject( data.armature[i] ) );
    }
    return l;
}

/**
 * Creates a new OCO Bone.
 * @class
 * @classdesc A bone contained in an OCO Limb.
 * @param {string} name The name
 * @category OCO
 */
function OCOBone(name)
{
    /**
     * The name of the bone
     * @name name
     * @memberof OCOBone
     * @type {string}
     */
    this.name = name;
    /**
     * The x coordinate of the bone
     * @name x
     * @memberof OCOBone
     * @type {float}
     */
    this.x = 0.0;
    /**
     * The y coordinate of the bone
     * @name y
     * @memberof OCOBone
     * @type {float}
     */
    this.y = 0.0;
    /**
     * An arbitrary Z-index. Higher is under, lower is above
     * @name zIndex
     * @memberof OCOBone
     * @type {int}
     */
    this.zIndex = 0;
    /**
     * true if this bone is attached to its parent.
     * @name attached
     * @memberof OCOBone
     * @type {Boolean}
     */
    this.attached = false;
    /**
     * The child bones.
     * @name children
     * @memberof OCOBone
     * @type {OCOBone[]}
     */
    this.children = [];
    /**
     * The child limbs.
     * @name limbs
     * @memberof OCOBone
     * @type {OCOLimb[]}
     */
    this.limbs = [];
    /**
     * The type of bone.
     * @name type
     * @memberof OCOBone
     * @type {OCO.Bone}
     */
    this.type = OCO.Bone.CUSTOM;
    /**
     * The envelop of the bone,<br/>
     * In a meta rig, this is a silhouette which will contain the design,
     * and can be used to help locate the joint, link the design to the bone, etc.<br/>
     * In a rigged character, this should be a simple silhouette close to the artwork silhouette.
     * @type {Object}
     */
    this.envelop = {};
    /**
     * The width of the envelop, around the joint
     * @type {float}
     */
    this.envelop.width = -1.0;
    /**
     * The offset of the envelop, in the local X-axis<br/>
     * 0.0 is centered around the joint,<br/>
     * positive values are on the right of the joint when the bone is oriented towards the ground,<br/>
     * negative values are on the left of the joint when the bone is oriented towards the ground.
     * @type {float}
     */
    this.envelop.offset = 0.0;
}

/**
 * The length of the bone (this distance with its first child)
 * @return {int} The length
 */
OCOBone.prototype.length = function ()
{
    if (this.children.length == 0) return 0;
    var child = this.children[0];
    return OCO._length([this.x, this.y], [child.x, child.y]);
}

/**
 * Creates a new limb and adds it to the bone
 * @param {OCO.Limb} [limb=OCO.Limb.CUSTOM] A Predefined limb
 * @param {OCO.Side} [side=OCO.Side.NONE] - The side of the limb
 * @param {OCO.Location} [location=OCO.Location.NONE] - The location of the limb
 * @param {OCO.LimbType} [type=OCO.LimbType.CUSTOM] - The type of the limb
 * @return {OCOLimb} The new limb
 */
OCOBone.prototype.newLimb = function( limb, side, location, type )
{
    var l = new OCOLimb( limb, side, location, type );
    this.limbs.push(l);
    return l;
}

/**
    * Counts the total number of child bones
    * @return {int}
    */
OCOBone.prototype.numBones = function ()
{
    var count = 1;
    for (var i = 0, ni = this.children.length; i < ni; i++ )
    {
        count += this.children[i].numBones();
    }
    for (var i = 0, ni = this.limbs.length; i < ni; i++ )
    {
        count += this.limbs[i].numBones();
    }
    return count;
}

/**
    * Counts the total number of child limbs
    * @return {int}
    */
OCOBone.prototype.numLimbs = function ()
{
    var count = 0;
    for (var i = 0, ni = this.children.length; i < ni; i++ )
    {
        count += this.children[i].numLimbs();
    }
    count += this.limbs.length;

    return count;
}

/**
 * Recursively gets all the children limbs of this bone
 * @return {OCOLimb[]} The array of all limbs
 */
OCOBone.prototype.getLimbs = function()
{
    var limbs = this.limbs;
    for (var i = 0, n = this.children.length; i < n; i++) 
    {
        limbs = limbs.concat( this.children[i].getLimbs() );
    }
    return limbs;
}

/**
 * Translates the bone by [x, y] pixels
 * @param {int} [x=0] The horizontal offset
 * @param {int} [y=0] The vertical offset
 * @param {bool} [translateChildren=true] If false, the children stay at their current location
 */
OCOBone.prototype.translate = function( x, y, translateChildren ) {
    translateChildren = OCO._d(translateChildren, true);
    x = OCO._d(x, 0);
    y = OCO._d(y, 0);

    this.x += x;
    this.y += y;

    if (translateChildren) {
        for (var i = 0, n = this.children.length; i < n; i++) {
            this.children[i].translate(x, y);
        }
    }
}

/**
 * Translates the bone to the new coordinates
 * @param {int} [x] The new X value. If omitted, moves the layer vertically
 * @param {int} [y] The new Y value. If omitted, moves the layer horizontally
 * @param {bool} [translateChildren=true] If false, the children stay at their current location
 */
OCOBone.prototype.translateTo = function( x, y, translateChildren ) {
    translateChildren = OCO._d(translateChildren, true);
    x = OCO._d(x, this.x);
    y = OCO._d(y, this.y);

    var offsetX = x - this.x;
    var offsetY = y - this.y;

    this.x = x;
    this.y = y;

    if (translateChildren) {
        for (var i = 0, n = this.children.length; i < n; i++) {
            this.children[i].translate(offsetX, offsetY);
        }
    }
}

/**
 * Creates a js object containing this bone data.<br/>
 * This object could then be exported to JSON for example.
 * @return {Object} the JS Object
 */
OCOBone.prototype.toObject = function()
{
    var data = {
        'name': this.name,
        'x': this.x,
        'y': this.y,
        'zIndex': this.zIndex,
        'attached': this.attached,
        'children': [],
        'limbs': [],
        'type': this.type
    }
    data.envelop = {};
    data.envelop.width = this.envelop.width;
    data.envelop.offset = this.envelop.offset;

    for (var i = 0, n = this.children.length; i < n; i++)
    {
        var boneData = this.children[i].toObject();
        data['children'].push(boneData);
    }

    for (var i = 0, n = this.limbs.length; i < n; i++)
    {
        var limbData = this.limbs[i].toObject();
        data['limbs'].push(limbData);
    }

    return data;
}

/**
 * Normalizes the Z indices of all bones so they're positive (including 0) and continuous integers
 * @param {int} [offset=0] An offset/start number
 * @return {int} The highest index
 */
OCOBone.prototype.normalizeZIndices = function( offset )
{
    offset = OCO._d(offset, 0);
    var numBones = this.numBones();
    // List all bones
    var bs = this.getBones();
    // Update indices
    for(var i = 0, ni = bs.length; i < ni; i++)
    {
        bs[i].zIndex = offset + i;
    }
}

/**
 * Gets all the bones sorted by z index
 * @return {OCOBone[]} The list of bones
 */
OCOBone.prototype.getBones = function ()
{
    var allBones = [];
    for (var i = 0, ni = this.limbs.length; i < ni; i++)
    {
        allBones = allBones.concat(this.limbs[i].getBones());
    }
    for (var i = 0, ni = this.children.length; i < ni; i++)
    {
        allBones = allBones.concat(this.children[i].getBones());
    }
    allBones.push(this);

    allBones.sort( OCOBone._zSorter );

    return allBones;
}

/**
 * Finds the maximum and minimum Z index from all bones
 * @return {int[]} The [min, max] Z indices
 */
OCOBone.zBounds = function()
{
    var maxZ = Number.NEGATIVE_INFINITY;
    var minZ = Number.POSITIVE_INFINITY;
    for (var i = 0, ni = this.limbs.length; i < ni; i++)
    {
        var zb = this.limbs[i].zBounds();
        if (zb[0] < minZ) minZ = zb[0];
        if (zb[1] > maxZ) maxZ = zb[1];
    }
    for (var i = 0, ni = this.children.length; i < ni; i++)
    {
        var zb = this.children[i].zBounds();
        if (zb[0] < minZ) minZ = zb[0];
        if (zb[1] > maxZ) maxZ = zb[1];
    }

    if (this.zIndex < minZ) minZ = this.zIndex;
    if (this.zIndex > maxZ) maxZ = this.zIndex;
    return [minZ, maxZ];
}

/**
 * Creates a bone from a js object.
 * @param {Object} data The js object representing the bone
 * @return {OCOBone} The new bone
 */
OCOBone.fromObject = function( data )
{
    var bone = new OCOBone( OCO._d(data.name, "Bone"));
    bone.x = OCO._d(data.x, 0.0);
    bone.y = OCO._d(data.y, 0.0);
    bone.zIndex = OCO._d(data.zIndex, 0);
    bone.attached = OCO._d(data.attached, false);
    bone.type = OCO._d(data.type, OCO.Bone.CUSTOM);
    data.envelop = OCO._d(data.envelop, {});
    bone.envelop.width = OCO._d(data.envelop.width, bone.envelop.width);
    bone.envelop.offset = OCO._d(data.envelop.offset, bone.envelop.offset);


    // Parse children
    data.children = OCO._d(data.children, []);
    for( var i = 0, ni = data.children.length; i < ni; i++)
    {
        bone.children.push( OCOBone.fromObject(data.children[i]) );
    }

    // Parse limbs
    data.limbs = OCO._d(data.limbs, []);
    for (var i = 0, ni = data.limbs.length; i < ni; i++)
    {
        bone.limbs.push( OCOLimb.fromObject(data.limbs[i]) );
    }

    return bone;
}

// Sorter for bones according to the z index
OCOBone._zSorter = function (ba, bb)
{
    return ba.zIndex - bb.zIndex;
}

// === INIT OCO on Include ===

OCO._init();