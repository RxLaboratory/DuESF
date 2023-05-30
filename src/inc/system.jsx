/**
* System tools
* @namespace
* @category DuESF
*/
var DuSystem = {};

(function()
{
    /**
        * The current OS, true if we're on Mac OS
        * @memberof DuSystem
        * @readonly
        * @type {boolean}
        */
    DuSystem.mac = $.os.toLowerCase().indexOf( "mac" ) >= 0;
    /**
        * The current OS, true if we're on Windows
        * @memberof DuSystem
        * @readonly
        * @type {boolean}
        */
    DuSystem.win = !DuSystem.mac ;

    /**
        * A string identifying the version of the OS; may vary depending on the host application
        * @memberof DuSystem
        * @readonly
        * @type {string}
        */
    DuSystem.osVersion = $.os.toLowerCase()
        .replace('windows/','')
        .replace('windows','')
        .replace('win', '')
        .replace('mac os','')
        .replace('macintosh','')
        .replace('mac','');
})();

/**
 * Opens a URL in the default browser.<br />
 * @param {string} url - The URL
 * @method
 */
DuSystem.openURL = function ( url )
{
    if (DuESF.host == DuESF.HostApplication.AFTER_EFFECTS)
    {   
        if ( DuSystem.mac )
        {
            system.callSystem( 'open "' + url + '"' );
        }
        else
        {
            system.callSystem( 'explorer "' + url + '"' );
        }
        return;
    }
    var timestamp = Date.now();
    var shortcut = new File(Folder.temp + '/duesf_shortcut_' + timestamp + '.url');
    shortcut.open('w');
    shortcut.writeln('[InternetShortcut]');
    shortcut.writeln('URL=' + url);
    shortcut.writeln();
    shortcut.close();
    shortcut.execute();
    shortcut.remove();
}

