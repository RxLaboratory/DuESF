/**
 * @class
 * @name DuToolBar
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A Tool Bar.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.toolBar} to create a Tool Bar.<br />
 * The DuToolBar inherits the <code>Group</code> object from ScriptUI and has all of its properties and methods.
 * @category DuScriptUI
 */

/**
 * Changes the background color of the button.
 * @method
 * @memberof DuToolBar
 * @name addButton
 * @param {string} text The button text.
 * @param {string} [icon] The path to the icon
 * @param {string} [helpTip] The button help tip
 * @param {Boolean} [addOptions=false] Whether to add more options
 * @param {Boolean} [optionsWithoutPanel=false] Whether the options need a dedicated panel
 */

/**
 * Creates a toolbar with a lighter background
 * @param {Panel|Window|Group} container The ScriptUI Object which will contain and display the toolbar.
 * @param {Number} [numCols] The number of columns to use when adding the buttons.
 * @returns {DuToolBar} The toolbar
 */
DuScriptUI.toolBar = function( container, numCols )
{
    var uiMode = DuESF.scriptSettings.get("common/uiMode", 0);

    if (!isdef( numCols ))
    {
        if (uiMode == 0) numCols = 3;
        else numCols = 6;
    }
    
    var toolsGroup = DuScriptUI.group( container, 'row' );
    toolsGroup.spacing = 3;
    toolsGroup.margins = 3;
    DuScriptUI.setBackgroundColor(toolsGroup , DuColor.Color.DARK_GREY );

    toolsGroup.columns = [];

    toolsGroup.spacing = 3;
    if (uiMode == 0) toolsGroup.alignChildren = ['fill', 'top'];
    else toolsGroup.alignChildren = ['center', 'top'];
    for (var i = 0; i < numCols; i++)
    {
        toolsGroup.columns.push( DuScriptUI.group(toolsGroup, 'column') );
    }

    toolsGroup.currentCol = 0;

    toolsGroup.addButton = function (text, icon, helpTip, addOptions, optionsWithoutPanel)
    {
        var options = {};
        text = def(text, '');

        if (jstype(text) != 'string') options = text;
        options.text = def(options.text, text);

        helpTip = def(helpTip, "");
        addOptions = def(addOptions, false);
        optionsWithoutPanel = def(optionsWithoutPanel, false);

        options.helpTip = def(options.helpTip, helpTip);
        options.options = def(options.options, addOptions);
        options.optionsWithoutPanel = def(options.optionsWithoutPanel, optionsWithoutPanel);
        options.image = def(options.image, icon);

        options.localize = false;
        options.orientation = uiMode == 0 ? 'column' : undefined;
        options.helpTip = uiMode == 0 ? helpTip : options.text + "\n\n" + helpTip;
        options.text =  uiMode == 0 ?  options.text : '';
        
        var button = DuScriptUI.button ( toolsGroup.columns[toolsGroup.currentCol], options);

        button.alignment = uiMode == 0 ? ['fill', 'top'] : ['center', 'top'];

        toolsGroup.currentCol = (toolsGroup.currentCol + 1) % numCols;


        return button;
    }

    return toolsGroup;
}
