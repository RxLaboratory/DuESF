/**
 * JS Objects related methods
 * @namespace
 * @category DuESF
 */
var DuJSObj = {};

/**
 * Sorts object keys and returns a new sorted object.
 * @param {object} obj The object to sort.
 * @param {bool} [reverse=false] Set to true to sort in the reverse order.
 * @param {function} [compareFn] Specifies a function that defines the sort order. Note that this parameter is ignored if reversed is true.<br />
 * If omitted, the keys are converted to strings, then sorted according to each character's Unicode code point value.
 * @return {object} The new sorted object.
 */
DuJSObj.sort = function( obj, reverse, compareFn ) {
    reverse = def(reverse, false);

    if (reverse) {
        compareFn = function(a, b) {
            if (b > a) return 1;
            if (b < a) return -1;
            if (b == a) return 0;
        }
    }

    var newObj = {};
    var tempArray = [];
    for (i in obj) {
        tempArray.push(i);
    }

    if (isdef( compareFn )) tempArray.sort(compareFn);
    else tempArray.sort();

    for (var i = 0, n = tempArray.length; i < n; i++)
    {
        var key = tempArray[i];
        newObj[key] = obj[key];
    }

    return newObj;
}

/**
 * Deletes all properties from an object, except a predefined list.
 * @param {object} obj The object to clear.
 * @param {string[]} [ignoredProperties] The properties to keep
 */
DuJSObj.clear = function( obj, ignoredProperties ) {
    ignoredProperties = def(ignoredProperties, []);
    // Remove existing items
    for (i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        // ignore properties
        var ok = true;
        for (var j = 0, n = ignoredProperties.length; j < n; j++)
        {
            if (i == ignoredProperties[j]) {
                ok = false;
                break;
            }
        }
        if (ok) delete obj[i];
    }
}

DuJSObj.equals = function( obj1, obj2 ) {
    for( key in obj1 ) {
        if (obj2[key] !== obj1[key]) return false
    }
    return true;
}