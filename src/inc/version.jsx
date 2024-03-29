/**
 * Constructs a new version object
 * @class
 * @name DuVersion
 * @classdesc Informations about the version of an application.<br />
 * The version is in the form: Major.Minor.Patch#Build. Example: <code>17.0.0x557</code> or <code>17.0.0-Alpha1</code> or <code>17.4</code><br />
 * The only required part is the Major version.
 * @param {string} [version='1.0.0'] The version in the form Major.Minor.Patch
 * @property {string} fullVersion The complete version name
 * @property {string} versionString The Major.Minor part as a string
 * @property {float} version The Major.Minor part as a float
 * @property {int} major
 * @property {int} minor
 * @property {int} patch
 * @property {int} build The build is -1 if it cannot be parsed as an int, like "alpha".
 * @property {string} buildString The build as a string
 * @category DuESF
 */
function DuVersion( version )
{
	if (!isdef( version )) version = '';
	
	var reV = /^(\d+)\.?(\d*)\.?(\d*)\D?(\S*)/i;
    var v = version.match( reV );

	if (version == '' || !v)
	{
		this.fullVersion = '1.0.0';
		this.versionString = '1.0';
		this.version = 1;
		this.major = 1;
		this.minor = 0;
		this.patch = 0;
		this.build = -1;
		this.buildString = "";
		return;
	}

	if (!v[ 1 ]) v[ 1 ]  = '1';
	if (!v[ 2 ]) v[ 2 ]  = '0';
	if (!v[ 3 ]) v[ 3 ]  = '0';
	if (!v[ 4 ]) v[ 4 ]  = '';

	this.fullVersion = version;
	this.versionString = v[ 1 ] + '.' + v[ 2 ];
	this.version = parseFloat(this.versionString);
	if ( isNaN(this.version) ) this.version = parseFloat(v[ 1 ]);
	if ( isNaN(this.version) ) this.version = 0;
	this.major = parseInt( v[ 1 ] );
	if ( isNaN(this.major) ) this.major = 0;
	this.minor = parseInt( v[ 2 ] );
	if ( isNaN(this.minor) ) this.minor = 0;
	this.patch = parseInt( v[ 3 ] );
	if ( isNaN(this.patch) ) this.patch = 0;
	this.build = parseInt( v[ 4 ] );
	if ( isNaN(this.build) ) this.build = -1;
	this.buildString = v[ 4 ];
}

/**
 * Checks if this version is higher than another.
 * @memberof DuVersion
 * @param {DuVersion|string} otherVersion The version to compare with.
 * @return {bool} true if this version is more recent than otherVersion
*/
DuVersion.prototype.higherThan = function( otherVersion )
{
	return DuVersion.compare(this, otherVersion);
}

/**
 * Checks if this version is higher than or equals another.
 * @memberof DuVersion
 * @param {DuVersion|string} otherVersion The version to compare with.
 * @return {bool} true if this version is more recent than or the same as otherVersion
*/
DuVersion.prototype.atLeast = function( otherVersion )
{
	if ( this.equals(otherVersion) ) return true;
	return DuVersion.compare(this, otherVersion);
}

/**
 * Checks if this version is the same as another.
 * @memberof DuVersion
 * @param {DuVersion|string} otherVersion The version to compare with.
 * @return {bool} true if this version is the same
*/
DuVersion.prototype.equals = function( otherVersion )
{
	if (! (otherVersion instanceof DuVersion) ) otherVersion = new DuVersion( otherVersion );

	return this.fullVersion == otherVersion.fullVersion;
}

/**
 * Compares two versions of an application
 * @static
 * @memberof DuVersion
 * @param {string|DuVersion} vA - The first version
 * @param {string|DuVersion} [vB=DuESF.scriptVersion] - The other version
 * @return {boolean} True if vA is more recent than vB (strict, if they're equal it will return false)
*/
DuVersion.compare = function (vA, vB)
{
	vB = def(vB, DuESF.scriptVersion);

	if (! (vA instanceof DuVersion) ) vA = new DuVersion( vA );
	if (! (vB instanceof DuVersion) ) vB = new DuVersion( vB );

	//compare major version
	if ( vA.major > vB.major ) return true;
	if ( vA.major < vB.major ) return false;

	//minor
	if ( vA.minor > vB.minor ) return true;
	if ( vA.minor < vB.minor ) return false;

	//patch
	if ( vA.patch > vB.patch ) return true;
	if ( vA.patch < vB.patch ) return false;

	//build 
	if ( vA.build >= 0 && vB.build >= 0 )
	{
		if ( vA.build > vB.build ) return true;
		if ( vA.build < vB.build ) return false;
	}

	//build as a string
	if ( vA.buildString == vB.buildString ) return false;
	if ( vA.buildString == '' && vB.buildString != '') return true;
	if ( vA.buildString != '' && vB.buildString == '') return false;

	var vABuildString = vA.buildString.toLowerCase();
	var vBBuildString = vB.buildString.toLowerCase();

	if ( vABuildString.indexOf('rc') >= 0 )
	{
		if ( vBBuildString.indexOf('rc') < 0 ) return true;
		return vABuildString > vBBuildString ;
	}

	if ( vABuildString.indexOf('gamma') >= 0 )
	{
		if ( vBBuildString.indexOf('rc') >= 0 ) return false;
		if ( vBBuildString.indexOf('gamma') < 0 ) return true;
		return vABuildString > vBBuildString ;
	}

	if ( vABuildString.indexOf('beta') >= 0 )
	{
		if ( vBBuildString.indexOf('rc') >= 0 ) return false;
		if ( vBBuildString.indexOf('gamma') >= 0 ) return false;
		if ( vBBuildString.indexOf('beta') < 0 ) return true;
		return vABuildString > vBBuildString ;
	}

	if ( vABuildString.indexOf('alpha') >= 0 )
	{
		if ( vBBuildString.indexOf('rc') >= 0 ) return false;
		if ( vBBuildString.indexOf('gamma') >= 0 ) return false;
		if ( vBBuildString.indexOf('beta') >= 0 ) return false;
		if ( vBBuildString.indexOf('alpha') < 0 ) return true;
		return vABuildString > vBBuildString ;
	}

	return vABuildString > vBBuildString;
}

