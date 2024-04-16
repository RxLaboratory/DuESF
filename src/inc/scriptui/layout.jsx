
/**
 * Adds a group in a container, using  DuScriptUI default alignments, and DuScriptUI.defaultSpacing. Margins are set to 0.
 * @param {Panel|Window|Group} container Where to create the group
 * @param {string} [orientation] The orientation to use. One of "column", "row" or "stack". By default, "column" if added in a row, "row" if added in a column.
 * @return {Group}	The group created
 */
DuScriptUI.group = function( container, orientation )
{
    var group = container.add( "group" );
    group.spacing = 0;
    group.margins = 0;
    if ( orientation !== undefined ) group.orientation = orientation;
    if ( group.orientation === "row" )
    {
        group.alignChildren = DuScriptUI.defaultRowAlignment;
    }
    else if ( group.orientation === "column" )
    {
        group.alignChildren = DuScriptUI.defaultColumnAlignment;
    }
    else
    {
        group.alignChildren = DuScriptUI.defaultStackAlignment;
    }

    group.addEventListener( "mouseover", DuScriptUI.dimControls );

    return group;
}

/**
 * @class
 * @name DuSeparator
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A DuSeparator.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.separator} to create a DuSeparator.<br />
 * The DuSeparator inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property {StaticText|CheckBox} label - the label
 * @property {boolean} checkable - Read-Only | true if a checkbox is displayed
 * @category DuScriptUI
 */

/**
 * Adds separator with an optionnal name in the group
 * @memberof DuScriptUI
 * @param {Panel|Window|Group} container - Where to create the separator
 * @param {string} [name] - The name displayed
 * @param {boolean} [checkable=false] - When true, adds a checkbox to the separator
 * @param {boolean} [drawLine=true] - Draws a line when there is no name. When false, the separator is an empty space
 * @param {boolean} [translatable=true] - If false, the name won't be translated
 * @return {DuSeparator} The separator
 */
DuScriptUI.separator = function( container, name, checkable, drawLine )
{
    name = def(name, '' );
    checkable = def( checkable, false );
    drawLine = def( drawLine, true );

    var separator = DuScriptUI.group( container );
    separator.margins = 0;
    separator.checkable = checkable;

    separator.label = null;
    if ( name != '' || checkable )
    {
        if ( checkable ) separator.label = separator.add( 'checkbox', undefined, name );
        else separator.label = separator.add( 'statictext', undefined, name );
        separator.label.alignment = [ 'center', 'bottom' ];
        if ( drawLine ) DuScriptUI.setBackgroundColor( separator, DuColor.Color.APP_BACKGROUND_COLOR.lighter() );
    }
    else if ( drawLine )
    {
        DuScriptUI.setBackgroundColor( separator, DuColor.Color.APP_BACKGROUND_COLOR.darker(300) );
        var size = 1;
        if (DuESF.host == DuESF.HostApplication.AFTER_EFFECTS) size = 2;
        if (container.orientation == 'row')
        {
            separator.alignment = ['left', 'fill'];
            separator.minimumSize = [size,-1];
        }
        else
        {
            separator.alignment = [ 'fill', 'top' ];
            separator.minimumSize = [-1,size];
        }
    }

    separator.addEventListener( "mouseover", DuScriptUI.dimControls );

    return separator;
}
