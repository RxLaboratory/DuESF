
/**
 * @class
 * @name DuSelector
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A drop down selector.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.selector} to create a Selector.<br />
 * The Selector inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property {string} image - The path to the current image (or a PNG as a string representation)
 * @property {Image} icon - The Image currently displayed
 * @property {StaticText} label - The current text
 * @property {string[][]} items  - The buttons, each one is an array with [text, image, helptip]
 * @property {int} index  - The current index
 * @property {string} text  - The current text
 * @property {*} currentData  - The current data
 * @property {Selector~onChange} onChange  - The function to execute when the index changes.<br />
 * You can set your own function here, which must take no argument.<br />
 * The method is called after the index has changed.
 * @property {Selector~onRefresh} onRefresh  - The function to execute to refresh the content.<br />
 * You can set your own function here, which must take no argument.
 * @category DuScriptUI
 */

/**
 * The function to execute when the index changes.<br />
 * The method is called after the index has changed.
 * @callback DuSelector~onChange
 * @memberof DuSelector
 */

/**
 * The function to execute to refresh the content.
 * @callback DuSelector~onRefresh
 * @memberof DuSelector
 */

/**
 * Adds a new button to the selector
 * @method
 * @memberof DuSelector
 * @name addButton
 * @param {string} [text] - The text displayed by the button
 * @param {string} [image] - The icon, either a path to the file or a PNG represented as a string.
 * @param {string} [helpTip] - The help tip for the entry
 * @param {*} [data] - Some data to associate with the button.
 */

/**
 * Removes all buttons from the selector. This is the same as {@link Selector.clear}.
 * @method
 * @memberof DuSelector
 * @name removeAll
 */

/**
 * Removes all buttons from the selector. This is the same as {@link Selector.removeAll}.
 * @method
 * @memberof DuSelector
 * @name clear
 */

/**
 * Changes the selection and the current index of the selector
 * @method
 * @memberof DuSelector
 * @name setCurrentIndex
 * @param {int} index - The new index
 */

/**
 * Changes the selection and the current index of the selector, using the text of the selection
 * @method
 * @memberof DuSelector
 * @name setCurrentText
 * @param {string} text - The text to select
 * @param {Boolean} [quiet=false] When true, the onChange() callback will not be triggered.
 */

/**
 * Creates a drop down selector, using image buttons
 * @param {Window|Panel|Group} container - The ScriptUI Object which will contain and display the selector.
 * @param {string} [helpTip] - The help tip to show on the selector
 * @return {DuSelector} - The selector
 */
