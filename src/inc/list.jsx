﻿/**
 * Constructs a new DuList object
 * @class
 * @name DuList
 * @classdesc DuList helps manipulating JS Arrays and After Effects Collections the same way. It is faster than converting a Collection to an Array.<br />
 * Other specific Adobe Lists in other Applications may be supported later.<br />
 * The first item of a DuList is always at index 0, the last at index length-1.<br />
 * Accessor is the {@link DuListat DuList.at()} method instead of <code>Array</code>.<br />
 * List length is given by the {@link DuListlength DuList.length()} method instead of a property.<br />
 * DuList does not reimplement methods to add or remove items, use the source list instead with the {@link DuListlist DuList.list()} property
 * and the original methods (from the <code>Collection</code> instance or <code>Array</code>).<br />
 * DuList can also be used as an iterator with iterator-like methods like {@link DuListnext DuList.next()}.<br />
 * You can also run a function on each item with {@link DuList do DuList.do()}.
 * @param {any | any[] | Collection | DuList} [obj] If a single obj is passed, it's used as the only element in the list
 * @property {boolean} isCollection - true if the original list is an After Effects Collection, false otherwise
 * @property {boolean} isArray - true if the original  list is an Array, false otherwise
 * @category DuESF
 */
function DuList(obj) {
    obj = def(obj, []);
    var newList = obj;
    // Copy constructor
    if (obj instanceof DuList)
        newList = obj.list;

    /**
     * True if the original list is an After Effects Collection, false otherwise.
     * @memberof DuList.prototype
     * @name isCollection
     * @readonly
     * @type {Boolean}
     * @ts-ignore */
    this.isCollection = false;
    /**
     * True if the original list is an Array, false otherwise
     * @memberof DuList.prototype
     * @name isArray
     * @readonly
     * @type {Boolean}
     * @ts-ignore */
    this.isArray = true;

    //check if list is an Array or a Collection
    if (DuESF.host == DuESF.HostApplication.AFTER_EFFECTS) {
        if (
            newList instanceof ItemCollection ||
            newList instanceof LayerCollection ||
            newList instanceof OMCollection ||
            newList instanceof RQItemCollection
        ) {
            /// @ts-ignore
            this.isCollection = true;
            /// @ts-ignore
            this.isArray = false;
        }
    }

    //if not a list, store it as a one-item array
    if (!(
            newList instanceof Array ||
            newList instanceof ItemCollection ||
            newList instanceof LayerCollection ||
            newList instanceof OMCollection ||
            newList instanceof RQItemCollection ||
            newList instanceof DuList
        )) {
        newList = [newList];
    }

    /**
     * The original list, an Array or an After Effects Collection.
     * @memberof DuList.prototype
     * @name list
     * @readonly
     * @type {Array|Collection}
     * @ts-ignore */
    this.list = newList;
    /**
     * The current index of the iterator.
     * @memberof DuList.prototype
     * @name current
     * @readonly
     * @type {number}
     * @ts-ignore */
    this.current = -1;
    /**
     * True if the iterator is at the start.
     * @memberof DuList.prototype
     * @name atStart
     * @readonly
     * @type {Boolean}
     * @ts-ignore */
    this.atStart = false;
    /**
     * True if the iterator has reached the end.
     * @memberof DuList.prototype
     * @name atEnd
     * @readonly
     * @type {Boolean}
     * @ts-ignore */
    this.atEnd = false;
    /**
     * True if the iterator is between 0 and length-1. Note that on creation, the iterator is always invalid, but calling {@link DuList#next DuList.next()} moves it to the beginning and makes it valid.
     * @memberof DuList.prototype
     * @name valid
     * @readonly
     * @type {Boolean}
     * @ts-ignore */
    this.valid = false;
}

/**
 * Returns the number of items in the list
 * @return {number} The number of items.
 */
DuList.prototype.length = function() {
    return this.list.length;
}

/**
 * Alias for {@link DuList#length DuList.length()}
 * @alias DuList.length()
 * @name count
 * @memberof DuList.prototype
 * @function
 */
