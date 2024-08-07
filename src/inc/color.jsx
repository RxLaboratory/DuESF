﻿/**
 * Constructs a new color object
 * @class
 * @name DuColor
 * @classdesc A simple class to manage colors and convert them.
 * @param {Number[]} [floatRGBA=[0,0,0,1]] An [R,G,B,A] float Array.<br />
 * Negative values are clamped to 0.<br />
 * Alpha > 1 is clamped to 1.<br />
 * Colors are stored in 32 bit float to keep the maximum precision.
 * @property {float} red The red value
 * @property {float} green The green value
 * @property {float} blue The blue value
 * @property {float} alpha The alpha value
 * @category DuESF
 */
function DuColor( floatRGBA )
{
	floatRGBA = def(floatRGBA, [0,0,0,0]);
	
	this.red = floatRGBA[0];
	if (this.red < 0) this.red = 0;
	if (!jstype( (this.red ) == 'number') ) this.red = 0;
	if ( isNaN(this.red) ) this.red = 0;

	this.green = floatRGBA[1];
	if (this.green < 0) this.green = 0;
	if (!jstype( (this.green ) == 'number') ) this.green = 0;
	if ( isNaN(this.green) ) this.green = 0;

	this.blue = floatRGBA[2];
	if (this.blue < 0) this.blue = 0;
	if (!jstype( (this.blue ) == 'number') ) this.blue = 0;
	if ( isNaN(this.blue) ) this.blue = 0;

	if (floatRGBA.length > 3) this.alpha = floatRGBA[3];
	else this.alpha = 1.0;
	if (this.alpha < 0) this.alpha = 0;
	if (this.alpha > 1) this.alpha = 1;
	if (!jstype( (this.alpha ) == 'number') ) this.alpha = 0;
	if ( isNaN(this.alpha) ) this.alpha = 0;
}

/**
 * Returns the color as a float Array with alpha
 * @param {bool} [clamped=true] Set to false to keep the values > 1.0
 * @return {float} an [R,G,B,A] Array.
 */
DuColor.prototype.floatRGBA = function(clamped)
{
	clamped = def( clamped, true );

	var col = this.floatRGB();

	var alpha = this.alpha;
	if (clamped) alpha = DuMath.clamp( alpha );

	col.push(alpha);

	return col;
}

/**
 * Returns the color as a float Array without alpha
 * @param {bool} [clamped=true] Set to false to keep the values > 1.0
 * @return {float} an [R,G,B] Array.
 */
DuColor.prototype.floatRGB = function(clamped)
{
	clamped = def( clamped, true );

	var col = [
		this.red,
		this.green,
		this.blue
	]

	if (clamped) return DuMath.clamp( col );

	return col;
}

/**
 * Returns the color as an 8-bit int Array with alpha
 * @return {int} an [R,G,B,A] Array.
 */
DuColor.prototype.intRGBA = function()
{
	var col = this.intRGB();
	col.push( parseInt( this.alpha * 255 ) );
	return col;
}

/**
 * Returns the color as an 8-bit int Array without alpha
 * @return {int} an [R,G,B] Array.
 */
DuColor.prototype.intRGB = function()
{
	return [
		parseInt( this.red * 255 ),
		parseInt( this.green * 255 ),
		parseInt( this.blue * 255 )
	]
}

/**
 * true if [R,G,B,A] in the range 0.0 ... 1.0
 * @return {boolean} true if the color is valid
 */
DuColor.prototype.isValid = function()
{
	if (this.red > 1) return false;
	if (this.green > 1) return false;
	if (this.blue > 1) return false;
	return true;
}

/**
 * Returns the hexcode for this color
 * @return {string} The hex code, without the leading '#'.
 */
DuColor.prototype.hex = function()
{
	var red = this.red*255;
	var green = this.green*255;
	var blue = this.blue*255;
	var hexR = red.toString(16);
	var hexG = green.toString(16);
	var hexB = blue.toString(16);
	if (hexR.length == 1) hexR = "0" + hexR;
	if (hexG.length == 1) hexG = "0" + hexG;
	if (hexB.length == 1) hexB = "0" + hexB;
	
	return hexR+hexG+hexB;
}

/**
 * Returns the hexcode for this color, including the alpha (at the end)
 * @return {string} The hex code, without the leading '#'.
 */
DuColor.prototype.hexA = function()
{
	var alpha = this.alpha*255;
	var hexA = alpha.toString(16);
	if (hexA.length == 1) hexA = "0" + hexA;

	return this.hex() + hexA;
}