DuScriptUI.selector = function( container, helpTip, iconOnly )
{
    helpTip = def(helpTip, '');
    iconOnly = def(iconOnly, false);

    //create main group
    var selector = container.add( 'group' );
    selector.orientation = 'row';
    selector.spacing = 0;
    selector.alignment = [ 'fill', 'top' ];
    selector.alignChildren = [ 'center', 'center' ];
    selector.freeze = false;

    selector.mainGroup = selector.add( 'group' );
    selector.mainGroup.orientation = 'row';
    if (!iconOnly) selector.mainGroup.margins = 1;
    selector.mainGroup.spacing = 4;
    selector.mainGroup.alignment = [ 'fill', 'fill' ];
    selector.mainGroup.alignChildren = [ 'center', 'center' ];
    selector.helpTip = helpTip;
    //DuScriptUI.setBackgroundColor( selector.mainGroup, DuColor.Color.OBSIDIAN );

    //the menu button
    if (!iconOnly) {
        selector.menuButton = selector.mainGroup.add( 'image', undefined, DuScriptUI.Icon.MENU.binAsString );
        selector.menuButton.alignment = [ 'left', 'center' ];
        selector.menuButton.helpTip = helpTip;
    }
    
    //the image
    var iconGroup = selector.mainGroup.add('group');
    if (!iconOnly) {
        iconGroup.minimumSize = [20,20];
        iconGroup.margins = 2;
    }
    else {
        iconGroup.minimumSize = [16,16];
    }
    iconGroup.alignment = ['left', 'fill'];
    selector.icon = iconGroup.add( 'image', undefined, DuScriptUI.Icon.PLACEHOLDER );
    selector.icon.alignment = [ 'center', 'center' ];
    selector.icon.helpTip = helpTip;

    if (!iconOnly) {
        //add fillers to be able to click anywhere on the button
        selector.fillerM = selector.mainGroup.add( 'statictext', undefined, " " );
        selector.fillerM.alignment = [ 'left', 'fill' ];
        selector.fillerM.size = [ 0, -1];

        //the text
        selector.label = selector.mainGroup.add( 'statictext', undefined, '' );
        selector.label.helpTip = '';
        selector.label.alignment = [ 'fill', 'center' ];
        selector.label.helpTip = helpTip;

        //add fillers to be able to click anywhere on the button
        selector.fillerR = selector.mainGroup.add( 'statictext', undefined, " " );
        selector.fillerR.alignment = [ 'fill', 'fill' ];
    }
    

    //create popup
    selector.popup = new Window( 'palette', '', undefined,
    {
        borderless: true
    } );
    selector.popup.margins = 2;
    selector.popup.spacing = 0;
    selector.popup.closeButton = DuScriptUI.button( selector.popup, i18n._("Cancel") );
    selector.popup.closeButton.onClick = selector.popup.onDeactivate = function()
    {
        selector.popup.hide();
        DuScriptUI.eventFunctionsPaused = false;
    };
    selector.popup.buttons = selector.popup.add( 'group' );
    selector.popup.buttons.orientation = 'column';
    selector.popup.buttons.margins = 0;
    selector.popup.buttons.spacing = 0;
    selector.popup.hide();

    //add default button
    selector.items = [];
    selector.index = -1;
    selector.currentData = null;

    selector.addButton = function( text, image, helpTip, data )
    {
        selector.popup.hide();

        var options = {};
        text = def(text, '-');
        if (jstype(text) != 'string') options = text;
        options.text = def(options.text, text);
        
        image = def(image, '');
        options.image = def(options.image, image);

        helpTip = def(helpTip, '');
        options.helpTip = def(options.helpTip, helpTip);

        data = def(data, null);
        options.data = def(options.data, data);
        
        if (!iconOnly) {
            var size = text.length * 7;
            if ( selector.label.minimumSize.width < size ) selector.label.minimumSize.width = size;
        }

        var index = selector.items.length;
        selector.items.push( [ options.text, options.image, options.helpTip, options.data ] );
        //add to popup
        options.localize = false;
        options.ignoreUIMode = true;
        var button = DuScriptUI.button( selector.popup.buttons, options );
        button.bgColor = DuColor.Color.OBSIDIAN;
        button.dim();
        button.onClick = function()
        {
            selector.setCurrentIndex( index );
            selector.popup.hide();
        };
        selector.popup.layout.layout(true);
        selector.popup.update();
    }

    selector.removeAll = function()
    {
        selector.popup.hide();
        selector.items = [];
        selector.setCurrentIndex( 0 );
        for ( var i = selector.popup.buttons.children.length - 1; i >= 0; i-- )
        {
            selector.popup.buttons.remove( selector.popup.buttons.children[ i ] );
        }
        selector.popup.layout.layout(true);
        selector.popup.update();
    }
    selector.clear = selector.removeAll;

    selector.setCurrentIndex = function( index, quiet )
    {
        if ( index < 0 ) return;
        if ( index >= selector.items.length ) return;

        var item = selector.items[ index ];

        if ( !item ) return;

        var image = item[ 1 ];
        if ( image != '' )
        {
            if (image instanceof DuBinary) image = image.toFile();
            selector.icon.show();
            selector.icon.image = image;
        }
        else if (!iconOnly)
        {
            selector.icon.hide();
        }
        if (!iconOnly) selector.label.text = item[ 0 ];

        selector.index = index;

        selector.text = item[ 0 ];

        selector.currentData = item[3];

        if (!quiet && !selector.freeze) selector.onChange();
    }

    selector.setCurrentText = function( text )
    {
        for (var i = 0, n = selector.items.length; i < n; i++)
        {
            if (selector.items[i][0] == text)
            {
                selector.setCurrentIndex(i);
                break;
            }
        }
    }

    selector.setCurrentData = function( data )
    {
        selector.setCurrentIndex(0);
        for (var i = 0, n = selector.items.length; i < n; i++)
        {
            if (selector.items[i][3] == data)
            {
                selector.setCurrentIndex(i);
                break;
            }
        }
    }

    selector.clicked = function( e )
    {
        selector.onRefresh();
        var popup = false;

        if (!iconOnly) if ( e.target === selector.menuButton ) popup = true;
        if ( e.altKey ) popup = true;
        

        if ( popup )
        {
            var x = e.screenX - e.clientX;
            var y = e.screenY - e.clientY;
            selector.popup.location = [ x, y ];
            selector.popup.show();
            DuScriptUI.eventFunctionsPaused = true;
        }
        else
        {
            var index = selector.index;
            if ( e.ctrlKey && DuSystem.win ) index = -1;
            if ( e.metaKey && DuSystem.mac ) index = -1;
            if ( index == selector.items.length - 1 ) index = 0;
            else index++;
            selector.setCurrentIndex( index );
            DuScriptUI.eventFunctionsPaused = false;
        }
    }

    //mouse over
    selector.highlight = function( e )
    {
        e.stopPropagation();
        DuScriptUI.dimControls();
        DuScriptUI.setTextColor( selector, DuColor.Color.APP_HIGHLIGHT_COLOR );
        DuScriptUI.highlightedControls.push( selector );
    }

    selector.dim = function( e )
    {
        DuScriptUI.setTextColor( selector, DuColor.Color.APP_TEXT_COLOR );
        //if (!iconOnly) DuScriptUI.setTextColor( selector.label, DuColor.Color.APP_TEXT_COLOR );
    }

    selector.mainGroup.addEventListener( "mouseover", selector.highlight );
    selector.mainGroup.addEventListener( "click", selector.clicked, true );

    selector.onChange = function() {};
    selector.onRefresh = function (){};

    selector.dim();

    return selector;
}