DuList.prototype.count = DuList.prototype.length;

/**
 * Accessor. First item is always 0, last is always length()-1<br />
 * Does not move the iterator to the index; to move the iterator use {@link DuList.goTo} instead.
 * @param {number} index The index of the item. If it is out of range (negative or > length()-1), returns null
 * @return  {object} The item at the given index.
 */
DuList.prototype.at = function(index) {
    var count = this.length();
    if (count == 0) return null;

    var min, max;

    if (this.isCollection) {
        min = 1;
        index++;
        max = count;
    } else {
        min = 0;
        max = count - 1;
    }

    if (index < min) return null;
    if (index > max) return null;

    return this.list[index];
}

/**
 * Gets the first index of a value, or -1 if not found
 * @memberof DuList
 * @param {*}	value	- The value to find. Must be compatible with the == operand if you don't provide a comparison function
 * @param {function}	[comparisonFunction]	- A function which compares two values which returns true if the values are considered the same.
 * @return {number}	The index of the value, -1 if not found
 */
DuList.prototype.indexOf = function(value, comparisonFunction) {
    if (DuDebug.checkVar(value, 'value', undefined, 'DuList.indexOf( value, comparisonFunction )') !== true)
        return -1;

    var useFunction = isdef( comparisonFunction );

    for (var i = 0, n = this.length(); i < n; i++) {
        if (!useFunction && this.at(i) == value) return i;
        else if (useFunction && comparisonFunction(this.at(i), value)) return i;
    }
    return -1;
}

/**
 * Checks if the list contains the item
 * @memberof DuList
 * @param {*}	value	- The value to find. Must be compatible with the == operand if you don't provide a comparison function
 * @param {function}	[comparisonFunction]	- A function which compares two values which returns true if the values are considered the same.
 * @return {Boolean}
 */
DuList.prototype.contains = function(value, comparisonFunction) {
    /// @ts-ignore
    return this.indexOf(value, comparisonFunction) >= 0;
}

/**
 * Checks if the list has duplicated values
 * @memberof DuList
 * @return {boolean}	true if the list has duplicated values. Always false for Ae Collections as they can't have duplicated items.
 */
DuList.prototype.hasDuplicates = function() {
    for (var i = 0, n = this.length(); i < n; i++) {
        for (var j = i + 1; j < n; j++) {
            if (this.at(i) === this.at(j)) return true;
        }
    }
    return false;
}

/**
 * Returns all duplicated values found in the list
 * @memberof DuList
 * @return {DuList}	The duplicated values. An empty list for Ae Collections as they can't have duplicated items.
 */
DuList.prototype.getDuplicates = function() {
    if (this.isCollection) return new DuList();

    var duplicates = [];

    for (var i = 0, n = this.length(); i < n; i++) {
        for (var j = i + 1; j < n; j++) {
            if (this.at(i) === this.at(j)) duplicates.push(this.at(j));
        }
    }

    var duplicateList = new DuList(duplicates);
    duplicateList.removeDuplicates();

    return duplicateList;
}

/**
 * Removes all duplicated values from the list, and returns them.<br />
 * The internal list may be converted to an Array if needed.<br />
 * The iterator invalidated.
 * @memberof DuList
 * @param {function}	[comparisonFunction] - A function which compares two values which returns true if the values are considered the same.
 * @return {DuList}	The duplicated (and removed) values. An empty list for Ae Collections as they can't have duplicated items.
 */
DuList.prototype.removeDuplicates = function(comparisonFunction) {
    // Convert to an Array
    this.convertToArray();

    var useFunction = isdef( comparisonFunction );
    var removed = [];

    for (var i = 0, n = this.length(); i < n; i++) {
        for (var j = n - 1; j > i; j--) {
            if (!useFunction && this.at(i) == this.at(j)) {
                /// @ts-ignore The list  was converted to an array
                removed = removed.concat(this.list.splice(j, 1));
            } else if (useFunction && comparisonFunction(this.at(i), this.at(j))) {
                /// @ts-ignore The list  was converted to an array
                removed = removed.concat(this.list.splice(j, 1));
            }
        }
    }

    /// @ts-ignore
    this.valid = false;
    /// @ts-ignore
    this.current = -1;

    return new DuList(removed);
}

