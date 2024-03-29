/**
* Tools for debugging
* @namespace
 * @category DuESF
*/
var DuDebug = {};

/**
 * Set this attribute to a DuDebugLog you have created to automatically add some debug infos to the log (like catched errors).
 * @type {DuDebugLog|null}
 */
DuDebug.debugLog = null;

/**
 * The log levels
 * @enum {int}
 * @readonly
 */
DuDebug.LogLevel =
{
	VERBOSE: 0,
	DEBUG: 1,
	WARNING: 2,
	CRITICAL: 3,
	FATAL: 4,
	NO_DEBUG: 5
}

/**
 * Logs a message to DuDebug.DuDebugLog if it has been set.
 * @param {string} message - The message to log
 * @param {DuDebug.LogLevel} [level=DuDebug.LogLevel.DEBUG] - The level of the message
 */
DuDebug.log = function (message,level)
{
	if ( DuDebug.debugLog != null ) DuDebug.debugLog.log( message,level );
}

/**
 * This methods shows an alert with an error thrown if DuESF.debug is set to true, and logs it in DuESF.debug.DuDebugLog if it has been set.<br />
 * The error is actually thrown only if JS Debugging is enabled in the host application, otherwise it is just shown in an alert.
 * @param {Error|string} error - An error thrown and catched
 */
DuDebug.error = function (error, msg)
{
	msg = def(msg, "");
	var file = new File( error.fileName );
	var errorString = 'An error has occured in file\n\n' + file.name + '\n\nlocated in:\n' + file.parent.fsName + '\n\nat line ' + error.line + '\n\n';
	if (msg == "") errorString += error.description;
	else errorString += msg;
	DuDebug.log( errorString, DuDebug.LogLevel.WARNING );
	if ( DuESF.debug )
	{
		alert( errorString );
		// Throw if debugger enabled
		if (DuESF.host == DuESF.HostApplication.AFTER_EFFECTS)
			if (DuAE.isDebuggerEnabled()) throw error;
	}
}

/**
 * Runs a method/script safely, i.e. enclosed in a try...catch, and logs any error thrown.<br />
 * arguments can be added after the first parameter, they will be passed to the callback.<br />
 * The callback is enclosed in a function to make sure it does not create global variables.
 * @param {function|string} callback - The method to run, or a script as a string
 * @return {any} The return of the callback, null if it fails.
 */
DuDebug.safeRun = function (callback)
{
	if (!isdef( callback )) throw "Error: DuDebug.safeRun(callback): Invalid parameter: callback cannot be undefined";
	if (callback == '') throw "Error: DuDebug.safeRun(callback): Invalid parameter: callback cannot be an empty string";
	var call = '';
	if (jstype(callback) != 'string' && arguments.length > 1)
	{
		var args = [];
		for (var i = 1, num = arguments.length; i < num; i++)
		{
			args.push(arguments[i]);
		}
		var params = args.join(',');
		call = 'var result = callback(' + params + '); result;'
	}
	else if (jstype(callback) == 'string') call = callback;

	try
	{
		if (call != '')
		{
			(function(){
				return eval(call);
			})();
		}
		else 
		{
			return callback();
		}
	}
	catch ( error )
	{
		DuDebug.error(error);
		return null;
	}
	finally
	{
		// Try to close any undo group
		if (DuESF.host == DuESF.HostApplication.AFTER_EFFECTS) {
			app.endUndoGroup();
		}
	}
}

/**
 * Inspects a javascript object and outputs all of its attributes
 * @param {object} obj - The object to inspect.
 * @param {boolean} [ownProperties=true] - Whether to inspect only the own properties of the object.
 * @return {string} The report. 
 */
DuDebug.inspect = function(obj, ownProperties)
{
	ownProperties = def( ownProperties, true );

	var report = "";
	for (var key in obj)
	{
		if (ownProperties && !obj.hasOwnProperty(key)) continue;
		report += key + " | type: " + typeof(obj[key]) + " | value: " + obj[key].toString() + "\n";
	}
	return report;
}

/**
 * Alerts a nice TypeError description, if {@link DuESF.debug} is true, and logs it if there's a log.<br />
 * Note that it does not actually throws an error.
 * @param {any} variable The failing argument
 * @param {string} varName The failing argument name
 * @param {string} varType The expected type
 * @param {string} [functionName] The name or description of the function throwing the error.
 * @return {string} The (multiline) description for the error
 */
DuDebug.throwTypeError = function (variable, varName, varType, functionName)
{
	functionName = def (functionName, '');
	if (typeof functionName === 'Function') {
		functionName = func.toString().split('\n')[0];
	}

	var e = 'TypeError:\n';
	if (functionName != '') e += "in function " + functionName + "\n";
	e += "\n" + varName + " should be of type " + varType + "\n";
	e += "but it is of type " + jstype(variable);
	if (isdef( variable )) try { e += " and has value: " + variable.toSource(); } catch(e) {};

	//ADD stack trace
	e += '\n\nStack:\n' + $.stack;
		
	DuDebug.log(e, DuDebug.LogLevel.CRITICAL);

	if ( DuESF.debug )
	{
		alert( e );
		// Throw if debugger enabled
		if (DuESF.host == DuESF.HostApplication.AFTER_EFFECTS)
			if (DuAE.isDebuggerEnabled()) throw e;
	}

	return e;
}

