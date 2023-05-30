
/**
 * @class
 * @name DuPanel
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A Panel or Window.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.mainPanel} to create a Panel.<br />
 * The DuPanel inherits the Panel or Window object from ScriptUI and has all of its properties and methods.
 * @category DuScriptUI
 */

/**
 * The ScriptUI group where the new controls must be added. Do not add any control directly inside the DuPanel.
 * @name content
 * @type {Group}
 * @memberof DuPanel.prototype
 */

/**
 * A function to reload a script in this panel.
 * @method refreshUi
 * @param {File} file - The script to reload. 
 * @return {boolean} true on success, false otherwise.
 * @memberof DuPanel.prototype
 */

/**
 * Creates the main panel for a script
 * @param {Panel|null} container - The container ('this' in the root of the calling script), either a Panel (when launched from the 'Window' menu) or null (when launched from 'file/scripts/run...')
 * @param {string} [scriptName=DuESF.scriptName] - A name for this UI
 * @param {string[]} [contentAlignment=DuScriptUI.defaultColumnAlignment] - The alignment of the content in the panel
 * @param {string} [borderless=false] - When true, creates a borderless window if container is not a panel
 * @return {DuPanel} The panel created, either a ScriptUI Panel or a ScriptUI Window.
 * @example
 * var ui = DuScriptUI.mainPanel(this,"Test Script");
 * var refreshButton = ui.content.add('button',undefined,"Refresh");
 * refreshButton.onClick = function() { ui.refreshUI( new File($.fileName) ); }; //reloads the current script
 * DuScriptUI.showUI(ui);
 */
DuScriptUI.mainPanel = function( container, scriptName, contentAlignment, bless )
{
    scriptName = def(scriptName, DuESF.scriptName, false);
    contentAlignment = def(contentAlignment, DuScriptUI.defaultColumnAlignment, false);
    bless = def (bless, false);

    var myPal = null;

    var winType = 'palette';

    if (DuESF.host == DuESF.HostApplication.PHOTOSHOP)
    {
        bless = false;
        winType = 'dialog';
    }

    container instanceof Panel ? myPal = container : myPal = new Window( winType, scriptName, undefined,
    {
        resizeable: true,
        borderless: bless
    } );

    if ( myPal == null ) throw "Failed to create User Interface.";

    myPal.margins = 0;
    myPal.spacing = 0;

    //create margins to dim buttons
    var topMargin = myPal.add( 'button' );
    topMargin.onDraw = function() {};
    topMargin.minimumSize.height = DuScriptUI.defaultMargins;
    topMargin.alignment = [ 'fill', 'top' ];
    topMargin.maximumSize.height = topMargin.minimumSize.height = topMargin.preferredSize.height = DuScriptUI.defaultMargins;

    var mainRow = myPal.add( 'group' );
    mainRow.alignment = contentAlignment;
    mainRow.alignChildren = contentAlignment;
    mainRow.margins = 0;
    mainRow.spacing = 0;

    var leftMargin = mainRow.add( 'button' );
    leftMargin.onDraw = function() {};
    leftMargin.maximumSize.width = leftMargin.minimumSize.width = leftMargin.preferredSize.width = DuScriptUI.defaultMargins;
    leftMargin.alignment = [ 'left', 'fill' ];

    myPal.content = mainRow.add( 'group' );
    myPal.content.margins = 0;
    myPal.content.spacing = DuScriptUI.defaultSpacing;
    myPal.content.alignChildren = DuScriptUI.defaultColumnAlignment;
    myPal.content.orientation = "column";
    myPal.content.alignment = ['fill', 'fill'];

    var rightMargin = mainRow.add( 'button' );
    rightMargin.onDraw = function() {};
    rightMargin.maximumSize.width = rightMargin.minimumSize.width = rightMargin.preferredSize.width = DuScriptUI.defaultMargins;
    rightMargin.alignment = [ 'right', 'fill' ];

    var bottomMargin = myPal.add( 'button' );
    bottomMargin.onDraw = function() {};
    bottomMargin.maximumSize.height = bottomMargin.minimumSize.height = bottomMargin.preferredSize.height = DuScriptUI.defaultMargins;
    bottomMargin.alignment = [ 'fill', 'bottom' ];

    myPal.addEventListener( "mouseover", DuScriptUI.dimControls );
    topMargin.addEventListener( "mouseover", DuScriptUI.dimControls );
    leftMargin.addEventListener( "mouseover", DuScriptUI.dimControls );
    rightMargin.addEventListener( "mouseover", DuScriptUI.dimControls );
    bottomMargin.addEventListener( "mouseover", DuScriptUI.dimControls );
//*/
    return myPal;
}

