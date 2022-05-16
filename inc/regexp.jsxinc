/**
	* JavaScript Regular Expression related methods
	* @namespace
	* @category DuESF
*/
var DuRegExp = {};

/**
	* Escape reg exp reserved characters from a string to build a regular expression compatible string
	* @memberof DuRegExp
	* @param {string}	string		- The string to escape
	* @return	{string}	The escaped string
*/
DuRegExp.escape = function (string)
{
	return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

/**
 * The set containing javascript symbols ( +, -, [, etc.). Useful when parsing javascript code.
 * @readonly
 */
DuRegExp.javascriptSymbols = "[\\s=!/*\\-+%()[\\]{};:.]";

/**
 * The set containing javascript symbols ( +, -, [, etc.) except the dot. Useful when parsing javascript code.
 * @readonly
 */
DuRegExp.javascriptSymbolsNoDot = "[\\s=!/*\\-+%()[\\]{};:]";

/**
 * The set containing authorized characters for javascript variable. Useful when parsing javascript code.
 * @readonly
 */
DuRegExp.javascriptVarChars = "[a-zA-Z0-9_]";