'use strict';
const path = require('path');
const BasePaths = require('base-cli-commands').BasePaths;

class CLIPaths extends BasePaths {

    constructor(base) {
        let options = {};
        if (base) options.base = base;

        super(options);

        this._home = path.join(this.homeDir, '.core.io');
        this._etc = path.join(this.rootDir, 'etc');
        this._hosts = this.home('hosts');
        this._metafile = this.home('hosts', '.metahosts');

        this._module = path.resolve(__dirname, '..');
        this._config = this.module('config');
        this._templates = this.module('lib', 'templates');


    }

    /**
     * Returns path to `root` directory,
     * appending any passed in arguments.
     *
     * ```js
     * cliPaths.config('my-project');
     * // ./core.io-cli-local-env/config/my-project
     * ```
     * @param  {...any} args Strings representing
     *
     */
    root(...args) {
        return this._join(this.rootDir, ...args);
    }

    /**
     * Returns path to `config` directory,
     * relative to the base directory.
     *
     * ```js
     * cliPaths.config('my-project');
     * // ./core.io-cli-local-env/config/my-project
     * ```
     * @param  {...any} args Strings representing
     *
     */
    config(...args) {
        return this._join(this._config, ...args);
    }

    /**
     * Returns directories or files relative to
     * this module.
     * @param  {...any} args String paths
     */
    module(...args) {
        return this._join(this._module, ...args);
    }

    /**
     * Returns path to `templates` directory,
     * relative to the base directory.
     *
     * ```js
     * cliPaths.templates('node-project');
     * // ./core.io-cli-local-env/lib/templates/node-project
     * ```
     * @param  {...any} args Strings representing
     *
     */
    templates(...args) {
        return this._join(this._templates, ...args);
    }

    /**
     * Returns path to `home` directory,
     * joining any segments passed to the
     * function
     * ```js
     * cliPaths.home('my-project');
     * // ~/.core.io/my-project
     * ```
     * @param  {...any} args Strings representing
     *
     */
    home(...args) {
        return this._join(this._home, ...args);
    }

    /**
     * Returns path to `hosts` directory,
     * joining any segments passed to the
     * function
     * ```js
     * cliPaths.hosts('my-web');
     * // ~/.core.io/hosts/my-web
     * ```
     * @param  {...any} args Strings representing
     *
     */
    hosts(...args) {
        return this._join(this._hosts, ...args);
    }

    /**
     * ~/.core.io/hosts/.metahosts
     * @returns {String}
     */
    get metafile() {
        return this._metafile;
    }

    /**
     * Value of home directory.
     * If we are working on `process.env.DEBUG`
     * it will return `/tmp`.
     * Else it will return process.env.HOME.
     *
     * @returns {String}
     */
    get homeDir() {
        if (process.env.DEBUG) {
            return '/tmp';
        }
        return process.env.HOME;
    }

    /**
     * Value of root directory.
     * If we are working on `process.env.DEBUG`
     * it will return `/tmp/.core.io`.
     * Else it will return '/'
     *
     * @returns {String}
     */
    get rootDir() {
        if (process.env.DEBUG) {
            return '/tmp/.core.io';
        }
        return '/';
    }
}

module.exports = CLIPaths;

// var p = new CLIPaths('/pe');
// console.log('root', p.root())
// console.log('config', p.config())
// console.log('templates', p.templates())
// console.log('home', p.home())
// console.log('hosts', p.hosts())
// console.log('metafile', p.metafile)
// console.log('config', p.homeDir)
// console.log('config', p.rootDir)
