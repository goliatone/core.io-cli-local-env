'use strict';
const fs = require('fs');
const path = require('path');

class Paths {
    constructor(base) {
        this._base = base || this.getBasepath();
        this._package = path.join(this._base, 'package');
    }

    base(...args) {
        return this._join(this._base, ...args);
    }

    get package() {
        return this._package;
    }

    getBasepath() {
        if (process.env.APP_BASE) {
            return process.env.APP_BASE;
        }

        const test = /\/pm2|mocha|ava|forever\//i;
        let parent = module;

        while (parent.parent && !test.test(parent.parent.filename)) {
            parent = parent.parent;
        }

        let dirname = path.dirname(parent.filename);

        while (dirname !== '/' && dirname !== '.' && !_hasPackage(dirname)) {
            dirname = path.dirname(dirname);
        }

        if (dirname === '/' || dirname === '.') {
            throw new Error('Could not find base path.');
        }

        return dirname;
    }

    _join(root, ...args) {
        if (!args.length) return root;
        args.unshift(root);
        return path.join(...args);
    }
}

function _hasPackage(dirname) {
    return fs.existsSync(path.join(dirname, 'package.json'));
}

module.exports = Paths;