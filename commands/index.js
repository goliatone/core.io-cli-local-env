'use strict';

const Install = require('./install');
const List = require('./list');
const Restart = require('./restart');
const Serve = require('./serve');
const Share = require('./share');
const Start = require('./start');
const Stop = require('./stop');
const Uninstall = require('./uninstall');

module.exports.attach = function(prog) {
    Install.attach(prog);
    List.attach(prog);
};
