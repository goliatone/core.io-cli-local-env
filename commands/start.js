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
            caddy.start(),
            dnsmasq.start()
        ]);
    }

    static attach(prog){
        const cmd = super.attach(prog);

        cmd.action((args, options, logger)=>{
            const command = new RestartCommand({
                logger
            });
            args.options = options;
            command.ready()
                .execute(args)
                .then((context)=>{
                    process.exit(0);
                });
        });
    }
}

RestartCommand.COMMAND_NAME = 'start';
RestartCommand.DESCRIPTION = 'Start Caddy and Dnsmasq services';

module.exports = RestartCommand;