/**
 * @class
 * @name DuPopup
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A borderless popup, to be tied to a ui control.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.popUp} to create a Popup.<br />
 * The DuPopup inherits the Window object from ScriptUI and has all of its properties and methods.
 * @property {Group} content - The ScriptUI group where the new controls must be added. Do not add any control directly inside the DuPopup.
 * @property {boolean} pinned - true if this popup is "pinned", which means it won't hide when the user clicks outside of the window.
 * @property {DuPopup~build} build - You can use this callback to add a function which builds the UI of the popup, it will be called on first display.
 * @category DuScriptUI
 */

/**
 * You can use this callback to add a function which builds the UI of the popup, it will be called on first display.<br />
 * This allows a faster startup of your script by delaying the creation of the tabs which are hidden at startup.<br />
 * You can add controls in the <code>this.content</code> object.
 * @callback DuPopup~build
 * @memberof DuPopup
 */
/**
 * Ties the popup to a ui control. The popup will be shown just above the control when it is clicked.<br />
 * The control must have an addEventListener method.
 * @method
 * @memberof DuPopup
 * @name tieTo
 * @param {ScriptUI} [control] - The control
 * @param {Boolean} [onShift=false] - If set to true, the popup is tied on Shift + Click only
 * @param {boolean} [alwaysBlock=false] If true, the popup will never be automatically shown. Call show() to show it.
 */

/**
 * Pins the popup (it won't be hidden anymore when deactivated).
 * @method
 * @memberof DuPopup
 * @name pin
 * @param {boolean} [pinned=true] - true to pin the popup, false to un-pin it.
 */

/**
 * Hides the popup.
 * @method
 * @memberof DuPopup
 * @name hidePopup
 */

/**
 * Hides the popup (alias for {@link DuPopup.hidePopup}).
 * @alias DuPopup.hidePopup
 * @method
 * @memberof DuPopup
 * @name cancel
 */

/**
 * Sets this parameter to <code>true</code> to prevent the next show of the popup.<br />
 * This will prevent it from showing once (and only once).
 * @type {Boolean}
 * @memberof DuPopup
 * @name block
 * @default false
 */

/**
 * Creates a borderless popup
 * @param {string} title The title of the popup
 * @param {string[]} [alignment=[ "fill", "top" ]] The alignement of this window
 * @param {boolean} [modal=false] Set the popup to a modal dialog
 * @return {DuPopup} The popup, a ScriptUI Window which is borderless, with a 'tieTo(control)' method.
 * @example
 * var popup = DuScriptUI.popUp( );
 * var popupButton = DuScriptUI.button( myUI, "My Buttton for the popup" );
 * popup.tieTo( popupButton ); // will show the popup when the button is clicked, just above it.
 */
