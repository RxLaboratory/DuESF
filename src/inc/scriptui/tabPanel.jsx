/**
 * @class
 * @name DuTabPanel
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A Panel with tabs.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.tabPanel} to create a picker.<br />
 * The DuTabPanel inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property {DuButton[]} buttons - The buttons for the tabs. Not that an "index" property is added to the button, containing the DuTab index.
 * @property {DuTab[]} tabs - The tabs.
 * @property {int} index - The currently visible tab.
 * @property {Group} buttonsGroup - The ScriptUI Group containing the buttons
 * @property {Group} mainGroup - The ScriptUI Group containing the tabs
 * @property {string} scriptUIPanel - The file name ("script.jsx") of a scriptUI Panel. Alt+Click on this tab will open/close this panel.
 * @property {DuTabPanel~onChange} onChange - Called when the index changes.
 * @category DuScriptUI
 */

/**
 * Adds a new empty DuTab in the DuTabPanel.
 * @method
 * @memberof DuTabPanel
 * @name addTab
 * @param {string} [text=''] - The label of the button.
 * @param {string} [image=''] - The path to the icon.
 * @param {string} [helpTip=''] - The helptip.
 * @param {bool} [translatable=true] - Set to false to not translate this tab text and helptip
 * @return {DuTab} The new DuTab.
 */

/**
 * Sets the current visible tab.
 * @method
 * @memberof DuTabPanel
 * @name setCurrentIndex
 * @param {int} [index=0] - The index of the tab to show.
 */

/**
 * Called when the index changes.
 * @callback DuTabPanel~onChange
 * @memberof DuTabPanel
 */

/**
 * @class
 * @name DuTab
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A DuTab inside a {@link DuTabPanel}.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuTabPanel.add} to create a new DuTab.
 * @property {int} index - The index of this tab.
 * @property {DuButton} button - The button associated with this tab.
 * @property {DuTab~tabActivated} onActivate - The function to execute when the tab is displayed.
 * @property {DuTab~tabDeActivated} onActivate - The function to execute when the tab is hidden.
 * @property {DuTab~build} build - You can use this callback to add a function which builds the UI of the tab, it will be called on first display.
 * @category DuScriptUI
 */

/**
 * The function to execute when the tab is about to be displayed.
 * @callback DuTab~tabActivated
 * @memberof DuTab
 */

/**
 * The function to execute when the tab is hidden.
 * @callback DuTab~tabDeActivated
 * @memberof DuTab
 */

/**
 * You can use this callback to add a function which builds the UI of the tab, it will be called on first display.<br />
 * This allows a faster startup of your script by delaying the creation of the tabs which are hidden at startup.<br />
 * You can add controls in the <code>this</code> object.
 * @callback DuTab~build
 * @memberof DuTab
 */

/**
 * Creates a panel with tabs
 * @param {Window|Panel|Group} container - The ScriptUI Object which will contain and display the panel.
 * @param {string} tabOrientation - The orientation to use for tab buttons.
 * @return {DuTabPanel} The panel.
 */
DuScriptUI.tabPanel = function( container, tabOrientation )
{
    tabOrientation = def(tabOrientation, 'row');

    var panel = DuScriptUI.group( container, 'column' );

    panel.tabOrientation = tabOrientation;
    panel.alignment = [ 'fill', 'fill' ];
    panel.buttons = [];
    panel.tabs = [];
    panel.tabGroups = [];
    panel.showTitle = true;
    panel.onChange = function() {};

    //adds a group for the buttons
    panel.buttonsGroup = DuScriptUI.group( panel, 'row' );
    //adds a group for the tabs
    panel.mainGroup = DuScriptUI.group( panel, 'stack' );
    panel.mainGroup.alignment = [ 'fill', 'fill' ];

    panel.addTab = function( text, image, helpTip, translatable )
    {
        text = def( text, '');
        image = def (image, '');
        translatable = def (translatable, true);

        var uiMode = DuESF.scriptSettings.get("common/uiMode", 0);
        if (uiMode >= 2 && image != '') text = '';

        // If this button and the previous one have a label, add a spacer
        if (panel.buttons.length > 0)
        {
            var prevButton = panel.buttons[panel.buttons.length-1];
            if (prevButton.label) if (prevButton.label.text != '' && text != '')
            {
                var spacer = panel.buttonsGroup.add('group');
                spacer.spacing = 0;
                spacer.margins = 0;
                spacer.minimumSize = [5,-1];
            }
        }

        //adds the new button
        var button = DuScriptUI.checkBox( panel.buttonsGroup, text, image, helpTip, undefined, undefined, panel.tabOrientation, true );
        button.index = panel.tabs.length;       
        panel.buttons.push( button );

        //adds the new tab
        var tab = DuScriptUI.group( panel.mainGroup, 'column' );
        tab.alignment = [ 'fill', 'fill' ];
        tab.visible = false;
        tab.activated = false;

        //the onActivate callBack
        tab.tabActivated = function() {};
        tab.tabDeActivated = function() {};
        //the build callBack
        tab.build = function( theTab ) {};
        tab.duBuild = function() { 
            if ( tab.built ) return;
            DuDebug.log( "TabPanel - Building Tab: " + tab.name + ' ' + tab.index );
            tab.build( tab );
            //resize everything
            DuDebug.log( "TabPanel - Tab Built, Layout..." );
            DuScriptUI.layout( tab );

            DuDebug.log( "TabPanel - Tab ready." );
            tab.built = true;
        }
        tab.built = false;

        tab.scriptUIPanel = "";

        tab.button = button;

        //add to the list
        tab.index = panel.tabs.length;
        tab.name = text;
        panel.tabs.push( tab );

        DuScriptUI.allTabs.push( tab );

        button.onClick = function()
        {
            panel.setCurrentIndex( button.index );
        }

        return tab;
    }

    panel.setCurrentIndex = function( index )
    {
        index = def( index, panel.index );

        var numTabs = panel.tabs.length;

        if ( numTabs == 0 ) return;

        //hide all tabs
        for ( var i = 0; i < numTabs; i++ )
        {
            var tab = panel.tabs[ i ];
            tab.activated = i == index;
            // Build only AFTER main UI has been shown, this improves performance
            // DuScriptUI.showUI will build visible tabs
            if ( tab.activated && DuScriptUI.uiShown )
            {
                tab.duBuild();
                tab.visible = true;
                tab.tabActivated();
            }
            if ( !tab.activated )
            {
                tab.visible = false;
                tab.tabDeActivated();
            }

            panel.buttons[ i ].setChecked( tab.activated );
        }

        if ( index >= 0 && index < numTabs ) panel.index = index;
        else panel.index = -1;

        panel.onChange();
    }

    return panel;
}

/**
 * Builds all the tabs from all the tab panels
 */
DuScriptUI.buildAllTabs = function()
{
    for ( var i = 0, num = DuScriptUI.allTabs.length; i < num; i++ )
    {
        var tab = DuScriptUI.allTabs[ i ];
        if ( !tab.built )
        {
            tab.build( tab );
            //resize everything
            DuScriptUI.layout( tab );
            tab.built = true;
        }
    }
    //check if there's still unbuilt tabs which may have been added
    var redo = false;
    for ( var i = DuScriptUI.allTabs.length - 1; i >= 0; i-- )
    {
        var tab = DuScriptUI.allTabs[ i ];
        if ( !tab.built )
        {
            redo = true;
            break;
        }
    }
    if ( redo ) DuScriptUI.buildAllTabs();
}
