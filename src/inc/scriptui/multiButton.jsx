
/**
 * @class
 * @name DuMultiButton
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A multi button popup.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.multiButton} to create a DuMultiButton.<br />
 * The DuMultiButton inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property {StaticText} label - The current text
 * @property {DuButton[]} buttons  - The buttons
 * @property {string} text  - The current text
 * @property {DuMultiButton~build} build - You can use this callback to add a function which builds the UI of the popup, it will be called on first display.
 * @category DuScriptUI
 */

/**
 * You can use this callback to add a function which builds the content of the popup, it will be called on first display.<br />
 * This allows a faster startup of your script by delaying the creation of the tabs which are hidden at startup.<br />
 * You can use <code>this.addButton</code> to add buttons in the popup.
 * @callback DuMultiButton~build
 * @memberof DuMultiButton
 */
/**
 * Creates a multi button popup
 * @param {Window|Panel|Group} container - The ScriptUI Object which will contain and display the multi button.
 * @param {string} [text] - The text.
 * @param {string|DuBInary} [image] - The path to the icon (or a PNG as a string representation). Default: empty string
 * @param {string} [helpTip] - The help tip to show on the multi button
 * @param {Boolean} [ignoreUIMode=false] - Will show texte even if the ui mode is set to > 1 in the script settings
 * @return {DuSelector} - The multiButton
 */
