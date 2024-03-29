/**
 * @class
 * @name DuLibrary
 * @classdesc For use with {@link DuScriptUI}.<br />
 * A complete library interface.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.library} to create a Library.<br />
 * The Library inherits the <code>Group</code> object from ScriptUI and has all of its properties and methods.
 * @property {ListBox} list The Listbox with the current items for the library.
 * Items are extended with new properties, see {@link DuListItem} for more details.
 * @property {DuLibraryItem} library The associated library data. Use setLibrary to change it.
 * @property {DuLibrary~onRun} onRun The function used to run the selected item.
 * @property {DuLibrary~onAltRun} onAltRun The function used to run the selected item with alt click.
 * @property {DuLibrary~onCtrlRun} onCtrlRun The function used to run the selected item with ctrl click.
 * @property {DuLibrary~onCtrlAltRun} onCtrlAltRun The function used to run the selected item with ctrl alt click.
 * @property {DuLibrary~onEditData} onEditData The function to execute to edit data.
 * @property {DuLibrary~onFolderOpened} onFolderOpened The function to open a containing folder
 * @property {DuLibrary~onFolderEdited} onFolderEdited The function to edit the folder
 * @property {DuLibrary~onAddItem} onAddItem The function to execute when adding a new item.
 * @property {DuLibrary~onEditItem} onEditItem The function to execute when editing an item.
 * @property {DuLibrary~onRemoveItem} onRemoveItem The function to execute when removing an item.
 * @property {DuLibrary~onRefresh} onRefresh The function to execute to refresh the library.
 * @property {DuLibrary~setLibrary} setLibrary Sets a new library. May be called from onRefresh to replace the lib by a new one.
 * @property {DuLibrary~setLibrary} runItem Runs the selected item. Tied to the apply/run button by default.
 * @extends {Group}
 * @category DuScriptUI
 */

/**
 * The function to execute to refresh the library.
 * @callback DuLibrary~onRefresh
 * @param {DuLibraryItem} category The category to refresh.
 * @memberof DuLibrary
 */

/**
 * Sets a new library. May be called from onRefresh to replace the lib by a new one.
 * @callback DuLibrary~setLibrary
 * @param {DuLibraryItem} newLib The new library.
 * @memberof DuLibrary
 */

/**
 * The function used to run the selected item.
 * @callback DuLibrary~onRun
 * @param {DuListItem} item The item to run/apply.
 * @memberof DuLibrary
 */

/**
 * The function used to run the selected item.
 * @callback DuLibrary~onAltRun
 * @param {DuListItem} item The item to run/apply.
 * @memberof DuLibrary
 */

/**
 * The function used to run the selected item.
 * @callback DuLibrary~onCtrlRun
 * @param {DuListItem} item The item to run/apply.
 * @memberof DuLibrary
 */

/**
 * The function used to run the selected item.
 * @callback DuLibrary~onCtrlAltRun
 * @param {DuListItem} item The item to run/apply.
 * @memberof DuLibrary
 */

/**
 * The function used to edit an item data.
 * @callback DuLibrary~onEditData
 * @param {DuListItem} item The item to edit.
 * @memberof DuLibrary
 */

/**
 * The function to open a containing folder.
 * @callback DuLibrary~onFolderOpened
 * @param {DuListItem} item The item to edit.
 * @param {Object} category The current category.
 * @memberof DuLibrary
 */

/**
 * The function to edit the folder.
 * @callback DuLibrary~onFolderEdited
 * @param {DuListItem} item The item to edit.
 * @param {Object} category The current category.
 * @memberof DuLibrary
 */

/**
 * The function to execute when adding a new item.
 * @callback DuLibrary~onAddItem
 * @param {Object} category The current category.
 * @memberof DuLibrary
 */

/**
 * The function to execute when editing an item.
 * @callback DuLibrary~onAddItem
 * @param {DuListItem} item The item to edit.
 * @param {Object} category The current category.
 * @memberof DuLibrary
 */

/**
 * The function to execute when removing an item.
 * @callback DuLibrary~onRemoveItem
 * @param {DuListItem} item The item to remove.
 * @param {Object} category The current category.
 * @memberof DuLibrary
 */

