'use strict';

const fsu = require('base-cli-commands').FsUtils;
const BaseCommand = require('base-cli-commands').BaseCommand;
const CaddyInstaller = require('../lib/installers/caddy');
const DnsmasqInstaller = require('../lib/installers/dnsmasq');

class RestartCommand extends BaseCommand {

    execute(args){
        const logger = this.logger;
        const caddy = new CaddyInstaller({logger});
        const dnsmasq = new DnsmasqInstaller({logger});

        return Promise.all([
            caddy.start(),
            dnsmasq.start()
        ]);
    }
}

RestartCommand.COMMAND_NAME = 'start';
RestartCommand.DESCRIPTION = 'Start Caddy and Dnsmasq services';

module.exports = RestartCommand;
