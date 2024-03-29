
/**
 * @class
 * @name DuForm
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A Form.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.form} to create a Form.<br />
 * The DuForm inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property {Group} labels - The left vertical group
 * @property {Group} buttons - The right vertical group
 * @category DuScriptUI
 */

/**
 * Adds a field to the form
 * example: form.addField('Composition:','dropdownlist',['Composition1','Composition2'],'Select a composition')
 * @method
 * @memberof DuForm
 * @name addField
 * @param {string}			label		- The label text.
 * @param {string}			type		- The type of ScriptUI object to add (like 'button','edittext', etc.).
 * @param {object}			[value]		- The default value or content of the field added, depends on the type.
 * @param {string}			[helpTip]		- The helpTip of the form control.
 * @return {ScriptUI[]}		An array with at 0 the StaticText label, and at 1 the ScriptUI object of the type type, added to the form
 */

/**
 * Creates a layout to add forms to a UI, using ScriptUI groups.<br />
 * You can easily add controls/fields to this form using DuScriptUI.addField
 * @param {Window|Panel|Group}	container		- The ScriptUI Object which will contain and display the form.
 * @return {DuForm}		The custom Group containing the form.
 */
DuScriptUI.form = function( container )
{
    var mainGroup = container.add( 'group' );
    mainGroup.orientation = 'row';
    mainGroup.margins = 0;
    mainGroup.spacing = DuScriptUI.defaultSpacing;

    var labelsGroup = mainGroup.add( 'group' );
    labelsGroup.alignment = [ 'left', 'top' ];
    labelsGroup.orientation = 'column';
    labelsGroup.alignChildren = [ 'left', 'bottom' ];
    labelsGroup.spacing = DuScriptUI.defaultSpacing;

    var buttonsGroup = mainGroup.add( 'group' );
    buttonsGroup.alignment = [ 'fill', 'top' ];
    buttonsGroup.orientation = 'column';
    buttonsGroup.alignChildren = [ 'fill', 'fill' ];
    buttonsGroup.spacing = DuScriptUI.defaultSpacing;

    mainGroup.labels = labelsGroup;
    mainGroup.buttons = buttonsGroup;

    mainGroup.addEventListener( "mouseover", DuScriptUI.dimControls );

    mainGroup.addField = function( label, type, value, helpTip )
    {
        helpTip = def (helpTip, '');

        var control = null;
        var height = 20;
        if ( type == "DuButton" )
        {
            control = DuScriptUI.button( mainGroup.buttons, '', value[ 0 ], helpTip );
            height = control.image.preferredSize[ 1 ];
        }
        else
        {
            control = mainGroup.buttons.add( type, undefined, value );
            control.helpTip = helpTip;
            height = control.preferredSize[ 1 ];
        }

        var l = mainGroup.labels.add( 'statictext', undefined, label );
        l.helpTip = helpTip;

        l.minimumSize.height = l.maximumSize.height = height;
        return [ l, control ];
    }

    return mainGroup;
}
