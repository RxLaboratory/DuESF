/**
 * Interpolation methods
 * @namespace
 * @category DuESF
 */
var DuInterpolation = {};

/**
 * Linear (extra/inter)polation
 * @param {Number} value The variable
 * @param {Number} [min=0] The minimum input value
 * @param {Number} [max=1] The maximum input value
 * @param {Number} [targetMin=0] The minimum output value
 * @param {Number} [targetMax=1] The maximum output value
 * @param {Boolean} [extrapolate=true] Whether to extrapolate outside the target.
 * @returns {Number}
 */
DuInterpolation.linear = function(value, min, max, targetMin, targetMax, extrapolate) { 
    extrapolate = def(extrapolate, true);
    return DuMath.linear(value, min, max, targetMin, targetMax, !extrapolate)
};

/**
 * Interpolates a value with a bezier curve.
 * @param {number} t The value to interpolate
 * @param {number} [tMin=0] The minimum value of the initial range
 * @param {number} [tMax=1] The maximum value of the initial range
 * @param {number} [value1=0] The minimum value of the interpolated result
 * @param {number} [value2=1] The maximum value of the interpolated result
 * @param {number[]} [bezierPoints=[0.33,0.0,0.66,1.0]] an Array of 4 coordinates wihtin the [0.0, 1.0] range which describes the Bézier interpolation. The default mimics the native ease() function<br />
 * [ outTangentX, outTangentY, inTangentX, inTangentY ]
 * @return {number} the value.
 */
DuInterpolation.bezier = function(t, tMin, tMax, value1, value2, bezierPoints) {
    tMin = def(tMin, 0);
    tMax = def(tMax, 1);
    value1 = def(value1, 0);
    value2 = def(value2, 1);
    bezierPoints = def(bezierPoints, [0.33,0.0,0.66,1.0]);

    if (arguments.length !== 5 && arguments.length !== 6) return (value1+value2)/2;
    var a = value2 - value1;
    var b = tMax - tMin;
    if (b == 0) return (value1+value2)/2;
    var c = DuMath.clamp((t - tMin) / b, 0, 1);
    if (!(bezierPoints instanceof Array) || bezierPoints.length !== 4) bezierPoints = [0.33,0.0,0.66,1];
    return a * h(c, bezierPoints) + value1;

    function h(f, g) {
        var x = 3 * g[0];
        var j = 3 * (g[2] - g[0]) - x;
        var k = 1 - x - j;
        var l = 3 * g[1];
        var m = 3 * (g[3] - g[1]) - l;
        var n = 1 - l - m;
        var d = f;
        for (var i = 0; i < 5; i++) {
            var z = d * (x + d * (j + d * k)) - f;
            if (Math.abs(z) < 1e-3) break;
            d -= z / (x + d * (2 * j + 3 * k * d));
        }
        return d * (l + d * (m + d * n));
    }
}

/**
 * Interpolates and extrapolates a value with an exponential function.
 * @param {number} t The value to interpolate
 * @param {number} [tMin=0] The minimum value of the initial range
 * @param {number} [tMax=1] The maximum value of the initial range
 * @param {number} [value1=0] The minimum value of the interpolated result
 * @param {number} [value2=1] The maximum value of the interpolated result
 * @param {number} [rate=1] The raising speed in the range [0, inf].
 * @return {number} the value.
 */
DuInterpolation.exponential = function(t, tMin, tMax, vMin, vMax, rate)
{
	tMin = def(tMin, 0);
    tMax = def(tMax, 1);
    vMin = def(vMin, 0);
    vMax = def(vMax, 1);
    rate = def(rate, 1);
   
    if (rate == 0) return DuInterpolation.linear(t, tMin, tMax, vMin, vMax);

    // handle tMax < tMin
    var rev = false;
    if (tMax < tMin) {
        var temp = tMax;
        tMax = tMin;
        tMin = temp;
        rev = true;
    }

	// Offset t to be in the range 0-Max
	tMax = ( tMax - tMin ) * rate;
	t = ( t - tMin ) * rate;
	// Compute the max
	var m = Math.exp(tMax);
	// Compute current value
	t = Math.exp(t);
	var result = DuInterpolation.linear(t, 1, m, vMin, vMax);
    if (rev) result = DuInterpolation.linear(result, vMin, vMax, vMax, vMin);
    return result;
}

/**
 * Interpolates a value with a gaussian function.
 * @function
 * @param {number} t The value to interpolate
 * @param {number} [tMin=0] The minimum value of the initial range
 * @param {number} [tMax=1] The maximum value of the initial range
 * @param {number} [value1=0] The minimum value of the interpolated result
 * @param {number} [value2=1] The maximum value of the interpolated result
 * @param {number} [rate=0] The raising speed in the range [-1.0, 1.0].
 * @return {number} the value.
 */
