/**
 * fuzzy-search.jsxinc.<br />
 * by {@link http://duduf.com Duduf} and Wouter Rutgers.<br />
 * @example
 * // Encapsulate everything to avoid global variables!
 * (function() {
 *     #include "fuzzy-search.jsxinc"
 * 
 *     var people = [{
 *     name: {
 *         firstName: 'Jesse',
 *         lastName: 'Bowen',
 *     },
 *    state: 'Seattle',
 *     }];
 * 
 *     var searcher = new FuzzySearch(people, ['name.firstName', 'state'], {
 *         caseSensitive: true,
 *     });
 *     var result = searcher.search('ess');
 * })();
 * @class
 * @author Nicolas Dufresne and contributors
 * @copyright 2022 Nicolas Dufresne, RxLaboratory
 * @version 1.0.0
 * @license GNU-GPLv3
 * @category fuzzy-search.jsxinc
 */
var FuzzySearch = function (haystack, keys, options) {
    if (typeof haystack === 'undefined') haystack = [];
    if (typeof keys === 'undefined') keys = [];
    if (typeof options === 'undefined') options = {};

    if (!(keys instanceof Array)) {
        options = keys;
        keys = [];
    }

    this.haystack = haystack;
    this.keys = keys;
    this.options = options;
    if (typeof options.caseSensitive === 'undefined') options.caseSensitive = false;
    if (typeof options.sort === 'undefined') options.sort = true;
};

// === METHODS === //

/**
 * Searches for items in the haystack
 * @param {string} query The string to search
 * @return {Obbject[]} The matching results. Objects with two attributes: <code>item</code> and <code>score</code>.
 */
FuzzySearch.prototype.search = function (query) {
    if (typeof query === 'undefined') query = '';

    if (query === '') {
        return this.haystack;
    }

    var results = [];

    for (var i = 0, ni = this.haystack.length; i < ni; i++) {
        var item = this.haystack[i];
        if (this.keys.length === 0) {
            var score = FuzzySearch.match(item, query, this.options.caseSensitive);

            if (score > 0) {
                results.push({
                    "item": item,
                    "score": score
                });
            }

        } else {
            for (var y = 0, ny = this.keys.length; y < ny; y++) {
                var propertyValues = FuzzySearch.getDescendantProperty(item, this.keys[y]);
                var found = false;

                for (var z = 0, nz = propertyValues.length; z < nz; z++) {
                    var score = FuzzySearch.match(propertyValues[z], query, this.options.caseSensitive);

                    if (score > 0) {
                        found = true;

                        results.push({
                            "item": item,
                            "score": score
                        });

                        break;
                    }
                }

                if (found) {
                    break;
                }
            }
        }
    }

    if (this.options.sort) {
        results.sort(function (a, b) {
            return a.score - b.score
        });
    }

    return results;
};

// === STATIC === //

/**
 * Caculates the score of a string against a query
 * @static
 * @param {string} item The string to test
 * @param {string} query The string to search
 * @param {bool} [caseSensitive=false] Whether to check the case or not
 * @return {float} The score, a positive value.<br/>
 * - <code>0</code>: no match<br/>
 * - <code>1</code>: perfect match<br/>
 * - <code>>1</code>: the lower the score, the better the match<br/>
 */
FuzzySearch.match = function (item, query, caseSensitive) {

    if (typeof caseSensitive === 'undefined') caseSensitive = false;
    if (!caseSensitive) {
        item = item.toLowerCase();
        query = query.toLowerCase();
    }

    // Exact matches should be first.
    if (item === query) {
        return 1;
    }

    // If the query is longher than the item, inverse the two
    if (query.length > item.length) {
        var t = item;
        item = query;
        query = t;
    }

    var indexes = FuzzySearch.nearestIndexesFor(item, query);

    if (!indexes) {
        return 0;
    }

    // Matches closest to the start of the string should be first.
    var o = indexes[0];
    // More indices is better (the best is as many indexes as item letters)
    var num = item.length - indexes.length;
    // We want to match as many letters as there are in the query too
    num += query.length - indexes.length;
    // and the closest the indices the better
    var close = indexes[indexes.length - 1] - indexes[0] + 1;
    // taking into account the number of letters in the query
    close /= indexes.length;
    return 2 + close + o + num;
}

// Low-level undocumented method
// Gets suboject from a path string like "obj.key1.key2"
FuzzySearch.getDescendantProperty = function (object, path, list) {
    if (typeof list === 'undefined') list = [];
    var firstSegment;
    var remaining;
    var dotIndex;
    var value;
    var index;
    var length;

    if (path) {
        dotIndex = path.indexOf('.');

        if (dotIndex === -1) {
            firstSegment = path;
        } else {
            firstSegment = path.slice(0, dotIndex);
            remaining = path.slice(dotIndex + 1);
        }

        value = object[firstSegment];

        if (value !== null && typeof value !== 'undefined') {
            if (!remaining && (typeof value === 'string' || typeof value === 'number')) {
                list.push(value);
            } else if (Object.prototype.toString.call(value) === '[object Array]') {
                for (index = 0, length = value.length; index < length; index++) {
                    FuzzySearch.getDescendantProperty(value[index], remaining, list);
                }
            } else if (remaining) {
                FuzzySearch.getDescendantProperty(value, remaining, list);
            }
        }
    } else {
        list.push(object);
    }

    return list;
}

FuzzySearch.nearestIndexesFor = function (item, query) {
    var letters = query.split('');
    var indexes = [];

    var indexesOfFirstLetter = FuzzySearch.indexesOfFirstLetter(item, query);

    for (var i = 0, ni = indexesOfFirstLetter.length; i < ni; i++) {
        var startingIndex = indexesOfFirstLetter[i];
        var index = startingIndex + 1;

        indexes[i] = [startingIndex];

        for (var j = 1, nj = letters.length; j < nj; j++) {
            var letter = letters[j];

            index = item.indexOf(letter, index);

            if (index === -1) {
                indexes[i] = false;

                break;
            }

            indexes[i].push(index);

            index++;
        }
    }

    indexes = FuzzySearch.arrayFilter(indexes, function(letterIndexes){ return letterIndexes !== false });

    if (!indexes.length) {
        return false;
    }

    return indexes.sort(function(a, b) {
        if (a.length === 1) {
            return a[0] - b[0];
        }

        a = a[a.length - 1] - a[0];
        b = b[b.length - 1] - b[0];

        return a - b;
    })[0];
}

FuzzySearch.indexesOfFirstLetter = function (item, query) {
    var match = query[0];

    var result = FuzzySearch.arrayMap( item.split(''), function(letter, index) {
            if (letter !== match) {
                return false;
            }
            return index;
        });
    
    return FuzzySearch.arrayFilter( result, function(index) {
        return index !== false;
    });
}

// Low-level undocumented method
// Reimplements Array.prototype.map, missing in ExtendScript
FuzzySearch.arrayMap = function (arr, callbackFn) {
    var result = [];
    for(var i = 0, ni = arr.length; i < ni; i++)
    {
        result.push(
            callbackFn( arr[i], i, arr )
            );
    }
    return result;
}

// Low-level undocumented method
// Reimplements Array.prototype.filter, missing in ExtendScript
FuzzySearch.arrayFilter = function (arr, callbackFn) {
    var result = [];
    for(var i = 0, ni = arr.length; i < ni; i++)
    {
        if (callbackFn( arr[i], i, arr ))
            result.push( arr[i] );
    }
    return result;
}