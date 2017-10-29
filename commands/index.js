'use strict';

const Install = require('./install');
const List = require('./list');
const Restart = require('./restart');
const Serve = require('./serve');
const Share = require('./share');
const Start = require('./start');
const Stop = require('./stop');
const Uninstall = require('./uninstall');
const Open = require('./open');
const Update = require('./update');

module.exports.attach = function(prog, namespace=false) {
    Install.attach(prog, namespace);
    List.attach(prog, namespace);
    Open.attach(prog, namespace);
    Share.attach(prog, namespace);
    Restart.attach(prog, namespace);
    Stop.attach(prog, namespace);
    Start.attach(prog, namespace);
    Serve.attach(prog, namespace);
    Update.attach(prog, namespace);
};
