'use strict';

const BaseCommand = require('base-cli-commands').BaseCommand;
const CaddyInstaller = require('../lib/installers/caddy');
const DnsmasqInstaller = require('../lib/installers/dnsmasq');

class RestartCommand extends BaseCommand {

    execute(args){
        const logger = this.logger;
        const caddy = new CaddyInstaller({logger});
        const dnsmasq = new DnsmasqInstaller({logger});

        return Promise.all([
            caddy.restart(),
            dnsmasq.restart()
        ]);
    }
}

RestartCommand.COMMAND_NAME = 'restart';
RestartCommand.DESCRIPTION = 'Restart Caddy and Dnsmasq services';

module.exports = RestartCommand;
