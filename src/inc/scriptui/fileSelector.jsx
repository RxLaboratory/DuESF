
/**
 * @class
 * @name DuFolderSelector
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A "Browse" button for folders only, with an optional text field for the path.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.folderSelector} to create a selector.<br />
 * The DuFolderSelector inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property {string} path - The folder path, initialized with an empty string. Note that this may not point to an existing folder if the user entered an incorrect path in the text field.<br />
 * To be sure to get an existing folder, you can use the getFolder() method.
 * @property {DuEditText|null} editText - The text field, if any.
 * @property {DuButton} button - The "Browse" button.
 * @category DuScriptUI
 */

/**
 * Gets the selected folder.
 * @method
 * @memberof DuFolderSelector
 * @name getFolder
 * @return {Folder|null} The new Folder, if any. null if the Folder does not exist or the user has input an incorrect path.
 */

/**
 * Creates a folder selector with a field for the path and a browse button<br />
 * @param {Window|Panel|Group} container - The ScriptUI Object which will contain and display the panel.
 * @param {string} [text="Browse..."] - The text to display on the button.
 * @param {boolean} [textField=true] - Whether to show the text field for the path.
 * @param {string} [helpTip=''] - The helptip for this control.
 * @param {string} [orientation='row'] - The orientation of the control (button+edittext).
 * @return {DuFolderSelector} The control.
 */
DuScriptUI.folderSelector = function ( container, text, textField, helpTip, orientation )
{
    text = def(text, "Browse...");
    textField = def(textField, true);
    helpTip = def(helpTip, '');
    orientation = def(orientation, 'row');

    if (DuESF.scriptSettings.get("common/uiMode", 0) >= 1) orientation = 'row';

    var folderSelector = container.add('group');
    folderSelector.orientation = orientation;
    folderSelector.margins = 0;
    folderSelector.spacing = 0;

    folderSelector.path = '';

    folderSelector.button = DuScriptUI.button(
        folderSelector,
        text,
        w12_folder,
        helpTip
        );
    if (orientation == 'row') folderSelector.button.alignment = ['left','fill'];

    folderSelector.editText = null;
    if (textField) {
        folderSelector.editText = DuScriptUI.editText(
            folderSelector,
            '',
            '',
            '',
            i18n._p("file system", "Path..."), /// TRANSLATORS: path for a file or a folder
            helpTip
            );
        folderSelector.editText.alignment = ['fill','center'];

        folderSelector.editText.onChange = function () {
            folderSelector.path = folderSelector.editText.text;
        }
    }

    folderSelector.button.onClick = function () {
        var folder = Folder.selectDialog ("Select Folder");
        if (!folder) return;
        folderSelector.editText.setText(folder.fsName);
        folderSelector.path = folder.absoluteURI;
    }

    folderSelector.getFolder = function () {
        var folder = new Folder(folderSelector.path);
        if (folder.exists) return folder;
        else return null;
    }

    return folderSelector;
}


/**
 * @class
 * @name DuFileSelector
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A "Browse" button for files only, with an optional text field for the path.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.fileSelector} to create a selector.<br />
 * The DuFileSelector inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property {string} path - The file path, initialized with an empty string. Note that this may not point to an existing folder if the user entered an incorrect path in the text field.<br />
 * To be sure to get an existing file, you can use the getFile() method.
 * @property {DuEditText|null} editText - The text field, if any.
 * @property {DuButton} button - The "Browse" button.
 * @property {DuFileSelector~onChange} onChange A function called when the file has changed.
 * @category DuScriptUI
 */

/**
 * Called when the file has changed.
 * @callback onChange
 * @memberof DuFileSelector
 */

/**
 * Gets the selected file.
 * @method
 * @memberof DuFileSelector
 * @name getFile
 * @return {File|null} The new File, if any. null if the File does not exist or the user has input an incorrect path.
 */

/**
 * Creates a file selector with a field for the path and a browse button.
 * @param {Window|Panel|Group} container - The ScriptUI Object which will contain and display the panel.
 * @param {string} [text="Browse..."] - The text to display on the button.
 * @param {boolean} [textField=true] - Whether to show the text field for the path.
 * @param {string} [helpTip=''] - The helptip for this control.
 * @param {string|DuBinary} [image] - The image to use as an icon; a "file" icon by default.
 * @param {string} [mode='open'] - The open mode, either 'open' or 'save'.
 * @param {string} [filters] - The file type filters.
 * @param {string} [orientation='row'] - The orientation of the control (button+edittext).
 * @return {DuFileSelector} The control.
 */
DuScriptUI.fileSelector = function ( container, text, textField, helpTip, image, mode, filters, orientation )
{
    text = def(text, "Browse...");
    textField = def(textField, true);
    helpTip = def(helpTip, '');
    mode = def(mode, 'open');
    image = def(image, w12_file);
    filters = def(filters, "All files: *.*");
    orientation = def(orientation, uiMode >= 1 ? 'row' : 'column');

    var uiMode = DuESF.scriptSettings.get("common/uiMode", 0);

    var fileSelector = container.add('group');
    fileSelector.orientation = orientation;
    fileSelector.margins = 0;
    fileSelector.spacing = 0;

    fileSelector.path = '';

    fileSelector.button = DuScriptUI.button(
        fileSelector,
        text,
        image,
        helpTip
        );
    if (orientation == 'row') fileSelector.button.alignment = ['left','fill'];

    fileSelector.editText = null;
    if (textField) {
        fileSelector.editText = DuScriptUI.editText(
            fileSelector,
            '',
            '',
            '',
            i18n._p("file system", "Path..."), /// TRANSLATORS: path for a file or a folder
            helpTip
            );
        fileSelector.editText.alignment = ['fill','center'];

        fileSelector.editText.onChange = function () {
            fileSelector.path = fileSelector.editText.text;
            fileSelector.onChange();
        }
    }

    fileSelector.onChange = function() {};

    fileSelector.button.onClick = function () {
        var file = new File(fileSelector.path);
        if (file.exists)
        {
            if (mode == 'open') file = file.openDlg("Select File", filters);
            else file = file.saveDlg ("Save File", filters);
        }
        else 
        {
            if (mode == 'open') file = File.openDialog("Select File",filters);
            else file = File.saveDialog ("Save File", filters);
        }
        
        if (!file) return;

        if (mode == 'open' && !file.exists)
        {
            if (fileSelector.editText) fileSelector.editText.setText("");
            fileSelector.path = file.absoluteURI;
        }
        else
        {
            if (fileSelector.editText) fileSelector.editText.setText(file.fsName);
            fileSelector.path = file.absoluteURI;
        }

        fileSelector.onChange();
    }

    fileSelector.getFile = function () {
        var file = new File(fileSelector.path);
        if (!file.exists && mode == 'open') return null;
        else return file;
    }

    fileSelector.setPath = function(path)
    {
        var file = new File(path);
        fileSelector.path = file.absoluteURI;
        if ((mode == 'open' && file.exists) || mode == 'save')
        {
            fileSelector.editText.setText( file.fsName ); 
        }
        else
        {
            fileSelector.editText.setText( "" );
        }
    }

    fileSelector.setPlaceholder = function(text)
    {
        fileSelector.editText.setPlaceholder(text);
    }



    return fileSelector;
}