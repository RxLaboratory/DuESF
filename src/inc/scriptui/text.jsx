
/**
 * @class
 * @name DuEditText
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A Nice EditText.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.editText} to create a Nice EditText.<br />
 * The Nice EditText inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property {string} text - Read-Only | The text displayed
 * @property {DuColor} textColor - The color of the text
 * @property {DuEditText~onActivate} onActivate - Function to execute when activated
 * @property {DuEditText~onDeactivate} onDeactivate - Function to execute when deactivated
 * @property {DuEditText~onChange} onChange - Function to execute when text changed
 * @property {DuEditText~onChange} onEnterPressed - Function to execute when enter key is pressed whil in edit mode
 * @category DuScriptUI
 */

/**
 * The function to execute when the text is changed.
 * @callback DuEditText~onChange
 * @memberof DuEditText
 */

/**
 * Function to execute when enter key is pressed whil in edit mode.
 * @callback DuEditText~onEnterPressed
 * @memberof DuEditText
 */


/**
 * The function to execute when the box is activated.
 * @callback DuEditText~onActivate
 * @memberof DuEditText
 */

/**
 * The function to execute when the box is deactivated.
 * @callback DuEditText~onDeactivate
 * @memberof DuEditText
 */

/**
 * Changes the text
 * @method
 * @memberof DuEditText
 * @name setText
 * @param {string} text - The new text
 */

 /**
 * Changes the prefix
 * @method
 * @memberof DuEditText
 * @name setPrefix
 * @param {string} prefix - The new prefix
 */

 /**
 * Changes the suffix
 * @method
 * @memberof DuEditText
 * @name setSuffix
 * @param {string} suffix - The new suffix
 */

/**
 * Changes the placeholder
 * @method
 * @memberof DuEditText
 * @name setPlaceholder
 * @param {string} placeholder - The placeholder text
 */

/**
 * Creates a nice edittext where the edit text is shown only on click.
 * @param {Window|Panel|Group}	container		- The ScriptUI Object which will contain and display the nice edit text.
 * @param {string} text - The initial text in the edit.
 * @param {string} [prefix=""] - A text prefix to display.
 * @param {string} [suffix=""] - A text suffix to display.
 * @param {string} [placeHolder=""] - A place holder default text.
 * @param {string} [helpTip=""] The helpTip of this control
 * @param {bool} [localize=true] Whether to translate the texts of this control
 * @return {DuEditText}	The custom Group containing the edit text.
 */
