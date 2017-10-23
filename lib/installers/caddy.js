'use strict';
const BaseInstaller = require('./base');
const TemplateRenderer = require('../template');

const LAUNCHCTL_PLIST = '/Library/LaunchDaemons/core.io.caddy.plist';
const SUDOER = '/etc/sudoers.d/core.io-caddy';

class CaddyInstaller extends BaseInstaller {

    constructor(options){
        super(options);
        this.template = new TemplateRenderer(options);
    }

    isInstalled(){
        const files = [
            this.paths.home('caddy'),
            LAUNCHCTL_PLIST,
            SUDOER
        ];

        for(const file of files) {
			const exists = this.fileExistsSync(file);
			if(exists) continue;
			return Promise.resolve(false);
		}
		return Promise.resolve(true);

    }

    install(){
        const home = this.paths.home();
        const script = this.paths.base('bin/install-caddy');
        const launchctlPlist = this.paths.root(LAUNCHCTL_PLIST);
        const sudoer = this.paths.root(SUDOER);

        const sudoerFile = [
            `%admin ALL=(root) NOPASSWD: /bin/launchctl load ${LAUNCHCTL_PLIST}`,
			`%admin ALL=(root) NOPASSWD: /bin/launchctl load -w ${LAUNCHCTL_PLIST}`,
			`%admin ALL=(root) NOPASSWD: /bin/launchctl unload ${LAUNCHCTL_PLIST}`,
			'%admin ALL=(root) NOPASSWD: /bin/launchctl list core.io.caddy'
        ];

        return Promise.all([
            this.exec(`/bin/bash "${script}" "${home}"`),
            this.writeFile(sudoer, sudoerFile),
            this.template.render('core.io-caddy-launch', {
                home
            })
        ]).then(([a, b, content])=>{
            return this.writeFile(launchctlPlist, content);
        }).catch((err)=>{
            this.logger.error('Failed caddy installation.');
            this.logger.error(err);
            return err;
        });
    }

    uninstall(){
        return Promise.all([
            this.sudo(`launchctl unload ${LAUNCHCTL_PLIST}`),
            this.removeFile(LAUNCHCTL_PLIST),
            this.removeFile(this.paths.home('caddy'))
        ]);
    }

    isService(){
        return true;
    }

    isRunning(){
        return this.sudo('launchctl list core.io.caddy')
            .then(() => true)
            .catch(() => false);
    }

    start(){
        this.logger.info(`launchctl load -w ${LAUNCHCTL_PLIST}`);
        return Promise.resolve();
        return this.sudo(`launchctl load -w ${LAUNCHCTL_PLIST}`);
    }

    stop(){
        return this.sudo(`launchctl unload -w ${LAUNCHCTL_PLIST}`);
    }
}

module.exports = CaddyInstaller;
