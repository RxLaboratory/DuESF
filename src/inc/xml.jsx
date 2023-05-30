/**
* XML tools
* @namespace
* @category DuESF
*/
var DuXML = {};

/**
 * Parses the value of the XML object.<br />
 * If this object length is not 1, an Array is returned
 * @memberof DuXML
 * @param {XML} xml - The xml to parse
 * @param {string} [type='string'] - The type, one of 'string', 'bool', 'int', 'float' or 'date'.
 * @return {any[]|any} The value or an Array of values
 */
DuXML.getValue = function (xml,type)
{
	type = def(type, 'string');
	var value;

	if(xml.length() > 1)
	{
		value = [];
		for (var i = 0 ; i < xml.length() ; i++)
		{
			var val = DuXML.getValue(xml[i],type);
			value.push(val);
		}
	}
	else
	{
		var xmlString = xml.toString();
		if (type.toLowerCase() == 'float')
		{
			value = parseFloat(xmlString);
		}
		else if (type.toLowerCase() == 'int' || type.toLowerCase() == 'integer')
		{
			value = parseInt(xmlString);
		}
		else if (type.toLowerCase() == 'boolean' || type.toLowerCase() == 'bool')
		{
			value = DuString.parseBool(xmlString);
		}
		else if (type.toLowerCase() == 'date')
		{
			var reDate = /(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d)/gim
			var matches = reDate.exec(xmlString);
			var year = parseInt(matches[4]);
			var month = DuDate.getMonth(matches[3]);
			var day = parseInt(matches[2]);
			var hours = parseInt(matches[5]);
			var min = parseInt(matches[6]);
			var sec = parseInt(matches[7]);
			value = new Date(year, month, day, hours, min, sec);
		}
		else
		{
			value = xmlString;
		}
	}

	return value;
}
