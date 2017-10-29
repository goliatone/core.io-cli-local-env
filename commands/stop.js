'use strict';

const BaseCommand = require('./base');
const CaddyInstaller = require('../lib/installers/caddy');
const DnsmasqInstaller = require('../lib/installers/dnsmasq');

class RestartCommand extends BaseCommand {

    execute(args){
        const logger = this.logger;
        const caddy = new CaddyInstaller({logger});
        const dnsmasq = new DnsmasqInstaller({logger});

        return Promise.all([
            caddy.stop(),
            dnsmasq.stop()
        ]);
    }
}

RestartCommand.COMMAND_NAME = 'stop';
RestartCommand.DESCRIPTION = 'Stop Caddy and Dnsmasq services';

module.exports = RestartCommand;
