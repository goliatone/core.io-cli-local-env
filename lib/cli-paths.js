'use strict';
const path = require('path');
const BasePaths = require('./paths');

class CLIPaths extends BasePaths {
    constructor(base){
        super(base);

        this._home = path.join(this.homeDir, '.core.io');
        this._etc = path.join(this.rootDir, 'etc');
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

    etc(...args){
        return this._join(this._etc, ...args);
    }

    get homeDir(){
        return '/tmp';
        if(process.env.DEBUG){
            return '/tmp';
        }
        return process.env.HOME;
    }

    get rootDir(){
        return '/tmp';
        if(process.env.DEBUG){
            return '/tmp';
        }
        return '/';
    }
}

module.exports = CLIPaths;
