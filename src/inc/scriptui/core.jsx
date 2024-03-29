﻿/**
    * Methods related to ScriptUI
    * @namespace
    * @category DuScriptUI
    */
var DuScriptUI = {}

#include "strings.jsx"
#include "icons.jsx"
#include "titleBar.jsx"
#include "panel.jsx"
#include "button.jsx"
#include "help.jsx"
#include "style.jsx"
#include "layout.jsx"
#include "checkbox.jsx"
#include "screen.jsx"
#include "selector.jsx"
#include "text.jsx"
#include "fileSelector.jsx"
#include "slider.jsx"
#include "form.jsx"
#include "tabPanel.jsx"
#include "colorSelector.jsx"
#include "multiButton.jsx"
#include "progressbar.jsx"
#include "toolbar.jsx"
#include "library.jsx"
#include "settingField.jsx"

//low-level list of functions to be run when the user interacts with the UI
DuScriptUI.eventFunctions = [];

/**
 * Adds a function to be run periodically, which will be connected to several UI events, fired when the user interacts with the UI.
 * @param {function} func The function to connect to the UI
 * @param {int} [timeOut=3000] A timeOut in milliseconds which prevents the function to be run too often
 * @return {int} a unique identifier to be used to remove the function later, with {@link DuScriptUI.removeEvent}.
 */
DuScriptUI.addEvent = function (func, timeOut)
{
    timeOut = def(timeOut, 3000);
    func.id = new Date().getTime();
    func.timeOut = timeOut;
    func.lastFire = func.id;
    DuScriptUI.eventFunctions.push(func);
    return func.id;
}

/**
 * Removes a function previously added with {@link DuScriptUI.addEvent}.
 * @param {int} id The id of the function
 */
DuScriptUI.removeEvent = function (id)
{
    for (var i = 0, n = DuScriptUI.eventFunctions.length; i < n; i++)
    {
        var f = DuScriptUI.eventFunctions[i];
        if (f.id == id)
        {
            DuScriptUI.eventFunctions.splice(i,1);
            break;
        }
    }
}

/**
 * The default alignment of children of containers with "column" orientation
 * @type {String[]}
 * @default ["fill","top"]
 */
DuScriptUI.defaultColumnAlignment = [ "fill", "top" ];

/**
 * The default alignment of children of containers with "row" orientation
 * @type {String[]}
 * @default ["left","center"]
 */
DuScriptUI.defaultRowAlignment = [ "left", "center" ];

/**
 * The default alignment of children of containers with "stack" orientation
 * @type {String[]}
 * @default ["fill","top"]
 */
DuScriptUI.defaultStackAlignment = [ "fill", "fill" ];

/**
 * The default spacing of containers
 * @type {int}
 * @default 2
 */
DuScriptUI.defaultSpacing = 2;

/**
 * The default margins of containers
 * @type {int}
 * @default 2
 */
DuScriptUI.defaultMargins = 2;

/**
 * A bar used to show current funding status.
 * @type {ProgressBar}
 */
DuScriptUI.fundingBar = null;

/**
 * A label used to show current funding status.
 * @type {StaticText}
 */
DuScriptUI.fundingLabel = null;

//low-level undocumented list: keeps the currently highlighted controls
DuScriptUI.highlightedControls = [];

//low-level undocumented list: keeps all the tabs, used in the buildAllTabs method
DuScriptUI.allTabs = [];

//low-level undocumented flag: set to true when showUI has been called. Before this, there's no need to set layout for children, this will improve performance greatly.
DuScriptUI.uiShown = false;

//low-level undocumented flag: pause events firing (used with popups)
DuScriptUI.eventFunctionsPaused = false;

//low-level undocumented function: dims all currently highlighted controls
//Also runs all functions in DuScriptUI.eventFunctions
DuScriptUI.dimControls = function( )
{
    if (!DuScriptUI.eventFunctionsPaused)
    {
        var now = new Date().getTime();
        for (var i = 0, n = DuScriptUI.eventFunctions.length; i < n; i++)
        {
            var f = DuScriptUI.eventFunctions[i];
            if (now - f.lastFire < f.timeOut) continue;
            f();
            f.lastFire = now;
        }
    }

    if ( DuScriptUI.highlightedControls.length == 0 ) return;
    for ( var i = DuScriptUI.highlightedControls.length - 1; i >= 0; i-- )
    {
        try
        {
            DuScriptUI.highlightedControls[ i ].dim();
        }
        catch ( e )
        {};
        DuScriptUI.highlightedControls.pop();
    }
}

