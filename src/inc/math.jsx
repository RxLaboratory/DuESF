/**
 * Math related methods
 * @namespace
 * @category DuESF
 */
var DuMath = {};

/**
 * Enum for locations.
 * @readonly
 * @static
 * @enum {Number}
 * @ts-ignore */
DuMath.Location = {
    TOP: 1,
    TOP_RIGHT: 2,
    RIGHT: 3,
    BOTTOM_RIGHT: 4,
    BOTTOM: 5,
    BOTTOM_LEFT: 6,
    LEFT: 7,
    TOP_LEFT: 8,
    CENTER: 0
}

/**
 * Checks if the given location is on the right side
 * @param {DuMath.Location} location The location
 * @returns {boolean}
 */
DuMath.isLocationRight = function(location) {
    if (location == DuMath.Location.TOP_RIGHT) return true;
    if (location == DuMath.Location.RIGHT) return true;
    if (location == DuMath.Location.BOTTOM_RIGHT) return true;
    return false;
}

/**
 * Checks if the given location is on the center on the horizontal axis
 * @param {DuMath.Location} location The location
 * @returns {boolean}
 */
DuMath.isLocationHCenter = function(location) {
    if (location == DuMath.Location.TOP) return true;
    if (location == DuMath.Location.CENTER) return true;
    if (location == DuMath.Location.BOTTOM) return true;
    return false;
}

/**
 * Checks if the given location is on the left side
 * @param {DuMath.Location} location The location
 * @returns {boolean}
 */
DuMath.isLocationLeft = function(location) {
    if (location == DuMath.Location.TOP_LEFT) return true;
    if (location == DuMath.Location.LEFT) return true;
    if (location == DuMath.Location.BOTTOM_LEFT) return true;
    return false;
}

/**
 * Checks if the given location is on the top side
 * @param {DuMath.Location} location The location
 * @returns {boolean}
 */
DuMath.isLocationTop = function(location) {
    if (location == DuMath.Location.TOP) return true;
    if (location == DuMath.Location.TOP_RIGHT) return true;
    if (location == DuMath.Location.TOP_LEFT) return true;
    return false;
}

/**
 * Checks if the given location is on the center on the vertical axis
 * @param {DuMath.Location} location The location
 * @returns {boolean}
 */
DuMath.isLocationVCenter = function(location) {
    if (location == DuMath.Location.LEFT) return true;
    if (location == DuMath.Location.CENTER) return true;
    if (location == DuMath.Location.RIGHT) return true;
    return false;
}

/**
 * Checks if the given location is on the bottom side
 * @param {DuMath.Location} location The location
 * @returns {boolean}
 */
DuMath.isLocationBottom = function(location) {
    if (location == DuMath.Location.BOTTOM_RIGHT) return true;
    if (location == DuMath.Location.CENTER) return true;
    if (location == DuMath.Location.BOTTOM_LEFT) return true;
    return false;
}

/**
 * Returns the location of the point relative to the origin. Works with 2D values, the first two coordinates.
 * Considers the coordinate [0,0] to be the top left corner of the system: positive values are right, bottom
 * @param {float[]} point The point to check
 * @param {float[]} [origin=[0,0]] The coordinates of the origin
 * @return {DuMath.Location} The location
 */
DuMath.relativeLocation = function(point, origin) {
    var x = point[0] - origin[0];
    var y = point[1] - origin[1];
    if (x == 0 && y == 0) return DuMath.Location.CENTER;
    if (x < 0 && y < 0) return DuMath.Location.TOP_LEFT;
    if (x < 0 && y == 0) return DuMath.Location.LEFT;
    if (x < 0 && y > 0) return DuMath.Location.BOTTOM_LEFT;
    if (x == 0 && y > 0) return DuMath.Location.BOTTOM;
    if (x > 0 && y > 0) return DuMath.Location.BOTTOM_RIGHT;
    if (x > 0 && y == 0) return DuMath.Location.RIGHT;
    if (x > 0 && y < 0) return DuMath.Location.TOP_RIGHT;
    if (x == 0 && y < 0) return DuMath.Location.TOP;
}

/**
 * Generates a random integer between minimum and maximum
 * @memberof DuMath
 * @param {int}	[min=0]	- The minimum value
 * @param {int}	[max=1]	- The maximum value
 * @return {int}	The randomly generated integer
 */
