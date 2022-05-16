/**
 * Resets the layout of the whole ui containing a scriptUI item.
 * @param {ScriptUI} item - The ScriptUI element which needs to be resized
 * @param {Boolean} [force] - Needs to be true if you need to layout before <code>DuESF.state</code> is <code>DuESF.State.RUNTIME</code>.<br />
 * That should be the case only for the main UI; Note that you should not need it anyway, {@link DuScriptUI.showUI} does that for you.
 */
DuScriptUI.layout = function( item, force )
{
    force = def( force, false );
    if (DuESF.state != DuESF.State.RUNTIME && !force) return;
    item.layout.layout( true );
    item.layout.resize();
}

/**
 * Changes the color of the text of a ScriptUI Object
 * @param {ScriptUI} text - The ScriptUI Object
 * @param {DuColor} color - The new color
 * @param {Boolean} [adjusted=false] - lightens the color if the brightness setting of Ae is not set on the darkest one
 */
DuScriptUI.setTextColor = function( text, color, adjusted )
{
    if ( !isdef( text ) ) throw "You must provide a ScriptUI Control to change the color of the text";
    adjusted = def( adjusted, false );

    var g = text.graphics;
    var c;
    if (adjusted) c = color.adjusted();
    else c = color;
    var textPen = g.newPen( g.PenType.SOLID_COLOR, c.floatRGBA(true), 1 );
    g.foregroundColor = textPen;
}

/**
 * Changes the color of the background of a ScriptUI Object
 * @param {ScriptUI} uiItem - The ScriptUI Object
 * @param {Array} color - The new color [R,V,B,A] Array
 * @param {Boolean} [adjusted=true] - lightens the color if the brightness setting of Ae is not set on the darkest one
 */
DuScriptUI.setBackgroundColor = function( uiItem, color, adjusted )
{
    if ( !isdef( uiItem ) ) throw "You must provide a ScriptUI Control to change the color of the background";
    adjusted = def( adjusted, true );
   
    var g = uiItem.graphics;
    var c;
    if (adjusted) c = color.adjusted();
    else c = color;
    var brush = g.newBrush( g.BrushType.SOLID_COLOR, c.floatRGBA(true) );
    g.backgroundColor = brush;
}