/**
 * Returns the HSL values
 * @return {float[]} the HSL
 */
DuColor.prototype.floatHSL = function()
{
	var r = this.red;
	var g = this.blue;
	var b = this.green;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min)
	{
        h = s = 0; // achromatic
    }
	else
	{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max)
		{
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

/**
 * Returns the HSLA values
 * @return {float[]} the HSL
 */
DuColor.prototype.floatHSLA = function()
{
	var hsla = this.floatHSL();
	hsla.push( this.alpha );
    return hsla;
}

/**
 * Creates a new color darker than the current one
 * @param {int} [ratio=200] A percentage: 200 means twice darker, 50 twice lighter
 * @returns {DuColor} The new color
 */
DuColor.prototype.darker = function( ratio )
{
	ratio = def(ratio, 200);
	ratio = ratio / 100;

	return new DuColor([
		this.red/ratio,
		this.green/ratio,
		this.blue/ratio,
		this.alpha,
	]);
}

/**
 * Creates a new color lighter than the current one
 * @param {int} [ratio=200] A percentage: 200 means twice lighter, 50 twice darker
 * @returns {DuColor} The new color
 */
DuColor.prototype.lighter = function( ratio )
{
	ratio = def(ratio, 200);
	ratio = ratio / 100;

	return new DuColor([
		this.red*ratio,
		this.green*ratio,
		this.blue*ratio,
		this.alpha,
	]);
}

/**
 * Creates a new color lighter or darker depending on the difference between the APP_TEXT_COLOR (foreground color) and the APP_BACKGROUND_COLOR
 * @param {int} [ratio=200] Pull ratio
 * @returns {DuColor} The new color
 */
DuColor.prototype.pull = function( ratio )
{
	ratio = def(ratio,200);

	if (DuColor.isUsingDarkMode()) {
		return this.lighter(ratio);
	}
	else {
		return this.darker(ratio);
	}
}

/**
 * Creates a new color lighter or darker depending on the difference between the APP_TEXT_COLOR (foreground color) and the APP_BACKGROUND_COLOR
 * @param {int} [ratio=200] Push ratio
 * @returns {DuColor} The new color
 */
DuColor.prototype.push = function( ratio )
{
	ratio = def(ratio,200);

	if (DuColor.isUsingDarkMode()) {
		return this.darker(ratio);
	}
	else {
		return this.lighter(ratio);
	}
}

/**
 * Compares two colors
 * @param {Boolean} [ignoreAlpha=false] Set to true to consider colors to be equal if they differ only by their alpha.
 * @param {int} [precision=4] The precision to use (the number of decimals to compare).
 * @return {Boolean} true if the colors are the same.
 */
DuColor.prototype.equals = function( other, ignoreAlpha, precision )
{
	if (!DuMath.equals( this.red, other.red, precision )) return false;
	if (!DuMath.equals( this.green, other.green, precision )) return false;
	if (!DuMath.equals( this.blue, other.blue, precision )) return false;
	if (!DuMath.equals( this.alpha, other.alpha, precision )) return false;
	return true;
}

/**
	* Creates a JSON string representation of the color; Actually an RGBA float Array.
	* @return {string} The JSON
	*/
DuColor.prototype.toJSON = function ()
{
	return '[' + this.red + ',' + this.green + ',' + this.blue + ',' + this.alpha + ']';
}

/**
 * Creates a color adjusted according to the brightness setting of the application.
 * @return {DuColor} The new color
 */
DuColor.prototype.adjusted = function( )
{
	// gets the main application brightness
	var q = DuColor.Color.APP_BACKGROUND_COLOR.red;
	// the darkest one is 0.11328125
	q = q - 0.11328125;
	// Limit the adjustment
	q *= .75;
	var newColor = this.floatRGBA() + [ q, q, q, 0 ];
	return new DuColor( newColor );
}

// ============== STATIC ===============

/**
	* Enum for predefined colors. float [R,G,B,A]
	* @readonly
	* @static
	* @enum {DuColor}
	* @ts-ignore */
DuColor.Color =
{
	TRANSPARENT: new DuColor([0,0,0,0]),
	BLACK: new DuColor([0,0,0,1]),
	WHITE: new DuColor([1,1,1,1]),
	OBSIDIAN: new DuColor([.082,.082,.082,1]),
	ABYSS_GREY: new DuColor([0.109,0.109,0.109,1]),
	VERY_DARK_GREY:new DuColor([0.199,0.199,0.199,1]),
	DARK_GREY: new DuColor([.262,.262,.262,1]),
	LIGHT_GREY: new DuColor([.65,.65,.65,1]),
	VERY_LIGHT_GREY: new DuColor([.85,.85,.85,1]),
	RAINBOX_RED: new DuColor([.925,.094,.094,1]),
	ORANGE: new DuColor([.925,.471,.094,1]),
	YELLOW_ORANGE: new DuColor([.925,.655,.094,1]),
	YELLOW: new DuColor([.925,.839,.094,1]),
	GREEN: new DuColor([.094,.925,.094,1]),
	LIGHT_GREEN: new DuColor([.541,.925,.569,1]),
	LIGHT_BLUE: new DuColor([.471,.847,.925,1]),
	LIGHT_PURPLE: new DuColor([.471,.471,.925,1]),
	AE_DARK_GREY: new DuColor([0.199,0.199,0.199,1]),
	AFTER_EFFECTS_BLUE: new DuColor([.1764,.5490,.9215,1]),
	RX_PURPLE: new DuColor([.7411,.1843,.7686,1]),
	APP_BACKGROUND_COLOR: new DuColor([0.199,0.199,0.199,1]),
	APP_HIGHLIGHT_COLOR: new DuColor([.7411,.1843,.7686,1]),
	APP_TEXT_COLOR: new DuColor( [ 0.6941, 0.6941, 0.6941, 1]),
	AE_ORANGE: new DuColor( [ .7804, .5725, 0, 1])
};

// Get the app colors
DuColor.init = function() 
{
		var highlightSelection = DuESF.scriptSettings.get("common/highlightSelection", -1);
		var highlightColor = new DuColor( DuESF.scriptSettings.get("common/highlightColor", DuColor.Color.APP_HIGHLIGHT_COLOR) );
		DuDebug.log("DuColor: Highlight color selection: " + highlightSelection);

		// Highlight color
		if (highlightSelection > 0)
		{
			if (highlightSelection == 1) DuColor.Color.APP_HIGHLIGHT_COLOR = DuColor.Color.RX_PURPLE;
			else if (highlightSelection == 2) DuColor.Color.APP_HIGHLIGHT_COLOR = DuColor.Color.RAINBOX_RED;
			else if (highlightSelection == 3) DuColor.Color.APP_HIGHLIGHT_COLOR = DuColor.Color.AE_ORANGE;
			else if (highlightSelection > 3) DuColor.Color.APP_HIGHLIGHT_COLOR = highlightColor;

			return;

			DuDebug.log("DuColor: Highlight color is: " + DuColor.Color.APP_HIGHLIGHT_COLOR.hex());
		}

	// ScriptUIGraphics object does not contain foreground & background colors in After Effects...
	if (DuESF.host == DuESF.HostApplication.AFTER_EFFECTS) 
	{
		DuColor.Color.APP_TEXT_COLOR = new DuColor( [ 0.6941, 0.6941, 0.6941, 1]);
		var bgColor = [.11328125, .11328125, .11328125, 1];
		if (DuESF.hostVersion.version < 24.4) {
			/* @ts-ignore */
			bgColor = app.themeColor(78) - [0.0127, 0.0127, 0.0127];
			bgColor.push(1);
		}
		else {
			/* @ts-ignore */
			var brightness = 0.2;
			if (app.preferences.havePref(
				"Main Pref Section v2",
				"User Interface Brightness (4) [0.0..1.0]",
                PREFType.PREF_Type_MACHINE_INDEPENDENT
			)) {
				brightness = app.preferences.getPrefAsFloat(
					"Main Pref Section v2",
					"User Interface Brightness (4) [0.0..1.0]",
					PREFType.PREF_Type_MACHINE_INDEPENDENT
					);
			}
			if (brightness < .16) bgColor = [.11328125, .11328125, .11328125, 1];
			else if (brightness < .5) bgColor = [.1953125, .1953125, .1953125, 1];
			else bgColor = [.96875, .96875, .96875, 1];
		}
		
		DuColor.Color.APP_BACKGROUND_COLOR = new DuColor( bgColor );
		DuColor.Color.APP_HIGHLIGHT_COLOR = DuColor.Color.AFTER_EFFECTS_BLUE;
		DuColor.Color.DARK_GREY = new DuColor( [.2, .2, .2, 1] );
		DuColor.Color.OBSIDIAN = new DuColor( [.0862, .0862, .0862, 1] );
	}
	else if (DuESF.host == DuESF.HostApplication.PHOTOSHOP)
	{
		DuColor.Color.APP_TEXT_COLOR = new DuColor( [ 0.6941, 0.6941, 0.6941, 1]);
		DuColor.Color.APP_BACKGROUND_COLOR = DuColor.Color.VERY_DARK_GREY;
		DuColor.Color.APP_HIGHLIGHT_COLOR = DuColor.Color.DARK_GREY;
		DuColor.Color.DARK_GREY = new DuColor( [.2, .2, .2, 1] );
		DuColor.Color.OBSIDIAN = new DuColor( [.0862, .0862, .0862, 1] );
	}
	else
	{
		// create a label to (try to) get the color
		var dummyWin = new Window( 'palette' );
		var dummyLabel = dummyWin.add('statictext', undefined,'text');

		var textPen = dummyLabel.graphics.foregroundColor;
		var bgBrush = dummyWin.graphics.backgroundColor;

		if (textPen) DuColor.Color.APP_TEXT_COLOR = new DuColor( textPen.color );
		else DuColor.Color.APP_TEXT_COLOR = DuColor.Color.LIGHT_GREY;
		if (bgBrush) DuColor.Color.APP_BACKGROUND_COLOR = new DuColor( bgBrush.color );
		else DuColor.Color.APP_BACKGROUND_COLOR = DuColor.Color.DARK_GREY;
		
		DuColor.Color.APP_HIGHLIGHT_COLOR = DuColor.Color.RX_PURPLE;
	}
}
DuESF.initMethods.push(DuColor.init);

/**
 * Checks if the app is in "dark mode", i.e. the APP_TEXT_COLOR is lighter than the APP_BACKGROUND_COLOR
 */
DuColor.isUsingDarkMode = function() {
	return DuColor.Color.APP_TEXT_COLOR.floatHSL()[2] > DuColor.Color.APP_BACKGROUND_COLOR.floatHSL()[2]
}

/**
	* Creates a new DuColor from a hex code/array
	* @static
	* @memberof DuColor
	* @param {string|int[]} hexColor	- The hexadecimal color
	* @return {DuColor}	The color
*/
DuColor.fromHex = function( hexColor )
{
	var isString = jstype( hexColor ) == 'string';

	if (isString)
	{
		if (hexColor.indexOf("#") == 0) hexColor = hexColor.replace("#","");
		var red = parseInt(hexColor.substr(0,2),16)/255.0;
		var green = parseInt(hexColor.substr(2,2),16)/255.0;
		var blue = parseInt(hexColor.substr(4,2),16)/255.0;
		return new DuColor( [red,green,blue,1] );
	}
	else
	{
		var r = hexColor >> 16;
		var g = (hexColor & 0x00ff00) >> 8;
		var b = hexColor & 0xff;
		return new DuColor( [r/255,g/255,b/255,1] );
	}
}

/**
 * Creates a new color from HSL(A) values
 * @static
 * @param {float[]} hsl the HSL(A) values
 * @return {DuColor} the color.
 */
DuColor.fromHSL = function( hsl )
{
	var r, g, b, a;
	var h = hsl[0];
	var s = hsl[1];
	var l = hsl[2];

    if(s == 0)
	{
        r = g = b = l; // achromatic
    }
	else
	{
        function hue2rgb(p, q, t)
		{
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

	if (hsl.length > 3) a = hsl[3];
	else a = 1;

    return new DuColor( [r, g, b, a] );
}

/**
 * Creates a new color from an 8-bit int RGB(A) array
 * @static
 * @param {int[]} source The 8-bit int RGB(A) array
 * @return {DuColor}
 */
DuColor.fromInt = function( intRGB )
{
	var floatColor = [];
	for (var i = 0, numChannels = color.length; i < numChannels; i++)
	{
		floatColor.push( color[ i ] / 255.0 );
	}

	return new DuColor( floatColor );
}

/**
	* Creates a color from a JSON string; Actually a JSON RGBA float Array.
	* @static
	* @param {string} json The JSON string
	* @return {DuColor} The color
	*/
DuColor.fromJSON = function (json)
{
	return new DuColor( JSON.parse(json) );
}

/**
 * Generates a random color, with the alpha == 1.0
 * @static
 * @return {DuColor} The color
 */
DuColor.random = function()
{
	var color = [0,0,0,1];
	for (var i = 0 ; i < 3 ; i++)
	{
		color[i] = DuMath.random();
	}

	return new DuColor(color);
}

// ========= DEPRECATED ==============

/**
 * Checks if this color is valid ([R,G,B,A] in the range 0.0 ... 1.0)
 * @static
 * @deprecated
 * @param {float[]} color - The floatRGBA color to validate
 * @param {boolean} [ignoreAlpha=false] - Will return true even if the array does not have any alpha value
 * @return {boolean} true if the color is valid
 */
DuColor.isValid = function (color, ignoreAlpha)
{
	ignoreAlpha = def( ignoreAlpha, false, false );
	if ( !jstype(color) == 'array' ) return false;
	var numChannels = color.length;
	if ( numChannels != 4 && !ignoreAlpha ) return false;
	if ( numChannels != 4 && numChannels != 3 ) return false;
	for (var i = 0, numChannels; i < numChannels; i++)
	{
		var c = color[i];
		if (isNaN(c)) return false;
		if (!jstype(color) == 'number') return false;
		if (c < 0) color[i] = 0;
		if (c > 1) color[i] = 1;
	}
	return true;
}

/**
	* Generates a random color
	* @static
	* @deprecated
	* @memberof DuColor
	* @return {float[]}	The color as an [R,G,B,A] Array with float values between 0.0 and 1.0
*/
DuColor.randomFloatRGBA = function ()
{
	var color = [0,0,0,1];
	for (var i = 0 ; i < 3 ; i++)
	{
		color[i] = DuMath.random();
	}
	return color;
}

/**
	* Converts an hexadecimal color to a floatRGBA Array
	* @static
	* @deprecated
	* @memberof DuColor
	* @param {string|int[]} hexColor	- The hexadecimal color
	* @param {boolean}	[isString=true] 	- Whether hexColor is a string or an Array of int of base 16
	* @return {float[]}	The color as an [R,G,B,A] Array with float values between 0.0 and 1.0
*/
DuColor.hexToRGB = function (hexColor,isString)
{
	if (isString == undefined) isString = true;
	if (isString)
	{
		if (hexColor.indexOf("#") == 0) hexColor = hexColor.replace("#","");
		var red = parseInt(hexColor.substr(0,2),16)/255.0;
		var green = parseInt(hexColor.substr(2,2),16)/255.0;
		var blue = parseInt(hexColor.substr(4,2),16)/255.0;
		return [red,green,blue,1];
	}
	else
	{
		var r = hexColor >> 16;
		var g = (hexColor & 0x00ff00) >> 8;
		var b = hexColor & 0xff;
		return [r/255,g/255,b/255,1];
	}
}

/**
	* Converts an RGB color to a hex string
	* @memberof DuColor
	* @deprecated
	* @static
	* @param {float[]} rgbColor	- The rgb color
	* @return {string}	The color as an hex string
*/
DuColor.rgbToHex = function (rgbColor)
{
	var red = rgbColor[0]*255;
	var green = rgbColor[1]*255;
	var blue = rgbColor[2]*255;
	var hexR = red.toString(16)
	var hexG = green.toString(16)
	var hexB = blue.toString(16);
	if (hexR.length == 1) hexR = "0" + hexR;
	if (hexG.length == 1) hexG = "0" + hexG;
	if (hexB.length == 1) hexB = "0" + hexB;
	var hex = hexR+hexG+hexB;
	return hex;
}

/**
	* Converts an HSL color to RGB
	* @deprecated
	* @static
	* @param {float[]} color - The RGBA color array
	* @return {float[]} the HSLA color array
*/
DuColor.hslToRgb = function (color)
{
    var r, g, b;
	var h = color[0];
	var s = color[1];
	var l = color[2];

    if(s == 0)
	{
        r = g = b = l; // achromatic
    }
	else
	{
        function hue2rgb(p, q, t)
		{
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r, g, b, color[3]];
}

/**
	* Converts an RGB color to HSL
	* @deprecated
	* @static
	* @param {float[]} color - The HSLA color array
	* @return {float[]} the RGBA color array
*/
DuColor.rgbToHsl = function (color)
{
	var r = color[0];
	var g = color[1];
	var b = color[2];

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min)
	{
        h = s = 0; // achromatic
    }
	else
	{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max)
		{
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l, color[3]];
}

/**
 * Converts an 8bpc color array to a 32bpc float color array
 * @deprecated
 * @static
 * @param {int[]} color - The RGB(A) color array in 8bpc (0-255 range)
 * @return {float[]} the RGBA color array
 */
DuColor.eightBpcToFloat = function (color)
{
	var floatColor = [];
	for (var i = 0, numChannels = color.length; i < numChannels; i++)
	{
		floatColor.push( color[ i ] / 255 );
	}
	return floatColor;
}
