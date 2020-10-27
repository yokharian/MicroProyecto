console.clear();
const localApp = require('./server');

console.log('LOCAL_MODE=true');

localApp.listen(3000, () => console.log('Local app listening on port 3000!'));
