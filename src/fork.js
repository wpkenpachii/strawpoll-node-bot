const { fork } = require('child_process');
let max_counter = 10;
[...Array(max_counter).keys()].forEach(() => fork('./src/zyte.js'))
