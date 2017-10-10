var _base = './public/';
var fs = require('fs');

var _camaraRequire = function(url, base) {
      if(base === undefined) {
         base = _base;
      }
      var content = fs.readFileSync(base + url  + ".js", { encoding: "utf-8" });
      return eval(content);
};

var _camaraConfig = function(url, base) {
      if(base === undefined) {
         base = _base;
      }
      var content = fs.readFileSync(base + url  + ".js", { encoding: "utf-8" });
      return eval("(function () { return " + content +  " })();");
};

module.exports = {   camaraRequire: _camaraRequire,
                     camaraConfig: _camaraConfig
                 };