/**
 * Compares two arrays.<br />
 * The items in the arrays must be compatible with the == operand if you don't provide a comparison function
 * @memberof DuList
 * @param {Array|Collection|DuList} other - The other list
 * @param {function}	[comparisonFunction] - A function which compares two values which returns true if the values are considered the same.
 * @param {number} [floatPrecision=-1] - The precision for (float) number comparison, number of decimals. Set to -1 to not use.
 * @return {boolean} true if the two arrays contain the same values
 */
DuList.prototype.equals = function(other, comparisonFunction, floatPrecision) {
    var useFunction = typeof comparisonFunction === 'function';

    if (!DuList.isList(other)) return false;

    other = new DuList(other);

    if (this.length() != other.length()) return false;

    var originalIndex = this.current;

    this.reinitIterator();
    var ok = true;
    var item1;
    while (item1 = this.next()) {
        var item2 = other.at(this.current);

        // A list, recursive
        if (DuList.isList(item1)) {
            var test = new DuList(item1);
            if (!test.equals(item2, comparisonFunction, floatPrecision)) {
                ok = false;
                break;
            }
            continue;
        }

        // Comparison function
        if (useFunction) {
            if (!comparisonFunction(item1, item2)) {
                ok = false;
                break;
            }
            continue;
        }

        // Numbers
        if (jstype(item1) == 'number') {
            if (!DuMath.equals(item1, item2, floatPrecision)) {
                ok = false;
                break;
            }
            continue;
        }

        // Other
        if (item1 != item2) {
            ok = false;
            break;
        }
    }

    // Restore original iterator index
    this.goTo(originalIndex);
    return ok;
}

/**
 * Returns true if the list is empty
 * @return {boolean}
 */
DuList.prototype.isEmpty = function() {
    return this.length() == 0;
}

/**
 * Gets the last item in the list
 * @return {*} The last item, null if the list is empty.
 */
DuList.prototype.last = function() {
    if (this.isEmpty()) return null;
    return this.at(this.length() - 1);
}

/**
 * Gets the first item in the list
 * @return {*} The first item, null if the list is empty.
 */
DuList.prototype.first = function() {
    if (this.isEmpty()) return null;
    return this.at(0);
}

/**
 * Converts the stored list to an Array if it was a Collection.<br />
 * This enables the modification of the list, but changes in the list will not be reflected in the application (if a layer is removed from the list, it is not removed in the application).
 */
DuList.prototype.convertToArray = function(index) {
    // Nothing to do
    if (!this.isCollection) return;

    // The new array
    var arr = [];
    for (var i = 1, n = this.list.length; i <= n; i++) {
        arr.push(this.list[i]);
    }

    /// @ts-ignore
    this.isCollection = false;
    /// @ts-ignore
    this.isArray = true;
    /// @ts-ignore
    this.list = arr;

}

/**
 * Removes the item at the given index. The internal list may be converted to an Array if needed.<br />
 * The iterator invalidated.
 * @param {number} index The index.
 */
DuList.prototype.remove = function(index) {
    // Convert to an Array
    this.convertToArray();
    /// @ts-ignore The list was conerted to an Array
    this.list.splice(index, 1);

    /// @ts-ignore
    this.valid = false;
    /// @ts-ignore
    this.current = -1;
}

/**
 * Removes the first value from the list. The value must be checkable with the <code>==</code> operator if no <code>comparisonFunction</code> is provided.<br />
 * The internal list may be converted to an Array if needed.<br />
 * The iterator invalidated.
 * @param {any} value The value.
 * @param {function} [comparisonFunction] A function which compares two values which returns true if the values are considered the same.
 */
