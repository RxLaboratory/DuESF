
/**
 * Methods to manage URLS
 * @namespace 
 * @category DuESF
 */
var DuURL = {};

/**
 * The list of escaped characters in URLs
 @enum {string}
 */
DuURL.EscapedChars = {
    "%": "%25",
    " ": "%20",
    "#": "%23",
    "$": "%24",
    "&": "%26",
    "@": "%40",
    "`": "%60",
    "/": "%2F",
    ":": "%3A",
    ":": "%3B",
    "<": "%3C",
    "=": "%3D",
    ">": "%3E",
    "?": "%3F",
    "[": "%5B",
    "\\": "%5C",
    "]": "%5D",
    "^": "%5E",
    "{": "%7B",
    "|": "%7C",
    "}": "%7D",
    "~": "%7E",
    "\"": "%22",
    "‘": "%27",
    "+": "%2B",
    ",": "%2C"
};


/**
 * Escapes common characters from a string to be included in a GET request URL.
 * @param {string} str The string to escape.
 * @returns {string} The escaped string.
 */
DuURL.escape = function( str )
{
    for( ch in DuURL.EscapedChars )
    {
        str = DuString.replace(str, ch, DuURL.EscapedChars[ch] );
    }
    return str;
}

/**
 * Builds a query, made of "key=value" pairs.
 * @param {Object} arr An associative array with key/value pairs. Values will be escaped.
 * @returns {string} The query, with the leading ?.
 */
DuURL.buildRequest = function( arr )
{
    var q = '?';
    var first = true;
    for( key in arr )
    {
        if (!arr.hasOwnProperty(key)) continue;
        if (!first) q += '&';
        first = false;
        q += key;
        if (arr[key] != '') q += "=" + DuURL.escape( arr[key] );
    }
    return q;
}

/**
 * Builds a HTTP GET request. The user-agent is named after DuESF.scriptName.
 * @param {string} host The host, without port, without http part; for example: "duduf.com" or "version.rxlab.io"
 * @param {string[]} [subfolders] The subfolders.
 * @param {Object} [argsArray] An associative array with key/value pairs. Values will be escaped.
 * @param {string} [httpVersion="1.1"] An associative array with key/value pairs. Values will be escaped.
 * @returns {string} The query ready to be posted with a socket
 */
DuURL.buildGET = function( host, subfolders, argsArray, httpVersion )
{
    subfolders = def(subfolders, []);
    httpVersion = def(httpVersion, "1.1");

    var request = 'GET ';
    
    // add subfolders
    for (var i = 0, n = subfolders.length; i < n; i++)
    {
        request += '/' + subfolders[i];
    }
    request += '/';

    // query
    if (isdef( argsArray ))
    {
        request += DuURL.buildRequest( argsArray );
    }

    request += '  HTTP/' + httpVersion + '\n';

    // Build user agent
    var userAgent = 'User-Agent: ' +
        DuESF.scriptName +
        '/' + DuESF.scriptVersion.fullVersion +
        ' (' + DuString.trim($.os) + ') AE/' +
        DuESF.hostVersion.version;

    request += userAgent + '\nHost: ' + host + '\n';

    return request;
}