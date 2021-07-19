(function()
{
    var f = new File("aeThemeColors.txt");
    var theme = '';
    for (var i =0; i < 100; i++)
    {
        theme += i + ': ' + app.themeColor(i).toSource() + '\n';
    }
    alert (theme);


})();