/**
 * Alerts a nice UndefinedError description, if {@link DuESF.debug} is true, and logs it if there's a log..<br />
 * Note that it does not actually throws an error.
 * @param {any} varName The name of the arg which should not be undefined
 * @param {any} [functionName] The name or description of the function throwing the error.
 * @return {string} The (multiline) description for the error
 */
DuDebug.throwUndefinedError = function( varName, functionName )
{
	if (!DuESF.debug) return;

	functionName = def (functionName, '');
	if (typeof functionName === 'Function') {
		functionName = func.toString().split('\n')[0];
	}

	var e = 'UndefinedError:\n';
	if (functionName != '') e += "in function " + functionName + "\n";
	e += "\n" + varName + " cannot be undefined.";

	DuDebug.log(e, DuDebug.LogLevel.CRITICAL);

	if ( DuESF.debug )
	{
		alert( e );
		// Throw if debugger enabled
		if (DuESF.host == DuESF.HostApplication.AFTER_EFFECTS)
			if (DuAE.isDebuggerEnabled()) throw e;
	}

	return e;
}

/**
 * Alerts a nice Error description, if {@link DuESF.debug} is true, and logs it if there's a log..<br />
 * Note that it does not actually throws an error.
 * @param {any} message The message to show
 * @param {any} [functionName] The name or description of the function throwing the error.
 * @param {Error} [error] A JS error.
 * @param {Boolean} [neverThrow=false] If true, will prevent actually throwing the error even if the debugger is enabled.
 * @return {string} The (multiline) description for the error
 */
DuDebug.throwError = function( message, functionName, error, neverThrow )
{
	functionName = def (functionName, '');
	neverThrow = def(neverThrow, false);
	if (typeof functionName === 'Function') {
		functionName = func.toString().split('\n')[0];
	}

	var e = 'Error:\n';
	if (functionName != '') e += "in function " + functionName + "\n";
	e += "\n" + message;

	if (isdef( error ))
	{
		var file = new File(error.fileName);
		e += '\n\nIn file\n\n' + file.name + '\n\nlocated in:\n' + file.parent.fsName + '\n\nat line ' + error.line + '\n\n' + error.description;
	}

	DuDebug.log(e, DuDebug.LogLevel.CRITICAL);

	if ( DuESF.debug )
	{
		alert( e );
		if (!neverThrow)
		{
			// Throw if debugger enabled
			if (DuESF.host == DuESF.HostApplication.AFTER_EFFECTS)
				if (DuAE.isDebuggerEnabled()) 
				{
					if (isdef( error )) throw error;
					else throw e;
				}
		}
	}

	return e;
}

/**
 * Checks if the given variable has the correct type,<br />
 * alerts a nice error if not using {@link DuDebug.throwUndefinedError()} or {@link DuDebug.throwTypeError()}.
 * @param {any} variable The variable to check
 * @param {string} argName  The variable name
 * @param {string} [argType] The expected type name (as return by {@link jstype()}). If not provided, checks only if the var is undefined
 * @param {any} [functionName] The name or description of the function throwing the error.
 * @return {string|bool} The (multiline) description for the error if any and {@link DuESF.debug} is true, false if there's an error and {@link DuESF.debug} is false, true if everything is ok.
 */
DuDebug.checkVar = function ( variable, varName, varType, functionName )
{
	// Check if undefined
	if ( !isdef( variable ) )
	{
		if (DuESF.debug) return DuDebug.throwUndefinedError( varName, functionName );
		else return false;
	} 
	if (isdef( varType ))
		if ( jstype( variable ) != varType )
		{
			if (DuESF.debug) return DuDebug.throwTypeError( variable, varName, varType, functionName );
			else return false;
		}
	return true;
}

/**
 * Constructs a new debug logger
 * @class DuDebugLog
 * @classdesc A logger for debugging purposes: writes debug messages to a file, with date and type
 * @param	{string|File} [pathOrFile] - The log file. By default, located next to the script settings file
 * (if constructed <strong>after</strong> {@link DuESF.init()}).
 * @param	{boolean} [clear=true] - Whether to clear the previous log file before starting
 * @param	{DuDebug.LogLevel}	[logLevel=DuDebug.LogLevel.DEBUG] -  The log level.
 * @param	{boolean}	[enabled=DuESF.debug] -  true to enable the log and start recording
 * @property {boolean}	running - true if the timer is running, false if it is stopped.
 * @category DuESF
 */