DuMath.random = function(min, max) {
    if (min == undefined) min = 0;
    if (max == undefined) max = 1;
    var rng = null;
    $.sleep(10);
    var date = new Date();
    var rng = new Math.seedrandom(date.getTime())();
    //rng = Math.random();

    if (!rng) return 0;
    return rng * (max - min) + min;
}

/**
 * Generates a random integer between minimum and maximum.<br/>
 * The results are distributed along a gaussian (bell) curve.<br/>
 * Note that a few (< 10%) values may be outside of the range. Set the <code>bounded</code> to true to avoid that.
 * @memberof DuMath
 * @param {int}	[min=0]	- The minimum value
 * @param {int}	[max=1]	- The maximum value
 * @param {Bool} [bounded=false] - When this is false, a few values may be outside the range. Set it to true to make sure all values are between min and max.
 * @return {int}	The randomly generated integer
 */
DuMath.gaussRandom = function(min, max, bounded) {
    min = def(min, 0);
    max = def(max, 1);
    bounded = def(bounded, false);

    var u = 0, v = 0;
    while(u === 0) u = DuMath.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = DuMath.random();
    var num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (bounded && (num > 1 || num < 0)) return DuMath.gaussRandom(min, max, true); // resample between 0 and 1
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
}

/**
 * Generates a zero value
 * @param {number} dimensions The number of needed dimensions
 * @return {number[]} Zero [0, ..., 0]
 */
DuMath.zero = function( dimensions ) {
    var z = new Array(dimensions);
    for (var i = 0; i < dimensions; i++) {
        z[i] = 0;
    }
    return z;
}

/**
 * Measures the vector length between two points
 * @param {number|number[]} value1 - The first value
 * @param {number|number[]} [value2=[0,0]] - The second value. If omitted, returns the difference between the two first values of value1
 * @return {number} The length
 */
DuMath.length = function(value1, value2) {
    if (typeof value2  === 'undefined') {
        if (!(value1 instanceof Array)) return value1;
        value2 = DuMath.zero(value1.length);
    }

    if (typeof value1 !== typeof value2) {
        throw "DuMath.length(): TypeError: value1 and value2 must be the same time but value is " + typeof value1 + " and value2 is " + typeof value2 + ".";
    }

    if (!(value1 instanceof Array)) {
        value1 = [value1];
        /// @ts-ignore
        value2 = [value2];
    }


    /// @ts-ignore
    while (value2.length < value1.length) value2.push(0);
    
    var result = 0;
    for (var dim = 0; dim < value1.length; dim++) {
        result += (value1[dim] - value2[dim]) * (value1[dim] - value2[dim]);
    }
    result = Math.sqrt(result);
    return result;
}

/**
 * Compares two numbers
 * @memberof DuMath
 * @param {Number|Number[]} value1 - The first value
 * @param {Number|Number[]} value2 - The second value
 * @param {int} [floatPrecision=-1] - The precision for (float) number comparison, number of decimals. Set to -1 to not use.
 * @return {boolean} true if the two values are equal
 */
DuMath.equals = function(value1, value2, floatPrecision, test) {
    floatPrecision = def(floatPrecision, -1);
    value1 = new DuList(value1);
    value2 = new DuList(value2);

    if (value1.length() != value2.length()) return false;

    var item1 = value1.next();
    while(item1 !== null)
    {
        var item2 = value2.at(value1.current);
        if (jstype(item1) !== jstype(item2)) return false;
        if (jstype(item1) === 'array') return DuMath.equals(item1, item2, floatPrecision);
        if (jstype(item1) !== 'number') return false;

        if (floatPrecision >= 0) {
            var mul = Math.pow(10, floatPrecision);
            var num1 = Math.round(item1 * mul) / mul;
            var num2 = Math.round(item2 * mul) / mul;
            if (num1 != num2) return false;
        } else  if (item1 != item2) return false;

        item1 = value1.next();
    }

    return true;
}

/**
 * Calculates the log10 of a number
 * @memberof DuMath
 * @param {float}	w	- The number
 * @return {float}	The result of log10(x)<br />
 * i.e. Math.log(x)/Math.LN10
 */
