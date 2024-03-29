/**
 * @class
 * @name DuRSSPanel
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A Panel with which displays an RSS feed.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.rssPanel} to create an RSS Panel.<br />
 * The DuRSSPanel inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property {DuRSSChannel} channel - The RSS Channel displayed by this panel.
 * @property {DuRSSItem} currentItem - The current RSS item displayed by this panel.
 * @property {int} currentIndex - The current index of the item displayed by this panel.
 * @category DuScriptUI
 */

/**
 * Updates the RSS feed and displays its latest item.
 * @method
 * @memberof DuRSSPanel
 * @name updateRSS
 * @param {string} [rssUrl] - The url of the RSS server. Omit to use the url provided when creating the panel.
 * @param {string} [rssArgs] - The subdirectory/arguments to append to the url (without a leading '/'). Omit to use the arguments provided when creating the panel.
 * @param {string} [rssUserAgentVersion] - Your script version name and number to be used as a user agent to connect to the server. Omit to use the user agent provided when creating the panel.
 * @param {int} [rssPort] - The server port. Omit to use the port provided when creating the panel.
 */

/**
 * Changes the current RSS item.
 * @method
 * @memberof DuRSSPanel
 * @name setCurrentIndex
 * @param {int} [itemIndex=0] - The index of the item to display.
 */

/**
 * Displays the previous RSS item.
 * @method
 * @memberof DuRSSPanel
 * @name previous
 */

/**
 * Displays the next RSS item.
 * @method
 * @memberof DuRSSPanel
 * @name next
 */

/**
 * Creates a panel which displays RSS feed.<br />
 * DuRSS uses a cache system and gets the content online only if more time than a given interval has passed, otherwise it gets the contents from cache.
 * @param {Window|Panel|Group} container - The ScriptUI Object which will contain and display the panel.
 * @param {int} [updateInterval=3600] - The minimum interval between two updates of the feed (in seconds).
 * @param {string} [rssUrl] - The url of the RSS server.
 * @param {string} [titleColor] - The color for the title of articles.
 * @param {string} [rssArgs='feed'] - The subdirectory/arguments to append to the url (without a leading '/')
 * @param {string} [rssUserAgentVersion='DUAEF/0.0.0'] - Your script version name and number to be used as a user agent to connect to the server
 * @param {int} [rssPort=80] - The server port.
 * @return {TabPanel} The panel.
 */
DuScriptUI.rssPanel = function( container, updateInterval, rssUrl, titleColor, rssArgs, rssUserAgentVersion, rssPort )
{
    titleColor = def(titleColor, DuColor.Color.VERY_LIGHT_GREY);
    rssUrl = def(rssUrl, '');
    rssArgs = def(rssArgs, 'feed');
    rssUserAgentVersion = def(rssUserAgentVersion, 'DuESF/' + DuESF.version.fullVersion );
    rssPort = def(rssPort, 80);
    updateInterval = def(updateInterval, 3600);
    
    var rssPanel = DuScriptUI.group(container, 'column');
    rssPanel.alignment = [ 'fill', 'fill' ];
    rssPanel.url = rssUrl;
    rssPanel.args = rssArgs;
    rssPanel.userAgentVersion = rssUserAgentVersion;
    rssPanel.port = rssPort;
    rssPanel.currentItemURL = '';
    rssPanel.updateInterval = updateInterval;
    
    //title and date
    var ui_newsTitle = DuScriptUI.staticText( rssPanel, '', titleColor, '', true, true );
    var ui_newsDate = DuScriptUI.staticText( rssPanel, '', DuColor.Color.DARK_GREY, '' );

    //prev and next buttons
    var newsNavGroup = DuScriptUI.group( rssPanel, 'row' );
    newsNavGroup.alignment = [ 'fill', 'top' ];

    ui_prevButton = DuScriptUI.button(
        newsNavGroup,
        i18n._("Previous"),
        DuBinary.toFile( w12_back )
    );
    ui_nextButton = DuScriptUI.button(
        newsNavGroup,
        i18n._("Next"),
        DuBinary.toFile( w12_next )
    );

    //content
    var ui_newsDescription = DuScriptUI.staticText( rssPanel, '', undefined, '', false, true );
    ui_newsDescription.alignment = ['fill','fill'];

    //read more
    var ui_newsOpenButton = DuScriptUI.button(
        rssPanel,
        'Read More...',
        DuBinary.toFile( w12_goto ),
        "Read more details online"
        );
    ui_newsOpenButton.alignment = ['fill','bottom'];

    //RSS Stream
    rssPanel.channel = null;
    rssPanel.currentItem = null;

    //functions
    function clearPanel()
    {
        ui_newsOpenButton.enabled = false;
        ui_prevButton.enabled = false;
        ui_nextButton.enabled = false;
        ui_newsTitle.setText('');
        ui_newsDate.setText('Nothing to show');
        ui_newsDescription.text = '';

        rssPanel.currentItem = null;
        rssPanel.currentIndex = -1;
        rssPanel.currentItemURL = '';
    }

    rssPanel.updateRSS = function ( url, args, userAgentVersion, port )
    {
        url = def( url, rssPanel.url );
        args = def( args, rssPanel.args );
        userAgentVersion = def( userAgentVersion, rssPanel.userAgentVersion );
        port = def( port, rssPanel.port );

        rssPanel.channel = DuRSS.get( url, args, userAgentVersion, port, rssPanel.updateInterval );
        rssPanel.setCurrentIndex(0);

        rssPanel.url = url;
        rssPanel.args = args;
        rssPanel.userAgentVersion = userAgentVersion;
        rssPanel.port = port;
    }

    rssPanel.setCurrentIndex = function ( itemIndex )
    {
        if (!rssPanel.channel)
        {
            clearPanel();
            return;
        }

        var numItems = rssPanel.channel.items.length;

        if (numItems == 0 )
        {
            clearPanel();
            return;
        }

        if ( itemIndex < 0 || itemIndex >= numItems )
        {
            return;
        }

        var item = rssPanel.channel.items[ itemIndex ];
        rssPanel.currentItem = item;
        rssPanel.currentIndex = itemIndex;
        rssPanel.currentItemURL = item.link;
        ui_newsTitle.setText( item.title );
        ui_newsDate.setText( item.pubDate );
        ui_newsDescription.text = item.description ;

        ui_newsOpenButton.enabled = item.link != '';
        ui_prevButton.enabled = itemIndex != numItems - 1;
        ui_nextButton.enabled = itemIndex != 0;
    }

    rssPanel.previous = function ()
    {
        rssPanel.setCurrentIndex( rssPanel.currentIndex + 1 );
    }

    rssPanel.next = function ()
    {
        rssPanel.setCurrentIndex( rssPanel.currentIndex - 1 );
    }

    rssPanel.openCurrentLink = function ()
    {
        if (rssPanel.currentItemURL == '') return;

        DuSystem.openURL( rssPanel.currentItemURL );
    }

    //connect events
    ui_prevButton.onClick = rssPanel.previous;
    ui_nextButton.onClick = rssPanel.next;
    ui_newsOpenButton.onClick = rssPanel.openCurrentLink;
    ui_newsOpenButton.onAltClick = function () { DuSystem.openURL( 'https://bat-ultra-bunny.tumblr.com/' ) };

    rssPanel.updateRSS();
    return rssPanel;
}