DuScriptUI.popUp = function( title, alignment, modal )
{
    modal = def(modal, false);
    alignment = def( alignment, [ "fill", "top" ] );
    title = def (title, "");
    
    var type = 'palette';
    if (modal) type = 'dialog'; 
    var popup = new Window( type, title, undefined,
    {
        resizeable: false,
        borderless: true
    } );

    DuScriptUI.setBackgroundColor(popup, DuColor.Color.OBSIDIAN);

    popup.margins = 0;
    popup.spacing = 0;
    popup.pinned = false;

    //add stroke around
    function drawBorder ( drawState ) {
        /*var g = this.graphics;
        var c = DuColor.Color.DARK_GREY;

        var pen = g.newPen( g.PenType.SOLID_COLOR, c, 1 );

        g.newPath();
        if (this.side == 0) {
            g.moveTo (0, 0);
            g.lineTo (this.size.width, 0);
        }
        else if (this.side == 2) {
            g.moveTo (this.size.width, 0);
            g.lineTo (this.size.width, this.size.height);
        }
        else if (this.side == 1) {
            g.moveTo (0, 0);
            g.lineTo (0, this.size.height);
        }
        else if (this.side == 3) {
            g.moveTo (0, this.size.height);
            g.lineTo (this.size.width, this.size.height);
        }

        g.strokePath( pen );*/
    };

    //create margins to dim buttons
    var topMargin = popup.add( 'button' );
    topMargin.onDraw = drawBorder;
    topMargin.side = 0;
    topMargin.minimumSize.height = DuScriptUI.defaultMargins;
    topMargin.alignment = [ 'fill', 'top' ];
    topMargin.maximumSize.height = topMargin.minimumSize.height = topMargin.preferredSize.height = 1;
    
    var mainRow = popup.add( 'group' );
    mainRow.alignment = alignment;
    mainRow.alignChildren = alignment;
    mainRow.margins = 0;
    mainRow.spacing = 0;

    var leftMargin = mainRow.add( 'button' );
    leftMargin.onDraw = drawBorder;
    leftMargin.side = 1;
    leftMargin.maximumSize.width = leftMargin.minimumSize.width = leftMargin.preferredSize.width = 1;
    leftMargin.alignment = [ 'left', 'fill' ];

    var mainColumn = mainRow.add( 'group' );
    mainColumn.orientation = 'column';
    mainColumn.spacing = 0;
    mainColumn.margins = 0;
    mainColumn.alignment = ['fill','fill'];

    var titleBar = DuScriptUI.titleBar(
        mainColumn,
        title
        );
    if (modal) DuScriptUI.setTextColor(titleBar.titleLabel, DuColor.Color.APP_HIGHLIGHT_COLOR)

    popup.content = mainColumn.add( 'group' );
    popup.content.margins = 0;
    popup.content.spacing = 0;
    popup.content.alignChildren = alignment;
    popup.content.orientation = "column";

    var rightMargin = mainRow.add( 'button' );
    rightMargin.onDraw = drawBorder;
    rightMargin.side = 2;
    rightMargin.maximumSize.width = rightMargin.minimumSize.width = rightMargin.preferredSize.width = 1;
    rightMargin.alignment = [ 'right', 'fill' ];

    var bottomMargin = popup.add( 'button' );
    bottomMargin.onDraw = drawBorder;
    bottomMargin.side = 3;
    bottomMargin.maximumSize.height = bottomMargin.minimumSize.height = bottomMargin.preferredSize.height = 1;
    bottomMargin.alignment = [ 'fill', 'bottom' ];

    popup.block = false;

    popup.build = function( contentGroup ) {};
    popup.built = false;

    popup.tiedAlwaysBlock = false;

    popup.tieTo = function (control, onShift, alwaysBlock)
    {
        onShift = def(onShift, false);
        alwaysBlock = def(alwaysBlock, false);

        popup.tiedAlwaysBlock = alwaysBlock;

        control.tiedPopups = def(control.tiedPopups, []);
        control.tiedOnShift  =def(control.tiedOnShift, []);
        control.tiedPopups.push(popup);
        control.tiedOnShift.push(onShift);
        
        if (control.tiedPopups.length == 1)
        {
            control.addEventListener( 'click', function(e) {
                if(e.view.parent != control) return;

                for (var i = 0; i < control.tiedPopups.length; i++)
                {
                    var ppup = control.tiedPopups[i];
                    if ( !e.shiftKey && control.tiedOnShift[i] ) return;

                    if (ppup.block)
                    {
                        ppup.block = false;
                        return;
                    }

                    if ( !ppup.built )
                    {
                        ppup.build( );
                        ppup.built = true;
                    }

                    var x = e.screenX - e.clientX;
                    var y = e.screenY - e.clientY;
                    //we need a layout and resize to get the window frame size
                    DuScriptUI.layout( ppup );
                    var location = [x,y];
                    location = DuScriptUI.moveInsideScreen( [x, y], ppup.frameSize );
                    ppup.location = location;
                    if (!ppup.pinned) DuScriptUI.eventFunctionsPaused = true;
                    if (!ppup.tiedAlwaysBlock) ppup.show();
                }
            }, true);
        }
    }

    popup.pin = function(p)
    {
        p = def (p, true);
        popup.pinned = p;
        titleBar.pinButton.setChecked(p);
    }

    var movingTitle = false;
    var movingPopup = false;
    var startMouseLocation = [0,0];
    var startPopupLocation = [0,0];

    function enterTitleMoveState(e)
    {
        movingTitle = true;
        startMouseLocation = [e.screenX, e.screenY];
        startPopupLocation = [popup.location[0], popup.location[1]];
    }

    function enterPopupMoveState(e)
    {
        movingPopup = true;
        startMouseLocation = [e.screenX, e.screenY];
        startPopupLocation = [popup.location[0], popup.location[1]];
    }

    function movePopup(e)
    {
        if (!movingPopup) return;
        if (movingTitle) return;
        var x = e.screenX - startMouseLocation[0];
        var y = e.screenY - startMouseLocation[1];
        popup.location = [ x, y ] + startPopupLocation;
    }

    function moveTitle(e)
    {
        if (!movingTitle) return;
        var x = e.screenX - startMouseLocation[0];
        var y = e.screenY - startMouseLocation[1];
        popup.location = [ x, y ] + startPopupLocation;
    }

    function endMoveState(e)
    {
        movingTitle = false;
        movingPopup = false;
    }

    function esc(e)
    {
        if ( e.keyName == "Escape") { hidePopup(); }
    }

    function hidePopup()
    {
        popup.hide();
        DuScriptUI.eventFunctionsPaused = false;
    }

    popup.cancel = popup.hidePopup = hidePopup;

    popup.onDeactivate = function () { if (!popup.pinned) hidePopup(); };
    titleBar.onClose = hidePopup;

    titleBar.onPin = function (pinned) { popup.pin(pinned); };

    popup.addEventListener( "mouseover", DuScriptUI.dimControls );
    popup.addEventListener( "keydown", esc );
    topMargin.addEventListener( "mouseover", DuScriptUI.dimControls );
    leftMargin.addEventListener( "mouseover", DuScriptUI.dimControls );
    rightMargin.addEventListener( "mouseover", DuScriptUI.dimControls );
    bottomMargin.addEventListener( "mouseover", DuScriptUI.dimControls );
    titleBar.addEventListener( "mouseover", DuScriptUI.dimControls );

    titleBar.addEventListener( "mousedown", enterPopupMoveState );
    titleBar.addEventListener( "mousemove", movePopup);
    titleBar.addEventListener( "mouseup", endMoveState );
    titleBar.addEventListener( "mouseout", endMoveState );

    titleBar.titleLabel.addEventListener( "mousedown", enterTitleMoveState );
    titleBar.titleLabel.addEventListener( "mousemove", moveTitle );
    titleBar.titleLabel.addEventListener( "mouseup", endMoveState );
    titleBar.titleLabel.addEventListener( "mouseout", endMoveState );

    if (modal) popup.pin();

    return popup;
}

