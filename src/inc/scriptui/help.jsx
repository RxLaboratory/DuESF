/**
 * Creates a button displaying the version of the script and redirecting to the about url.
 * @param {Panel|Window|Group} container - The ScriptUI Object which will contain and display the button.
 * @param {string|DuBinary} [image=DuESF.scriptIcon] - The path to the icon or a png binstring. Default: empty string
 * @return {DuButton} The version button created.
 */
DuScriptUI.versionButton = function( container, image )
{
    image = def(image, DuESF.scriptIcon);

    var button = DuScriptUI.button(
        container,
        'v' + DuESF.scriptVersion.fullVersion,
        image,
        DuESF.companyName + '\n' + DuESF.scriptName + ' v' + DuESF.scriptVersion.fullVersion,
        false,
        undefined,
        undefined,
        false
    )

    //button.bgColor = DuColor.Color.TRANSPARENT;
    button.dim();

    if (DuESF.aboutURL != '') button.onClick = function() {
        DuSystem.openURL(DuESF.aboutURL);
    };

    return button;
}

/**
 * Creates a button opening the bug report url.
 * @param {Panel|Window|Group} container - The ScriptUI Object which will contain and display the button.
 * @param {bool} [showLabel=false] - When true, the button includes a "Bug Report" label.
 * @return {DuButton} The bug button created.
 */
DuScriptUI.addBugButton = function( container, showLabel )
{
    showLabel = def(showLabel, false);

    var label = i18n._("Bug Report or Feature Request");
    var helpTip = i18n._("Bug report\nFeature request\n\nTell us what's wrong or request a new feature.");

    var button;

    if (container.addButton) 
    {
        button = container.addButton(
            label,
            w12_bugreport,
            helpTip
        );
    }
    else 
    {
        button = DuScriptUI.button(
            container,
            showLabel ? label : "",
            w12_bugreport,
            helpTip
            );
    }

    button.onClick = function ()
    {
        DuSystem.openURL( DuESF.bugReportURL );
    }
    button.onAltClick = function ()
    {
        DuSystem.openURL( 'http://bat-ultra-bunny.tumblr.com' );
    }
    return button;
}

/**
 * Creates a button opening the help panel.
 * @param {Panel|Window|Group} container - The ScriptUI Object which will contain and display the button.
 * @param {bool} [showLabel=false] - When true, the button includes a "Help" label.
 * @return {DuButton} The help button created.
 */
DuScriptUI.addHelpButton = function( container, showLabel )
{
    showLabel = def(showLabel, false);

    var label = i18n._("Help");
    var helpTip = i18n._("Get help.");

    var button;

    if (container.addButton) 
    {
        button = container.addButton(
            label,
            w12_help,
            helpTip
        );
    }
    else 
    {
        button = DuScriptUI.button(
            container,
            showLabel ? label : "",
            w12_help,
            helpTip
            );
    }

    button.onClick = function ()
    {
        DuSystem.openURL( DuESF.docURL );
    }
    button.onAltClick = function ()
    {
        DuSystem.openURL( 'http://bat-ultra-bunny.tumblr.com' );
    }

    return button;
}

/**
 * Creates a button opening the help panel.
 * @param {Panel|Window|Group} container - The ScriptUI Object which will contain and display the button.
 * @param {bool} [showLabel=false] - When true, the button includes a "Help" label.
 * @return {DuButton} The help button created.
 */
DuScriptUI.addTranslateButton = function( container, showLabel )
{
    showLabel = def(showLabel, false);

    var label = i18n._("Translate %1", DuESF.scriptName);
    var helpTip = i18n._("Help translating %1 to make it available to more people.", DuESF.scriptName);

    var button;

    if (container.addButton) 
    {
        button = container.addButton(
            label,
            w12_language,
            helpTip
        );
    }
    else 
    {
        button = DuScriptUI.button(
            container,
            showLabel ? label : "",
            w12_language,
            helpTip
            );
    }

    button.onClick = function ()
    {
        DuSystem.openURL( DuESF.translateURL );
    }
    button.onAltClick = function ()
    {
        DuSystem.openURL( 'http://bat-ultra-bunny.tumblr.com' );
    }

    return button;
}

/**
 * Creates a button opening the link for like/follow/donation
 * @param {Panel|Window|Group} container - The ScriptUI Object which will contain and display the button.
 * @param {bool} [showLabel=false] - When true, the button includes a <code>"I ♥ " + DuESF.scriptName</code> label.
 * @return {DuButton} The like button created.
 */
DuScriptUI.addDonateButton = function ( container, showLabel )
{
    showLabel = def(showLabel, false);

    var defaultLabel = "I \u2665 " + DuESF.scriptName;

    var button = DuScriptUI.button(
        container,
        {
            text: showLabel ? defaultLabel : "",
            image: w12_heart,
            helpTip: defaultLabel,
            small: true
        }
    );

    DuScriptUI.fundingLabel = button.label;

    button.onClick = function ()
    {
        DuSystem.openURL( DuESF.donateURL );
    }
    button.onAltClick = function ()
    {
        DuSystem.openURL( 'http://patreon.com/duduf' );
    }

    DuScriptUI.updateFundingInfo();

    return button;
}

