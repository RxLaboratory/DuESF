/**
 * XMP tools
 * @namespace
 * @category DuESF
 */
var DuXMP = {};

DuXMP.initialized = false;

/**
 * Loads the XMP library if it has not been loaded yet. There is no need to call this function as it's called automatically by DuESF methods if needed.<br />
 * Call it once if you plan to use XMP without the methods in DuESF.<br />
 * Note that the XMP library is added statically as <code>ExternalObject.AdobeXMPScript</code>.
 * @returns {Boolean} Init may fail, in this case the function returns false and the XMP lib can't be used.
 */
DuXMP.init = function ()
{
    if (DuXMP.initialized) return true;
    
    // load the library
    try {
    ExternalObject.AdobeXMPScript = def (
        ExternalObject.AdobeXMPScript,
        new ExternalObject( "lib:AdobeXMPScript" )
        );
    } catch (e) {
        $.writeln("Can't load the XMP library");
        DuXMP.initialized = false;
        return false;
    }

    DuXMP.initialized = true;
    return true;
}