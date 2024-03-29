/* License
	DuESF - Duduf ExtendScript Framework

	Copyright (c) 2021 Nicolas Dufresne, RxLaboratory

	https://rxlaboratory.org

	This file is part of DuESF.

        This program is free software: you can redistribute it and/or modify
        it under the terms of the GNU General Public License as published by
        the Free Software Foundation, either version 3 of the License, or
        (at your option) any later version.

        This program is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
        GNU General Public License for more details.

        You should have received a copy of the GNU General Public License
        along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * The Duduf ExtendScript Framework.<br />
 * by {@link https://rxlaboratory.org RxLaboratory} and {@link http://duduf.com Duduf}.<br />
 * WARNING: all objects marked deprecated will be removed in the version 1.1.0 of the framework.
 * @example
 * // Encapsulate everything to avoid global variables!
 * // The parameter is either undefined (stand alone script) or the panel containing the ui (ScriptUI)
 * (function(thisObj)
 * {
 *      // Include the framework
 *      #include "DuESF.jsxinc";
 *      
 *      // Running the init() method of DuAEF is required to setup everything properly.
 *      DuESF.init( "YourScriptName", "1.0.0", "YourCompanyName" );
 *      
 *      // These info can be used by the framework to improve UX, but they're optional
 *      DuESF.chatURL = 'http://chat.rxlab.info'; // A link to a live-chat server like Discord or Slack...
 *      DuESF.bugReportURL = 'https://github.com/RxLaboratory/DuAEF_Dugr/issues/new/choose'; // A link to a bug report form
 *      DuESF.featureRequestURL = 'https://github.com/RxLaboratory/DuAEF_Dugr/issues/new/choose'; // A link to a feature request form
 *      DuESF.aboutURL = 'http://rxlaboratory.org/tools/dugr'; // A link to the webpage about your script
 *      DuESF.docURL = 'http://dugr.rxlab.guide'; // A link to the documentation of the script
 *      DuESF.scriptAbout = 'Duduf Groups: group After Effects layers!'; // A short string describing your script
 *      DuESF.companyURL = 'https://rxlaboratory.org'; // A link to your company's website
 *      DuESF.rxVersionURL = 'http://version.rxlab.io' // A link to an RxVersion server to check for updates
 *      
 *      // Build your UI here, declare your methods, etc.
 * 
 *      // This will be our main panel
 *      var ui = DuScriptUI.scriptPanel( thisObj, true, true, new File($.fileName) );
 *      ui.addCommonSettings(); // Automatically adds the language settings, location of the settings file, etc
 *
 *      DuScriptUI.staticText( ui.settingsGroup, "Hello world of settings!" ); // Adds a static text to the settings panel
 *      DuScriptUI.staticText( ui.mainGroup, "Hello worlds!" ); // Adds a static text to the main panel
 *      
 *      // When you're ready to display everything
 *      DuScriptUI.showUI(ui);
 *
 *      // Note that if you don't have a UI or if you don't use DuScriptUI to show it,
 *      // you HAVE TO run this method before running any other function:
 *      // DuESF.enterRunTime();
 *  
 * })(this);
 * @namespace
 * @author Nicolas Dufresne and contributors
 * @copyright 2021-2023 Nicolas Dufresne, RxLaboratory
 * @version {duesfVersion}
 * @license GPL-3.0 <br />
 * This program is free software: you can redistribute it and/or modify<br />
 * it under the terms of the GNU General Public License as published by<br />
 * the Free Software Foundation, either version 3 of the License, or<br />
 * (at your option) any later version.<br />
 *<br />
 * This program is distributed in the hope that it will be useful,<br />
 * but WITHOUT ANY WARRANTY; without even the implied warranty of<br />
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the<br />
 * GNU General Public License for more details.<br />
 *<br />
 * You should have received a copy of the GNU General Public License<br />
 * along with this program. If not, see {@link http://www.gnu.org/licenses/}.
 * @category DuESF
 */
var DuESF = {};

/**
 * The Current DuESF Version
 * @readonly
 * @memberof DuESF
 * @type {DuVersion}
 */
DuESF.version = new DuVersion('{duesfVersion}');
/**
 * Set to true and enable debug mode if you're a developper
 * @memberof DuESF
 * @type {Boolean}
 */
DuESF.debug = false;
/**
 * The name of the script using this instance of DuESF. Must be set by {@link DuESF.init}.
 * @memberof DuESF
 * @type {string}
 * @readonly
 */
