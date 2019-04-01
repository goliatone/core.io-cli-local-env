'use strict';

const BaseInstaller = require('./base');

class BaseBrewInstaller extends BaseInstaller {

    get sudoerServiceFile() {
        return this.paths.root('etc', 'sudoers.d', `brew-${this.formula}`);
    }

    isInstalled() {
        return this.exec('brew list')
            .then(result => {
                return result.stdout.toLowerCase().split(/\s+/);
            }).then(output => {
                return output.includes(this.formula);
            });
    }

    install() {
        let next;
        if (this.isBrewService) {
            next = this.writeFile(this.sudoerServiceFile, [
                `Cmnd_Alias BREW_START = /usr/local/bin/brew services start ${this.formula}`,
                `Cmnd_Alias BREW_STOP = /usr/local/bin/brew services stop ${this.formula}`,
                `Cmnd_Alias BREW_RESTART = /usr/local/bin/brew services restart ${this.formula}`,
                '%admin ALL=(root) NOPASSWD: BREW_START',
                '%admin ALL=(root) NOPASSWD: BREW_STOP',
                '%admin ALL=(root) NOPASSWD: BREW_RESTART'
            ]);
        }
        return Promise.resolve(next).then(() => {
            return this.exec(`brew install ${this.formula}`);
        });
    }

    update() {
        return this.exec(`brew update ${this.formula}`);
    }

    uninstall() {
        let next;
        if (this.isBrewService) {
            next = this.removeFile(this.sudoerServiceFile);
        }

        return Promise.resolve(next).then(() => {
            return this.exec(`brew remove ${this.formula}`);
        });
    }

    isService() {
        return this.isBrewService;
    }

    isRunning() {
        return this.exec('brew services list').then(result => {
            const content = result.stdout.toLowerCase().split(/\n+/).filter(
                line => line.indexOf(this.formula) >= 0
            ).join('\n');
            return content.indexOf('started') >= 0;
        });
    }

    start() {
        this.logger.info(`brew services start ${this.formula}`);
        // return Promise.resolve();
        return this.sudo(`brew services start ${this.formula}`);
    }

    stop() {
        this.logger.info(`brew services stop ${this.formula}`);
        // return Promise.resolve();
        return this.sudo(`brew services stop ${this.formula}`);
    }

    get isBrewService() {
        return !!this._isBrewService;
    }

    get formula() {
        return this._formula;
    }
}

module.exports = BaseBrewInstaller;