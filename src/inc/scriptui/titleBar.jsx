/**
 * @class
 * @name DuTitleBar
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A title bar.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.titleBar} to create  title bar.<br />
 * The itle bar inherits the <code>Group</code> object from ScriptUI and has all of its properties and methods.
 * @property {Boolean} pinned True when the title bar has been pinned and the corresponding panel should not be hidden.
 * @property {DuTitleBar~onClose} onClose - The function to execute when the close button is clicked
 * @property {DuTitleBar~onPin} onPin - The function to execute when the pin button is clicked
 * @category DuScriptUI
 */

/**
 * The function to execute when the close button is clicked
 * @callback DuTitleBar~onClose
 * @memberof DuTitleBar
 */

/**
 * The function to execute when the pin button is clicked
 * @callback DuTitleBar~onPin
 * @param {Boolean} pinned Wether the bar has been pin or not
 * @memberof DuTitleBar
 */

/**
 * Creates a titlebar
 * @param {Panel|Window|Group} container The ScriptUI Object which will contain and display the titlebar.
 * @param {string} [title=""] The title.
 * @param {Boolean} [closeButton=true] Wether to add a close button
 * @param {Boolean} [pinButton=true] Wether to add a pin button
 * @returns {DuTitleBar} The titlebar
 */
DuScriptUI.titleBar = function( container, title, closeButton, pinButton ) {
    // Defaults
    title = def(title, "");
    closeButton = def(closeButton, true);
    pinButton = def(pinButton, true);

    // Creates the title bar
    var titleBar = container.add( 'group' );
    titleBar.margins = 0;
    titleBar.spacing = 0;
    titleBar.orientation = 'row';
    titleBar.alignment = ['fill','top'];
    DuScriptUI.setBackgroundColor( titleBar, DuColor.Color.APP_BACKGROUND_COLOR.pull(130) );

    titleBar.onClose = function() {};
    titleBar.onPin = function(p) {};

    // Pin button
    if(pinButton) {
        titleBar.pinButton = DuScriptUI.checkBox(titleBar, '', w12_pin, i18n._("Keep this panel open"), '', w12_pinned);
        titleBar.pinButton.alignment = [ 'left', 'center' ];
        titleBar.pinButton.onClick = function() {
            titleBar.pinned = titleBar.pinButton.checked;
            titleBar.onPin(titleBar.pinned);
        };
    }

    // Title
    if (title != "") {
        titleBar.titleLabel = titleBar.add('statictext', undefined,  title);
        titleBar.titleLabel.alignment = [ 'center', 'center' ];
    }

    // Close
    if (closeButton) {
        titleBar.closeButton = DuScriptUI.button(titleBar, '', w12_close, 'Close');
        titleBar.closeButton.alignment = [ 'right', 'center' ];
        titleBar.closeButton.onClick = function() {
            titleBar.onClose();
        };
    }

    return titleBar;
}