/**
 * Resizes and shows the main panel of a script
 * @param {Panel|Window}		ui	- The UI created by Duik.ui.createUI
 * @param {boolean}		[enterRunTime=false]	- Set to true to automatically set DuESF to runtime state<br />
 * Set this to false if the ui shown is not the actual main panel of the script and it is shown before the main panel has been loaded.
 */
DuScriptUI.showUI = function( ui, enterRunTime )
{
    DuScriptUI.updateFundingInfo();

    enterRunTime = def( enterRunTime, true);

    DuDebug.log( "DuScriptUI.showUI" );

    DuDebug.log( "DuScriptUI.showUI: Defining layout & resize" );
    DuScriptUI.layout( ui, true );
    DuDebug.log( "DuScriptUI.showUI: Layout OK" );
    ui.onResizing = ui.onResize = function()
    {
        try
        {
            ui.layout.resize();
        }
        catch ( e )
        {}
    }
    DuDebug.log( "DuScriptUI.showUI: UI Ready" );

    // If it's a Window, it needs to be shown
    if ( ui instanceof Window )
    {
        DuDebug.log( "DuScriptUI.showUI: Showing window" );
        //ui.center();
        ui.show();
        DuDebug.log( "DuScriptUI.showUI: Window visible." );
    }
    DuDebug.log( "DuScriptUI.showUI: UI shown" );

    DuScriptUI.uiShown = true;
    
    if (enterRunTime) DuESF.enterRunTime();
    DuDebug.log( "DuScriptUI.showUI: Runtime!" );

    // Build tabs
    for (var i = 0, n = DuScriptUI.allTabs.length; i < n; i++)
    {
        var tab = DuScriptUI.allTabs[i];
        if ( !tab.activated ) continue;
        tab.duBuild();
        tab.visible = true;
        tab.tabActivated();
    }//*/
    DuDebug.log( "DuScriptUI.showUI: Tabs built." );
}

/**
 * @class
 * @name DuScriptPanel
 * @extends DuPanel
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A Panel or Window.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.scriptPanel} to create a Panel.<br />
 * @property {Group} settingsGroup - The ScriptUI group where to add the UI for the settings of the script.
 * @property {Group} mainGroup - The ScriptUI group where to add the main UI of the script.
 * @property {DuScriptPanel~onApplySettings} onApplySettings Called when the apply settings button is clicked.
 * @property {DuScriptPanel~onResetSettings} onResetSettings Called when the reset (default) settings button is clicked.
 * @category DuScriptUI
 */

/**
 * The function to execute when the apply settings button is clicked.
 * @callback DuScriptPanel~onApplySettings
 * @memberof DuScriptPanel
 */

/**
 * The function to execute when the reset settings button is clicked.
 * @callback DuScriptPanel~onResetSettings
 * @memberof DuScriptPanel
 */

/**
 * Adds some settings common to all scripts (the file, highlight color, languages...)
 * @method addCommonSettings
 * @memberof DuScriptPanel.prototype
 */

/**
 * Creates the main panel of a script
 * @param {Panel|null} container - The container ('this' in the root of the calling script), either a Panel (when launched from the 'Window' menu) or null (when launched from 'file/scripts/run...')
 * @param {bool} [addSettingsButton=true] - Whether to create a button to open the settings or not
 * @param {bool} [addHelpButton=false] - Whether to create a button to open the help panel or not
 * @param {File} [scriptFile] - The main script file, needed for the refresh button in debug mode
 * @return {DuScriptPanel} The panel created, either a ScriptUI Panel or a ScriptUI Window.
 * @example
 * var ui = DuScriptUI.mainPanel(this,"Test Script");
 * var refreshButton = ui.content.add('button',undefined,"Refresh");
 * refreshButton.onClick = function() { ui.refreshUI( new File($.fileName) ); }; //reloads the current script
 * DuScriptUI.showUI(ui);
 */
