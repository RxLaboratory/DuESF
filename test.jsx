(function (thisObj) {

    #include "DuESF.jsxinc"

    new OCOConfig('X:/OCO.config');
    alert(OCO.config.librarySettingsAbsoluteURI());

})(this);