DuInterpolation.gaussian = function( t, tMin, tMax, value1, value2, rate )
{
    tMin = def(tMin, 0);
    tMax = def(tMax, 1);
    value1 = def(value1, 0);
    value2 = def(value2, 1);
    rate = def(rate, 0);

    // handle tMax < tMin
    var rev = false;
    if (tMax < tMin) {
        var temp = tMax;
        tMax = tMin;
        tMin = temp;
        rev = true;
    }

    // fix small bump at first value
    if (t != tMin)
    {
        var newValue1 = DuInterpolation.gaussian( tMin, tMin, tMax, value1, value2, rate );
        var offset = newValue1 - value1;
        value1 = value1 - offset;
    }
	if (rate < 0) rate = rate*10;
	rate = DuInterpolation.linear(t, tMin, tMax, 0.25, rate);
	var r = ( 1 - rate );
    var fwhm = (tMax-tMin) * r;
    var center = tMax;
	if (t >= tMax) {
        if (rev) return value1;
        return value2;
    }
    if (fwhm === 0 && t == center) {
        if (rev) return value1;
        return value2;
    }
    else if (fwhm === 0) {
        if (rev) return value2;
        return value1;
    }
	
    var exp = -4 * Math.LN2;
    exp *= Math.pow((t - center),2);
    exp *= 1/ Math.pow(fwhm, 2);
    var result = Math.pow(Math.E, exp);
	result = result * (value2-value1) + value1;

    if (rev) result = DuInterpolation.linear( result, value1, value2, value2, value1);

    return result;
}

/**
 * Interpolates and extrapolates a value with a logarithmic function.
 * @function
 * @param {number} t The value to interpolate
 * @param {number} [tMin=0] The minimum value of the initial range
 * @param {number} [tMax=1] The maximum value of the initial range
 * @param {number} [value1=0] The minimum value of the interpolated result
 * @param {number} [value2=1] The maximum value of the interpolated result
 * @param {number} [rate=1] The raising speed in the range [0, inf].
 * @return {number} the value.
 */
DuInterpolation.logarithmic = function(t, tMin, tMax, vMin, vMax, rate)
{
    tMin = def(tMin, 0);
    tMax = def(tMax, 1);
    vMin = def(vMin, 0);
    vMax = def(vMax, 1);
    rate = def(rate, 1);
    
    if (rate == 0) return DuInterpolation.linear(t, tMin, tMax, vMin, vMax);

    // handle tMax < tMin
    var rev = false;
    if (tMax < tMin) {
        var temp = tMax;
        tMax = tMin;
        tMin = temp;
        rev = true;
    }

    // Offset t to be in the range 0-Max
    tMax = ( tMax - tMin ) * rate + 1;
    t = ( t - tMin ) * rate + 1;
    if (t <= 1) {
        if (rev) return vMax;
        return vMin;
    } 
    // Compute the max
    var m = Math.log(tMax);
    // Compute current value
    var v = Math.log(t);
    var result = DuInterpolation.linear(v, 0, m, vMin, vMax);
    if (rev) result = DuInterpolation.linear(result, vMin, vMax, vMax, vMin);
    return result;
}

/**
 * Interpolates and extrapolates a value with a logistic (sigmoid) function.
 * @function
 * @param {number} t The value to interpolate
 * @param {number} [tMin=0] The minimum value of the initial range
 * @param {number} [tMax=1] The maximum value of the initial range
 * @param {number} [value1=0] The minimum value of the interpolated result
 * @param {number} [value2=1] The maximum value of the interpolated result
 * @param {number} [rate=1] The raising speed in the range [0, inf].
 * @param {number} [tMid] The t value at which the interpolated value should be half way. By default, (tMin+tMax)/2
 * @return {number} the value
 */
DuInterpolation.logistic = function( t, tMin, tMax, value1, value2, rate, tMid )
{
    tMin = def(tMin, 0);
    tMax = def(tMax, 1);
    value1 = def(value1, 0);
    value2 = def(value2, 1);
    rate = def(rate, 1);
    tMid = def(tMid, (tMin+tMax)/2);

    if (rate == 0) return DuInterpolation.linear(t, tMin, tMax, value1, value2);
    t = DuMath.logistic( t, tMid, tMin, tMax, rate);
    
    // Scale to actual min/max
    var m = DuMath.logistic( tMin, tMid, tMin, tMax, rate);
    var M = DuMath.logistic( tMax, tMid, tMin, tMax, rate);

    return DuInterpolation.linear( t, m, M, value1, value2);
}