DuScriptUI.scriptPanel = function( container, addSettingsButton, addHelpButton, scriptFile )
{
    function testGroup( group )
    {
        group.add('statictext', undefined, "test");
        DuScriptUI.setBackgroundColor( group, DuColor.Color.BLACK );
    }

    addSettingsButton = def(addSettingsButton, true);
    addHelpButton = def(addHelpButton, false);

    var panel = DuScriptUI.mainPanel( container, undefined, ['fill','fill'] );
    panel.content.orientation = 'stack';
    panel.content.alignment = ['fill','fill'];

    var contentsMainGroup = DuScriptUI.group(panel.content, 'column');
    contentsMainGroup.alignment = ['fill', 'fill'];
    contentsMainGroup.margins = 0;

    var contentsMainStack = DuScriptUI.group(contentsMainGroup, 'column');
    contentsMainStack.orientation = 'stack';
    contentsMainStack.alignment = ['fill', 'fill'];

    panel.mainGroup = DuScriptUI.group(contentsMainStack, 'column');
    panel.mainGroup.alignment = ['fill', 'fill'];

    //a margin at the bottom (hidden by the bottom bar buttons)
    var mainGroupMarginBottom = DuScriptUI.group(contentsMainGroup, 'column');
    mainGroupMarginBottom.alignment= ['fill', 'bottom'];
    //mainGroupMarginBottom.minimumSize = [0, 16];

    // == SETTINGS PANEL
    var rootSettingsGroup = DuScriptUI.group(contentsMainStack, 'column');
    rootSettingsGroup.alignment = ['fill', 'fill'];
    rootSettingsGroup.visible = false;
    panel.settingsGroup = DuScriptUI.group(rootSettingsGroup, 'column');
    panel.settingsGroup.alignment = ['fill', 'top'];
    var settingsTitle = DuScriptUI.titleBar(
        panel.settingsGroup,
        i18n._( "%1 Settings", DuESF.scriptName),
        true,
        false
    );

    panel.hasCommonSettings = false;
    panel.addCommonSettings = function()
    {
        DuDebug.log("ScriptUI: adding settings to main panel.");
        if (panel.hasCommonSettings) return;
        panel.hasCommonSettings = true;

        var debug = DuESF.scriptSettings.get("common/debug", false);

        // Add default settings
        // language
        // Prepare languages, count how many there are, etc
        var languages = i18n.getAvailableLanguages();

        var languageGroup = DuScriptUI.group(panel.settingsGroup, 'row');

        if (languages.count >= 1)
        {
            panel.settingsGroup.languageSelector = DuScriptUI.selector(
                languageGroup,
                i18n._("Set the language of the interface.")
            )

            for (var locale in languages)
            {
                if (locale == "count") continue;

                DuDebug.log("ScriptUI: Found locale: " + locale);

                panel.settingsGroup.languageSelector.addButton( {
                    text: languages[locale],
                    image: w16_language,
                    data: locale
                }); 
            }

            panel.settingsGroup.languageSelector.setCurrentIndex(0);
        }
        DuDebug.log("ScriptUI: language settings ready.");
        
        // settings file
        panel.settingsGroup.fileButton = DuScriptUI.fileSelector (
            panel.settingsGroup,
            i18n._("Settings file") + '...',
            true,
            i18n._("Set the location of the settings file."),
            w16_settings_file,
            'save',
            "JSON: *.json, All Files: *.*",
            'column'
        );
        DuDebug.log("ScriptUI: settings file ready.");

        // color
        panel.settingsGroup.colorSelector = DuScriptUI.selector(
            panel.settingsGroup,
            i18n._("Set the highlight color.")
        );
        panel.settingsGroup.colorSelector.addButton(
            i18n._("After Effects Blue"),
            w8_ae_blue,
            i18n._("The After Effects highlighting blue")
        );
        panel.settingsGroup.colorSelector.addButton(
            i18n._("RxLab Purple"),
            w8_rx_purple,
            i18n._("The RxLaboratory Purple")
        );
        panel.settingsGroup.colorSelector.addButton(
            i18n._("Rainbox Red"),
            w8_rx_red,
            i18n._("The Rainbox Productions Red")
        );
        panel.settingsGroup.colorSelector.addButton(
            i18n._("After Effects Orange (CS6)"),
            w8_ae_orange,
            i18n._("The After Effects highlighting orange from good ol'CS6")
        );
        panel.settingsGroup.colorSelector.addButton(
            i18n._("Custom..."),
            undefined,
            i18n._("Select a custom color.")
        );
        panel.settingsGroup.colorSelector.setCurrentIndex(0);
        DuDebug.log("ScriptUI: color ready.");
        // ui mode
        panel.settingsGroup.uiModeSelector = DuScriptUI.selector(
            panel.settingsGroup,
            i18n._("Select the UI mode.")
        )
        panel.settingsGroup.uiModeSelector.addButton(
            i18n._("Rookie"),
            w16_rookie,
            i18n._("The easiest-to-use mode, but also the biggest UI.")
        );
        panel.settingsGroup.uiModeSelector.addButton(
            i18n._("Standard"),
            w16_standard,
            i18n._("The standard not-too-big UI.")
        );
        panel.settingsGroup.uiModeSelector.addButton(
            i18n._("Expert"),
            w16_expert,
            i18n._("The smallest UI, for expert users.")
        );
        panel.settingsGroup.uiModeSelector.setCurrentIndex(0);
        DuDebug.log("ScriptUI: ui mode ready.");
        // dev & debug
        panel.settingsGroup.debugButton = DuScriptUI.checkBox (
            panel.settingsGroup,
            i18n._("Normal mode"),
            w16_user,
            i18n._("Use at your own risk!"),
            i18n._("Dev and Debug mode"),
            w16_bug
        );
        DuDebug.log("ScriptUI: Dev and debug mode ready.");

        panel.settingsGroup.fileButton.onChange = function()
        {
            var file = panel.settingsGroup.fileButton.getFile();
            if (file == null) return;
            DuESF.scriptSettings.setFile(file);
            panel.settingsGroup.reset();
        }

        panel.settingsGroup.colorSelector.onChange = function()
        {
            var customColor = new DuColor( DuESF.scriptSettings.get("common/highlightColor", DuColor.Color.APP_HIGHLIGHT_COLOR) );
            var colorIndex = panel.settingsGroup.colorSelector.index;
            if (colorIndex == panel.settingsGroup.colorSelector.items.length -1 )
            {
                var newColor = new DuColor( colorPicker( customColor.floatRGB() ) );
                // If white, the user has canceled
                if ( newColor.equals( DuColor.Color.WHITE ) )
                {
                    panel.settingsGroup.colorSelector.setCurrentIndex(0);
                    return;
                }

                // Store the color for the valid button
                panel.settingsGroup.colorSelector.customColor = newColor;
            }
        }

        DuDebug.log("ScriptUI: events ready.");

        // Load settings
        panel.settingsGroup.reset = function()
        {
            var highlightSelection = DuESF.scriptSettings.get("common/highlightSelection", 0);
            var currentLanguageName = DuESF.scriptSettings.get("common/currentLanguageName", 'Esperanto');
            var debug = DuESF.scriptSettings.get("common/debug", false);
            var uiMode = DuESF.scriptSettings.get("common/uiMode", 0);
            var customColor = new DuColor( DuESF.scriptSettings.get("common/highlightColor", DuColor.Color.APP_HIGHLIGHT_COLOR) );
            
            // Settings File
            panel.settingsGroup.fileButton.setPath( DuESF.scriptSettings.file.absoluteURI );

            // Ui mode
            panel.settingsGroup.uiModeSelector.setCurrentIndex( uiMode );

            // Color
            panel.settingsGroup.colorSelector.setCurrentIndex( highlightSelection, true );
            // Set custom
            panel.settingsGroup.colorSelector.customColor = customColor;

            // Language
            if (panel.settingsGroup.languageSelector)
                for (var i = 0 , num = panel.settingsGroup.languageSelector.items.length; i < num; i++)
                {
                    if (panel.settingsGroup.languageSelector.items[i][0] == currentLanguageName)
                    {
                        panel.settingsGroup.languageSelector.setCurrentIndex(i);
                        break;
                    }
                }

            // Debug mode
            panel.settingsGroup.debugButton.setChecked( debug );

            panel.onResetSettings();
        }

        DuDebug.log("ScriptUI: calling reset method...");

        panel.settingsGroup.reset();

        DuDebug.log("ScriptUI: settings panel ready!");
    }

    DuScriptUI.separator( rootSettingsGroup );

    panel.settingsGroup.updateButton = DuScriptUI.button(
        rootSettingsGroup,
        i18n._("Check for updates"),
        DuScriptUI.Icon.DOWNLOAD,
        i18n._("Check for updates"),
        false,
        'row',
        'center'
    )

    DuScriptUI.separator( rootSettingsGroup );

    var validGroup = DuScriptUI.group( rootSettingsGroup, 'row');

    panel.settingsGroup.resetButton = DuScriptUI.button(
        validGroup,
        i18n._("Default"),
        w12_reset,
        i18n._("Reset the settings to their default values."),
        false,
        'row',
        'center'
    );
    panel.settingsGroup.validButton = DuScriptUI.button(
        validGroup,
        i18n._("Apply"),
        w12_check,
        i18n._("Apply settings."),
        false,
        'row',
        'center'
    );
    
    panel.onApplySettings = function() {};
    panel.onResetSettings = function() {};

    panel.settingsGroup.validButton.onClick = function()
    {
        if (!panel.hasCommonSettings)
        {
            panel.onApplySettings();
            return;
        }

        // Update and Save settings

        // UI Mode
        DuESF.scriptSettings.set("common/uiMode", panel.settingsGroup.uiModeSelector.index);

        // Color
        var colorIndex = panel.settingsGroup.colorSelector.index;
        DuESF.scriptSettings.set("common/highlightSelection", colorIndex);
        // Custom
        if (colorIndex == panel.settingsGroup.colorSelector.items.length -1 )
        {
            // Save and set
            var color = panel.settingsGroup.colorSelector.customColor;
            DuESF.scriptSettings.set("common/highlightColor",  color.floatRGBA());
            DuColor.Color.APP_HIGHLIGHT_COLOR = color;
        }
        else if (colorIndex == 0)
        {
            DuESF.scriptSettings.set("common/highlightColor",  DuColor.Color.AFTER_EFFECTS_BLUE);
            DuColor.Color.APP_HIGHLIGHT_COLOR = DuColor.Color.AFTER_EFFECTS_BLUE;
        }
        else if (colorIndex == 1)
        {
            DuESF.scriptSettings.set("common/highlightColor",  DuColor.Color.RX_PURPLE);
            DuColor.Color.APP_HIGHLIGHT_COLOR = DuColor.Color.RX_PURPLE;
        }
        else if (colorIndex == 2)
        {
            DuESF.scriptSettings.set("common/highlightColor",  DuColor.Color.RAINBOX_RED);
            DuColor.Color.APP_HIGHLIGHT_COLOR = DuColor.Color.RAINBOX_RED;
        }
        else if (colorIndex == 3)
        {
            DuESF.scriptSettings.set("common/highlightColor",  DuColor.Color.AE_ORANGE);
            DuColor.Color.APP_HIGHLIGHT_COLOR = DuColor.Color.AE_ORANGE;
        }

        // Language
        if (panel.settingsGroup.languageSelector)
        {
            DuESF.scriptSettings.set("common/language",  panel.settingsGroup.languageSelector.currentData );
            DuESF.scriptSettings.set("common/currentLanguageName",  panel.settingsGroup.languageSelector.text);
        }
            
        // Dev Mode
        DuESF.scriptSettings.set("common/debug",  panel.settingsGroup.debugButton.value);
		DuESF.debug = panel.settingsGroup.debugButton.value;

        DuESF.scriptSettings.save();

        panel.mainGroup.visible = true;
        rootSettingsGroup.visible = false;

        panel.onApplySettings();

        // Restart script
        var ok = DuScriptUI.refreshPanel( panel, scriptFile );
        if (!ok) alert(i18n._("You may need to restart the script for all changes to take effect."));
    }

    panel.settingsGroup.resetButton.onClick = function()
    {
        DuESF.settings.reset();
        DuESF.scriptSettings.reset();
        panel.settingsGroup.reset();
    }

    panel.settingsGroup.updateButton.onClick = function()
    {
        DuScriptUI.checkUpdate(undefined, undefined, true);
    }

    // == Bottom Line
    var bottomUberGroup = mainGroupMarginBottom;
    // TODO Test in Ae
    /*var bottomUberGroup = DuScriptUI.group(panel.content, 'column');
    bottomUberGroup.alignment = ['fill', 'bottom'];
    bottomUberGroup.margins = 0;
    bottomUberGroup.spacing = 0;*/

    // Add a progress bar
    panel.progressBar = new DuProgressBar("", bottomUberGroup);

    // Draw a thin line like other panels.
    //var bottomLine = DuScriptUI.separator( bottomUberGroup );
    if ( DuESF.rxVersionURL != '' ) {
        DuScriptUI.fundingBar = bottomUberGroup.add( 'progressbar' );
        DuScriptUI.fundingBar.maximumSize = [32000, 2];
        DuScriptUI.fundingBar.alignment = ['fill', 'top'];
        DuScriptUI.fundingBar.helpTip = i18n._("Thank you for your donations!");
        DuScriptUI.updateFundingInfo();
    }

    panel.bottomGroup = DuScriptUI.group(bottomUberGroup, 'row');
    panel.bottomGroup.margins = 0;

    /*if (DuESF.bugReportURL != '' || addSettingsButton || addHelpButton || DuESF.translateURL != '')
    {
        panel.moreButton = DuScriptUI.multiButton( panel.bottomGroup,
            {
                text: "",
                helpTip: i18n._("Help and options")
            }
        );
        panel.moreButton.alignment = ['left', 'center'];

        if (DuESF.bugReportURL != '')
        {
            var bugButton = DuScriptUI.addBugButton( panel.moreButton );
            bugButton.alignment = ['left', 'fill'];
        }
        
        if (addSettingsButton)
        {
            var settingsButton = panel.moreButton.addButton(
                i18n._("Edit settings"),
                w12_settings,
                i18n._("Edit settings")
                );
            settingsButton.alignment = ['left', 'fill'];

            settingsButton.onClick = function()
            {
                if (!rootSettingsGroup.visible)
                {
                    if(panel.hasCommonSettings) panel.settingsGroup.reset();
                    panel.mainGroup.visible = false;
                    rootSettingsGroup.visible = true;
                }
                else
                {
                    panel.mainGroup.visible = true;
                    rootSettingsGroup.visible = false;
                }
            }

            settingsTitle.onClose = function()
            {
                if( panel.hasCommonSettings ) panel.settingsGroup.reset();
                panel.mainGroup.visible = true;
                rootSettingsGroup.visible = false;
            }           
        }

        if (DuESF.translateURL != '')
        {
            var translateButton = DuScriptUI.addTranslateButton( panel.moreButton );
            translateButton.alignment = ['left', 'fill'];
        }

        if (addHelpButton)
        {
            var helpButton = DuScriptUI.addHelpButton( panel.moreButton, false );
            helpButton.alignment = ['left', 'fill'];
        }
    }*/

    if (addSettingsButton) {
        var settingsButton =  DuScriptUI.button( panel.bottomGroup, {
            text: '',
            image: w12_settings,
            helpTip: i18n._("Edit settings")
        });
        settingsButton.alignment = ['left', 'fill'];

        settingsButton.onClick = function()
        {
            if (!rootSettingsGroup.visible)
            {
                if(panel.hasCommonSettings) panel.settingsGroup.reset();
                panel.mainGroup.visible = false;
                rootSettingsGroup.visible = true;
            }
            else
            {
                panel.mainGroup.visible = true;
                rootSettingsGroup.visible = false;
            }
        }

        settingsTitle.onClose = function()
        {
            if( panel.hasCommonSettings ) panel.settingsGroup.reset();
            panel.mainGroup.visible = true;
            rootSettingsGroup.visible = false;
        }           
    }

    if (DuESF.translateURL != '')
    {
        var translateButton = DuScriptUI.addTranslateButton( panel.bottomGroup );
        translateButton.alignment = ['left', 'fill'];
    }

    if (DuESF.bugReportURL != '')
    {
        var bugButton = DuScriptUI.addBugButton( panel.bottomGroup );
        bugButton.alignment = ['left', 'fill'];
    }

    if (addHelpButton)
    {
        var helpButton = DuScriptUI.addHelpButton( panel.bottomGroup, false );
        helpButton.alignment = ['left', 'fill'];
    }

    var donateButton = DuScriptUI.addDonateButton( panel.bottomGroup, true);
    donateButton.alignment = ['left', 'fill'];

    var versionButton = DuScriptUI.versionButton(
        panel.bottomGroup
        );
    versionButton.alignment = ['right', 'bottom'];
    
    //Refresh button
    if ( DuESF.debug && (scriptFile instanceof File) && scriptFile.exists )
    {
        var refreshButton = panel.bottomGroup.add( 'button', undefined, 'R' );
        refreshButton.alignment = [ 'right', 'bottom' ];
        refreshButton.maximumSize = [ 20, 20 ];
        refreshButton.onClick = function()
        {
            DuScriptUI.refreshPanel( panel, scriptFile );
        };
    }

    return panel;
}

