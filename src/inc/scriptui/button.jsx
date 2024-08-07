/**
 * @class
 * @name DuButton
 * @classdesc For use with {@link DuScriptUI}.<br />
 * An Image Button.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.button} to create an Image Button.<br />
 * The Image Button inherits the <code>Group</code> object from ScriptUI and has all of its properties and methods.
 * @property {string} helpLink - A URL to a help page, shown on shift click on the button.
 * @property {Image} image - The scriptui object representing the image.
 * @property {StaticText} label - The label
 * @property {DuPopup} optionsPopup - A popup for .
 * @property {Group} optionsPanel - The ScriptUI Group where to add the options (child of the popup).
 * @property {DuButton~onClick} onClick - The function to execute when the button is clicked
 * @property {DuButton~onAltClick} onAltClick - The function to execute when the button is Alt + clicked
 * @property {DuButton~onCtrlClick} onCtrlClick - The function to execute when the button is Ctrl + clicked
 * @property {DuButton~onCtrlAltClick} onCtrlAltClick - The function to execute when the button is Ctrl + Alt + clicked
 * @property {DuButton~onOptions} onOptions - The function to execute when the options are called (Shift+CLick or click on the options button)
 * @category DuScriptUI
 */

/**
 * The function to execute when the button is clicked.
 * @callback DuButton~onClick
 * @memberof DuButton
 */

/**
 * The function to execute when the button is Alt + clicked.
 * @callback DuButton~onAltClick
 * @memberof DuButton
 */

/**
 * The function to execute when the button is Ctrl + clicked.
 * @callback DuButton~onCtrlClick
 * @memberof DuButton
 */

/**
 * The function to execute when the button is Ctrl + Alt + clicked.
 * @callback DuButton~onCtrlAltClick
 * @memberof DuButton
 */

/**
 * The function to execute when the options are called (Shift+CLick or click on the options button).<br/>
 * Use the <code>showUI</code> parameter to build the options when the button is clicked without showing any UI.
 * @callback DuButton~onOptions
 * @param {Boolean} showUI This is set to false when the button is clicked: use this parameter to build the options without showing any UI when needed on all button clicks.
 * @memberof DuButton
 */

/**
 * Changes the background color of the button.
 * @method
 * @memberof DuButton
 * @name setBackgroundColor
 * @param {DuColor} color - the color.
 */

/**
 * Changes the text color of the button.
 * @method
 * @memberof DuButton
 * @name setTextColor
 * @param {DuColor} color - the color.
 */

/**
 * Changes the image of the button.
 * @method
 * @memberof DuButton
 * @name setImage
 * @param {File|DuBInary} image - the image. Changing the image does not work with PNG as strings, a File must be passed.
 */

/**
 * Changes the helptip of the button.
 * @method
 * @memberof DuButton
 * @name setHelpTip
 * @param {string} helptip - the helptip.
 */

/**
 * Changes the text of the button.
 * @method
 * @memberof DuButton
 * @name setText
 * @param {string} text - the text.
 */

/**
 * Creates a button with an optionnal icon. Must have at least an icon or a text, or both.
 * @param {Panel|Window|Group}		container	- The ScriptUI Object which will contain and display the button.
 * @param {string}					[text]		- The label of the button. Default: empty string
 * @param {string|DuBInary}			[image]		- The path to the icon (or a PNG as a string representation). Default: empty string
 * @param {string}					[helpTip]		- The helptip. Default: empty string
 * @param {Boolean}					[addOptionsPanel=false]	- Adds a panel for options and a button to access it.
 * @param {Boolean}					[orientation='row']	- The orientation of the button (icon, text, options button). Default will be changed to 'column' if there's no text.
 * @param {Boolean}					[alignment='left']	- The alignment of the button content ('center', 'right' or 'left' for 'row', 'top' 'bottom', 'center' for column).
 * @param {Boolean}					[localize=true]	- Set to false if the text must not be translated.
 * @param {Boolean}					[ignoreUIMode=false]	- Will show texte even if the ui mode is set to > 1 in the script settings
 * @param {Boolean}					[optionsWithoutButton=false]	- Don't add an "ok" button to the options popup
 * @param {string}					[optionsButtonText]	- Change the displayed text of the bottom button of the options
 * @param {Boolean}					[optionsWithoutPanel=false]	- Don't create the options popup panel (use <code>DuButton.onOptions</code> to add your own callback when the options are requested)
 * @return {DuButton}			The image button created.
 */
