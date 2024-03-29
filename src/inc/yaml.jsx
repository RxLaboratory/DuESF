/**
* Yaml Parser/Reader
* @namespace
* @category DuESF
*/
var YAML = {};

/**
 * Parses a string formatted in yaml.
 * @memberof YAML
 * @param {string} yaml_string - The yaml to parse
 * @return {any|null} null if the yaml could not be parsed
 */
YAML.load = function (yaml_string) {
    // Split by lines
    yaml = yaml_string.split('\n');

    // Check if there's a '---' line
    var startLine = 0
    for (var i = 0, n = yaml.length; i < n; i++) {
        var line = yaml[i];
        line = YAML._trim(line);
        if (line == '---') {
            startLine = i+1;
            break;
        }
    }

    return YAML._load_block( yaml, startLine )[0];
}

/**
 * Dumps some data as a yaml string.
 * @memberof YAML
 * @param {any} data The data
 * @param {int} [numIdents=2] The indentation
 * @return {string} The Yaml
 */
YAML.dump = function( data, numIdents ) {
    if (typeof numIdents === 'undefined') numIdents = 2;

    var tab = '';
    while(tab.length < numIdents) tab += ' ';
    
    var lines = [];
    if (YAML._is_object(data)) lines = YAML._dump_object(data, tab);
    else if (data instanceof Array) lines = YAML._dump_array(data, tab);
    else lines = [YAML._dump_value(data)];

    return lines.join('\n');
}

// PRIVATE METHODS //

YAML._load_block = function( yaml_array, startIndex ) {

    // Parse the first line to knonw what we're getting (obj or array)
    var line = yaml_array[startIndex];
    var indentation = YAML._indentation(line);
    var lineData = YAML._parse_line( line );
    var key = lineData[0];
    var value = lineData[1];

    // If the line is empty, skip, get to the next
    if (key === '' && value === '') return YAML._load_block( yaml_array, startIndex + 1);

    var obj = null;
    if (key === '') obj = [];
    else obj = {};

    // Init
    var currentIndentation = indentation;

    for( var i = startIndex, n = yaml_array.length; i < n; i++ ) {

        var line = yaml_array[i];
        
        if (line == '...') return [obj,n];

        // Ignore empty lines
        if (YAML._trim(line) == '') continue;

        currentIndentation = YAML._indentation(line);
        // Finished
        if (currentIndentation < indentation) return [obj,i-1];

        lineData = YAML._parse_line( line );
        key = lineData[0];
        value = lineData[1];

        // Ignore empty lines
        if (key === '' && value === '') continue;

        // === We're filling an array ===
        if (obj instanceof Array) {
            // Just a value -> add it
            if (key === '' && value !== '') {
                obj.push(value);
                continue;
            }
            // A Key and a Value -> add as a dict
            if (key !== '' && value !== '') {
                var v = {};
                v[key] = value;
                obj.push(v);
                continue;
            }
        }
        // === We're filling a dictionnary ===
        else {
            // No key: error
            if (key === '')
                throw 'YAML Key Error at line ' + i + ': Value "' + value + '" is part of a dictionnary but doesn\'t have a name.';

            // Key and a value -> add
            if (key !== '' && value !== '') {
                obj[key] = value;
                continue;
            }
        }

        // We just have a key

        // If this is the last line, error
        if (i == n - 1)
            throw 'YAML Value Error at line ' + i + ': Key "' + key + '" doesn\'t have a value.';

        // Check if the next line has a higher indentation
        for( var j = i+1; j < n; j++ ) {

            var nextLine = yaml_array[j];
            if (nextLine == '...') return [obj, n];

            if (YAML._trim(nextLine) == '') continue;
            nextIndentation = YAML._indentation(nextLine);

            if (nextIndentation <= indentation) {
                throw 'YAML Value Error at line ' + i + ': Key "' + key + '" doesn\'t have a value.';
                break;
            }

            var subBlock = YAML._load_block(yaml_array, j);

            if (obj instanceof Array) {
                var v = {};
                v[key] = subBlock[0];
                obj.push(v);
            }
            else {
                obj[key] = subBlock[0];
            }
                            
            // We can continue after the block
            i = subBlock[1];
            break;
        }
    }

    return [obj,n];
}

YAML._dump_array = function(array, tab) {

    var lines = [];

    for (var i = 0, n = array.length; i < n; i++) {
        var d = array[i];

        if (d instanceof Array)
            throw "YAML Dump Error: an array can't have another array in it's items. Sub-arrays must be included as objects.";
        if (YAML._num_keys(d) > 1)
            throw "YAML Dump Error: an array can contain only objects with a single property, not objects with multiple properties.";
        
        if (YAML._is_object(d)) {
            var objLines = YAML._dump_object(d, tab);

            lines.push('- ' + objLines[0])

            for (var j = 1, nj = objLines.length; j < nj; j++) {
                lines.push(tab + objLines[j]);
            }
        }
        else {
            lines.push('- ' + YAML._dump_value(d));
        }
    }

    return lines;
}

YAML._is_object = function(obj) {
    if (obj instanceof Array) return false;
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) return true;
    }
    return false;
}

