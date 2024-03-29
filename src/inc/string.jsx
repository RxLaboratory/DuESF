﻿/**
 * JavaScript String related methods
 * @namespace
 * @category DuESF
 */
var DuString = {};

/**
 * Counts the number of occurences of item in string
 * @memberof DuString
 * @param {string} string - The string where to count
 * @param {string} item - the string to search
 * @return {int} the number of occurences
 */
DuString.occurences = function(string, item) {
    return (string.split(item).length - 1);
}

/**
 * Parses the string as a boolean.<br />
 * The following strings are falsy:<br />
 * 'false', '0', '', 'null', 'undefined', 'NaN'.<br />
 * Note that any string consisiting only in any number of 0 will be falsy.
 * @memberof DuString
 * @param {string} string - The string to parse
 * @param {boolean} [caseSensitive=true] - When false, 'FALSE', 'nan', 'UNdefined'... for example will be falsy too.
 * @return {boolean} The resulting boolean
 */
DuString.parseBool = function(string, caseSensitive) {
    caseSensitive = def(caseSensitive, true);

    if (!caseSensitive) string = string.toLowerCase();
    var nan = 'NaN';
    if (!caseSensitive) nan = 'nan';

    // test if string is only zeroes
    var reZeroes = /^0+$/g;
    if (reZeroes.test(string)) return false;

    return string !== 'false' && string !== 'null' && string !== '' && string !== 'undefined' && string !== nan;
}

/**
 * Replaces <strong>all</strong> occurences of a substring by another and returns the new string.
 * @memberof DuString
 * @param {string}	string			- The original string
 * @param {string}	find			- The substring to replace
 * @param {string}	replace			- The new substring to insert
 * @param {boolean}	[caseSensitive=true]	- Optionnal. Do a case sensitive search of substring.
 * @return	{string}	The new string
 */
DuString.replace = function(string, find, replace, caseSensitive) {
    if (caseSensitive == undefined) caseSensitive = true;
    var re = new RegExp(DuRegExp.escape(find), caseSensitive ? 'g' : 'gi');
    return string.replace(re, replace);
}

/**
 * Replaces all occurences of "{#}" in the string by the args.
 * @memberof DuString
 * @param {string}	string			- The original string
 * @param {string[]|string}	args			- The arguments
 * @return {string}	The new string
 */
DuString.args = function(string, args) {
    args = def(args, []);
    if (typeof args === 'string' || args instanceof String) args = [args];

    var str = string;
    while (str.indexOf("{#}") !== -1) {
        // While there is stuff to format
        if (args.length < 1) break;
        var arg = args.shift(); // Take the first arg and remove it
        str = str.replace("{#}", arg);
    }
    return str;
}

/**
 * Checks if a string ends with a given suffix
 * @memberof DuString
 * @param {string}	str 	The string to check
 * @param {string}	suffix	The suffix
 * @return {bool}	Whether the string ends with the given suffix or not
 */
DuString.endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/**
 * Checks if a string starts with a given prefix
 * @memberof DuString
 * @param {string}	str 	The string to check
 * @param {string}	suffix	The suffix
 * @return {bool}	Whether the string ends with the given suffix or not
 */
DuString.startsWith = function(str, prefix) {
    return str.indexOf(prefix) === 0;
}

/**
 * Generates a new unique string (numbered)
 * @param {string} newString	- The wanted new string
 * @param {string[]} stringList 	- The list of strings where the new one must be generateUnique
 * @param {boolean} [increment=true] - true to automatically increment the new name if it already ends with a digit
 * @param {boolean} [isFile=false] - when generating name for files, setting this to true will add the increment before the extension
 * @return {string}	The unique string, with a new number at the end if needed.
 */
