
/**
 * Moves the coordinates so that the size completely fits inside an existing screen
 * @param {int[]} location The coordinates [top, left]
 * @param {Dimension} size The rectangle size, an object which has two properties: width and height
 * @return {int[]} the new location
 */ 
DuScriptUI.moveInsideScreen = function (location, size)
{
    var screen = DuScriptUI.getClosestScreen(location);

    var result = location;
    var left = location[0];
    var right = location[0] + size.width;
    var top = location[1];
    var bottom = location[1] + size.height;
    // if outside on the left
    if (screen.left > location[0]) result[0] += ( screen.left - left );
    if (screen.right < right) result[0] += ( screen.right - right );
    if (screen.top > top) result[1] += ( screen.top - top );
    if (screen.bottom < bottom) result[1] += ( screen.bottom - bottom );
    return result;
}

/**
 * Centers the coordinates in their screen
 * @param {int[]} location The coordinates [top, left]
 * @param {Dimension} size The rectangle size, an object which has two properties: width and height
 * @return {int[]} the new location
 */ 
DuScriptUI.centerInScreen = function (location, size)
{
    var screen = DuScriptUI.getClosestScreen(location);
    if (!screen) return location;

    var x = (screen.left + screen.right) / 2;
    var y = (screen.top + screen.bottom) / 2;

    // offset
    x -= size[0] / 2;
    y -= size[1] / 2;

    return [x, y];
}

/**
 * Gets the corners of the screen the closest to (or containing) the location
 * @param {int[]} location The coordinates
 * @return {Object} The screen object with a top, left, right and bottom property. 
 */
DuScriptUI.getClosestScreen = function(location)
{
    var screen = null;
    var distance = 999999999;
    for (var i = 0, n = $.screens.length; i < n; i++)
    {
        var s = $.screens[i];

        // check if the location is inside the screen
        if (location[0] > s.left && location[0] < s.right && location[1] > s.top && location[1] < s.bottom)
        {
            return s;
        }

        //get the center
        var c = [ (s.left + s.right)/2, (s.top + s.bottom) / 2];
        //get the distance
        var d = DuMath.length(c, location);
        if (d < distance)
        {
            screen = s;
            distance = d;
        }
    }
    return screen;
}