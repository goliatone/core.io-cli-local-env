'use strict';

const BaseCommand = require('./base');
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

    static attach(prog){
        const cmd = super.attach(prog);

        cmd.action((args, options, logger)=>{
            const command = new UninstallCommand({
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

UninstallCommand.COMMAND_NAME = 'uninstall';
UninstallCommand.DESCRIPTION = 'Uninstall all files and binaries';

module.exports = UninstallCommand;