/**
 * Displays a prompt to select the language of the script.<br />
 * Won't do nothing if the script already has a language set in the settings.<br />
 * Use this method before launching the script. 
 * @param {function} callback - The function to execute when the user has chosen the language.<br />
 * This function should be the one which loads the script.
 * @param {Panel|Window} [ui]	- A container to display the UI. A modal Dialog is created if omitted
 */
DuScriptUI.askLanguage = function ( callback, ui )
{
    if (! (ui instanceof Panel || ui instanceof Window) )
    {
        ui = new Window('dialog', "Language")
    }

    var currentLanguageName = DuESF.scriptSettings.get("common/currentLanguageName", '');
    var currentLocale = DuESF.scriptSettings.get("common/language", '');

    var languages = i18n.getAvailableLanguages();

    if (currentLocale != '' || languages.count == 0)
    {
        callback()
        return;
    }

    var ui_languageGroup = DuScriptUI.group( ui, 'column' );

    ui_languageGroup.add('statictext', undefined, "EO: Selektu la lingvo kiu vi volas uzi per tio softvaro.", { multiline: true } );
    ui_languageGroup.add('statictext', undefined, "EN: Select the language you wish to use with this software.", { multiline: true } );

    var currentIndex = 0;
    var languageSelector = DuScriptUI.selector( ui_languageGroup, "Set the language of the interface." );
    var i = 0;
    for (var locale in languages)
    {
        if (locale == "count") continue;
        languageSelector.addButton( {
            text: languages[locale],
            image: w16_language,
            data: locale
        });
        if (locale == 'eo') currentIndex = i;
        i++;
    }

    languageSelector.setCurrentIndex( currentIndex );

    var okButton = DuScriptUI.button( ui_languageGroup, {
        text: "Apply",
        image: w12_check,
        helpTip: "Apply changes to the settings.",
        alignment: 'center'
    });

    okButton.onClick = function()
    {
        // Save settings
        DuESF.scriptSettings.set("common/language", languageSelector.currentData );
        DuESF.scriptSettings.set("common/currentLanguageName", languageSelector.text);
        i18n.setLocale( languageSelector.currentData, true );

        DuESF.scriptSettings.save();

        // Delete
        ui.remove( ui_languageGroup );

        callback();
    }

    DuScriptUI.showUI( ui, false );
    DuScriptUI.uiShown = false;
}

/**
 * Checks if the script can be updated
 * @param {function} [callback] - The function to execute when the user has clicked on the "dismiss" button.
 * @param {Panel|Window} [ui]	- A container to display the UI. A modal Dialog is created if omitted
 * @param {Boolean} [showAlert] Whether to show an alert if the check failed or if the version is up-to-date.
 */
