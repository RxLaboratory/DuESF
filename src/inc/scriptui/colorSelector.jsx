/**
 * @class
 * @name DuColorSelector
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A color selector, with an edittext and a random button.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.colorSelector} to create a Selector.<br />
 * The Selector inherits the Group object from ScriptUI and has all of its properties and methods.
 * @category DuScriptUI
 */

/**
 * The current color
 * @type {DuColor}
 * @memberof DuColorSelector
 * @name color
 */

/**
 * Sets the current color
 * @method
 * @name setColor
 * @param {DuColor} color The new color
 * @memberof DuColorSelector
 */

/**
 * Method called when the has been changed
 * @type {DuColorSelector~onChange}
 * @name onChange
 * @memberof DuColorSelector
 */

/**
 * The function to execute when the color is changed.
 * @callback DuColorSelector~onChange
 * @memberof DuColorSelector
 */

/**
 * Creates a new color selector and adds it to the container
 * @param {Window|Panel|Group} container
 * @param {string} [helpTip] - The help tip to show on the selector
 * @returns {DuColorSelector}
 */
DuScriptUI.colorSelector = function ( container, helpTip )
{
    helpTip = def(helpTip, '');

    var colorSelector = container.add('group');
    colorSelector.orientation = 'row';
    colorSelector.margins = 0;
    colorSelector.spacing = 0;
    colorSelector.alignment = ['fill', 'top'];

    colorSelector.color = DuColor.Color.RX_PURPLE;

    var label = DuScriptUI.staticText( colorSelector, "Color:", DuColor.Color.RX_PURPLE );
    label.helpTip = helpTip;
    label.alignment = ['left','center'];

    var editText = DuScriptUI.editText( colorSelector, "A526C4", '#', '', '000000', helpTip );
    editText.alignment = ['fill', 'fill'];

    var randomButton = DuScriptUI.button( colorSelector, '', DuScriptUI.Icon.RANDOM, i18n._("Set a random value.") );
    randomButton.alignment = ['right', 'center'];

    colorSelector.onChange = function() {};

    function labelClicked()
    {
        var color = new DuColor( colorPicker(editText.text) );
        editText.setText( color.hex() );
        colorChanged();
    }

    function randomClicked()
    {
        var color = DuColor.random();
        editText.setText( color.hex() );
        colorChanged();
    }

    function colorChanged()
    {
        var color = DuColor.fromHex( editText.text );
        colorSelector.color = color;
        DuScriptUI.setTextColor( label, color );
        colorSelector.onChange();
    }

    colorSelector.setColor = function( color )
    {
        editText.setText( color.hex() );
        colorChanged();
    }

    label.addEventListener("mousedown",labelClicked,false);
    randomButton.onClick = randomClicked;
    editText.onChange = colorChanged;

    return colorSelector;
}