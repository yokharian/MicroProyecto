'use strict';
console.clear();

const app = require('./build/server');

console.log('LOCAL_MODE=true');

app.listen(3000, () => console.log('Local app listening on port 3000!'));