DuMath.log10 = function(x) {
    return Math.log(x) / Math.LN10;
}

/**
 * Calculates the average value in a list
 * @memberof DuMath
 * @param {Number|Number[]}	values	- values
 * @return {float}	The average value
 */
DuMath.average = function(values) {
    if (!(values instanceof Array)) return values;
    var sum = 0;
    var total = values.length;
    if (total == 0) return 0;
    for (var i = 0; i < total; i++) {
        sum += values[i];
    }
    return sum / total;
}

/**
 * Alias for {@link DuMath.average}.
 * @memberof DuMath
 * @function
 */
DuMath.mean = DuMath.average;

/**
 * Clamps the value
 * @memberof DuMath
 * @param {Number|Number[]}	values	- values
 * @param {Number}	[min=0] - The minimum value
 * @param {Number}	[max=1] - The maximum value
 * @return {Number|Number[]}	The clamped values
 */
DuMath.clamp = function(values, min, max) {
    if (!isdef( min )) min = 0;
    if (!isdef( max )) max = 1;

    if (max < min) {
        var t = max;
        max = min;
        min = t;
    }

    var isArray = true;
    var result = [];
    if (!(values instanceof Array)) {
        isArray = false;
        values = [values];
    }
    for (var i = 0, num = values.length; i < num; i++) {
        var v = values[i];
        if (v < min) v = min;
        if (v > max) v = max;
        result.push(v);
    }
    if (isArray) return result;
    else return result[0];
}

/**
 * Converts the number from degrees to radians
 * @memberof DuMath
 * @param {number} value - the value
 * @return {float} The value in radians
 */
DuMath.toRadians = function(value) {
    return value * Math.PI / 180;
}

/**
 * Converts the number from radians to degrees
 * @memberof DuMath
 * @param {number} value - the value
 * @return {float} The value in degrees
 */
DuMath.toDegrees = function(value) {
    return value * 180 / Math.PI;
}

/**
 * The logistic function (sigmoid)
 * @param {Number} value The value
 * @param {Number} [midValue=0] The midpoint value, at which the function returns max/2
 * @param {Number} [min=0] The minimum return value
 * @param {Number} [max=1] The maximum return value
 * @param {Number} [rate=1] The logistic growth rate or steepness of the function
 * @return {Number} The result in the range [min, max] (excluding min and max)
 */
DuMath.logistic = function(value, midValue, min, max, rate) {
    if (!isdef( midValue )) midValue = 0;
    if (!isdef( min )) min = 0;
    if (!isdef( max )) max = 1;
    if (!isdef( rate )) rate = 1;
    var exp = -rate * (value - midValue);
    var result = 1 / (1 + Math.pow(Math.E, exp));
    return result * (max - min) + min;
}

/**
 * The inverse logistic function (inverse sigmoid)
 * @param {Number} v The variable
 * @param {Number} [midValue=0] The midpoint value, at which the function returns max/2 in the original logistic function
 * @param {Number} [min=0] The minimum return value of the original logistic function
 * @param {Number} [max=1] The maximum return value of the original logistic function
 * @param {Number} [rate=1] The logistic growth rate or steepness of the original logistic function
 * @return {Number} The result
 */
DuMath.inverseLogistic = function(v, midValue, min, max, rate) {
    if (!isdef( midValue )) midValue = 0;
    if (!isdef( max )) max = 1;
    if (!isdef( min )) min = 0;
    if (!isdef( rate )) rate = 1;

    if (v == min) return 0;

    return midValue - Math.log((max - min) / (v - min) - 1) / rate;
}

/**
 * The gaussian function
 * @param {Number} value The variable
 * @param {Number} [min=0] The minimum return value
 * @param {Number} [max=1] The maximum return value
 * @param {Number} [center=0] The center of the peak
 * @param {Number} [fwhm=1] The full width at half maximum of the curve
 * @return {Number} The result
 */
DuMath.gaussian = function(value, min, max, center, fwhm) {
    if (!isdef( max )) max = 1;
    if (!isdef( min )) min = 0;
    if (!isdef( center )) center = 0;
    if (!isdef( fwhm )) fwhm = 1;
    if (fwhm === 0 && value == center) return max;
    else if (fwhm === 0) return 0;

    var exp = -4 * Math.LN2;
    exp *= Math.pow((value - center), 2);
    exp *= 1 / Math.pow(fwhm, 2);
    var result = Math.pow(Math.E, exp);
    return result * (max - min) + min;
}