DuList.prototype.removeOne = function(value, comparisonFunction) {
    // Convert to an Array
    this.convertToArray();

    var index = this.indexOf(value, comparisonFunction);
    if (index >= 0) this.remove(index);

    /// @ts-ignore
    this.valid = false;
    /// @ts-ignore
    this.current = -1;
}

/**
 * Removes all occurences of the value from the list. The value must be checkable with the <code>==</code> operator if no <code>comparisonFunction</code> is provided.<br />
 * The internal list may be converted to an Array if needed.<br />
 * The iterator invalidated.
 * @param {number} value The value.
 * @param {function} [comparisonFunction] A function which compares two values which returns true if the values are considered the same.
 * @return {number} The number of items removed.
 */
DuList.prototype.removeAll = function(value, comparisonFunction) {
    // Convert to an Array
    this.convertToArray();

    var count = 0;
    var index;
    do {
        index = this.indexOf(value, comparisonFunction);
        if (index >= 0) this.remove(index);
        count++;
    }
    while (index >= 0);

    /// @ts-ignore
    this.valid = false;
    /// @ts-ignore
    this.current = -1;

    return count;
}

/**
 * Reimplements the Array.sort() method.<br />
 * The internal list may be converted to an Array if needed.<br />
 * The iterator is invalidated.
 * @param {function} compareFunction Specifies a function that defines the sort order. If omitted, the array elements are converted to strings, then sorted according to each character's Unicode code point value.
 * @return {Array} The sorted array. Note that the array is sorted in place, and no copy is made.
 */
DuList.prototype.sort = function(compareFunction) {
    // Convert to an Array
    this.convertToArray();

    /// @ts-ignore The list was converted to an Array
    if (!isdef( compareFunction )) this.list.sort();
    /// @ts-ignore The list was converted to an Array
    else this.list.sort(compareFunction);

    /// @ts-ignore
    this.valid = false;
    /// @ts-ignore
    this.current = -1;

    /// @ts-ignore The list was converted to an Array
    return this.list;
}

/**
 * Adds one or more elements to the end of the list and returns the new length of the list.<br />
 * The internal list may be converted to an Array if needed.
 * @ts-ignore
 * @param {any[]} elements The element(s) to add to the end of the array. You can pass an array or multiple arguments
 * @return {number} The new length of the list.
 */
DuList.prototype.push = function() {
    this.convertToArray();

    var items = [];
    if (arguments.length == 1 && arguments[0] instanceof Array) items = arguments[0];
    /// @ts-ignore
    else items = arguments;

    for (var i = 0, n = items.length; i < n; i++) {
        /// @ts-ignore The list was converted to an Array
        this.list.push(items[i]);
    }

    return this.list.length;
}

/**
 * Mergeserge two lists.<br />
 * This method does not change the existing list, but instead returns a new list. 
 * @param {Array|DuList} other The other list.
 * @return {DuList} The new list.
 */
DuList.prototype.concat = function(other) {
    // Make copies to not modify existing lists
    other = new DuList(other);
    var current = new DuList(this);
    // Convert to arrays
    other.convertToArray();
    current.convertToArray();
    /// @ts-ignore The list was converted to an Array
    return new DuList( current.list.concat(other.list) );
}

/**
 * Adds one or more elements to the end of the list and returns the new length of the list, only if the value is not already in the list<br />
 * The internal list may be converted to an Array if needed.
 * @param {function} comparisonFunction A function which compares two values which returns true if the values are considered the same.
 * @param {any[]} element0 The element(s) to add to the end of the array. You can pass an array or a list of separated arguments
 * @return {number} The new length of the list.
 */
DuList.prototype.pushUnique = function(comparisonFunction) {
    this.convertToArray();

    var items = [];
    var i = 0;
    if (arguments.length == 2 && arguments[1] instanceof Array) {
        items = arguments[1];
    }
    else {
        /// @ts-ignore
        items = arguments;
        i =  1;
    }

    for (var n = arguments.length; i < n; i++) {
        var arg = arguments[i];
        if (this.indexOf(arg, comparisonFunction) >= 0) continue;
        this.push(arg);
    }

    return this.list.length;
}

