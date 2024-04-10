
/**
 * @class
 * @name DuCheckBox
 * @classdesc For use with {@link DuScriptUI}.<br />
 * An Image Checkbox.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.checkBox} to create an Image Checkbox.<br />
 * The Image Checkbox inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property {Image} image The scriptui object representing the image, if any
 * @property {StaticText} label The label, if any
 * @property {string} text The current text
 * @property {string} textChecked The text to display when the checkbox is checked
 * @property {string} defaultText The text to display when the checkbox is unchecked
 * @property {boolean} checked The checked state of the button
 * @property {DuColor} textColor The color of the text of the label
 * @property {DuCheckBox~onClick} onClick The function to execute when the button is clicked
 * @category DuScriptUI
 */

/**
 * The function to execute when the button is clicked.
 * @callback DuCheckBox~onClick
 * @memberof DuCheckBox
 */

/**
 * Sets the checked state of the button
 * @method
 * @memberof DuCheckBox
 * @name setChecked
 * @param {boolean} [checked=true] - The state
 */

/**
 * Creates a checkbox with an optionnal icon. Must have at least an icon or a text, or both.
 * @param {Panel|Window|Group} container The ScriptUI Object which will contain and display the button.
 * @param {string} text The label of the button. Default: empty string
 * @param {string|DuBinary} [image] The path to the icon. Default: empty string
 * @param {string} [helpTip=''] The helptip. Default: empty string
 * @param {string} [textChecked=text] The label of the button displayed when it is checked.
 * @param {string|DuBinary} [imageChecked] The image to show when it is checked
 * @param {string} [orientation='row'] The orientation
 * @return {DuCheckBox} The checkbox created.
 */
