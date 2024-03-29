﻿/**
	* Date related methods
	* @namespace
	* @category DuESF
*/
var DuDate = {};

// low-level undocumented list. Use getMonth and getMonthName
DuDate.MonthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

/**
	* Gets the month number from a literal localized name. 0 is january, 11 is december
	* @memberof DuDate
	* @param {string} string - The month name
	* @return {int} The month number
*/
DuDate.getMonth = function (string)
{
	string = string.toLowerCase();
	for (var i = 0; i < 12; i++)
	{
		if ( DuDate.MonthNames[i].toLowerCase().indexOf(string) >= 0 ) return i;
	}

	return 0;
}

/**
	* Gets the month name from an index. 0 is january, 11 is december
	* @memberof DuDate
	* @param {int} string - The month index
	* @return {string} The month name
*/
DuDate.getMonthName = function (index)
{
	if (index >= 0 && index < 12) return i18n._(DuDate.MonthNames[i]);

	return "";
}

/**
	* Returns a pretty formatted string representing the date
	* @todo format option
	* @memberof DuDate
	* @param {Date} date - The date
	* @return {string} The date
*/
DuDate.toString = function (date)
{
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getFullYear();

	return year + "-" + (month+1) + "-" + day + " " + hour + "-" + minute + "-" + second;
}