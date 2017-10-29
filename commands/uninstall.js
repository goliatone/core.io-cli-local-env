'use strict';

const BaseCommand = require('base-cli-commands').BaseCommand;
const CaddyInstaller = require('../lib/installers/caddy');
const DnsmasqInstaller = require('../lib/installers/dnsmasq');

class UninstallCommand extends BaseCommand {

    constructor(options){
        super(options);
        this._sudo = true;
    }

    execute(args){
        const logger = this.logger;
        const caddy = new CaddyInstaller({logger});
        const dnsmasq = new DnsmasqInstaller({logger});

        return Promise.all([
            caddy.remove(),
            dnsmasq.remove()
        ]);
    }
}

UninstallCommand.COMMAND_NAME = 'uninstall';
UninstallCommand.DESCRIPTION = 'Uninstall all files and binaries';

module.exports = UninstallCommand;