function DuDebugLog(pathOrFile,clear,logLevel,enabled)
{
	/**
	 * The log file.
	 * @memberof DuDebugLog
	 * @readonly
	 * @name file
	 * @type {File}
	 */
	this.file = null;

	if (!isdef( pathOrFile ))
	{
		var folder = DuESF.scriptSettings.file.parent;
		pathOrFile = new File( folder.absoluteURI + '/' + DuESF.scriptName + '_debug_log.txt');
	}

	if (!(pathOrFile instanceof File)) this.file = new File(pathOrFile);
	else this.file = pathOrFile;
	this.file.encoding = 'UTF-8';

	/**
	 * The log level.
	 * @memberof DuDebugLog
	 * @type {DuDebug.LogLevel}
	 * @name level
	 * @default DuDebug.LogLevel.DEBUG
	 */
	this.level = def (logLevel, DuDebug.LogLevel.DEBUG);

	/**
	 * true to enable the log and record logs.
	 * @memberof DuDebugLog
	 * @type {DuDebug.LogLevel}
	 * @name enabled
	 * @default DuESF.debug
	 */
	this.enabled = def( enabled, DuESF.debug );

	clear = def (clear, true);
	var append = !clear && this.file.exists;

	if (this.level <= DuDebug.LogLevel.DEBUG)
	{
		var currentDate = new Date();
		DuFile.writeln (
			this.file,
			'[' + currentDate.toString() + '] == Debugger started. ==',
			append );
	}

	this.elapsed = 0;
	this.running = false;

	this.log( "\n=========== NEW LOG =============\n=================================" , DuDebug.LogLevel.NO_DEBUG);
}

/**
	* Logs a message
	* @param {string} message - The message to log
	* @param {DuDebug.LogLevel} [level=DuDebug.LogLevel.DEBUG] - The level of the message
	*/
DuDebugLog.prototype.log = function (message,level)
{
	level = def( level, DuDebug.LogLevel.DEBUG );

	if (!this.enabled) return;
	if (level < this.level) return;

	var currentDate = new Date();
	var levelString = " || Debug info || ";
	if (level == DuDebug.LogLevel.WARNING) levelString = " || Warning || ";
	else if (level == DuDebug.LogLevel.CRITICAL) levelString = " || Critical || ";
	else if (level == DuDebug.LogLevel.FATAL) levelString = " || Fatal || ";

	DuFile.writeln (
			this.file,
			'[' + currentDate.toString() + ']' + levelString + message,
			true );
	$.writeln('[' + currentDate.toString() + ']' + levelString + message,)
}

/**
	* Starts the debugger timer.
	* @param {string} [message] - A message to display in the log
	* @param {DuDebug.LogLevel} [level=DuDebug.LogLevel.VERBOSE] - The level of the message
	*/
DuDebugLog.prototype.startTimer = function(message, level)
{
	if (!this.enabled) return;

	level = def(level, DuDebug.LogLevel.VERBOSE );
	message = def (message, '');

	if (level >= this.level)
	{
		DuDebug.safeRun( function()
		{
			if (this.file.open('a'))
			{
				var currentDate = new Date();
				this.file.writeln('[' + currentDate.toString() + '] == Timer started. == ' + message);
				this.file.close();
			}
		});
	}

	if (!this.running) this.elapsed = 0;
	this.running = true;
	$.hiresTimer;
}

/**
	* Stops the debugger timer.
	* @param {string} [message] - A message to display in the log
	* @param {DuDebug.LogLevel} [level=DuDebug.LogLevel.DEBUG] - The level of the message
	*/
DuDebugLog.prototype.stopTimer = function(message, level)
{
	if (!this.enabled) return;
	if (!this.running) return;

	level = def( level, DuDebug.LogLevel.DEBUG );

	this.elapsed += Math.round($.hiresTimer/1000);

	if (!isdef( message )) message = '';

	if (level >= this.level)
	{
		DuDebug.safeRun( function()
		{
			if (this.file.open('a'))
			{
				var currentDate = new Date();
				this.file.writeln('[' + currentDate.toString() + '] == Timer stopped == Time elapsed | ' + this.elapsed + 'ms | == ' + message);
				this.file.close();
			}
		});
	}

	this.elapsed = 0;
	this.running = false;
	$.hiresTimer;
}

/**
	* Checks the time elapsed since the timer has started<br />
	* If the timer is not running, it will be started.
	* @param {string} message - A message to display in the log
	* @param {DuDebug.LogLevel} [level=DuDebug.LogLevel.DEBUG] - The level of the message
	* @return {int} The time elapsed in milliseconds
	*/
DuDebugLog.prototype.checkTimer = function(message, level)
{
	level = def( level, DuDebug.LogLevel.DEBUG );

	if (!this.running) this.startTimer();
	this.elapsed += Math.round($.hiresTimer/1000);

	if (!this.enabled) return -1;

	if (level >= this.level)
	{
		DuDebug.safeRun(function()
		{
			if (this.file.open('a'))
			{
				message = def(message, '');

				var currentDate = new Date();
				this.file.writeln('[' + currentDate.toString() + '] == Time elapsed | ' + this.elapsed + 'ms | == ' + message);
				this.file.close();
			}
		});
		
	}

	return this.elapsed;
}