DuScriptUI.editText = function( container, text, prefix, suffix, placeHolder, helpTip )
{
    var options = {};
    text = def(text, '');

    if (jstype(text) != 'string') options = text;

    prefix = def(prefix, '');
    suffix = def(suffix, '');
    placeHolder = def(placeHolder,'');
    helpTip = def(helpTip, '');

    options.text = def(options.text, text);
    options.suffix = def(options.suffix, suffix);
    options.prefix = def(options.prefix, prefix);
    options.placeHolder = def(options.placeHolder, placeHolder);
    options.helpTip = def(options.text, helpTip);

    var niceEditText = container.add( 'group' );
    niceEditText.orientation = 'stack';
    niceEditText.margins = 0;
    niceEditText.alignChildren = [ 'fill', 'fill' ];
    niceEditText.placeHolder = options.placeHolder;
    var staticText = options.text;
    if ( options.text == "" && options.placeHolder != "" ) staticText = options.placeHolder;
    niceEditText.static = niceEditText.add( 'statictext', undefined, options.prefix + staticText + options.suffix );
    niceEditText.static.alignment = [ 'fill', 'center' ];
    niceEditText.static.helpTip = options.helpTip;
    if ( options.text == "" && options.placeHolder != "" ) DuScriptUI.setTextColor( niceEditText.static, DuColor.Color.APP_HIGHLIGHT_COLOR.push(150) );
    else DuScriptUI.setTextColor( niceEditText.static, DuColor.Color.APP_HIGHLIGHT_COLOR );
    niceEditText.edit = niceEditText.add( 'edittext', undefined, options.text );
    niceEditText.edit.visible = false;
    niceEditText.edit.helpTip = options.helpTip;
    niceEditText.edit.alignment = ['fill', 'center'];
    niceEditText.prefix = options.prefix;
    niceEditText.suffix = options.suffix;
    niceEditText.textColor = DuColor.Color.APP_HIGHLIGHT_COLOR;
    niceEditText.freeze = false;

    niceEditText.text = options.text;
    niceEditText.tempText = '';
    niceEditText.previousText = options.text;
    niceEditText.editing = false;

    niceEditText.onActivate = function() {};
    niceEditText.onDeactivate = function() {};
    niceEditText.onChange = function() {};
    niceEditText.onChanging = function() {};
    niceEditText.onEnterPressed = function() {};

    niceEditText.clicked = function()
    {
        if ( niceEditText.editing ) return;
        else
        {
            niceEditText.static.visible = false;
            niceEditText.edit.visible = true;
            niceEditText.editing = true;
            niceEditText.edit.active = true;
        }
    }

    niceEditText.changed = function()
    {
        if ( niceEditText.text ==  niceEditText.edit.text ) 

        var freeze = niceEditText.freeze;
        niceEditText.freeze = true;

        niceEditText.editing = false;
        var staticText = '';
        if ( niceEditText.edit.text == '' && niceEditText.placeHolder != '' )
        {
            DuScriptUI.setTextColor( niceEditText.static, niceEditText.textColor.push(150) );
            staticText = niceEditText.placeHolder;
        }
        else
        {
            if ( niceEditText.placeHolder != '' ) DuScriptUI.setTextColor( niceEditText.static, niceEditText.textColor );
            staticText = niceEditText.edit.text;
        }
        niceEditText.static.text = niceEditText.prefix + staticText + niceEditText.suffix;

        niceEditText.previousText = niceEditText.text;

        niceEditText.text = niceEditText.edit.text;
        niceEditText.edit.visible = false;
        niceEditText.static.visible = true;
        niceEditText.edit.active = false;

        niceEditText.freeze = freeze;
        if (!niceEditText.freeze) niceEditText.onChange();
    }

    niceEditText.changing = function()
    {
        var freeze = niceEditText.freeze;
        niceEditText.freeze = true;

        niceEditText.tempText = niceEditText.edit.text;

        niceEditText.freeze = freeze;
        // workaround for ae not sending the event
        if (!niceEditText.freeze) niceEditText.onChanging();
    }

    niceEditText.enterPressed = function()
    {
        if (!niceEditText.freeze) niceEditText.onEnterPressed();
    }

    niceEditText.setText = function( text )
    {
        var freeze = niceEditText.freeze;
        niceEditText.freeze = true;

        niceEditText.previousText = niceEditText.text;
        if (text == '')
        {
            niceEditText.edit.text = niceEditText.text = text;
            niceEditText.static.text = niceEditText.prefix + niceEditText.placeHolder + niceEditText.suffix;
        }
        else 
        {
            niceEditText.edit.text = niceEditText.text = text;
            niceEditText.static.text = niceEditText.prefix + text + niceEditText.suffix;
        }

        niceEditText.freeze = freeze;
    }

    niceEditText.setPrefix = function( prefix )
    {
        niceEditText.prefix = prefix;
        niceEditText.setText(niceEditText.text);
    }

    niceEditText.setSuffix = function( suffix )
    {
        niceEditText.suffix = suffix;
        niceEditText.setText(niceEditText.text);
    }

    niceEditText.setPlaceholder = function( ph )
    {
        var freeze = niceEditText.freeze;
        niceEditText.freeze = true;

        niceEditText.placeHolder = ph;
        var text = niceEditText.text;
        if (text == '')
        {
            niceEditText.edit.text = niceEditText.text = text;
            niceEditText.static.text = niceEditText.prefix + niceEditText.placeHolder + niceEditText.suffix;
        }
        else 
        {
            niceEditText.edit.text = niceEditText.text = text;
            niceEditText.static.text = niceEditText.prefix + text + niceEditText.suffix;
        }

        niceEditText.freeze = freeze;
    }

    niceEditText.edit.onActivate = function()
    {
        if (!niceEditText.freeze) niceEditText.onActivate();
    }
    niceEditText.edit.onDeactivate = function()
    {
        if (!niceEditText.freeze) niceEditText.changed();
        if (!niceEditText.freeze) niceEditText.onDeactivate();
    }
    niceEditText.edit.onChange = niceEditText.changed;
    niceEditText.edit.onChanging = niceEditText.changing;
    niceEditText.addEventListener( "mousedown", niceEditText.clicked, true );
    niceEditText.addEventListener( "mouseover", DuScriptUI.dimControls );
    niceEditText.edit.addEventListener('keydown', function(e){ if (e.keyName == 'Enter' && !niceEditText.freeze) niceEditText.enterPressed(); } );

    niceEditText.helpTip = options.helpTip;

    return niceEditText;
}

/**
 * Creates a statictext (with an optionnal color).
 * @param {Window|Panel|Group} container - The ScriptUI Object which will contain and display the nice edit text.
 * @param {string} text - The initial text in the edit.
 * @param {DuColor} [color] - The color of the text. By default, uses a slightly darker text than the Host App text color
 * @param {bool} [localize=true] - Set this to false to never translate this text.
 * @param {bool} [multiLine=false] - Set this to true to add a multiline text. Auto detected by default if the text contains the newline character.
 * @return {StaticText} The ScriptUI StaticText created.
 */
DuScriptUI.staticText = function( container, text, color, multiLine )
{
    var options = {};
    text = def(text, '');

    if (jstype(text) != 'string') options = text;

    options.text = def(options.text, text);

    multiLine = def(multiLine, options.text.indexOf("\n") >= 0 )
    color = def(color, DuColor.Color.APP_TEXT_COLOR.push(130) );

    options.color = def(options.color, color);
    options.multiLine = def(options.multiLine, multiLine);

    var t = container.add( 'statictext', undefined, options.text,
    {
        multiline: options.multiLine
    } );

    DuScriptUI.setTextColor( t, options.color );

    t.setText = function (txt) { t.text = txt; };

    return t;
}