DuESF.scriptName = "DuESF";
/**
 * The version of the script using this instance of DuESF. Must be set by {@link  DuESF.init}.
 * @memberof DuESF
 * @type {DuVersion}
 * @readonly
 */
DuESF.scriptVersion = new DuVersion('0.0.0');
/**
 * An icon for this script
 * @type {string}
 */
DuESF.scriptIcon = '';
/**
 * The url for the forum about the script
 * @type {string}
 */
DuESF.forumURL = '';
/**
 * The url for a chat server about the script
 * @type {string}
 */
DuESF.chatURL = '';
/**
 * The url for reporting bugs
 * @type {string}
 */
DuESF.bugReportURL = '';
/**
 * The url for donations, support, like...
 * @type {string}
 */
DuESF.donateURL = 'http://donate.rxlab.info';
/**
 * The url about the script
 * @type {string}
 */
DuESF.aboutURL = '';
/**
 * The url to the documentation of the script
 * @type {string}
 */
DuESF.docURL = '';
/**
 * The text about the script
 * @type {string}
 */
DuESF.scriptAbout = '';
/**
 * The name of the company/organisation/individual developping this tool
 * @type {string}
 */
DuESF.companyName = 'RxLaboratory';
/**
 * The URL to the company's website
 * @type {string}
 */
DuESF.companyURL = 'https://rxlaboratory.org';
/**
 * An icon for this company
 * @type {string}
 */
DuESF.companyIcon = '';
/**
 * The URL to a rxVersion server used to check for updates
 * @type {string}
 */
DuESF.rxVersionURL = '';
/**
 * A URL where people can help localizing the script
 * @type {string}
 */
DuESF.translateURL = 'http://translate.rxlab.io'
/**
 * Is this script a prerelease version? This info is used when checking for updates.
 * @type {bool}
 */
DuESF.isPreRelease = false;
/**
 * The current DuESF File
 * @readonly
 * @memberof DuESF
 * @type {File}
 */
DuESF.file = new File( $.fileName );
/**
 * Enum for states.
 * @readonly
 * @enum {int}
 */
DuESF.State = {
    NOT_SET: -1,
    INIT: 0,
    RUNTIME: 1
};
/**
 * The current state of the script
 * @type {DuESF.State}
 * @default DuESF.State.NOT_SET
 */
DuESF.state = DuESF.State.NOT_SET;
/**
 * True if the script is run for the first time (new or the version has changed since last run)
 * @type {boolean}
 * @readonly
 */
DuESF.scriptFirstRun = true;
/**
 * The applicatiosns DuESF can be used with.
 * @readonly
 * @enum {string}
 */
DuESF.HostApplication = {
    AFTER_EFFECTS: 'aftereffects',
    ILLUSTRATOR: 'illustrator',
    PHOTOSHOP: 'photoshop',
    INDESIGN: 'indesign'
}
DuESF.HostApplicationName = {
    'aftereffects': 'After Effects',
    'illustrator': 'Illustrator',
    'photoshop': 'Photoshop',
    'indesign': 'InDesign',
}
DuESF.hostIsBeta = false;
/**
 * The host application
 * @type {DuESF.HostApplication}
 */
DuESF.host = null;
/**
 * The version of the host application
 * @type {DuVersion}
 */
DuESF.hostVersion = new DuVersion();
/**
 * The list of functions to run with {@link DuESF.init}. You can add your own methods here.<br />
 * They're run after the settings have been loaded, but before everything else (especially the translator).
 * @type {function[]}
 */
DuESF.preInitMethods = [];
/**
 * The list of functions to run with {@link DuESF.init}. You can add your own methods here.<br />
 * They're run after the settings and translator have been loaded.
 * @type {function[]}
 */
DuESF.initMethods = [];
/**
 * The list of functions to run with {@link DuESF.enterRunTime}. You can add your own methods here.<br />
 * They're run after the UI has been created and just before runtime
 * @type {function[]}
 */
DuESF.enterRunTimeMethods = [];

/**
 * The settings used by DuESF
 * @type {DuSettings}
 */
DuESF.settings = null;

/**
 * This method has to be called once at the very beginning of the script, just after the inclusion of DuESF <code>#include DuESF.jsxinc</code>
 * @param {string} [scriptName="DuESF"] - The name of your script, as it has to be displayed in the UI and the filesystem
 * @param {string} [scriptVersion="0.0.0"] - The version of your script, in the form "XX.XX.XX-Comment", for example "1.0.12-Beta". The "-Comment" part is optional.
 * @param {string} [companyName="RxLaboratory"] - The name of the company/organisation/individual developping this script.
 */
