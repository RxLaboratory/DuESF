/**
 * Creates a toolbar with a lighter background
 * @param {Panel|Window|Group} container The ScriptUI Object which will contain and display the toolbar.
 * @param {int} [numCols] The number of columns to use when adding the buttons.
 * @returns {Group} The toolbar, a ScriptUI Group
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