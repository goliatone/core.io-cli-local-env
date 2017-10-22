'use strict';
const path = require('path');
const BasePaths = require('./paths');

class CLIPaths extends BasePaths {
    constructor(base){
        super(base);

        this._home = path.join('/tmp', '.core.io');
        // this._home = path.join(process.env.HOME, '.core.io');
        this._hosts = this.home('hosts');
        this._config = this.base('config');
        this._templates = this.base('lib', 'templates');
    }

    config(...args){
        return this._join(this._config, ...args);
    }
    templates(...args){
        return this._join(this._templates, ...args);
    }

    home(...args){
        return this._join(this._home, ...args);
    }

    hosts(...args){
        return this._join(this._hosts, ...args);
    }
}

module.exports = CLIPaths;