/**
 * Alias for {@link DuList#push DuList.push()}
 * @alias DuList.push()
 * @name append
 * @memberof DuList.prototype
 * @function
 */
DuList.prototype.append = DuList.prototype.push;

/**
 * Alias for {@link DuList#pushUnique DuList.pushUnique()}
 * @alias DuList.pushUnique()
 * @name appendUnique
 * @memberof DuList.prototype
 * @function
 */
DuList.prototype.appendUnique = DuList.prototype.pushUnique;

/**
 * Merges the new array to the current list.<br />
 * Note that to the contrary of the <code>Array.concat()</code> method, this does not create a new list, but modifies the current one in place.<br />
 * The internal list may be converted to an Array if needed.
 * @param {any[]} arr The other array.
 * @return {number} The new length of the list.
 */
DuList.prototype.merge = function(arr) {
    this.convertToArray();

    /// @ts-ignore
    this.list = this.list.concat(arr);

    return this.list.length;
}

/**
 * Merges the new array to the current list.<br />
 * Will only add items if they're not already in the list.<br />
 * Note that to the contrary of the <code>Array.concat()</code> method, this does not create a new list, but modifies the current one in place.<br />
 * The internal list may be converted to an Array if needed.
 * @param {any[]|DuList} arr The other array/list.
 * @param {function} [comparisonFunction] A function which compares two values which returns true if the values are considered the same.
 * @return {number} The new length of the list.
 */
DuList.prototype.mergeUnique = function(arr, comparisonFunction) {
    arr = new DuList(arr);
    this.convertToArray();

    for (var i = 0, n = arr.length(); i < n; i++) {
        this.pushUnique(comparisonFunction, arr.at(i));
    }

    return this.list.length;
}

/**
 * Reimplementation of the <code>Array.join</code> function.<br />
 * For collections, the name of the item will be used, or any other property which makes sense as a string list.
 * @param {string} separator The separator to use
 * @return {string} The new length of the list.
 */
DuList.prototype.join = function(separator) {
    /// @ts-ignore
    if (this.isArray) return this.list.join(separator);

    // Collection without "name" property
    if (this.list instanceof RQItemCollection) {
        var str = '';
        this.do(function(item) {
            if (this.current != 0) str += separator;
            str += item.comp.name;
            if (item.status == RQItemStatus.WILL_CONTINUE) str += ' (will continue)';
            else if (item.status == RQItemStatus.NEEDS_OUTPUT) str += ' (no output)';
            else if (item.status == RQItemStatus.UNQUEUED) str += ' (disabled)';
            else if (item.status == RQItemStatus.QUEUED) str += ' (ready)';
            else if (item.status == RQItemStatus.RENDERING) str += ' (rendering)';
            else if (item.status == RQItemStatus.USER_STOPPED) str += ' (stopped)';
            else if (item.status == RQItemStatus.ERR_STOPPED) str += ' (rendering error)';
            else if (item.status == RQItemStatus.DONE) str += ' (done)';
        });
        return str;
    }

    // Other collections have a "name" property
    var str = '';
    this.do(function(item) {
        if (this.current != 0) str += separator;
        str += item.name;
    });
    return str;
}

/**
 * Replaces all occurences of a value with another value.<br />
 * The internal list may be converted to an Array if needed.
 * @param {any} previousValue The current value
 * @param {any} newValue The new value
 * @param {function} [comparisonFunction] A function which compares two values which returns true if the values are considered the same.
 * @return {number} The number of occurences which were updated.
 */
DuList.prototype.replace = function(previousValue, newValue, comparisonFunction) {
    this.convertToArray();

    var useFunction = isdef( comparisonFunction );

    var count = 0;

    for (var i = 0, n = this.length(); i < n; i++) {
        if (!useFunction && this.at(i) == previousValue) {
            this.list[i] = newValue;
            count++;
        } else if (useFunction && comparisonFunction(this.at(i), previousValue)) {
            this.list[i] = newValue;
            count++;
        }
    }

    return count;
}