DuScriptUI.multiButton = function( container, text, image, helpTip, ignoreUIMode )
{
    var options = {};
    text = def(text, '');

    if (jstype(text) != 'string') options = text;
    options.text = def(options.text, text);

    if (options.text != '') options.text = options.text + '...';
    helpTip = def(helpTip, '');
    image = def(image, '');
    ignoreUIMode = def(ignoreUIMode, false);

    options.image = def(options.image, image);
    options.helpTip = def(options.helpTip, helpTip);
    options.ignoreUIMode = def(options.ignoreUIMode, ignoreUIMode);

    var uiMode = DuESF.scriptSettings.get("common/uiMode", 0);
    if (uiMode >= 2 && image != '' && !options.ignoreUIMode) options.text = '';

    var multiButton = container.add( 'group' );
    multiButton.orientation = 'row';
    multiButton.spacing = 0;
    multiButton.alignment = [ 'fill', 'top' ];
    multiButton.alignChildren = [ 'center', 'center' ];

    multiButton.mainGroup = multiButton.add( 'group' );
    multiButton.mainGroup.orientation = 'row';
    if (text != '') {
        multiButton.mainGroup.margins = 1;
        multiButton.mainGroup.spacing = 4;
    }
    multiButton.mainGroup.alignment = [ 'fill', 'fill' ];
    multiButton.mainGroup.alignChildren = [ 'center', 'center' ];
    multiButton.helpTip = helpTip;

    //the menu button
    if ( options.text != '' || (options.text == "" && options.image == ""))
    {
        multiButton.menuButton = multiButton.mainGroup.add( 'image', undefined, DuScriptUI.Icon.MORE.binAsString );
        multiButton.menuButton.alignment = [ 'left', 'center' ];
        multiButton.menuButton.helpTip = options.helpTip;
    }

    //the image
    if (options.image != '')
    {
        var iconGroup = multiButton.mainGroup.add('group');
        if ( options.text == '' ) {
            iconGroup.minimumSize = [16,16];
            iconGroup.alignment = ['center', 'fill'];
        }
        else {
            iconGroup.minimumSize = [20,20];
            iconGroup.margins = 2;
            iconGroup.alignment = ['left', 'fill'];
        }
        if (options.image instanceof DuBinary) options.image = options.image.binAsString;
        multiButton.icon = iconGroup.add( 'image', undefined, options.image );
        multiButton.icon.alignment = [ 'center', 'center' ];
        multiButton.icon.helpTip = options.helpTip;
    }

    if ( options.text != '')
    {
        //add fillers to be able to click anywhere on the button
        multiButton.fillerM = multiButton.mainGroup.add( 'statictext', undefined, " " );
        multiButton.fillerM.alignment = [ 'left', 'fill' ];
        multiButton.fillerM.size = [ 0, -1];

        //the text
        multiButton.label = multiButton.mainGroup.add( 'statictext', undefined, options.text );
        multiButton.label.helpTip = '';
        multiButton.label.alignment = [ 'fill', 'center' ];
        multiButton.label.helpTip = options.helpTip;

        //add fillers to be able to click anywhere on the button
        multiButton.fillerR = multiButton.mainGroup.add( 'statictext', undefined, " " );
        multiButton.fillerR.alignment = [ 'fill', 'fill' ];
    }

    //create popup
    multiButton.popup = new Window( 'palette', '', undefined,
    {
        borderless: true
    } );
    multiButton.popup.margins = 2;
    multiButton.popup.spacing = 0;
    multiButton.popup.closeButton = DuScriptUI.button( multiButton.popup, i18n._("Cancel") );
    multiButton.popup.closeButton.onClick = multiButton.popup.onDeactivate = function()
    {
        multiButton.popup.hide();
        DuScriptUI.eventFunctionsPaused = false;
    };
    multiButton.popup.buttons = multiButton.popup.add( 'group' );
    multiButton.popup.buttons.orientation = 'column';
    multiButton.popup.buttons.margins = 0;
    multiButton.popup.buttons.spacing = 0;
    multiButton.popup.hide();

    multiButton.build = function() {};
    multiButton.built = false;
    
    //add default button
    multiButton.buttons = [];

    multiButton.addButton = function( text, image, helpTip, addOptionsPanel, optionsWithoutButton, optionsButtonText )
    {
        multiButton.popup.hide();
        text = def(text, '-');
        image = def(image, '');
        helpTip = def(helpTip, '');

        if (multiButton.label)
        {
            var size = text.length * 7;
            if ( multiButton.label.minimumSize.width < size ) multiButton.label.minimumSize.width = size;
        }
        
        //add to popup
        var button = DuScriptUI.button( multiButton.popup.buttons,
            {
                text: text,
                image: image,
                helpTip: helpTip,
                options: addOptionsPanel,
                ignoreUIMode: true,
                optionsWithoutButton: optionsWithoutButton,
                optionsButtonText: optionsButtonText
            } );
        multiButton.buttons.push( button );
        button.bgColor = DuColor.Color.OBSIDIAN;
        button.dim();
        
        multiButton.popup.layout.layout(true);
        multiButton.popup.update();

        return button;
    }

    multiButton.clicked = function( e )
    {
        if (!multiButton.built)
        {
            multiButton.build();
            multiButton.built = true;
        }

        var x = e.screenX - e.clientX;
        var y = e.screenY - e.clientY;
        multiButton.popup.location = [ x, y ];
        multiButton.popup.show();
        DuScriptUI.eventFunctionsPaused = true;
    }

    //mouse over
    multiButton.highlight = function( e )
    {
        e.stopPropagation();
        DuScriptUI.dimControls();
        if (multiButton.label)
        {
            DuScriptUI.setTextColor( multiButton.label, DuColor.Color.APP_HIGHLIGHT_COLOR );
        }
        else
        {
            DuScriptUI.setBackgroundColor( multiButton, DuColor.Color.APP_HIGHLIGHT_COLOR.push() );
        }
        
        DuScriptUI.highlightedControls.push( multiButton );
    }

    multiButton.dim = function( e )
    {
        if (multiButton.label) DuScriptUI.setTextColor( multiButton.label, DuColor.Color.APP_TEXT_COLOR );
        DuScriptUI.setBackgroundColor( multiButton, DuColor.Color.TRANSPARENT );
    }

    multiButton.mainGroup.addEventListener( "mouseover", multiButton.highlight );
    multiButton.mainGroup.addEventListener( "click", multiButton.clicked, true );

    multiButton.dim();

    return multiButton;
}