DuScriptUI.button = function(container, text, image, helpTip, addOptionsPanel, orientation, alignment, ignoreUIMode, optionsWithoutButton, optionsButtonText, optionsWithoutPanel) {
    if (!isdef( container )) {
        throw 'DuScriptUI: DuScriptUI.button(container, text, image, helpTip, imageOver):\nMissing argument: container.';
    }

    if (jstype(container) != 'group' && jstype(container) != 'panel' && jstype(container) != 'window') {
        throw 'DuScriptUI: DuScriptUI.button(container, text, image, helpTip):\nTypeError.\n\ncontainer has to be a Group/Panel/Window.\n\ncontainer is ' + jstype(container) + ' with value ' + container.toString();
    }

    var options = {};
    text = def(text, '');

    if (jstype(text) != 'string') options = text;
    options.text = def(options.text, text);

    image = def(image, '');
    helpTip = def(helpTip, '');
    addOptionsPanel = def(addOptionsPanel, false);
    orientation = def(orientation, 'row');
    localize = def(localize, true);
    ignoreUIMode = def(ignoreUIMode, false);
    optionsWithoutButton = def(optionsWithoutButton, false);
    optionsWithoutPanel = def(optionsWithoutPanel, false);
    optionsButtonText = def(optionsButtonText, options.text);
    
    options.image = def(options.image, image);
    options.helpTip = def(options.helpTip, helpTip);
    options.options = def(options.options, addOptionsPanel);
    options.orientation = def(options.orientation, orientation);
    options.ignoreUIMode = def(options.ignoreUIMode, ignoreUIMode);
    options.optionsWithoutButton = def(options.optionsWithoutButton, optionsWithoutButton);
    options.optionsButtonText = def(options.optionsButtonText, optionsButtonText);
    options.optionsWithoutPanel = def(options.optionsWithoutPanel, optionsWithoutPanel);
    options.small = def(options.small, false);
    
    var uiMode = DuESF.scriptSettings.get("common/uiMode", 0);
    if (uiMode >= 2 && options.image != '' && !options.ignoreUIMode) options.text = '';

    if (!isdef( alignment )) {
        if (options.orientation == 'row' && options.text != '') alignment = 'left';
        else if (options.orientation == 'row') alignment = 'center';
        else alignment = 'top';
    }
    options.alignment = def(options.alignment, alignment);

    if (options.options) {
        if (options.helpTip != '') options.helpTip += '\n\n';
        options.helpTip += i18n._("[Shift]: More options...");
    }  

    if (options.image == '' && options.text == '') options.text = 'button';

    var duButton = container.add('group');
    duButton.orientation = options.orientation;
    duButton.alignment = ['fill', 'top'];
    duButton.spacing = 0;
    duButton.bgColor = DuColor.Color.TRANSPARENT;
    if (DuESF.host == DuESF.HostApplication.PHOTOSHOP) duButton.bgColor = DuColor.Color.APP_BACKGROUND_COLOR;
    duButton.textColor = DuColor.Color.APP_TEXT_COLOR;

    duButton.onClick = function() {};
    duButton.onAltClick = function() {};
    duButton.onCtrlAltClick = function() {};
    duButton.onCtrlClick = function() {};
    duButton.onShiftClick = function() {};
    duButton.onOptions = function() {};

    // Location of the latest event
    duButton.screenX = 0;
    duButton.screenY = 0;

    // Options panel
    if (options.options) {

        if (!options.optionsWithoutPanel) {
            // Create panel
            var optionsPanel = DuScriptUI.popUp(options.text == '' ? i18n._('Options') : options.text);
            duButton.optionsPopup = optionsPanel;
            duButton.optionsPanel = DuScriptUI.group(optionsPanel.content, 'column');

            if (!options.optionsWithoutButton) {
                DuScriptUI.separator(optionsPanel.content);

                duButton.optionsButton = DuScriptUI.button( optionsPanel.content, {
                    text: options.optionsButtonText,
                    image: w12_check,
                    helpTip: options.helpTip
                });

                duButton.optionsButton.onClick = function() {
                    duButton.clicked();
                };
                duButton.optionsButton.onAltClick = function() {
                    duButton.altClicked();
                };
                duButton.optionsButton.onCtrlClick = function() {
                    duButton.ctrlClicked();
                };
                duButton.optionsButton.onCtrlAltClick = function() {
                    duButton.ctrlAltClicked();
                };
            }

            optionsPanel.tieTo(duButton, true);
        }

        // Add button
        if (options.text != '' && options.orientation != 'column') {
            var optionsButton = DuScriptUI.button(
                duButton,
                '',
                w12_options,
                options.text + '\n' + i18n._('Options')
            )
            optionsButton.alignment = ['left', 'center'];

            if (!options.optionsWithoutPanel) optionsPanel.tieTo(optionsButton);

            optionsButton.onClick = function () { duButton.onOptions(true); };
        }
    }

    var mainGroup = DuScriptUI.group(duButton, options.orientation);
    mainGroup.alignment = ['fill', 'fill'];
    mainGroup.margins = 0;

    //Add fillers to be able to click anywhere on the button
    if (options.text != '' && options.orientation == 'row') {
        duButton.fillerL = mainGroup.add('statictext', undefined, " ");
        duButton.fillerL.alignment = ['left', 'fill'];
        if (options.alignment == 'left' && !options.options && !options.small) duButton.fillerL.size = [18, -1];
        else if (options.alignment == 'left') duButton.fillerL.size = [2, -1];
    }

    // Add options.image
    if (options.image != '') {
        duButton.imageGroup = mainGroup.add('group');
        duButton.imageGroup.margins = 0;
        duButton.imageGroup.spacing = 0;
        duButton.imageGroup.alignment = ['fill', 'fill'];
        var subgroup = duButton.imageGroup.add('group');
        subgroup.margins = 2;
        subgroup.spacing = 0;
        subgroup.alignment = ['fill', 'fill'];
        if (options.image instanceof DuBinary) options.image = options.image.binAsString;
        duButton.image = subgroup.add('image', undefined, options.image);
        if (options.orientation == 'row') duButton.imageGroup.alignment = [options.alignment, 'center'];
        else duButton.imageGroup.alignment = ['center', options.alignment];
        // Bigger buttons on photoshop
        if (DuESF.host == DuESF.HostApplication.PHOTOSHOP) duButton.imageGroup.margins = 3;
        duButton.image.helpTip = options.helpTip;
    }

    // Another filler
    if (options.text != '' && options.image != '' && options.orientation == 'row') {
        duButton.fillerM = mainGroup.add('statictext', undefined, " ");
        duButton.fillerM.alignment = ['left', 'fill'];
        if (options.small) duButton.fillerM.size = [2, -1];
        else duButton.fillerM.size = [8, -1];
    }

    // Add text
    if (options.text != '') {
        duButton.label = mainGroup.add('statictext', undefined, options.text);
        duButton.label.helpTip = options.helpTip;
        if (options.orientation == 'row' && !options.small) duButton.label.alignment = [options.alignment, 'center'];
        else if (options.orientation == 'row') duButton.label.alignment = [options.alignment, 'bottom'];
        else duButton.label.alignment = ['center', options.alignment];
    }

    // Another filler
    if (options.text != '' && options.orientation == 'row') {
        duButton.fillerR = mainGroup.add('statictext', undefined, " ");
        duButton.fillerR.alignment = ['fill', 'fill'];
        if (options.alignment == 'right') duButton.fillerR.size = [10, -1];
    }

    //events
    duButton.clicked = function() {
        if (options.options) {
            if (!options.optionsWithoutPanel && !duButton.optionsPopup.built) {
                duButton.optionsPopup.build();
                duButton.optionsPopup.built = true;
            }
            duButton.onOptions(false);
        }
        DuDebug.safeRun(duButton.onClick);
    }

    duButton.shiftClicked = function() {
        if (options.options) {
            if (!options.optionsWithoutPanel && !duButton.optionsPopup.built) {
                duButton.optionsPopup.build();
                duButton.optionsPopup.built = true;
            }
            duButton.onOptions(true);
        }
        DuDebug.safeRun(duButton.onShiftClick);
    }

    duButton.altClicked = function() {
        if (options.options) {
            if (!options.optionsWithoutPanel && !duButton.optionsPopup.built) {
                duButton.optionsPopup.build();
                duButton.optionsPopup.built = true;
            }
            duButton.onOptions(false);
        }
        DuDebug.safeRun(duButton.onAltClick);
    }

    duButton.ctrlAltClicked = function() {
        if (options.options) {
            if (!options.optionsWithoutPanel && !duButton.optionsPopup.built) {
                duButton.optionsPopup.build();
                duButton.optionsPopup.built = true;
            }
            duButton.onOptions(false);
        }
        DuDebug.safeRun(duButton.onCtrlAltClick);
    }

    duButton.ctrlClicked = function() {
        if (options.options) {
            if (!options.optionsWithoutPanel && !duButton.optionsPopup.built) {
                duButton.optionsPopup.build();
                duButton.optionsPopup.built = true;
            }
            duButton.onOptions(false);
        }
        DuDebug.safeRun(duButton.onCtrlClick);
    }

    duButton.highlight = function(e) {
        e.stopPropagation();
        DuScriptUI.dimControls();

        if (duButton.label && !options.small) {
            DuScriptUI.setTextColor(duButton.label, DuColor.Color.APP_HIGHLIGHT_COLOR);
        }
        else {
            DuScriptUI.setBackgroundColor(mainGroup, DuColor.Color.APP_HIGHLIGHT_COLOR.push());
        }
        
        DuScriptUI.highlightedControls.push(duButton);
    }

    duButton.dim = function() {
        DuScriptUI.setBackgroundColor(mainGroup, duButton.bgColor);
        if (duButton.label) DuScriptUI.setTextColor(duButton.label, duButton.textColor);
    }

    duButton.setBackgroundColor = function(color) {
        duButton.bgColor = color;
        duButton.dim();
    }

    duButton.setTextColor = function(color) {
        duButton.textColor = color;
        duButton.dim();
    }

    duButton.setImage = function(image) {
        if (options.image == '') return;
        if (image instanceof DuBinary) image = image.toFile();
        duButton.image.image = image;
    }

    duButton.setHelpTip = function(helpTip) {
        if (options.image != '') duButton.image.helpTip = helpTip;
        if (options.text != '') duButton.label.helpTip = helpTip;
    }

    duButton.setText = function(text) {
        if (options.text != '') duButton.label.text = text;
    }

    //add events
    function clickEvent(e) {
        // On After Effects, event is triggered multiple times...
        if (e.view.parent != mainGroup && DuESF.host == DuESF.HostApplication.AFTER_EFFECTS) return;

        duButton.screenX = e.screenX - e.clientX;
        duButton.screenY = e.screenY - e.clientY;

        var ctrl = false;
        if (DuSystem.win && e.ctrlKey) ctrl = true;
        if (DuSystem.mac && e.metaKey) ctrl = true;

        if (e.shiftKey) duButton.shiftClicked();
        else if (e.altKey && ctrl) duButton.ctrlAltClicked();
        else if (e.altKey) duButton.altClicked();
        else if (ctrl) duButton.ctrlClicked();
        else duButton.clicked();
    }

    mainGroup.addEventListener('click', clickEvent, true);

    mainGroup.addEventListener("mouseover", duButton.highlight);

    duButton.dim();

    return duButton;
}