DuScriptUI.checkUpdate = function ( callback, ui, showAlert )
{
    var noCallback = false;
    if (!isdef( callback ))
    {
        callback = function(){};
        var noCallback = true;
    }
    showAlert = def(showAlert, false);
    //if (DuESF.debug) showAlert = true;

    //Just once a day
    var latestUpdateCheck = DuESF.scriptSettings.get("common/latestUpdateCheck", 0);
    var now = Date.now();
    // 24h
    if (now - latestUpdateCheck < 86400000 && !showAlert && !DuESF.debug) {
        // Just update funding info
        DuScriptUI.updateFundingInfo();
        return callback();
    }
    DuESF.scriptSettings.set("common/latestUpdateCheck", now);
    DuESF.scriptSettings.save();

    if ( DuESF.rxVersionURL == '' ) return callback();

    // Get the version & info from the server
    var update = DuVersion.checkUpdate();

    // Compare
    if (!update)
    {
        if (noCallback) return;
        return callback();
    }
    if (!update.success)
    {
        if (showAlert) alert("Sorry, something failed...\n\n" + update.message);
        if (noCallback) return;
        return callback();
    }

    // Update funding info
    if (update.monthlyFund && update.fundingGoal) {
        DuScriptUI.updateFundingInfo(update.monthlyFund, update.fundingGoal);
    }

    if (!update.update)
    {
        if (showAlert) alert("This version is up-to-date, congratulations!");
        if (noCallback) return;
        return callback();
    }

    // Show window if update
    var reuseUI = true;
    if (! (ui instanceof Panel || ui instanceof Window) )
    {
        reuseUI = false;
        ui = new Window('dialog',i18n._("New version"),undefined,
        {
            resizeable: true
        } );
    }

    var ui_updateGroup = DuScriptUI.group( ui, 'column' );
    ui_updateGroup.alignment = ['fill', 'fill'];

    var titleGroup = DuScriptUI.group( ui_updateGroup );
    titleGroup.alignment = ['fill', 'top'];
    DuScriptUI.setBackgroundColor( titleGroup, DuColor.Color.APP_BACKGROUND_COLOR.push() );

    DuScriptUI.staticText(
        titleGroup,
        DuString.args( "New {#}!", [ DuESF.scriptName ] ),
        DuColor.Color.APP_TEXT_COLOR.pull(150)
        ).alignment = ['center','top'];

    var newVersionGroup = DuScriptUI.group( ui_updateGroup );
    newVersionGroup.alignment = ['fill', 'top'];
    newVersionGroup.margins = 2;

    DuScriptUI.staticText(
        newVersionGroup,
        "New version" + ": "
        );

    DuScriptUI.staticText(
        newVersionGroup,
        update.version,
        DuColor.Color.APP_TEXT_COLOR.pull(130)
        );

    var descriptionGroup = DuScriptUI.group( ui_updateGroup );
    descriptionGroup.margins = 2;
    descriptionGroup.alignment = ['fill','fill'];
    //DuScriptUI.setBackgroundColor( descriptionGroup, DuColor.Color.OBSIDIAN );

    var descriptionText = descriptionGroup.add("edittext", undefined, update.description, {multiline:true});
    descriptionText.alignment = ['fill','fill'];
    descriptionText.minimumSize = [-1,100];
    DuScriptUI.setBackgroundColor( descriptionText, DuColor.Color.APP_BACKGROUND_COLOR.push() );

    DuScriptUI.staticText(
        ui_updateGroup,
        "Current version: " + DuESF.scriptVersion.fullVersion,
        DuColor.Color.APP_TEXT_COLOR.push(160)
        ).alignment = ['fill', 'bottom'];

    if (update.downloadURL)
    {
        var downloadButton = DuScriptUI.button(
            ui_updateGroup,
            "Download",
            DuScriptUI.Icon.DOWNLOAD,
            "Download the new version now."
        );
        downloadButton.alignment = ['fill','bottom'];

        downloadButton.onClick = function() {
            DuSystem.openURL( update.downloadURL );
        };
    }
    
    if (update.changelogURL)
    {
        var changelogButton = DuScriptUI.button(
            ui_updateGroup,
            "Changelog",
            DuScriptUI.Icon.LIST,
            "Read all the details about what's changed."
        );
        changelogButton.alignment = ['fill','bottom'];

        changelogButton.onClick = function() {
            DuSystem.openURL( update.changelogURL );
        };
    }

    if (update.donateURL)
    {
        var donateButton = DuScriptUI.button(
            ui_updateGroup,
            "I \u2665 " + DuESF.scriptName,
            DuScriptUI.Icon.HEART,
            "We need you!\nMake a donation to help us continue to release and update free software."
        );
        donateButton.alignment = ['fill','bottom'];

        donateButton.onClick = function()
        {
            DuSystem.openURL( update.donateURL );
        };
        donateButton.onAltClick = function ()
        {
            DuSystem.openURL( 'http://patreon.com/duduf' );
        }
    }

    var validButton = DuScriptUI.button(
        ui_updateGroup,
        noCallback ? "Close" : DuString.args("Update later"),
        noCallback ? DuScriptUI.Icon.CLOSE : DuScriptUI.Icon.NEXT,
        noCallback ? "Close" : DuString.args("Continue to {#}", [DuESF.scriptName])
    );
    validButton.onClick = function()
    {
        // Delete or hide ui
        if (reuseUI) ui.remove( ui_updateGroup );
        else ui.close();
        
        if (!noCallback) callback();

    }
    
    DuScriptUI.showUI( ui, false );
    DuScriptUI.uiShown = false;
}

DuScriptUI.updateFundingInfo = function (fund, goal) {
   
    fund = def(fund, DuESF.scriptSettings.get("funding/monthlyFund", 0));
    goal = def(goal, DuESF.scriptSettings.get("funding/fundingGoal", 4000));

    if (fund) {
        fund = parseFloat(fund);
        DuESF.scriptSettings.set("funding/monthlyFund", fund);
    }
    if (goal) {
        goal = parseFloat(goal);
        DuESF.scriptSettings.set("funding/fundingGoal", goal);
    }

    DuESF.scriptSettings.save();

    if (!fund || !goal && DuScriptUI.fundingBar) {
        DuScriptUI.fundingBar.value = 0;
        DuScriptUI.fundingBar.helpTip = i18n._("Thank you for your donations!");
        return;
    }

    var ratio = Math.round( fund / goal * 100);
    var helpTip = i18n._("Thank you for your donations!") + '\n\n' + 
            i18n._( "This month, the %1 fund is $%2.\nThat's %3% of our monthly goal ( $%4 )\n\nClick on this button to join the development fund!", DuESF.companyName, fund, ratio, goal );

    if (DuScriptUI.fundingBar) {
        DuScriptUI.fundingBar.value = ratio;
        fund = Math.round( fund );
        DuScriptUI.fundingBar.helpTip = helpTip
    }
    if (DuScriptUI.fundingLabel) {
        DuScriptUI.fundingLabel.helpTip = helpTip;
        DuScriptUI.fundingLabel.text = ratio + '%';
    }
    
}