DuString.generateUnique = function(newString, stringList, increment) {
    increment = def(increment, true);
    if (!increment) newString += ' ';

    //detect digits
    var reg = "( *)(\\d+)([.,]?\\d*)$";
    //clean input
    var regexClean = new RegExp(reg);
    newString = newString.replace(regexClean, "");
    //go!
    var regex = new RegExp(DuRegExp.escape(newString) + reg);
    //The greatest number found
    var greatestNumber = 0;
    //The number of digits for the number as string
    var numDigits = 0;
    var spaceString = "";
    for (var i = 0; i < stringList.length; i++) {
        var currentNumberMatch = stringList[i].match(regex);
        if (stringList[i] === newString && greatestNumber == 0) greatestNumber++;
        else if (currentNumberMatch !== null) {
            //if its a decimal number, keep only the integer part
            var numberAsString = currentNumberMatch[2];
            //convert to int
            var numberAsInt = parseInt(currentNumberMatch[2], 10);
            if (isNaN(numberAsInt)) continue;
            if (numberAsInt >= greatestNumber) {
                greatestNumber = numberAsInt + 1;
                spaceString = currentNumberMatch[1];
            }
            //check if there are zeroes before the number, count the digits
            if (numberAsInt.toString().length < numberAsString.length && numDigits < numberAsString.length) numDigits = numberAsString.length;
        }
    }

    //add leading 0 if needed
    if (greatestNumber > 0) {
        //convert to string with leading zeroes
        if (greatestNumber == 1) {
            greatestNumber++;
            spaceString = " ";
        }
        newString += spaceString;
        greatestNumber = DuNumber.toString(greatestNumber, numDigits);
        newString += greatestNumber;
    }

    if (!increment) newString = newString.substr(0, newString.length - 1);

    return newString;
}

/**
 * Returns a copy of the string without leading and trailing white spaces.
 * @param {string}	 str	- The string to trim
 * @return {String} The trimmed string
 */
