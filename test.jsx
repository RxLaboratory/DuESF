(function (thisObj) {

    #include "DuESF.jsxinc"

    var f = new File('X:/test.yml');
    f.open('r');
    var data = f.read();
    f.close();
    data = DuYAML.load(data);

    alert(JSON.stringify(data, null, 4));
    alert(DuYAML.dump(data));

})(this);