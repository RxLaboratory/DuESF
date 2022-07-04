/**
    * Constructs a new DuProcess instance
    * @class DuProcess
    * @classdesc A class to launch and manage processes, using the system command line.
    * @param {string}	  processPath     - The path to the process executable binary
    * @param {string[]}    [args]            - The common arguments used to run the process. You can append arguments each time you run the process with start(args)
    * @param {int}      [timeout=0]         - Waiting timeout after process start, in ms, 0 to avoid waiting, -1 for infinite.
    * If the process times out, process will not be killed, the script will just stop waiting.
    * @category DuESF
*/
function DuProcess( processPath, args, timeout ) {
    processPath = def( processPath, "");
    args = def( args, []);
    timeout = def( timeout, 0);

    /**
     * The path to the process executable binary
     * @type {string}
     * @name processPath
     * @memberof DuProcess
     * @readonly
     */
    this.processPath = processPath;

    /**
     * The common arguments used to run the process. You can append arguments each time you run the process with start(args)
     * @type {any[]}
     * @name args
     * @memberof DuProcess
     */
    this.args = args;

    /**
     * Waiting timeout after process start, in ms, 0 to avoid waiting, -1 for infinite.<br />
     * If the process times out, process will not be killed, the script will just stop waiting. Default: 0
     * @type {int}
     * @name timeout
     * @memberof DuProcess
     */
    this.timeout = timeout;

    /**
     * True if the process path leads to an application package (.app folder containing at least "/Contents/MacOS") on mac. False otherwise.
     * @type {Boolean}
     * @name isAppPackage
     * @memberof DuProcess
     * @readonly
     */
    this.isAppPackage = DuProcess.isAppPackage( processPath );

    /**
     * An Array of arguments array.<br />
     * Arrays of arguments in the queue will be processed one after each other.<br />
     * Update the Array and launch the queue with startQueue()
     * @type {string[][]}
     * @name queue
     * @memberof DuProcess
     */
    this.queue = [];

    /**
     * The latest command which has been run.
     * @type {string}
     * @name latestCommand
     * @memberof DuProcess
     * @readonly
     */
    this.latestCommand = '';
}

/**
 * Starts the process
 * @memberof DuProcess
 * @param {Array}  args  - Args to append to {@link DuProcess.args} before starting
 * @param {int}		[timeout] 	- Overrides the default timeout.
 */
DuProcess.prototype.start = function ( args, timeout ) {
    timeout = def(timeout, this.timeout);

    var cmd = this.buildCmd( args );

    this.startCmd( cmd );
    this.latestCommand = cmd;
    if (timeout > 100) this.waitForFinished( timeout );
}

/**
 * Starts the queue
 * @memberof DuProcess
 * @param {int}		[timeout] 	- Overrides the default timeout.
 */
DuProcess.prototype.startQueue = function ( timeout ) {
    if ( timeout === undefined ) timeout = this.timeout;

    var cmd = this.buildQueueCmd();

    this.startCmd( cmd );
    this.latestCommand = cmd;
    this.queue = [];

    this.waitForFinished( timeout );
}

/**
 * Waits for the process to finish
 * @memberof DuProcess
 * @param {int}		[timeout] 	- Overrides the default timeout.
 */
DuProcess.prototype.waitForFinished = function ( timeout ) {
    if ( timeout === undefined ) timeout = this.timeout;
    //wait
    var wait = true;
    var currentDate = new Date();
    var timeout = currentDate.getTime() + timeout;
    var checkTime = new Date();

    var checkCmd = '';
    var processName = new File( this.processPath ).name;
    if ( DuSystem.mac ) checkCmd = 'ps -A | grep "' + processName + '"';
    if ( DuSystem.win ) checkCmd = 'tasklist /FO TABLE /NH /FI "Imagename eq ' + processName + '"';

    //wait
    while ( wait ) {
        var test = system.callSystem( checkCmd );
        if ( test.indexOf( processName ) < 0 ) break;
        $.sleep( 100 );
        checkTime = new Date();

        if ( this.timeout >= 0 ) {
            wait = checkTime.getTime() < timeout;
        }
    }
}

/**
 * Builds and returns the command line
 * @memberof DuProcess
 * @param {string[]}  [args]  - Args to append to DuProcess.args before starting
 * @return {string}	The command
 */