DuString.trim = function(str) {
    if (typeof str === 'undefined') return "";
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

/**
 * Returns a copy of the string without leading white spaces.
 * @param {string}	 str	- The string to trim
 * @return {String} The trimmed string
 */
DuString.leftTrim = function(str) {
    return str.replace(/^[\s\uFEFF\xA0]+/, '');
}

/**
 * Returns a copy of the string without trailing white spaces.
 * @param {string}	 str	- The string to trim
 * @return {String} The trimmed string
 */
DuString.rightTrim = function(str) {
    return str.replace(/[\s\uFEFF\xA0]+$/, '');
}

/**
 * Returns a copy of the string without leading and trailing white spaces, and without any new line, leaving only standard spaces.
 * @param {string}	 str	- The string to trim
 * @return {String} The trimmed string
 */
DuString.fullTrim = function(str) {
    var newStr = str.replace(/[\s\uFEFF\xA0]+/g, ' ');
    return DuString.trim(newStr);
}

/**
 * Returns a copy of the string without trailing white spaces and numbers.
 * @param {string}	 str	- The string to trim
 * @return {String} The trimmed string
 */
DuString.trimNumbers = function(str) {
	return str.replace(/[\s\uFEFF\xA0\d]*$/g, '');
}

/**
 * Converts a size in Bytes to a human-readable string with a fitting unit automatically chosen<br />
 * Note that the conversion uses 1024 Bytes per kB.
 * @param {int} size The size in Bytes
 * @return {string} The stringified size
 */
DuString.fromSize = function(size) {
    if (size < 1024) return size + " B";
    if (size < 1048576) return DuPath.sizeFromBytes(size, "kB") + " kB";
    if (size < 1073741824) return DuPath.sizeFromBytes(size, "MB") + " MB";
    if (size < 1099511627776) return DuPath.sizeFromBytes(size, "GB") + " GB";
    else return DuPath.sizeFromBytes(size, "TB") + " TB";
}

/**
 * Generates a camel case text from a snake case or standard one
 * @param {string} text The source text
 * @return {string} The camelCase version of the text
 */
DuString.toCamelCase = function(text) {
    text = text.split(" ");
    if (text.length == 0) return "";
    text[0] = DuString.unCapitalize(text[0]);
    for (var i = 1, n = text.length; i < n; i++) {
        text[i] = DuString.capitalize(text[i]);
    }
    return text.join("");
}

/**
 * Sets the first character of the text to be capital case if it's a letter.<br />
 * Note that the string is left trimmed first: any leading white space is removed.
 * @param {string} text The source text
 * @return {string} The new text
 */
DuString.capitalize = function(text) {
    var newText = DuString.leftTrim(text);
    var firstChar = newText.substring(0, 1);
    firstChar = firstChar.toUpperCase();
    return firstChar + newText.substring(1);
}

/**
 * Sets the first character of the text to be lower case if it's a letter.<br />
 * Note that the string is left trimmed first: any leading white space is removed.
 * @param {string} text The source text
 * @return {string} The new text
 */
DuString.unCapitalize = function(text) {
    var newText = DuString.leftTrim(text);
    var firstChar = newText.substring(0, 1);
    firstChar = firstChar.toLowerCase();
    return firstChar + newText.substring(1);
}

/**
 * Caculates the score of a string against a query, using Duduf's fuzzy-search.jsxinc
 * @param {string} item The string to test
 * @param {string} query The string to search
 * @param {bool} [caseSensitive=false] Whether to check the case or not
 * @return {float} The score, a positive value.<br/>
 * - <code>0</code>: no match<br/>
 * - <code>1</code>: perfect match<br/>
 * - <code>>1</code>: the lower the score, the better the match<br/>
 */
DuString.match = function(str, query, caseSensitive) {
    return FuzzySearch.match(str, query, caseSensitive);
}

/**
 * Same as JS String.split except that it works with a list of separators too
 * @param {string} str The string to split
 * @param {string|string[]|DuList.<string>} separators The separator(s)
 * @return {string[]} The array of strings.
 */
DuString.split = function(str, separators) {
    separators = new DuList(separators);
    var lastSep = separators.last();
    var arr = str.split(separators.first());
    separators.do( function(sep) {
        if (separators.current == 0) return;
        arr = arr.join(lastSep).split(sep);
    });
    return arr;
}

/**
 * Splits the string into same-length substrings.
 * @param {string} str The string to split
 * @param {int} subStringLength The length of the substrings
 * @return {string[]} The array of strings. The last one may be shorter than <code>subStringLength</code> if the original string length is not a multiple of it.
 */
DuString.chunk = function(str, subStringLength) {

    return str.match(new RegExp("([\\s\\S]{1," + subStringLength + "})", "g"));

    /*var strArr = [];
    for (var i = 0, ni = str.length; i < ni; i) {
        // don't split escaped characters
        var end = subStringLength;

        while ( str[i+end-1] == "\\" ) end++;

        strArr.push(str.substr(i, end));

        i += end;
    }*/
    return strArr;
}

/**
 * Checks if the string contains one of the substrings
 * @param {string} str The string to check
 * @param {string|string[]|DuList.<string>} subStrs The substrings to look for
 * @return {boolean}
 */
DuString.contains = function(str, subStrs) {
    subStrs = new DuList(subStrs);

    for (var i = 0, ni = subStrs.length(); i < ni; i++) {
        if ( str.indexOf( subStrs.at(i) ) >= 0 ) return true;
    }
    return false;
}

/**
 * Counts the spaces at the beginning of the line
 * @param {string} str The string
 * @return {int}
 */
DuString.indentation = function(str) {
    var testStr = str;

    var c = 0;
    while (DuString.isIndented(testStr)) {
        testStr = testStr.substring(1);
        c++;
    }
    return c;
}

/**
 * Checks if the string is indented (starts with a space or tab)
 * @param {string} str The string to test
 * @return {bool}
 */
DuString.isIndented = function(str) {
    if (DuString.fullTrim(str) == '') return false;
    return DuString.startsWith(str, ' ') || DuString.startsWith(str, '\t');
}

/**
 * Checks if this string represents a float (strict, the string must include a ".")
 * @param {string} str The string
 * @return {boolean}
 */
DuString.isFloat = function( str ) {
    var re = /^\d*\.\d+$/
    return re.test( str );
}

/**
 * Checks if this string represents an integer
 * @param {string} str The string
 * @return {boolean}
 */
DuString.isInt = function( str ) {
    var re = /^\d+\.?$/
    return re.test( str );
}

/**
 * Checks if this string represents a number (int or float)
 * @param {string} str The string
 * @return {boolean}
 */
DuString.isNumber = function( str ) {
    return (DuString.isInt(str) || DuString.isFloat(str));
}