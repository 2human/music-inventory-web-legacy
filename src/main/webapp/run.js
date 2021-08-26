// run.js

require('babel-register')({
    presets: ['env']
});

module.exports = require('../../src/main/webapp/app.js')