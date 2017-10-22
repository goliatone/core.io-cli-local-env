'use strict';
const Bluebird = require('bluebird');
const mkdirp = Bluebird.promisify(require('mkdirp'));
const readFile = Bluebird.promisify(require('fs').readFile);

module.exports = {
    mkdirp,
    readFile
};