/**
 * Removes the last element of the list and returns it.<br />
 * The internal list may be converted to an Array if needed.
 * @return {any|null} The last element or null if the list is empty.
 */
DuList.prototype.pop = function() {
    this.convertToArray();
    /// @ts-ignore
    return this.list.pop();
}

// ================ ITERATOR METHODS ================

/**
 * Reinits the iterator, i.e. go to index -1 so that the next call to {@link DuList.next} returns the first item.
 */
DuList.prototype.reinitIterator = function() {
    this.goTo(-1);
}

/**
 * Sets the iterator on the index
 * @param {number} index - The index
 * @return {*} The item at index, or null if the index is invalid
 */
DuList.prototype.goTo = function(index) {
    /// @ts-ignore
    this.current = index;

    var count = this.length();

    /// @ts-ignore
    if (this.current < 0 || this.current >= count) this.valid = false;
    /// @ts-ignore
    else this.valid = true;

    /// @ts-ignore
    if (this.current == 0) this.atStart = true;
    /// @ts-ignore
    else this.atStart = false;

    /// @ts-ignore
    if (this.current == count - 1) this.atEnd = true;
    /// @ts-ignore
    else this.atEnd = false;

    if (this.valid) return this.at(this.current);
    else return null;
}

/**
 * Goes to the end of the Iterator
 * @return {Object} The item at the end, or null if length is 0
 */
DuList.prototype.goToEnd = function() {
    if (this.isEmpty()) return null;
    return this.goTo(this.length() - 1);
}

/**
 * Goes to the start of the Iterator
 * @return {Object} The item at the start, or null if length is 0
 */
DuList.prototype.goToStart = function() {
    if (this.isEmpty()) return null;
    return this.goTo(0);
}

/**
 * Increments the Iterator<br />
 * Must be called at least once to validate the iterator
 * @return {any} The next item, or null if there isn't
 */
DuList.prototype.next = function() {
    if (this.isEmpty()) return null;

    if (!this.valid) {
        return this.goToStart();
    }

    if (this.current < this.length() - 1) {
        return this.goTo(this.current + 1);
    }

    this.goTo(this.current + 1);
    return null;
}

/**
 * Decrements the Iterator
 * if it's called while valid is false, goes to the end
 * @return {Object} The previous item, or null if there isn't
 */
DuList.prototype.previous = function() {
    if (this.isEmpty()) return null;

    if (!this.valid) {
        return this.goToEnd();
    }

    if (this.current > 0) {
        return this.goTo(this.current - 1);
    }

    return null;
}

/**
 * Executes a function on each item of the List
 * @param {function} callBack - The function to execute, which takes one parameter: an item of the list
 * @param {Boolean} [reverse=false] - Set this to true to iterate from the end.
 */
DuList.prototype.do = function(callBack, reverse) {
    if (this.isEmpty()) return;

    reverse = def(reverse, false);

    // Keep the current index
    var current = this.current;

    if (reverse)
    {
        for (var i = this.length() - 1; i >= 0; i--) {
            /// @ts-ignore
            this.valid = true;
            /// @ts-ignore
            this.current = i;
            callBack(this.at(i));
        }
    }
    else
    {
        for (var i = 0, n = this.length(); i < n; i++) {
            /// @ts-ignore
            this.valid = true;
            /// @ts-ignore
            this.current = i;
            callBack(this.at(i));
        }
    }
    
    // Restore the current index
    this.goTo(current);
}


// ================ STATIC ==========================

/**
 * Checks if this is an Array or an After Effects collection type or a {@link DuList}
 * @static
 * @param {Array|Collection|DuList} list - The list to check
 * @return {boolean} true if this is a Cllection or an Array or a {@link DuList}
 */
DuList.isList = function(list) {
    return (
        list instanceof Array ||
        list instanceof ItemCollection ||
        list instanceof LayerCollection ||
        list instanceof OMCollection ||
        list instanceof RQItemCollection ||
        list instanceof DuList
    );
}