DuScriptUI.refreshPanel = function( panel, scriptFile )
{
    return DuScriptUI.refreshWindow( panel, scriptFile );
}

DuScriptUI.refreshWindow = function ( win, scriptFile )
{
    // If Panel is a window, close, and run script again
    if( win instanceof Window && scriptFile.exists)
    {
        win.close();
        $.evalFile( scriptFile );
        return true;
    }
    return false;
}

/**
 * Creates a popup to ask for a simple string
 * @param {string} title The title of the popup
 * @param {string} defaultString The placeholder for the edit text
 * @returns {DuPopup} The popup, with an <code>onAccept( str )</code> callback.
 */
DuScriptUI.stringPrompt = function ( title, defaultString )
{
    defaultString = def(defaultString, '');

    var nameEditor = DuScriptUI.popUp( title );
    nameEditor.content.alignment = ['fill','top'];
    
    nameEditor.editText = DuScriptUI.editText(
        nameEditor.content,
        '',
        '',
        '',
        defaultString
    )
    nameEditor.editText.alignment = ['fill','top'];

    var nameButtons = DuScriptUI.group( nameEditor.content );
    nameButtons.alignment = ['fill','top'];

    var nameOKButton = DuScriptUI.button(
        nameButtons,
        i18n._("OK"),
        DuScriptUI.Icon.CHECK,
        title,
        false,
        'row',
        'center'
    )

    nameEditor.previousString = '';

    nameEditor.onAccept = function( str ){};

    nameEditor.accept = function() {
        nameEditor.onAccept( nameEditor.editText.text );
        nameEditor.hidePopup();
        return nameEditor.editText.text;
    }

    nameEditor.setText = function (text) {
        nameEditor.previousString = text;
        nameEditor.editText.setText(text);
    }

    nameEditor.edit = function() {
        nameEditor.editText.clicked();
    }

    nameOKButton.onClick = nameEditor.accept;
    nameEditor.addEventListener('enterkey', nameEditor.accept );

    return nameEditor;
}

/**
 * Finds the window containing this ScriptUI Control
 * @param {Control} scriptUIControl The ScriptUI Control
 * @return {Window} The containing ScriptUI Window
 */
DuScriptUI.parentWindow = function ( scriptUIControl )
{
    var p = scriptUIControl;
    while(p.parent) p = p.parent;
    return p;
}