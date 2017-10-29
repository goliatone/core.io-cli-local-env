'use strict';

const Paths = require('../lib/cli-paths');

const Base = require('base-cli-commands').BaseCommand;

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

/**
 * Attach commands to given application context,
 * if a `namespace` is given then commands will 
 * be added as sub-commands.
 */
module.exports.attach = function $attach(app, namespace=false) {

    const context = {
        namespace,
        prog: app.prog,
        paths: new Paths()
    };

    Install.attach(context);
    List.attach(context);
    Open.attach(context);
    Share.attach(context);
    Restart.attach(context);
    Stop.attach(context);
    Start.attach(context);
    Serve.attach(context);
    Update.attach(context);
};