YAML._num_keys = function(obj) {
    if (obj instanceof Array) return 0;
    var i = 0;
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) i++;
    }
    return i;
}

YAML._dump_object = function(obj, tab) {
    var lines = [];

    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        
        var d = obj[key];
        if (typeof d === 'undefined') continue;

        if (YAML._is_object(d)) {

            lines.push(key + ':');

            var objLines = YAML._dump_object(d, tab);

            for (var i = 0, n = objLines.length; i < n; i++) {
                lines.push(tab + objLines[i]);
            }
        }
        else if (d instanceof Array) {
            lines.push(key + ':');

            var arrayLines = YAML._dump_array(d, tab);
            
            for (var i = 0, n = arrayLines.length; i < n; i++) {
                lines.push(tab + arrayLines[i]);
            }
        }
        else {
            lines.push(key + ': ' + YAML._dump_value(d));
        }
    }

    return lines;
}

YAML._dump_value = function(val) {
    //if (typeof val === 'string' || val instanceof String)
    //    return '"' + val + '"';
    if (val instanceof Date) {
        var hour = val.getHours();
        var minute = val.getMinutes();
        var second = val.getSeconds();
        var day = val.getDate();
        var month = val.getMonth();
        var year = val.getFullYear();

        return year + "-" + YAML._pad_int(month+1) + "-" + YAML._pad_int(day) + " " + YAML._pad_int(hour) + ":" + YAML._pad_int(minute) + ":" + YAML._pad_int(second);
    }
    return val.toString();
}

YAML._pad_int = function( val, numDigits) {
    if (typeof numDigits === 'undefined')
        numDigits = 2;
    val = val.toString();
    while(val.length < numDigits)
        val = '0'+val;
    return val;
}

YAML._is_comment = function( str ) {
    str = YAML._trim(str);
    return str.indexOf('#') == 0;
}

YAML._parse_line = function( str ) {

    if (YAML._is_comment( str )) return ['',''];

    str = YAML._trim(str);
    if (str == '') return ['',''];

    // Check if there's a colon
    colonIndex = str.indexOf(':');

    if (colonIndex == 0) {
        throw "YAML Syntax Error: \"" + str + "\":Can't start an line with ':'.";
    }

    // Just a value
    if (colonIndex < 0) {
        if (str.indexOf('- ') != 0) {
            throw "YAML Syntax Error: \"" + str + "\": Unknown value, it isn't a named value nor an item in a list";
        }
        // Remove the leading "-"
        str = str.substring(2);
        return ['', YAML._parse_value(str)];
    }

    // Just a key
    if (colonIndex == str.length -1)
        return [ YAML._parse_key(str), '' ];

    colonIndex = str.indexOf(': ');

    // Just a value
    if (colonIndex < 1) {
        return ['', YAML._parse_value(str)];
    }

    // Separate the value and the key
    return [
        YAML._parse_key( str.substring(0, colonIndex) ),
        YAML._parse_value( str.substring(colonIndex + 2))
    ];
}

YAML._parse_value = function ( str ) {
    str = YAML._trim(str);

    // if this is the start of a paragraph
    if ( str == '>' || str == '|') {
        // TODO
        return str;
    }

    // Check if this is a quoted string
    var quote = YAML._string_quote(str);
    if ( quote != '' ) {
        if (quote == '"') {
            // Parse escaped stuff using JSON
            str = JSON.parse(str);
        }
        else {
            str = str.substring(1, str.length-1);
        }
        return str;
    }

    // Remove the comment if any
    str = str.split('# ')[0];
    str = YAML._trim(str);

    // This may be a bool
    if (str.toLowerCase() == 'true') return true;
    if (str.toLowerCase() == 'false') return false;

    // Is it a float?
    if ( YAML._is_float(str) ) return parseFloat(str);
    // Or an int?
    if ( YAML._is_int(str) ) return parseInt(str);

    // Let's keep it as a string
    return str;
}

YAML._parse_key = function (str) {
    str = YAML._trim(str);
    str = str.replace(':','');
    if (str.indexOf('- ') == 0) str = str.substring(2);
    return str;
}

YAML._string_quote = function(str) {
    if ( str.indexOf('"') == 0 && YAML._str_ends_with(str, '"') ) return '"';
    if ( str.indexOf("'") == 0 && YAML._str_ends_with(str, "'") ) return "'";
    return '';
}

YAML._trim = function(str) {
    var newStr = str.replace(/[\s\uFEFF\xA0]+/g, ' ');
    return newStr.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

YAML._is_indented = function(str) {
    if (YAML._trim(str) == '') return false;
    return str.indexOf(' ') == 0 || str.indexOf('\t') == 0;
}

YAML._indentation = function(str) {
    var testStr = str;

    var c = 0;
    while (YAML._is_indented(testStr)) {
        testStr = testStr.substring(1);
        c++;
    }
    return c;
}

YAML._is_float = function(str) {
    var re = /^\d*\.\d+$/
    return re.test( str );
}

YAML._is_int = function( str ) {
    var re = /^\d+\.?$/
    return re.test( str );
}

YAML._is_number = function( str ) {
    return (YAML._is_int(str) || YAML._is_float(str));
}

YAML._str_ends_with = function (str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}