'use strict';
console.clear()

let choices =[ 
"filemeta", 
"headparser",
"server",
"shorturl",
"timestamp",
"tracker" ]
let prompt = require('readline-sync').question(`${choices}\n\nchoose one :) ->\n`)
let choice = choices.filter(v=>v.match(prompt))[0]
console.log(choice)
const app = require('./build/' + choice);


app.listen(3000, () => console.log('Local app listening on port 3000!'));