DuESF.init = function( scriptName, scriptVersion, companyName )
{
    var host = BridgeTalk.appName;

    if (host.indexOf('beta') == host.length -4) {
        DuESF.hostIsBeta = true;
        host = host.slice(0, host.length - 4);
    }

    DuESF.host = host;
    DuESF.hostApplicationName = DuESF.HostApplicationName[host];

    DuESF.hostVersion = new DuVersion( BridgeTalk.appVersion );
    if (DuESF.host == DuESF.HostApplication.AFTER_EFFECTS) {
        DuESF.hostVersion = new DuVersion( app.version );
    }
    
    DuESF.state = DuESF.State.INIT;

    scriptName = def( scriptName, "DuESF" );
    scriptVersion = def( scriptVersion, "0.0.0" );
    DuESF.scriptName = scriptName;
    DuESF.scriptVersion = new DuVersion(scriptVersion);
    DuESF.companyName = def( companyName, "RxLaboratory" );

    // Init settings
    DuSettings.init();

    // check if this script has already been run once
    // Check the version from latest run
    var prevVersion = DuESF.settings.get("version");
    if ( prevVersion == scriptVersion ) DuESF.scriptFirstRun = false;

    DuDebug.log( "DuESF: loading preinit methods." );

    // Pre translator init
    for( var i = 0; i < DuESF.preInitMethods.length; i++) {
        DuESF.preInitMethods[i]();
    }

    DuDebug.log( "DuESF: init translator." );

    // Init translator
    translationEngine.init();

    DuDebug.log( "DuESF: loading init methods." );

    // Init everything else
    for( var i = 0; i < DuESF.initMethods.length; i++) {
        DuESF.initMethods[i]();
    }
}

/**
 * This method has to be called once at the end of the script, when everything is ready and the main UI visible (after any prompt or setup during startup).
 */
DuESF.enterRunTime = function()
{
    DuDebug.log( "DuESF: Entering runtime..." );

    DuDebug.log( "DuESF: Language is set to: " + i18n.getLocale());

    DuDebug.log( "DuESF: Getting script version..." );
    DuESF.settings.data.version = DuESF.scriptVersion.fullVersion;
    DuESF.settings.save();
    DuESF.state = DuESF.State.RUNTIME;

    // Everything which needs to be run once
    for( var i = 0; i < DuESF.enterRunTimeMethods.length; i++) {
        
        DuESF.enterRunTimeMethods[i]();
    }

    DuDebug.log( "DuESF: Runtime!" );
}

/**
 * Removes all DuESF parts from memory. Call this if you've updated before you reload DuESF.
 */
DuESF.delete = function()
{
    delete tr;
    delete def;
    delete jstype;
    delete DuBinary;
    delete DuColor;
    delete DuDate;
    delete DuDebug;
    delete DuDebugLog;
    delete DuESF;
    delete DuFile;
    delete DuFolder;
    delete DuList;
    delete DuMath;
    delete DuNumber;
    delete DuOCA;
    delete DuPath;
    delete DuProcess;
    delete DuProcessQueue;
    delete DuRegExp;
    delete DuRSS;
    delete DuRSSChannel;
    delete DuRSSItem;
    delete DuSettings;
    delete DuSystem;
    delete DuString;
    delete DuVersion;
    delete DuXML;
    delete DuXMP;
    delete DuZip;
    delete DuESF;
}

/**
 * Assigns a default value to a var if it's undefined.
 * @global
 * @param {object} val - The variable to set
 * @param {object} defaultVal - The default value
 * @return {object} The var
 * @example foo = def( foo, 12 ); // if foo was undefined, it is now 12, else it's unchanged.
 * @category DuESF
 */
function def( val, defaultVal )
{
	return isdef(val) ? val : defaultVal;
}

/**
 * Checks if a value is defined. Convenience replacement for `typeof val !== 'undefined`
 * @param {any} val The value
 * @return {boolean}
 * @category DuESF
 */
function isdef(val) {
    return typeof val !== 'undefined';
}

/**
 * Improved typeof which returns the type of object instead of 'object'
 * @global
 * @param {any} exp - The expression to check.
 * @return {string} The type always in lower case.
 * @category DuESF
*/
function jstype(value) {
    var type = typeof value;

    if (type == 'object') {
        try {
            type = value === null ? 'null' : Object.prototype.toString.call(value).match(/^\[object (.*)\]$/)[1].toLowerCase();
        } catch (e) {}
    }

    return type.toLowerCase();
}