/**
 * Information got from an update query on a RxVersion server, as returned by {@link DuVersion.checkUpdate DuVersion.checkUpdate()}.
 * @typedef {Object} DuVersion~UpdateReply
 * @property {Boolean} update Whether this script needs an update.
 * @property {string} version The available version.
 * @property {string} name The name of the script.
 * @property {string} description A description of the version.
 * @property {string} downloadURL The link to download the current version.
 * @property {string} changelogURL The link to the changelog.
 * @property {string} donateURL The link to make a donation.
 * @property {string} date The date of the version, in the form "yyyy-MM-dd hh:mm:ss".
 * @property {string} message Information about success/errors.
 * @property {Boolean} success false if the query failed and the version could not be retrieved.
 * @property {Boolean} accepted false if the query was wrong or the server did not recognize it. Should always be true.

/**
 * Checks if a new version is available for the current script,<br/>
 * using the DuESF.rxVersionURL if it is set.
 * @returns {DuVersion~UpdateReply|null} An {@link DuVersion~UpdateReply} or null if the server could not be reached.
 */
DuVersion.checkUpdate = function()
{
	if ( DuESF.rxVersionURL == '' ) return null;
	var co = new Socket;
	co.encoding = 'UTF-8';
	// No need for more than 5 seconds for just checking updates.
	co.timeout = 5;
    var url = DuESF.rxVersionURL.replace('http://','').replace('https://','').split('/');
    var baseUrl = url.shift();
	var fullUrl = baseUrl  + ':80';
    if ( co.open( fullUrl ) )
    {
        // Build request
		var os;
		if (DuSystem.mac) os = 'mac';
        else os = 'win';

		var args = {
			"getVersion": "",
			"name": DuESF.scriptName,
			"version": DuESF.scriptVersion.fullVersion,
			"os": os,
			"osVersion": DuSystem.osVersion,
			"host": DuESF.host,
			"hostVersion": DuESF.hostVersion.fullVersion,
			"languageCode": i18n.getLocale()
		}
		if (DuESF.isPreRelease) args["prerelease"] = '';
        var request = DuURL.buildGET( baseUrl, url, args );
		var reply = '';

		DuDebug.log( "Version check - Sys Info\r\n" +
			"Script: " + DuESF.scriptName + '\r\n' +
			"Script Version: " + DuESF.scriptVersion.fullVersion + '\r\n' +
			"OS: " + os + '\r\n' +
			"OS Version: " + DuSystem.osVersion + '\r\n' +
			"Host: " + DuESF.host + '\r\n' +
			"Host Version: " + DuESF.hostVersion.fullVersion + '\r\n' +
			"Language Code: " + i18n.getLocale() + '\r\n\r\n' +
			"Request: " + request
			);

		if ( co.writeln( request ) ) {
			// Wait for the closing } or timeout
			// timeout in 2 seconds
			var now = new Date().getTime();
			var timeout = now + 2000;
			while ( (reply == '' || reply.lastIndexOf('}') < reply.indexOf('{') ) && now < timeout)
			{
				$.sleep(100);
				now = new Date().getTime();
				reply += co.read();
			}
    	}

		co.close();

		// Sanitize reply (strip http headers, and parse)
		DuDebug.log( "Version check - Reply\r\n" + reply );
		var replyBody = reply.substring( reply.indexOf('{'), reply.lastIndexOf('}')+1 );

		if (DuString.fullTrim(replyBody) == '') {
			if (DuESF.debug) alert("Can't check for updates:\nThe server did not reply.");
			return null;
		}

		try {
			reply = JSON.parse(replyBody);
		}
		catch (e) {
			if (DuESF.debug) alert("Can't check for updates:\n" + e.message + '\n\nThis is the content of the server reply:\n\n' + reply);
			return null;
		}

		// Parse lists
		if (reply['description']) {
			var descriptionList = reply['description'].split('\n');
			for (var i = 0; i < descriptionList.length; i++) {
				var trimmedLine = DuString.trim(descriptionList[i]);
				if (DuString.startsWith(trimmedLine, "- ")) {
					descriptionList[i] = descriptionList[i].replace("- ", "\u2022 ");
				}
			}
			reply.description = descriptionList.join("\n");
		}

		return reply;
    }

	return null;
}