/**
 * @class
 * @name DuListItem
 * @classdesc For use with {@link DuScriptUI}.<br />
 * An item in a custom listbox used with {@link DuLibrary}.<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuScriptUI.library} to create a Library.<br />
 * The Library has a <code>list</code> property which is a ScriptUI <code>ListBox</code> which contains these DuListItem.<br />
 * DuListItem inherits the <code>Item</code> object from ScriptUI and has all of its properties and methods.
 * @property {*} data The data associated with the item, depends on the library object passed to the DuLibrary.
 * @property {string} libType The type of item, one of ['item', 'category', 'parent']
 * @property {bool} editableData Wether this item data can be edited by the user.
 * @property {bool} editableItem Whether this item can be edited by the user.
 * @category DuScriptUI
 */

/**
 * @class
 * @name DuLibraryItem
 * @classdesc For use with {@link DuLibrary}.<br />
 * An item in a library.
 * @hideconstructor
 * @property {*} data The data associated with the item.
 * @property {string} libType The type of item, one of ['item', 'category']
 * @property {bool} editableData Wether this item data can be edited by the user.
 * @property {bool} editableItem Whether this item can be edited by the user.
 * @property {string} icon Either the path to an image or a png representation as a string.
 * @category DuScriptUI
 */

/**
 * Adds a new {@link DuLibrary} to the container.
 * @param {Panel|Window|Group} container The ScriptUI Object which will contain and display the library.
 * @param {DuLibraryItem} library A library object. Key/value pairs, values being {@link DuLibraryItem} objects, keys being their display name.
 * @param {object} [options] Options and other values.
 */
