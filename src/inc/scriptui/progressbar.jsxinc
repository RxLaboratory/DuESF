/**
    * Constructs a progress bar popup
    * @class DuProgressBar
    * @classdesc A simple progress bar.<br />
    * This was inspired by {@link https://github.com/indiscripts/extendscript/blob/master/scriptui/ProgressBar.jsx the progress bar}
    * by {@link  https://www.indiscripts.com/ Marc Autret / IndiScripts}.
    * @param {string} [title="Magic is happening"] The title of the progress bar
    * @param {Group} [container] A ScriptUI Group to add the progress bar. If not provided, the bar will be added in a new window popup
 * @category DuScriptUI
 */
DuProgressBar = function( title, container )
{
    title = def(title, i18n._("Magic is happening"));
    if (title == "") title = i18n._("Magic is happening");
    this.container = def(container, null );
    this.isPopup = !this.container;
    if (!this.isPopup) this.window = DuScriptUI.parentWindow(this.container);
    else this.window = null;

    this.built = false;
    this.coordinates = null;

    // Create ui
    this.__setupUI = function()
    {
        if (this.built) return;

        if (this.isPopup)
        {
            this.window = new Window('palette', '', [0,0,360,86]);
            this.container = this.window;
        }

        this.rootGroup = this.container.add('group');
        this.rootGroup.margins = 0;
        this.rootGroup.orientation = 'column';

        this.stage = this.rootGroup.add( 'statictext', this.isPopup ? { x:20, y:15, width:320, height:16 } : undefined, i18n._("Working"));

        this.barGroup = this.rootGroup.add('group', this.isPopup ? { x:20, y:37, width:320, height:12 } : undefined);
        this.barGroup.orientation = 'stacked';
        this.barGroup.margins = 0;
        this.bar = this.barGroup.add( 'progressbar', this.isPopup ? { x:0, y:0, width:320, height:12 } : undefined, 0, 0);
        this.image = this.barGroup.add( 'image', this.isPopup ? { x:0, y:0, width:320, height:12 } : undefined, DuScriptUI.Icon.PROGRESS.binAsString );
        
        this.label = this.rootGroup.add( 'statictext', this.isPopup ? { x:20, y:51, width:320, height:16 } : undefined);

        this.message =  title + ' %1';

        //if (this.isPopup) this.window.center();

        DuScriptUI.layout( this.container );

        this.built = true;
    }

    // Destroy ui
    this.__delete = function()
    {
        if (!this.built) return;
        // Remove controls
        this.rootGroup.remove( this.label );
        this.barGroup.remove( this.bar );
        this.barGroup.remove( this.image );
        this.rootGroup.remove( this.barGroup );
        this.rootGroup.remove( this.stage );
        this.container.remove( this.rootGroup );
        // Delete to (try to) free memory
        delete this.label;
        delete this.image;
        delete this.bar;
        delete this.barGroup;
        delete this.stage;
        delete this.rootGroup;
        if (this.isPopup)
        {
            delete this.container;
            delete this.window;
        }
        this.built = false;

        // Garbage collection
        $.gc();
    }

    // A private method to update with the message and the value
    this.__ = function()
    {
        var ok = this.bar.maxvalue != 0;
        if (ok) this.label.text = DuString.replace(this.message, '%1', this.bar.value + ' / ' + this.bar.maxvalue);
        else this.label.text = i18n._("Magic is happening") + '!';
        this.bar.visible = ok;
        this.image.visible = !ok;
        if (this.window.update) this.window.update();
    };
}

/**
 * Changes the text of the label
 * @param {string} message The text
 */
DuProgressBar.prototype.msg = function( message )
{
    this.__setupUI();
    if(isdef( message )) this.message = message;
    this.__();
}

/**
 * Changes the text of the current stage
 * @param {string} message The text
 */
DuProgressBar.prototype.stg = function( stage )
{
    this.__setupUI();
    this.stage.text = stage;
    this.msg();
}

/**
 * Shows the progress bar and updates the value and text
 * @param {string} [message=''] The text
 * @param {int[]} [eventCoordinates] - Provide the screen coordinates to center the progress bar on the corresponding screen.
 */
DuProgressBar.prototype.show = function( message, eventCoordinates )
{
    eventCoordinates = def(eventCoordinates, null);

    this.__setupUI();
    this.rootGroup.show();
    this.msg(message);  
    if (this.isPopup) {
        if (eventCoordinates) this.coordinates = DuScriptUI.centerInScreen( eventCoordinates, this.window.frameSize );

        if (this.coordinates) this.window.location = this.coordinates;
        else this.window.center();

        this.window.show();
    }
}

/**
 * Hides and resets the progress bar to 0 and default texts
 */
DuProgressBar.prototype.reset = function(  )
{
    this.hide();
    this.close();
    this.__delete();
}

/**
 * Updates and increments the progress bar
 * @param {int} [value] The new value. if omitted, the bar is just incremented by 1
 * @param {string} [message] A new label
 */
DuProgressBar.prototype.hit = function( value, message )
{
    this.__setupUI();
    value = def(value, 1);
    this.bar.value += value;
    this.msg(message);
}

/**
 * Sets the maximum value
 * @param {int} maxValue The new maximum value
 * @param {Boolean} [onlyIfZero=true] Set to false to change the max value even if it was not 0 before
 */
DuProgressBar.prototype.setMax = function( maxValue, onlyIfZero )
{
    this.__setupUI();
    onlyIfZero = def(onlyIfZero, true);
    if (onlyIfZero && this.bar.maxvalue != 0) return;
    this.bar.maxvalue = maxValue;
    this.msg();
}

/**
 * Increments the maximum value
 * @param {int} [maxValue=1] The value to add to the maximum
 */
DuProgressBar.prototype.addMax = function( maxValue )
{
    this.__setupUI();
    maxValue = def(maxValue, 1);
    this.setMax(this.bar.maxvalue + maxValue, false);
}

/**
 * Hides the progress bar
 */
DuProgressBar.prototype.hide = function( )
{
    if (!this.built) return;
    this.rootGroup.hide();
    this.__delete();
    if (!this.isPopup) DuScriptUI.layout( this.container );
}

/**
 * Closes the progress bar
 */
DuProgressBar.prototype.close = function( )
{
    if (!this.built) return;
    if (this.isPopup) this.window.close();
    this.hide();
}

DuProgressBar.init = function()
{
    /**
    * Show this progress bar before long operations with {@link DuProgressBar.show} and DuESF will update it.
    * @type {DuProgressBar}
    */
    DuScriptUI.progressBar = new DuProgressBar();
}
DuESF.initMethods.push( DuProgressBar.init );