DuProcess.prototype.buildCmd = function ( args ) {
    if ( args === undefined ) args = [];
    //build command
    //make sure to use fsName
    if ( this.processPath.indexOf( '/' ) >= 0 || this.processPath.indexOf( '\\' ) >= 0 ) {
        var processFile = new File( this.processPath );
        this.processPath = processFile.fsName;
        if ( this.processPath.indexOf( ' ' ) > 0 ) {
            this.processPath = '"' + this.processPath + '"';
        }
    }
    var cmd = "";
    // if it's an app package, prepend "open -n " and append " --args"
    if (this.isAppPackage)
    {
        cmd = "open -n " + this.processPath;
        if (args.length > 0 || this.args.length > 0)
        {
            cmd += " --args";
        }
    }
    else
    {
        cmd = this.processPath;
    }

    //args
    for ( var a = 0; a < this.args.length; a++ ) {
        var arg = this.args[ a ];
        if (jstype(arg) != 'string') arg = arg.toString();
        if ( arg.indexOf( ' ' ) > 0 ) {
            arg = '"' + arg + '"';
        }
        cmd += ' ' + arg;
    }
    for ( var b = 0; b < args.length; b++ ) {
        var arg = args[ b ];
        if (jstype(arg) != 'string') arg = arg.toString();
        if ( arg.indexOf( ' ' ) > 0 ) {
            arg = '"' + arg + '"';
        }
        cmd += ' ' + arg;
    }
    
    return cmd;
}

/**
 * Builds and returns the command line to launch the current queue
 * @memberof DuProcess
 * @return {string}	The command
 */
DuProcess.prototype.buildQueueCmd = function () {
    var cmd = '';

    if ( this.queue.length == 0 ) {
        return this.buildCmd();
    }

    for ( var i = 0; i < this.queue.length; i++ ) {
        if ( i > 0 ) {
            if ( DuSystem.mac ) cmd += ' && ';
            if ( DuSystem.win ) cmd += '\r\n';
        }
        cmd += this.buildCmd( this.queue[ i ] );
    }
    return cmd;
}

/**
 * Starts a command (in another thread).
 * @memberof DuProcess
 * @param {string}  cmd  - The command to start
 */
DuProcess.prototype.startCmd = function ( cmd ) {
    //Start
    if ( DuSystem.mac ) {
        //add ' &' at the end to start detached
        cmd += ' &';
        system.callSystem( cmd );
    }
    if ( DuSystem.win ) {
        //create batch file
        var batName = 'DuProcess_' + new Date().getTime() + '.bat'
        var bat = new File( DuFolder.duesfData.absoluteURI + '/' + batName );
        bat.encoding = "CP437";
        cmd += '\ndel "' + DuFolder.duesfData.fsName + '\\' + batName + '"';
        bat.open( 'w' );
        bat.write( cmd );
        bat.close();
        bat.execute();
    }
}


// ================ STATIC =====================

/**
    * Runs a command with some arguments.
    * @static
    * @param {string|File} process - The process or a path to the process.
    * @param {string[]} [args=[]] - The arguments to pass to the command.
    * @param {bool} [detached=false] - The script won't wait for the command to finish.
    * @return {string}	The output from the command.
    */
DuProcess.run = function( process, args, detached ) {
    detached = def(detached, false);
    var p;
    if (process instanceof File) p = new DuProcess(process.absoluteURI, args);
    else p = new DuProcess(process, args);

    var output = "";
    if (detached) p.start();
    else {
        var cmd = p.buildCmd();
        output = system.callSystem( cmd );
    }
    return output;
}

/**
 * Checks if a given path leads to an Application package on Mac, i.e. it's a path ending with <code>.app</code> containing at least <code>Contents/MacOS/</code>.
 * @static
 * @param {string|Folder|File} path - The path to the file or folder to check.
 * @return {bool} true if path is an application package.
 */
DuProcess.isAppPackage = function (path) {
    if (DuSystem.win) return false;

    if (path instanceof File || path instanceof Folder) path = path.absoluteURI;
    if (!DuString.endsWith( path, ".app")) return false;
    var testFolder = new Folder(path + "/Contents/MacOS/");
    return testFolder.exists;
}

/**
 * Constructs a queue of different processes
 * @class DuProcessQueue
 * @classdesc A class to launch several processes
 * @param {DuProcess[]}	  [processes]     - The DuProcess Array
 * @category DuESF
 */
function DuProcessQueue( processes ) {
    /**
     * The DuProcess list
      *@name processes
     * @type {DuProcess[]}
     * @memberof DuProcessQueue
     */
    this.processes = def (processes, []);
}

/**
 * Starts the processes
 * @memberof DuProcessQueue
 */
DuProcessQueue.prototype.start = function () {
    if ( !this.processes.length ) return;
    var cmd = '';
    for ( var i = 0; i < this.processes.length; i++ ) {
        var p = this.processes[ i ];
        if ( i > 0 ) {
            if ( DuSystem.mac ) cmd += ' && ';
            if ( DuSystem.win ) cmd += '\r\n';
        }
        cmd += p.buildQueueCmd();
        p.queue = [];
    }

    this.processes[ 0 ].startCmd( cmd );
}