DuScriptUI.library = function( container, library, options ) {
    options = def(options, {});
    options.runButton = def(options.runButton, true);
    options.editDataButton = def(options.editDataButton, false);
    options.folderButton = def(options.folderButton, true);
    options.canEditFolder = def(options.canEditFolder, false);
    options.editListButtons = def(options.editListButtons, true);
    options.refreshInterval = def(options.refreshInterval, -1);
    options.defaultItemIcon = def(options.defaultItemIcon, '');
    options.itemName = def(options.itemName, i18n._p("project", "Item")); /// TRANSLATORS: an item in the After Effects project
    options.runHelpTip = def(options.runHelpTip, i18n._p("file", "Run")); /// TRANSLATORS: as in "run script"
    options.folderHelpTip = def(options.folderHelpTip, i18n._("Open folder"));
    options.addItemHelpTip = def(options.addItemHelpTip, i18n._("Add item or category"));
    options.editItemHelpTip = def(options.editItemHelpTip, i18n._("Edit item or category"));
    options.removeItemHelpTip = def(options.removeItemHelpTip, i18n._("Remove item or category"));
    options.editDataHelpTip = def(options.editDataHelpTip, '');
    options.sortButton = def(options.sortButton, true);
    options.refreshButton = def(options.refreshButton, false);

    // The main group
    var duLibrary = container.add('group');
    duLibrary.orientation = 'column';
    duLibrary.alignment = ['fill', 'fill'];
    duLibrary.margins = 0;
    duLibrary.spacing = 0;
    // And its lib
    duLibrary.library = library;

    var runIcon = '';
    if (options.runButton) runIcon = DuScriptUI.Icon.RUN;
    else runIcon = DuScriptUI.Icon.CHECK;

    // UTILS
    duLibrary.currentCategory = duLibrary.library;
    var currentCommand = [];
    duLibrary.sortMode = 'up';

    function setCategory( cat ) {
        duLibrary.onRefresh( cat );

        duLibrary.currentCategory = cat;

        // Update the sort button
        duLibrary.srtButton.freeze = true;
        if (duLibrary.sortMode == 'none') duLibrary.srtButton.setCurrentIndex(0);
        else if (duLibrary.sortMode == 'down') duLibrary.srtButton.setCurrentIndex(2);
        else duLibrary.srtButton.setCurrentIndex(1);
        duLibrary.srtButton.freeze = false;

        if (duLibrary.sortMode != 'none') cat = DuJSObj.sort(cat, false, function( a, b ) {
            var aType = cat[a].libType;
            var bType = cat[b].libType;
            var r = 1;
            if (duLibrary.sortMode == 'down') r = -1;
            // Categories go first no matter what
            if (aType == 'category' && bType == 'item') return -r;
            else if (aType == 'item' && bType == 'category') return r;
            // Alphabetical
            if (a < b) return -r;
            if (a > b) return r;            
            return 0;
        });

        libList.removeAll();

        if (duLibrary.currentCategory != duLibrary.library) {
            var item = libList.add('item', '..');
            item.image = DuScriptUI.Icon.PARENT.binAsString;
            item.libType = 'parent';
            item.data = '';
            item.editableItem = false;
            item.editableData = false;
        }

        for (i in cat) {
            if (!cat.hasOwnProperty(i)) continue;
            // ignore lib properties
            if (i == 'libType') continue;
            if (i == 'icon') continue;
            if (i == 'data') continue;
            if (i == 'editableData') continue;
            if (i == 'editableItem') continue;
            var val = cat[i];
            // ignore unknown types
            if (typeof val.libType === 'undefined') continue;
            if (val.libType == 'item') {
                val.icon = def(val.icon, options.defaultItemIcon);
                if (val.icon == '') val.icon = options.defaultItemIcon;
                val.data = def (val.data, '');
                val.editableData = def (val.editableData, false);
                val.editableItem = def (val.editableItem, false);

                var item = libList.add('item', i);
                item.libType = 'item';
                item.data = val.data;
                item.editableItem = val.editableItem;
                item.editableData = val.editableData;
                try {  item.image = val.icon; }
                catch(e) {}
            }
            else {
                val.icon = def(val.icon, DuScriptUI.Icon.FOLDER_CLOSED.binAsString);
                val.data = def (val.data, '');
                val.editableData = false;
                val.editableItem = def (val.editableItem, false);

                var item = libList.add('item', i);
                item.libType = 'category';
                item.data = val.data;
                item.editableItem = val.editableItem;
                item.editableData = val.editableData;
                try {  item.image = val.icon; }
                catch(e) {}
            }
        }

        libList.onChange();
    }

    function updateCategory() {
        var cat = duLibrary.library;
        duLibrary.onRefresh( cat );
        for (var i = 0; i < currentCommand.length; i++) {
            if (!cat[currentCommand[i]]) break;
            cat = cat[currentCommand[i]];
            if (cat) duLibrary.onRefresh( cat );
        }
        setCategory(cat);
    }

    function updateBreadCrumbs() {
        tipLabel.text = currentCommand.join(' > ');
    }

    function parseCmd() {
        var currentCmd = cmdEdit.tempText;

        if ( DuString.endsWith(currentCmd, ' >')) return;
        if ( DuString.fullTrim(currentCmd) == '') {
            updateCategory();
            return;
        }
        var newBlock = DuString.endsWith(currentCmd, ' ');

        if (!newBlock) {
            search = currentCmd.toLowerCase();
            // Reset list
            setCategory(duLibrary.currentCategory);
            for (var i = libList.items.length -1; i >= 0; i--) {
                var item = libList.items[i];
                if ( // unsuccessful search
                    item.text.toLowerCase().indexOf(search) < 0
                    )
                {
                    libList.remove(i);
                }
            }
            return;
        }

        if (libList.items.length > 0 && currentCmd.length > 0) {
            var item = libList.items[0];
            if (item.libType == 'parent') {
                currentCommand.pop();
                updateBreadCrumbs();
                updateCategory();
                cmdEdit.setText('');
            }
            else if (item.libType == 'category') {
                currentCommand.push(item.text);
                updateBreadCrumbs();
                updateCategory();
                cmdEdit.setText('');
            }
            /*else if (item.libType == 'item') {
                cmdEdit.setText(item.text + ' >');
                updateCategory();
            }*/
        }
    };

    function run() {
        parseCmd();
        cmdEdit.setText(cmdEdit.text + ' ');
        parseCmd();
        if (libList.items.length == 0) {
            cmdEdit.setText('');
            parseCmd();
            tipLabel.text = i18n._("Item not found.");
            return;
        }
        var item = libList.items[0];
        if (item.libType == 'item') {
            duLibrary.onRun(item);
            // Clears the edit
            cmdEdit.setText('');
            parseCmd();
        }
    }

    duLibrary.runItem = function ( modifier ) {
        var item = libList.selection;
        if (!item) return;
        modifier = def(modifier, '');

        if (item.libType == 'parent') {
            currentCommand.pop();
            updateBreadCrumbs();
            updateCategory();
            cmdEdit.setText('');
            return;
        }

        if (item.libType == 'category') {
            currentCommand.push(item.text);
            updateBreadCrumbs();
            updateCategory();
            cmdEdit.setText('');
            return;
        }
        if (modifier == 'alt') duLibrary.onAltRun(item);
        else if (modifier == 'ctrl') duLibrary.onCtrlRun(item);
        else if (modifier == 'ctrlAlt') duLibrary.onCtrlAltRun(item);
        else duLibrary.onRun(item);
        // Clears the edit
        cmdEdit.setText('');
        parseCmd();
    };

    duLibrary.clear = function () {
        // Empty
        currentCommand = [];
        cmdEdit.setText('');
        updateBreadCrumbs();
        updateCategory();
        //parseCmd();
    };

    duLibrary.refresh = function () {
        // Only if visible
        if (!duLibrary.visible) return;
        //duLibrary.onRefresh(duLibrary.currentCategory);
        setCategory(duLibrary.currentCategory);
        updateBreadCrumbs();
    };

    duLibrary.sort = function(mode) {
        duLibrary.sortMode = mode;
        duLibrary.onRefresh(duLibrary.currentCategory);
        setCategory(duLibrary.currentCategory);
        updateBreadCrumbs();
    };

    // CREATE UI

    var cmdGroup = DuScriptUI.group(duLibrary, 'row');
    cmdGroup.spacing = 3;
    cmdGroup.alignment = ['fill', 'top'];

    var clearButton = DuScriptUI.button(
        cmdGroup,
        '',
        DuScriptUI.Icon.CLOSE,
        i18n._("Remove all")
    );
    clearButton.alignment = ['left', 'fill'];
    clearButton.onClick = duLibrary.clear;

    var cmdEdit = DuScriptUI.editText(
        cmdGroup,
        '',
        '',
        '',
        i18n._("Start typing...") /// TRANSLATORS: start typing a command in a command line interface
    );
    cmdEdit.alignment = ['fill', 'fill'];
    cmdEdit.onChanging = parseCmd;
    cmdEdit.onChange = parseCmd;
    cmdEdit.onEnterPressed = run;

    var tipGroup = DuScriptUI.group( duLibrary, 'row');
    tipGroup.alignment = ['fill', 'top'];

    var tipLabel = DuScriptUI.staticText(
        tipGroup,
        ''
    );
    tipLabel.alignment = ['fill', 'fill'];

    var listGroup = DuScriptUI.group( duLibrary, 'row');
    listGroup.alignment = ['fill', 'fill'];

    var libList = listGroup.add('listbox');
    libList.alignment = ['fill', 'fill'];
    libList.onDoubleClick = duLibrary.runItem;
    libList.onChange = function() {
        var item = libList.selection;
        if (options.editDataButton) {
            if (!item) duLibrary.editDataButton.visible = false;
            else duLibrary.editDataButton.visible = item.editableData;
        }

        if (options.editListButtons) {
            if (!item) {
                duLibrary.editItemButton.visible = false;
                removeItemButton.visible = false;
            }
            else {
                duLibrary.editItemButton.visible = item.editableItem; 
                removeItemButton.visible = duLibrary.currentCategory.editableItem && item.editableItem;
            }
            addItemButton.visible = duLibrary.currentCategory.editableItem;
            
        }
    };

    var listButtonsGroup = DuScriptUI.group( listGroup, 'column');
    listButtonsGroup.alignment = ['right', 'fill'];

    duLibrary.runButton = DuScriptUI.button(
        listButtonsGroup,
        '',
        runIcon,
        options.runHelpTip
    );
    duLibrary.runButton.alignment = ['right','top'];
    duLibrary.runButton.onClick = duLibrary.runItem;
    duLibrary.runButton.onAltClick = function() { duLibrary.runItem('alt') };
    duLibrary.runButton.onCtrlClick = function() { duLibrary.runItem('ctrl') };
    duLibrary.runButton.onCtrlAltClick = function() { duLibrary.runItem('ctrlAlt') };

    if (options.editDataButton) {
        duLibrary.editDataButton = DuScriptUI.button(
            listButtonsGroup,
            '',
            DuScriptUI.Icon.EDIT,
            options.editDataHelpTip
        );
        duLibrary.editDataButton.alignment = ['right','top'];
        duLibrary.editDataButton.onClick = function() { 
            var selection = libList.selection;
            if (!selection) return;
            if (!selection.editableData) return;
            duLibrary.onEditData( selection );
        };
        duLibrary.editDataButton.onAltClick = function() { 
            var selection = libList.selection;
            if (!selection) return;
            if (!selection.editableData) return;
            duLibrary.onAltEditData( selection );
        };
    }

    if (options.folderButton) {
        var fldrButton = DuScriptUI.button(
            listButtonsGroup,
            '',
            DuScriptUI.Icon.FOLDER_CLOSED,
            options.folderHelpTip
        );
        fldrButton.alignment = ['right','top'];
        fldrButton.onClick = function() {
            var selection = libList.selection;
            duLibrary.onFolderOpened(selection, duLibrary.currentCategory);
        };
        if (options.canEditFolder) {
            fldrButton.onAltClick = function() {
                var selection = libList.selection;
                duLibrary.onFolderEdited(selection, duLibrary.currentCategory);
            };
        }
    }

    if (options.sortButton) {
        duLibrary.srtButton = DuScriptUI.selector( listButtonsGroup, '', true );
        duLibrary.srtButton.alignment = ['right','top'];
        duLibrary.srtButton.addButton(
            '',
            DuScriptUI.Icon.SORT
        );
        duLibrary.srtButton.addButton(
            '',
            DuScriptUI.Icon.SORT_UP
        );
        duLibrary.srtButton.addButton(
            '',
            DuScriptUI.Icon.SORT_DOWN
        );
        duLibrary.srtButton.setCurrentIndex(1);
        duLibrary.srtButton.onChange = function() {
            if (duLibrary.srtButton.index == 0) duLibrary.sort('none');
            else if (duLibrary.srtButton.index == 1) duLibrary.sort('up');
            else if (duLibrary.srtButton.index == 2) duLibrary.sort('down');
        }
    }

    if (options.refreshButton) {
        var rfrshButton = DuScriptUI.button(
            listButtonsGroup,
            '',
            DuScriptUI.Icon.UPDATE,
            i18n._("Refresh") /// TRANSLATORS: refresh a list
        );
        rfrshButton.alignment = ['right','top'];
        rfrshButton.onClick = duLibrary.refresh;
    }

    if (options.editListButtons) {
        var addItemButton = DuScriptUI.multiButton(
            listButtonsGroup,
            '',
            DuScriptUI.Icon.ADD,
            options.addItemHelpTip
        );
        addItemButton.alignment = ['right','bottom'];
        duLibrary.addItemButton = addItemButton.addButton(
            options.itemName
        );
        duLibrary.addCategoryButton = addItemButton.addButton(
            i18n._("Category")
        );

        duLibrary.addItemButton.onClick = function() {
            duLibrary.onAddItem(duLibrary.currentCategory);
        };
        duLibrary.addCategoryButton.onClick = function() {
            duLibrary.onAddCategory(duLibrary.currentCategory);
        }

        duLibrary.editItemButton = DuScriptUI.button(
            listButtonsGroup,
            '',
            DuScriptUI.Icon.EDIT,
            options.editItemHelpTip
        );
        duLibrary.editItemButton.alignment = ['right','bottom'];
        duLibrary.editItemButton.onClick = function() {
            var selection = libList.selection;
            if (!selection) return;
            if (!selection.editableItem) return;
            duLibrary.onEditItem(selection, duLibrary.currentCategory);
        };

        var removeItemButton = DuScriptUI.button(
            listButtonsGroup,
            '',
            DuScriptUI.Icon.REMOVE,
            options.removeItemHelpTip
        );
        removeItemButton.alignment = ['right','bottom'];
        removeItemButton.onClick = function() {
            var selection = libList.selection;
            if (!selection) return;
            if (selection.libType == 'parent') return;
            // Add confirm
            duLibrary.onRemoveItem(selection, duLibrary.currentCategory);
        };
    }

    duLibrary.onRun = function() {};
    duLibrary.onAltRun = function() {};
    duLibrary.onCtrlRun = function() {};
    duLibrary.onCtrlAltRun = function() {};
    duLibrary.onEditData = function() {};
    duLibrary.onAltEditData = function() {};
    duLibrary.onFolderOpened = function() {};
    duLibrary.onFolderEdited = function() {};
    duLibrary.onAddItem = function() {};
    duLibrary.onAddCategory = function() {};
    duLibrary.onEditItem = function() {};
    duLibrary.onRemoveItem = function() {};
    duLibrary.onRefresh = function() {};

    duLibrary.setLibrary = function (newLib) {
        duLibrary.library = newLib;
        updateCategory();
    }

    duLibrary.list = libList;

    // Init 
    setCategory(duLibrary.library);

    // Refresh
    if (options.refreshInterval > 0) DuScriptUI.addEvent(duLibrary.refresh, options.refreshInterval);

    return duLibrary;
}