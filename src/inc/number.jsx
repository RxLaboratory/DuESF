﻿/**
	* Number related methods
	* @namespace
	* @category DuESF
*/
var DuNumber = {};

/**
 * Converts a number to a string, adding optionnal leading zeroes
 * @param {Number} num	- The number
 * @param {int} numDigits 	- The number of digits in the string. Adds leading zeroes
 * @param {int} [base=10]	- The conversion base
 * @return {string}	The number as a string
 */
DuNumber.toString = function (num, numDigits, base)
{
	if (base == undefined) base = 10;
	var result = num.toString(base);
	while(numDigits > result.length)
	{
		result  = "0" + result ;
	}
	return result;
}
