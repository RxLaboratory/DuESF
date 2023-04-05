(function (thisObj) {

    #include "DuESF.jsxinc"

    new OCOConfig('X:/OCO.config');
    //alert(OCO.config.librarySettingsAbsoluteURI());

    var file = File.saveDialog("Select the OCO.config file.", "OCO Config:*.config;YAML:*.yml,*.yaml;Text files:*.txt;All files:*.*");

})(this);