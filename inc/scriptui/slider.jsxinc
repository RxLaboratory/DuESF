
/**
 * @class
 * @name DuSlider
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A Nice Slider.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.slider} to create a Nice Slider.<br />
 * The Nice Slider inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property {int} value - Read-Only | The current value
 * @property {DuSlider~onChanging} onChanging - Function to execute when changing
 * @property {DuSlider~onChange} onChange - Function to execute when changed
 * @category DuScriptUI
 */

/**
 * Function to execute when changing
 * @callback DuSlider~onChanging
 * @memberof DuSlider
 */

/**
 * Function to execute when changed
 * @callback DuSlider~onChange
 * @memberof DuSlider
 */

/**
 * Changes the value
 * @method
 * @memberof DuSlider
 * @name setValue
 * @param {int} value - The new value
 */
 
/**
 * Creates a slider.
 * @param {Window|Panel|Group}	container		- The ScriptUI Object which will contain and display the nice edit text.
 * @param {int}	[defaultValue=0]		- The initial value.
 * @param {int}	[min=0]		- The minimal value.
 * @param {int}	[max=100]		- The maximal value.
 * @param {string}	[orientation='column']		- Either 'row' or 'column'
 * @param {boolean}	[invertedAppearance]		- Revert the slider with max value on the left
 * @param {string}	[prefix]		- A text prefix to display.
 * @param {string}	[suffix]		- A text suffix to display.
 * @param {string}	[textAlignment='center'] - The alignment of the text.<br />
 * One of 'left', 'center', 'right' for column orientation,<br />
 * And 'top', 'center', 'bottom' for row orientation.
 * @param {int[]}	[valueButtons=[]] - A list of predefined values to add as buttons.
 * @return {DuSlider}	The custom Group containing the slider.
 * @todo implement helpTip
 */
DuScriptUI.slider = function( container, defaultValue, min, max, orientation, invertedAppearance, prefix, suffix, textAlignment, valueButtons )
{
    prefix = def(prefix, '');
    suffix = def(suffix, '');
    min = def( min, 0);
    max = def( max, 100);
    defaultValue = def(defaultValue, 0);
    textAlignment = def(textAlignment, 'center');
    valueButtons = def(valueButtons, []);
    orientation = def(orientation, 'column');

    if ( valueButtons.length > 0 && textAlignment == 'center' )
    {
        if ( orientation == 'column' ) textAlignment = 'right';
        else textAlignment = 'bottom';
    }

    var niceSlider = container.add( 'group' );
    niceSlider.orientation = orientation;
    niceSlider.spacing = 0;
    niceSlider.margins = 0;
    niceSlider.alignment = [ 'fill', 'top' ];
    niceSlider.alignChildren = [ 'fill', 'fill' ];

    niceSlider.value = defaultValue;
    niceSlider.invertedAppearance = invertedAppearance;

    var sliderValue = defaultValue;
    if ( niceSlider.invertedAppearance ) sliderValue = max - defaultValue + min;

    niceSlider.slider = niceSlider.add( 'slider', undefined, sliderValue, min, max );

    niceSlider.editGroup = DuScriptUI.group( niceSlider );
    niceSlider.editGroup.spacing = 0;
    niceSlider.editGroup.margins = 0;

    //a function to add buttons before or after the edittext, depending on the textAlignment
    niceSlider.buttons = [];

    function addButtons ()
    {
        //add
        for ( var i = 0, num = valueButtons.length; i < num; i++ )
        {
            niceSlider.buttons[i] = DuScriptUI.smallbutton(
                niceSlider.editGroup,
                valueButtons[ i ].toString(),
                "",
                valueButtons[ i ]
                );
            niceSlider.buttons[i].alignment = [ 'fill', 'fill' ];
            niceSlider.buttons[i].onClick = function( val )
            {
                niceSlider.setValue( val );
                niceSlider.onChange();
            }
        }
    }

    if ( textAlignment == 'right' || textAlignment == 'bottom' ) addButtons();

    niceSlider.edit = DuScriptUI.editText( niceSlider.editGroup, defaultValue.toString(), prefix + ': ', suffix + ' ', '', '', false );
    var numChars = max.toString().length;
    if ( min.toString().length > max.toString().length ) numChars = min.toString().length;
    niceSlider.edit.edit.characters = numChars + prefix.length + suffix.length - 1;
    if ( orientation == 'row' )
    {
        niceSlider.editGroup.alignment = [ 'right', 'fill'];
        niceSlider.edit.alignment = [ 'center', textAlignment ];
        niceSlider.edit.static.justify = 'center';
    }
    else
    {
        niceSlider.editGroup.alignment = [ 'fill', 'bottom'];
        niceSlider.edit.alignment = [ textAlignment, 'center' ];
        niceSlider.edit.static.justify = textAlignment;
    }

    if ( textAlignment == 'left' || textAlignment == 'top' ) addButtons();

    niceSlider.onChanging = function() {};
    niceSlider.onChange = function() {};

    niceSlider.setValue = function( val )
    {
        niceSlider.value = val;
        niceSlider.edit.setText( niceSlider.value );
        if ( niceSlider.invertedAppearance ) niceSlider.slider.value = niceSlider.slider.maxvalue - val + niceSlider.slider.minvalue;
        else niceSlider.slider.value = val;
    }

    //events
    niceSlider.slider.onChanging = function()
    {
        if ( niceSlider.invertedAppearance ) niceSlider.value = Math.round( niceSlider.slider.maxvalue - niceSlider.slider.value + niceSlider.slider.minvalue );
        else niceSlider.value = Math.round( niceSlider.slider.value );
        niceSlider.edit.setText( niceSlider.value );
        niceSlider.onChanging();
    }

    niceSlider.slider.onChange = function()
    {
        niceSlider.onChange();
    }

    niceSlider.edit.onChanging = function()
    {
        var val = parseInt( niceSlider.edit.text );
        if ( isNaN( val ) ) return;
        niceSlider.value = val;
        if ( niceSlider.invertedAppearance ) niceSlider.slider.value = niceSlider.slider.maxvalue - val + niceSlider.slider.minvalue;
        else niceSlider.slider.value = val;
        niceSlider.onChanging();
    }
    niceSlider.edit.onChange = function()
    {
        var val = parseInt( niceSlider.edit.text );
        if ( isNaN( val ) ) return;
        if ( val < niceSlider.slider.minvalue ) val = niceSlider.slider.minvalue;
        if ( val > niceSlider.slider.maxvalue ) val = niceSlider.slider.maxvalue;
        niceSlider.edit.setText( val );
        niceSlider.value = val;
        if ( niceSlider.invertedAppearance ) niceSlider.slider.value = niceSlider.slider.maxvalue - val + niceSlider.slider.minvalue;
        else niceSlider.slider.value = val;
        niceSlider.onChange();
    }

    niceSlider.addEventListener( "mouseover", DuScriptUI.dimControls );

    return niceSlider;
}