/**
 * @class
 * @name DuSmallButton
 * @classdesc For use with {@link DuScriptUI}.<br />
 * An Small Button.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.smallbutton} to create a Small Button.<br />
 * The Small Button inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property {string} helpLink - A URL to a help page, shown on shift click on the button.
 * @property {StaticText} label - The label
 * @property {any} value - A user value stored in the button, which is passed to the onClick method
 * @property {DuSmallButton~onClick} onClick - The function to execute when the button is clicked
 * @category DuScriptUI
 */

/**
 * The function to execute when the button is clicked.<br />
 * The implementation of this function can take one parameter which is the used defined value of the button.
 * @callback DuSmallButton~onClick
 * @memberof DuSmallButton
 * @param {any} value - The used defined value of the button
 */

/**
 * Creates a small button.
 * @param {Panel|Window|Group}			container	- The ScriptUI Object which will contain and display the button.
 * @param {string}					text		- The label of the button. Default: empty string
 * @param {string}					[helpTip]		- The helptip. Default: empty string
 * @param {any}					[value]		- A user value stored in the button, which is passed to the onClick method
 * @return {DuButton}			The image button created.
 */
DuScriptUI.smallbutton = function(container, text, helpTip, value) {
    if (!isdef( helpTip )) helpTip = '';

    var smallButton = container.add('group');
    smallButton.orientation = 'row';
    smallButton.margins = 0;
    smallButton.alignment = ['fill', 'top'];
    smallButton.alignChildren = ['fill', 'fill'];
    smallButton.spacing = 0;

    smallButton.onClick = function( v ) {};
    smallButton.onAltClick = smallButton.onClick;
    smallButton.onCtrlAltClick = smallButton.onClick;
    smallButton.onCtrlClick = smallButton.onClick;
    smallButton.label = smallButton.add('statictext', undefined, text);
    smallButton.label.helpTip = helpTip;
    smallButton.label.justify = 'center';

    smallButton.value = value;
    smallButton.helpLink = '';

    //events
    smallButton.clicked = function() {
        smallButton.onClick( smallButton.value );
    }

    smallButton.shiftClicked = function() {
        if (duButton.helpLink != '') {
            DuSystem.openURL(smallButton.helpLink);
        }
    }

    smallButton.altClicked = function() {
        smallButton.onAltClick( smallButton.value );
    }

    smallButton.ctrlAltClicked = function() {
        smallButton.onCtrlAltClick( smallButton.value );
    }

    smallButton.ctrlClicked = function() {
        smallButton.onCtrlClick( smallButton.value );
    }

    smallButton.highlight = function(e) {
        e.stopPropagation();
        DuScriptUI.dimControls();

        if (smallButton.label) DuScriptUI.setTextColor(smallButton.label, DuColor.Color.VERY_DARK_GREY);
        DuScriptUI.setBackgroundColor(smallButton, DuColor.Color.APP_TEXT_COLOR.push());

        DuScriptUI.highlightedControls.push(smallButton);
    }

    smallButton.dim = function() {
        if (smallButton.label) DuScriptUI.setTextColor(smallButton.label, DuColor.Color.APP_TEXT_COLOR);
        DuScriptUI.setBackgroundColor(smallButton, DuColor.Color.TRANSPARENT);
    }

    //add events
    smallButton.addEventListener('click', function(e) {
        if (e.shiftKey) smallButton.shiftClicked();
        else if (e.altKey && e.ctrlKey) smallButton.ctrlAltClicked();
        else if (e.altKey) smallButton.altClicked();
        else if (e.ctrlKey) smallButton.ctrlClicked();
        else smallButton.clicked();
    }, true);


    smallButton.addEventListener("mouseover", smallButton.highlight);
    if (smallButton.label) smallButton.label.addEventListener("mouseover", smallButton.highlight);

    return smallButton;
}