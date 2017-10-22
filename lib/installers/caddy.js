'use strict';
const BaseInstaller = require('./base');

class CaddyInstaller extends BaseInstaller {

    isInstalled(){
        return this.fileExists(this.paths.home('ngrok'));
    }

    install(){
        const home = this.paths.home();
        const script = this.paths.base('bin/install-ngrok');

        return this.exec(`/bin/bash "${script}" "${home}"`);
    }

    uninstall(){
        return this.removeFile(this.paths.home('ngrok'));
    }
}

module.exports = CaddyInstaller;
