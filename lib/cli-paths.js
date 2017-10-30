'use strict';
const path = require('path');
const BasePaths = require('base-cli-commands').BasePaths;

class CLIPaths extends BasePaths {
    
    constructor(base){
        super(base);

        this._home = path.join(this.homeDir, '.core.io');
        this._etc = path.join(this.rootDir, 'etc');
        this._hosts = this.home('hosts');
        this._config = this.base('config');
        this._templates = this.base('lib', 'templates');
        this._metafile = this.home('hosts', '.metahosts');
    }

    root(...args){
        return this._join(this.rootDir, ...args);
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

    get metafile(){
        return this._metafile;
    }

    get homeDir(){
        if(process.env.DEBUG){
            return '/tmp';
        }
        return process.env.HOME;
    }

    get rootDir(){
        if(process.env.DEBUG){
            return '/tmp/.core.io';
        }
        return '/';
    }
}

module.exports = CLIPaths;
