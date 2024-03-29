/**
 * @class
 * @name DuSettingField
 * @classdesc For use with {@link DuScriptUI}.<br />
 * An Setting field, which can be enabled or disabled.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.settingField} to create setting field.<br />
 * The DuSettingField inherits the <code>Group</code> object from ScriptUI and has all of its properties and methods.
 * @property {DuSettingField~onClick} onClick - The function to execute when the checkbox is clicked
 * @category DuScriptUI
 */

/**
 * The function to execute when the checkbox is clicked.
 * @callback DuSettingField~onClick
 * @memberof DuSettingField
 */

/**
 * Creates a {@link DuSettingField} which can be enabled or disabled
 * @param {Panel|Window|Group}		container	- The ScriptUI Object which will contain and display the setting.
 * @param {string}					[text]		- The label of the setting
 * @param {int}					[minimumLabelWidth]		- The minmimum width of the label
 * @return {DuSettingField}			The setting created.
 */
DuScriptUI.settingField = function(container, text, minimumLabelWidth ) {
    minimumLabelWidth = def(minimumLabelWidth, -1);

    var settingGroup = DuScriptUI.group(container, 'row');
    settingGroup.margin = 0;
    settingGroup.spacing = 3;
    settingGroup.alignment = ['fill', 'top'];

    var checkbox = DuScriptUI.checkBox( settingGroup, {
        text: text + ':',
        localize: false
    });
    checkbox.alignment = ['left', 'center'];
    checkbox.minimumSize = [minimumLabelWidth, -1];

    settingGroup = DuScriptUI.group(settingGroup, 'row');
    settingGroup.spacing = 0;
    settingGroup.margin = 0;
    settingGroup.alignment = ['fill', 'fill'];
    settingGroup.checked = settingGroup.enabled = false;

    settingGroup.onClick = function() {};

    settingGroup.setChecked = function (c) {
        checkbox.setChecked(c);
        settingGroup.enabled = c;
    };
    
    checkbox.onClick = function() {
        settingGroup.checked = checkbox.value;
        settingGroup.enabled = checkbox.value;
        settingGroup.onClick();
    };

    return settingGroup;
};