/**
 * A "reversed" gaussian function, growing faster with low value
 * @param {Number} value The variable
 * @param {Number} [min=0] The minimum return value
 * @param {Number} [max=1] The maximum return value
 * @param {Number} [center=0] The center of the peak
 * @param {Number} [fwhm=1] The full width at half maximum of the curve
 * @return {Number} The result
 */
DuMath.reversedGaussian = function(value, min, max, center, fwhm) {
    r = -value - fwhm + 1;
    return gaussian(value, min, max, center, r);
}

/**
 * The inverse gaussian function
 * @param {Number} v The variable
 * @param {Number} [min=0] The minimum return value of the corresponding gaussian function
 * @param {Number} [max=1] The maximum return value of the corresponding gaussian function
 * @param {Number} [center=0] The center of the peak of the corresponding gaussian function
 * @param {Number} [fwhm=1] The full width at half maximum of the curve of the corresponding gaussian function
 * @return {Number[]} The two possible results, the lower is the first in the list. If both are the same, it is the maximum
 */
DuMath.inverseGaussian = function(v, min, max, center, fwhm) {
    if (!isdef( max )) max = 1;
    if (!isdef( min )) min = 0;
    if (!isdef( center )) center = 0;
    if (!isdef( fwhm )) fwhm = 1;
    if (v == 1) return [center, center];
    if (v === 0) return [center + fwhm / 2, center - fwhm / 2];
    if (fwhm === 0) return [center, center];

    var result = (v - min) / (max - min);
    result = Math.log(result) * Math.pow(fwhm, 2);
    result = result / (-4 * Math.LN2);
    result = Math.sqrt(result);
    return [result + center, -result + center];
}

/**
 * The inverse of the reversed gaussian function
 * @param {Number} value The variable
 * @param {Number} [min=0] The minimum return value of the corresponding gaussian function
 * @param {Number} [max=1] The maximum return value of the corresponding gaussian function
 * @param {Number} [center=0] The center of the peak of the corresponding gaussian function
 * @param {Number} [fwhm=1] The full width at half maximum of the curve of the corresponding gaussian function
 * @return {Number[]} The two possible results, the lower is the first in the list. If both are the same, it is the maximum
 */
DuMath.inverseReversedGaussian = function(value, min, max, center, fwhm) {
    r = -value - fwhm + 1;
    return inverseGaussian(value, min, max, center, r);
}

/**
 * The linear function
 * @param {Number} value The variable
 * @param {Number} [min=0] The minimum input value
 * @param {Number} [max=1] The maximum input value
 * @param {Number} [targetMin=0] The minimum output value
 * @param {Number} [targetMax=1] The maximum output value
 * @param {Boolean} [clamp=false] Whether to clamp the output value to the target or not.
 * @returns {Number}
 */
DuMath.linear = function(value, min, max, targetMin, targetMax, clamp) {
    min = def(min, 0);
    max = def(max, 1);
    targetMin = def(targetMin, 0);
    targetMax = def(targetMax, 1);
    clamp = def(clamp, false);

    // Handle stupid values
    if (min == targetMin && max == targetMax) return value;
    if (min == max) return value;
    if (targetMin == targetMax) return targetMin;
    if (value == min) return targetMin;
    if (value == max) return targetMax;

    var result = targetMin + (value - min) / (max - min) * (targetMax - targetMin);
    if (clamp) result = DuMath.clamp(value, targetMin, targetMax);
    return result;
}

/**
 * Checks if a point is located inside given bounds
 * @param {float[]} point The point
 * @param {float[]} bounds The bounds. The number of bounds must be at least twice the number of dimensions, in this order : [a1, a2, ..., x1,x2,y1,y2,z1,z2]
 * @return {Boolean} true if the point is inside the bounds
 */
DuMath.isInside = function(point, bounds) {
    for (var i = 0, n = point.length; i < n; i++) {
        var c = point[i];
        var c1 = bounds[i * 2];
        var c2 = bounds[i * 2 + 1];

        if (c < c1) return false;
        if (c > c2) return false;
    }
    return true;
}

