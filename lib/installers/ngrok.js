'use strict';
const BaseInstaller = require('./base');

class NgrokInstaller extends BaseInstaller {

    isInstalled() {
        const home = this.paths.home('ngrok');
        return this.fileExists(home);
    }

    install() {
        const home = this.paths.home();
        const script = this.paths.base('bin/install-ngrok');

        return this.exec(`/bin/bash "${script}" "${home}"`);
    }

    uninstall() {
        return this.removeFile(this.paths.home('ngrok'));
    }

    isRunning() {
        console.log('isRunning', false);
        return false;
    }
}

module.exports = NgrokInstaller;