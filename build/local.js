"use strict";
console.clear();
var localApp = require('./server');
console.log('LOCAL_MODE=true');
localApp.listen(3000, function () { return console.log('Local app listening on port 3000!'); });
