function camaraRequire(url) {
   var req = new XMLHttpRequest();
    req.open("GET", url + ".js", false); // 'false': synchronous.
    req.send(null);
    return eval(req.responseText);
}

function camaraConfig(url) {
   var req = new XMLHttpRequest();
    req.open("GET", url + ".js", false); // 'false': synchronous.
    req.send(null);
    return eval("(function () { return " + req.responseText +  " })();");
}