DuScriptUI.checkBox = function( container, text, image, helpTip, textChecked, imageChecked, orientation, isTab )
{
    var options = {};
    text = def(text, '');
    if (jstype(text) != 'string') options = text;
    options.text = def(options.text, text);
    
    isTab = def(isTab, false);
    options.isTab = def(options.isTab, isTab);

    orientation = def(orientation, 'row');
    options.orientation = def(options.orientation, orientation);
    
    textChecked = def(textChecked, options.text);
    options.textChecked = def(options.textChecked, textChecked);

    image = def(image, '');
    options.image = def(options.image, image);

    imageChecked = def(imageChecked, options.image);
    options.imageChecked = def(options.imageChecked, imageChecked);

    helpTip = def(helpTip, '');
    options.helpTip = def(options.helpTip, helpTip);

    if ( !container ) return null;

    if (options.isTab || options.orientation == 'column')
    {
        var commonSettings = def( DuESF.scriptSettings.data.common, {} );
        var uiMode = def(commonSettings.uiMode, 0);
        if (uiMode >= 2 && options.image != '') text = '';
    }

    //create ui
    var duCheckBox = container.add( 'group' );
    duCheckBox.orientation = 'column';

    if (options.isTab || options.orientation == 'column') duCheckBox.alignment = ['left', 'fill'];
    else duCheckBox.alignment = [ 'fill', 'top' ];

    if (options.isTab || options.text == '' || options.orientation == 'column' ) duCheckBox.hasIcon = false;
    else duCheckBox.hasIcon = true;

    duCheckBox.hasImage = options.image != '';
    duCheckBox.hasLabel = options.text != '';
    duCheckBox.imageOnly = options.image == options.imageChecked && options.text == '';

    //if no options.image and no options.text, at least the icon
    if ( options.image == '' && options.text == '' ) duCheckBox.hasIcon = true;

    // attributes
    duCheckBox.onClick = function() {};
    duCheckBox.onAltClick = function() {};
    duCheckBox.checked = duCheckBox.value = false;
    duCheckBox.textChecked = options.textChecked;
    duCheckBox.defaultText = options.text;
    duCheckBox.text = options.text;
    duCheckBox.helpLink = '';
    duCheckBox.textColor = DuColor.Color.APP_TEXT_COLOR;

    duCheckBox.mainGroup = DuScriptUI.group(duCheckBox, 'column');
    duCheckBox.mainGroup.margins = 1;
    duCheckBox.mainGroup.alignment = ['fill', 'fill'];
    
    duCheckBox.buttonGroup = DuScriptUI.group(duCheckBox.mainGroup, options.orientation);
    duCheckBox.buttonGroup.alignment = ['fill', 'top'];

    //the checkbox icon & options.image group
    duCheckBox.imageGroup = duCheckBox.buttonGroup.add('group');
    duCheckBox.imageGroup.margins = 0;
    duCheckBox.imageGroup.spacing = 4;
    if ( options.text == '' || options.orientation == 'column' ) duCheckBox.imageGroup.alignment = [ 'center', 'center' ];
    else duCheckBox.imageGroup.alignment = [ 'left', 'center' ];

    if (duCheckBox.hasIcon)
    {
        var subgroup = duCheckBox.imageGroup.add('group');
        subgroup.orientation = 'stacked';
        subgroup.margins = 0;
        subgroup.spacing = 0;
        subgroup.size = [12,12];

        duCheckBox.checkboxIcon = subgroup.add( 'image', undefined, DuScriptUI.Icon.BOX_UNCHECKED.binAsString );
        duCheckBox.checkboxIcon.helpTip = options.helpTip;

        duCheckBox.checkboxIconChecked = subgroup.add( 'image', undefined, DuScriptUI.Icon.BOX_CHECKED.binAsString );
        duCheckBox.checkboxIconChecked.helpTip = options.helpTip;
        duCheckBox.checkboxIconChecked.visible = false;
    }

    //checkbox icon
    if ( duCheckBox.hasImage )
    {
        var subgroup = duCheckBox.imageGroup.add('group');
        subgroup.orientation = 'stacked';
        subgroup.margins = 2;
        subgroup.spacing = 0;
        subgroup.minimumSize = [20,20];

        if ( options.image instanceof DuBinary ) options.image = options.image.binAsString;
        if ( options.imageChecked instanceof DuBinary ) options.imageChecked = options.imageChecked.binAsString;

        if (options.imageChecked != '')
        {
            duCheckBox.imageChecked = subgroup.add( 'image', undefined, options.imageChecked );
            duCheckBox.imageChecked.helpTip = options.helpTip;
            duCheckBox.imageChecked.visible = false;
            duCheckBox.imageChecked.alignment = ['center', 'center'];
        }
        
        duCheckBox.image = subgroup.add( 'image', undefined, options.image);
        duCheckBox.image.helpTip = options.helpTip;
        duCheckBox.image.alignment = ['center', 'center'];
    }
 
    //Add fillers to be able to click anywhere on the button
    if ( duCheckBox.hasLabel && !options.isTab && options.orientation != 'column')
    {
        duCheckBox.fillerM = duCheckBox.buttonGroup.add( 'statictext', undefined, " " );
        duCheckBox.fillerM.alignment = [ 'left', 'fill' ];
        duCheckBox.fillerM.size = [ 7, -1];
    }

    // label
    if ( duCheckBox.hasLabel )
    {
        var labelGroup = duCheckBox.buttonGroup.add('group');
        labelGroup.orientation = 'stacked';
        labelGroup.margins = 0;
        if (options.orientation == 'column') labelGroup.alignment = [ 'center', 'top' ];
        else labelGroup.alignment = [ 'left', 'fill' ];

        duCheckBox.label = labelGroup.add( 'statictext', undefined, options.text );
        duCheckBox.label.helpTip = options.helpTip;
        if (options.orientation == 'column') duCheckBox.label.alignment = [ 'center', 'top' ];
        else duCheckBox.label.alignment = [ 'left', 'fill' ];
        DuScriptUI.setTextColor( duCheckBox.label, DuColor.Color.APP_TEXT_COLOR );
        
        duCheckBox.labelChecked = labelGroup.add( 'statictext', undefined, options.textChecked );
        duCheckBox.labelChecked.helpTip = options.helpTip;
        duCheckBox.labelChecked.visible = false;
        if (options.orientation == 'column') duCheckBox.labelChecked.alignment = [ 'center', 'top' ];
        else duCheckBox.labelChecked.alignment = [ 'left', 'fill' ];
        DuScriptUI.setTextColor( duCheckBox.labelChecked, DuColor.Color.APP_HIGHLIGHT_COLOR );
    }

    //Add fillers to be able to click anywhere on the button
    if ( duCheckBox.hasLabel && !options.isTab && options.orientation != 'column' )
    {
        duCheckBox.fillerR = duCheckBox.buttonGroup.add( 'statictext', undefined, "" );
        duCheckBox.fillerR.alignment = [ 'fill', 'fill' ];
    }

    // outline
    if ( options.isTab )
    {
        duCheckBox.outLine = duCheckBox.mainGroup.add( 'group' );
        duCheckBox.outLine.margins = 0;
        duCheckBox.outLine.minimumSize.height = 2;
        duCheckBox.outLine.alignment = [ 'fill', 'bottom' ];
    }

    duCheckBox.setChecked = function( c )
    {
        c = def(c, true);
        duCheckBox.checked = duCheckBox.value = c;

        if ( c )
        {
            if (options.isTab) DuScriptUI.setBackgroundColor( duCheckBox.outLine, DuColor.Color.APP_TEXT_COLOR );
            else 
            {
                //icon
                if ( duCheckBox.hasIcon )
                {
                    duCheckBox.checkboxIconChecked.visible = true;
                    duCheckBox.checkboxIcon.visible = false;
                }

                //image
                if ( duCheckBox.hasImage ) 
                {
                    duCheckBox.imageChecked.visible = true;
                    duCheckBox.image.visible = false;
                    if (duCheckBox.imageOnly)
                    {
                        DuScriptUI.setBackgroundColor( duCheckBox.imageGroup, DuColor.Color.APP_HIGHLIGHT_COLOR.darker() );
                    }
                }

                //label
                if ( duCheckBox.hasLabel )
                {
                    duCheckBox.label.visible = false;
                    duCheckBox.labelChecked.visible = true;
                    duCheckBox.text = duCheckBox.textChecked;
                    DuScriptUI.setTextColor( duCheckBox.label, DuColor.Color.APP_HIGHLIGHT_COLOR );
                }
            }
        }
        else 
        {
            if (options.isTab) DuScriptUI.setBackgroundColor( duCheckBox.outLine, DuColor.Color.TRANSPARENT );
            else 
            {
                //icon
                if ( duCheckBox.hasIcon )
                {
                    duCheckBox.checkboxIconChecked.visible = false;
                    duCheckBox.checkboxIcon.visible = true;
                }

                //image
                if ( duCheckBox.hasImage ) 
                {
                    duCheckBox.imageChecked.visible = false;
                    duCheckBox.image.visible = true;
                    if (!duCheckBox.hasIcon && !duCheckBox.hasLabel) DuScriptUI.setBackgroundColor( duCheckBox.imageGroup, DuColor.Color.TRANSPARENT );
                }

                //label
                if ( duCheckBox.hasLabel )
                {
                    duCheckBox.label.visible = true;
                    duCheckBox.labelChecked.visible = false;
                    duCheckBox.text = duCheckBox.defaultText;
                    DuScriptUI.setTextColor( duCheckBox.label, DuColor.Color.APP_TEXT_COLOR );
                }
            }
        }
    }

    duCheckBox.clicked = function( e )
    {
        e.stopPropagation();

        if ( e.shiftKey )
        {
            if ( duCheckBox.helpLink != '' )
            {
                DuSystem.openURL( duCheckBox.helpLink );
            }
            return;
        }

        duCheckBox.setChecked( !duCheckBox.checked );
        DuDebug.safeRun(duCheckBox.onClick);
    }

    duCheckBox.altClicked = function()
    {
        DuDebug.safeRun(duCheckBox.onAltClick);
    }

    duCheckBox.highlight = function( e )
    {
        e.stopPropagation();
        DuScriptUI.dimControls();

        if ( duCheckBox.checked )
        {
            if (!options.isTab) {
                if (duCheckBox.hasLabel)
                    DuScriptUI.setTextColor( duCheckBox.labelChecked, DuColor.Color.APP_HIGHLIGHT_COLOR.lighter(150) );
                else
                    DuScriptUI.setBackgroundColor( duCheckBox.buttonGroup, DuColor.Color.APP_HIGHLIGHT_COLOR );
            }
            //outline
            else
            {
                DuScriptUI.setBackgroundColor( duCheckBox.outLine, DuColor.Color.APP_HIGHLIGHT_COLOR );
                if (duCheckBox.hasLabel) DuScriptUI.setTextColor( duCheckBox.label, DuColor.Color.APP_HIGHLIGHT_COLOR );
            }
        }
        else 
        {
            if (!options.isTab) {
                if (duCheckBox.hasLabel)
                    DuScriptUI.setTextColor( duCheckBox.label, DuColor.Color.APP_HIGHLIGHT_COLOR );
                else
                    DuScriptUI.setBackgroundColor( duCheckBox.buttonGroup, DuColor.Color.APP_HIGHLIGHT_COLOR.darker() );
            }
            //outline
            else
            {
                DuScriptUI.setBackgroundColor( duCheckBox.outLine, DuColor.Color.APP_HIGHLIGHT_COLOR );
                if (duCheckBox.hasLabel) DuScriptUI.setTextColor( duCheckBox.label, DuColor.Color.APP_HIGHLIGHT_COLOR );
            }
        }
        

        DuScriptUI.highlightedControls.push( duCheckBox );
    }

    duCheckBox.dim = function( e )
    {
        if ( duCheckBox.checked )
        {
            if (!options.isTab) {
                if (duCheckBox.hasLabel)
                    DuScriptUI.setTextColor( duCheckBox.labelChecked, DuColor.Color.APP_HIGHLIGHT_COLOR );
                else
                    DuScriptUI.setBackgroundColor( duCheckBox.buttonGroup, DuColor.Color.TRANSPARENT );
            }
            //outline
            else
            {
                DuScriptUI.setBackgroundColor( duCheckBox.outLine, DuColor.Color.APP_TEXT_COLOR );
                if (duCheckBox.hasLabel) DuScriptUI.setTextColor( duCheckBox.label, duCheckBox.textColor );
            }
        }
        else 
        {
            if (!options.isTab) {
                if (duCheckBox.hasLabel)
                    DuScriptUI.setTextColor( duCheckBox.label, duCheckBox.textColor );
                else
                    DuScriptUI.setBackgroundColor( duCheckBox.buttonGroup, DuColor.Color.TRANSPARENT );
            }
            //outline
            else
            {
                DuScriptUI.setBackgroundColor( duCheckBox.outLine, DuColor.Color.TRANSPARENT );
                if (duCheckBox.hasLabel) DuScriptUI.setTextColor( duCheckBox.label, duCheckBox.textColor );
            }
        }
    }

    duCheckBox.addEventListener( "click", function(e)
    {
        if(e.view.parent != duCheckBox) return;
        
        if ( e.altKey ) duCheckBox.altClicked();
        else duCheckBox.clicked(e);
    }, true );


    duCheckBox.addEventListener( "mouseover", duCheckBox.highlight );
    duCheckBox.buttonGroup.addEventListener( "mouseover", duCheckBox.highlight );
    duCheckBox.mainGroup.addEventListener( "mouseover", duCheckBox.highlight );
    if(duCheckBox.label) duCheckBox.label.addEventListener( "mouseover", duCheckBox.highlight );
    if(duCheckBox.checkBox) duCheckBox.imageChecked.addEventListener( "mouseover", duCheckBox.highlight );
    if(duCheckBox.image) duCheckBox.image.addEventListener( "mouseover", duCheckBox.highlight );

    duCheckBox.dim();

    return duCheckBox;
}