/**
 * Checks the sign of a number
 * @param {Number} num The number to check
 * @returns {Number} 1 if num is positive, -1 if negative, 0 in other cases (0, NaN...)
 */
DuMath.sign = function(num) {
    if (num < 0) return -1;
    if (num > 0) return 1;
    return 0;
}

/**
 * Gets the bounds of the values
 * @param {Number[][]} values A list of values
 * @return {float[]} The bounds, for N dimensions: [min1, min2, ..., minN, max1, max2, ..., maxN]
 */
DuMath.bounds = function(values) {
    var mins = [];
    var maxs = [];

    for (var i = 0, n = values.length; i < n; i++) {
        var v = values[i];
        for (var j = 0, d = v.length; j < d; j++) {
            if (typeof(mins[j]) === 'undefined') mins[j] = v[j];
            else if (v[j] < mins[j]) mins[j] = v[j];

            if (typeof(maxs[j]) === 'undefined') maxs[j] = v[j];
            else if (v[j] > maxs[j]) maxs[j] = v[j];
        }
    }

    return mins.concat(maxs);
}

/**
 * Checks if the direction changes (if the point is at an extreme value). If the values have multiple dimensions, checks each axis individually.
 * @param {Number|Number[]} previousValue The value just before the point.
 * @param {Number|Number[]} point The point to check.
 * @param {Number|Number[]} nextValue The value just after the point.
 * @param {int} [precision=1] The precision for floating point comparisons; number of decimals.
 * @return {Boolean} 
 */
DuMath.isExtremePoint = function(previousValue, point, nextValue, precision) {
    previousValue = new DuList(previousValue);
    point = new DuList(point);
    nextValue = new DuList(nextValue);

    for (var i = 0, n = point.length(); i < n; i++) {
		var p = point.at(i);
		var pv = previousValue.at(i);
		var nx = nextValue.at(i);
		if (DuMath.equals(p, pv, 1) && DuMath.equals(p, nx, 1)) continue;
        // Get the dif
        var pDif = p-pv;
        var nDif = p-nx;
        // If the sign is the same, this is an extreme
        if (pDif >= 0 && nDif >= 0) return true;
        if (pDif <= 0 && nDif <= 0) return true;
		// If one of the two is 0, this is an extreme
        if (DuMath.equals(pDif, 0.0, 1)) return true;
        if (DuMath.equals(nDif, 0.0, 1)) return true;
    }
	return false;
}

/**
 * Checks if the point is an inflexion point.
 * @param {Number|Number[]} previousVelocity The derivative (speed) of a point just before the point.
 * @param {Number|Number[]} pointVelocity The derivative (speed) at the point to check.
 * @param {Number|Number[]} nextVelocity The derivative (speed) of a point just after the point.
 * @return {Boolean} 
 */
DuMath.isInflexionPoint = function(previousVelocity, pointVelocity, nextVelocity) {
    previousVelocity = new DuList(previousVelocity);
    pointVelocity = new DuList(pointVelocity);
    nextVelocity = new DuList(nextVelocity);

    for (var i = 0, n = pointVelocity.length(); i < n; i++) {
		var p = pointVelocity.at(i);
		var pv = previousVelocity.at(i);
		var nx = nextVelocity.at(i);
		if (p == pv && p == nx) continue;
		if ( p >= pv && p >= nx) return true;
		if ( p <= pv && p <= nx) return true;
    }
	return false;
}

/**
 * Finds the angle formed by three points
 * @param {float[]} anglePoint The point at which to measure the angle
 * @param {float[]} oppositePointA One of the opposite points
 * @param {float[]} oppositePointB The other opposite point
 * @return {float} The angle in radians.
 */
DuMath.angleFromSides = function( anglePoint, oppositePointA, oppositePointB ) {
    var sideA = DuMath.length(anglePoint, oppositePointA);
    var sideB = DuMath.length(anglePoint, oppositePointB);
    var oppositeSide = DuMath.length(oppositePointA, oppositePointB);

    var result = sideA*sideA + sideB*sideB - oppositeSide*oppositeSide;
    result = result / (2*sideA*sideB);
    result = Math.acos(result);
    return result;
}