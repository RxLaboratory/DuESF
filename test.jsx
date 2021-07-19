// This file is used for testing DuESF

//encapsulate the script in a function to avoid global variables
(function (thisObj) {

    #include "DuESF.jsxinc"
    // This is required
    DuESF.init("DuESFTests", "0.0.1-Dev", "Duduf");

    // Setting these may prove useful
    DuESF.debug = true;
    DuESF.chatURL = 'http://chat.rxlab.info';
    DuESF.bugReportURL = 'http://git.rxlab.io';
    DuESF.featureRequestURL = 'http://git.rxlab.io';
    DuESF.aboutURL = 'http://rxlaboratory.org';
    DuESF.docURL = 'http://duesf.rxlab.io';
    DuESF.scriptAbout = 'The Duduf ExtendScript Framework to help you develop Adobe Scripts';
    DuESF.companyURL = 'https://rxlaboratory.org';

    // This is required at the end of init (building ui, etc) and before running methods
    DuESF.enterRunTime();

    alert(DuESF.scriptAbout);

})(this);