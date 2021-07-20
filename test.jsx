// This file is used for testing DuESF

//encapsulate the script in a function to avoid global variables
(function (thisObj) {

    #include "DuESF.jsxinc"
    // This is required
    DuESF.init( DuESF.HostApplication.AFTER_EFFECTS, "Duik NoName", "17.0.0-Dev", "RxLaboratory");

    // Setting these may prove useful
    //DuESF.debug = true;
    DuESF.chatURL = 'http://chat.rxlab.info';
    DuESF.bugReportURL = 'http://git.rxlab.io';
    DuESF.featureRequestURL = 'http://git.rxlab.io';
    DuESF.aboutURL = 'http://rxlaboratory.org';
    DuESF.docURL = 'http://duesf.rxlab.io';
    DuESF.scriptAbout = 'The Duduf ExtendScript Framework to help you develop Adobe Scripts';
    DuESF.companyURL = 'https://rxlaboratory.org';

    var ui = DuScriptUI.scriptPanel( thisObj, true, true, new File($.fileName) );


    var testButton = DuScriptUI.button( ui.mainGroup, 'Button with options', undefined, undefined, true );
    testButton.onClick = function() { alert('Hello World!'); };

    var testCheckBox = DuScriptUI.checkBox(ui.mainGroup, 'CheckBox' );

    var testIconButton = DuScriptUI.button( ui.mainGroup, 'Icon Button', w16_arm_structure, 'Help!' );

    var testIconButtonOpts = DuScriptUI.button( ui.mainGroup, 'Icon Button w/ opts', w16_arm_structure, 'Help!', true );

    var testIconCheckBox = DuScriptUI.checkBox(ui.mainGroup, 'Icon CheckBox', w16_arm_structure, 'Checkbox', 'Icon Checked' );

    // This is required at the end of init (building ui, etc) and before running methods
    // Equivalent to using true as second arg of DuScriptUI.showUI
    //DuESF.enterRunTime();

    DuScriptUI.showUI(ui, true);

    //alert(DuESF.scriptAbout);

})(this);