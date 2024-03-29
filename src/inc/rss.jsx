/**
 * @class DuRSSItem
 * @name DuRSSItem
 * @classdesc an item from an RSS feed
 * This is not a real class, and cannot be instanciated, it does not have a constructor.<br />
 * Use {@link DuRSS.get} to get items from an RSS feed.<br />
 * @category DuESF
 */

/**
 * The title.
 * @name title
 * @type {string}
 * @memberof DuRSSItem
 * @readonly
 */

/**
 * The date of publication.
 * @name pubDate
 * @type {Date}
 * @memberof DuRSSItem
 * @readonly
 */

/**
 * The link to the article.
 * @name link
 * @type {string}
 * @memberof DuRSSItem
 * @readonly
 */

/**
 * The link to the comments.
 * @name comments
 * @type {string}
 * @memberof DuRSSItem
 * @readonly
 */

/**
 * The extract/description of the article.
 * @name description
 * @type {string}
 * @memberof DuRSSItem
 * @readonly
 */

/**
 * @class DuRSSChannel
 * @name DuRSSChannel
 * @classdesc an RSS channel
 * This is not a real class, and cannot be instanciated, it does not have a constructor.<br />
 * Use {@link DuRSS.get} to get items from an RSS feed.<br />
 * @category DuESF
 */

/**
 * The title.
 * @name title
 * @type {string}
 * @memberof DuRSSChannel
 * @readonly
 */

/**
 * The link to the site.
 * @name title
 * @type {string}
 * @memberof DuRSSChannel
 * @readonly
 */

/**
 * The extract/description of the channel.
 * @name description
 * @type {string}
 * @memberof DuRSSChannel
 * @readonly
 */


/**
 * The items in the channel.
 * @name items
 * @type {DuRSSItem[]}
 * @memberof DuRSSChannel
 * @readonly
 */

/**
 * RSS tools
 * @namespace
 * @category DuESF
 */
var DuRSS = {};

/**
* Gets the RSS content from a feed url, and returns it as a JS object.<br />
* DuRSS uses a cache system and gets the content online only if more time than a given interval has passed, otherwise it gets the contents from cache.<br />
* WARNING: This method needs network access but will not check if it has and may throw an error if not.
* @param {string} url - The url of the server.
* @param {string} [subfolder='feed'] - The subdirectory of the feed (without a leading '/')
* @param {string} [userAgentVersion='DUAEF/0.0.0'] - Your script version name and number to be used as a user agent to connect to the server
* @param {int} [port=80] - The server port.
* @param {float} [updateInterval=3600] - The minimum interval between two updates of the feed (in seconds).
* @return {DuRSSChannel|null}	The content of the RSS feed
*/
DuRSS.get = function ( url, subfolder, userAgentVersion, port, updateInterval ) {

    userAgentVersion = def (userAgentVersion, 'DuESF/' + DuESF.version.fullVersion);
    subfolder = def (subfolder, 'feed');
    port = def (port, 80);
    updateInterval = def (updateInterval, 3600);

    //get cache
    var rssCacheFolder = new Folder( DuFolder.duesfData.absoluteURI + '/RSSCache/');
    if ( !rssCacheFolder.exists ) rssCacheFolder.create();
    var rssCacheFile = new File( rssCacheFolder.absoluteURI + '/' + DuPath.fixName(url + '.' + subfolder + '.json') );
    var now = new Date().getTime();
    var DuRSSChannel = DuFile.parseJSON( rssCacheFile );

    if ( DuRSSChannel.lastCheck ) {
        if ( now - DuRSSChannel.lastCheck < updateInterval*1000 ) return DuRSSChannel;
    }

    //socket
    conn = new Socket;
    conn.encoding = 'UTF-8';
    if ( !conn.open( url + ':' + port ) ) return null;

    var reply = '';

    var userAgent = 'User-Agent: ' + userAgentVersion + ' (' + $.os + ')';

    if ( conn.writeln( 'GET /' + subfolder + '  HTTP/1.0\n' + userAgent + '\nHost: ' + url + '\n' ) ) {
        reply = conn.read( 100000 );
    }

    conn.close();

    //strip html header
    reply = reply.substring( reply.indexOf( '<?xml' ) );

    var DuRSSChannel = {};
    DuRSSChannel.title = "";
    DuRSSChannel.link = "";
    DuRSSChannel.description = "";
    DuRSSChannel.items = [];
    DuRSSChannel.lastCheck = new Date().getTime();

    if (
        !DuDebug.safeRun( function()
        {
            reply = new XML( reply );
            return true;
        })
    ) return DuRSSChannel;


    var xmlChannel = reply.channel;
    DuRSSChannel.title = DuXML.getValue( xmlChannel.title );
    DuRSSChannel.link = DuXML.getValue( xmlChannel.link );
    DuRSSChannel.description = DuXML.getValue( xmlChannel.description );

    var xmlItems = xmlChannel.child( 'item' );

    for ( var i = 0, num = xmlItems.length(); i < num; i++ ) {
        var item = {};
        var xmlItem = xmlItems[ i ];
        item.title = DuXML.getValue( xmlItem.title );
        item.link = DuXML.getValue( xmlItem.link );
        item.comments = DuXML.getValue( xmlItem.comments );
        item.description = DuXML.getValue( xmlItem.description );
        item.pubDate = DuXML.getValue( xmlItem.pubDate, 'date' );
        DuRSSChannel.items.push( item );
    }

    DuFile.saveJSON(DuRSSChannel, rssCacheFile);

    return DuRSSChannel;
}
