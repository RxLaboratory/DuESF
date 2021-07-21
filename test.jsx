// This file is used for testing DuESF

//encapsulate the script in a function to avoid global variables
(function (thisObj) {

    #include "DuESF.jsxinc"
    #include "inc/scriptui/icons/w16_arm_structure.png.jsxinc"
    // This is required
    DuESF.init( DuESF.HostApplication.AFTER_EFFECTS, "Duik NoName", "17.0.0-Dev", "RxLaboratory");

    // Setting these may prove useful
    DuESF.chatURL = 'http://chat.rxlab.info';
    DuESF.bugReportURL = 'http://git.rxlab.io';
    DuESF.featureRequestURL = 'http://git.rxlab.io';
    DuESF.aboutURL = 'http://rxlaboratory.org';
    DuESF.docURL = 'http://duesf.rxlab.io';
    DuESF.scriptAbout = 'The Duduf ExtendScript Framework to help you develop Adobe Scripts';
    DuESF.companyURL = 'https://rxlaboratory.org';

    var ui = DuScriptUI.scriptPanel( thisObj, true, true, new File($.fileName) );
    ui.addCommonSettings();

    var testButton = DuScriptUI.button( ui.mainGroup, 'Button with options', undefined, undefined, true );
    testButton.onClick = function() { alert('Hello World!'); };

    var testCheckBox = DuScriptUI.checkBox(ui.mainGroup, 'CheckBox' );

    var testIconButton = DuScriptUI.button( ui.mainGroup, 'Icon Button', w16_arm_structure, 'Help!' );

    var testIconButtonOpts = DuScriptUI.button( ui.mainGroup, 'Icon Button w/ opts', w16_arm_structure, 'Help!', true );

    var testIconCheckBox = DuScriptUI.checkBox(ui.mainGroup, 'Icon CheckBox', w16_arm_structure, 'Checkbox', 'Icon Checked' );

    var textEdit = DuScriptUI.editText( ui.mainGroup, '', 'prefix ', ' suffix', "edit text", "This is an edit text field");
    
    var staticText = DuScriptUI.staticText( ui.mainGroup, 'Static Text', undefined, "This is astatic text field");
    var staticColoredText = DuScriptUI.staticText( ui.mainGroup, 'Colored Static Text', DuColor.Color.RAINBOX_RED, "This is astatic text field");

    var folderSelector = DuScriptUI.folderSelector( ui.mainGroup, "Select a folder...", true, "A folder selector");
    
    var fileOpenSelector = DuScriptUI.fileSelector( ui.mainGroup, "Open file...", true, "A file selector");
    
    var fileSaveSelector = DuScriptUI.fileSelector( ui.mainGroup, "Save file...", true, "A file selector", undefined, 'save', "After Effects Project: *.aep, All files: *.*");

    // This is required at the end of init (building ui, etc) and before running methods
    // Equivalent to using true as second arg of DuScriptUI.showUI
    //DuESF.enterRunTime();

    DuScriptUI.showUI(ui, true);

    //alert(DuESF.scriptAbout);

})(this);