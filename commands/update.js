'use strict';

const BaseCommand = require('./base');
const CaddyInstaller = require('../lib/installers/caddy');
const DnsmasqInstaller = require('../lib/installers/dnsmasq');

class UpdateCommand extends BaseCommand {

    execute(args){
        const logger = this.logger;
        const caddy = new CaddyInstaller({logger});
        const dnsmasq = new DnsmasqInstaller({logger});

        return this.checkIfCommandExists('brew').then((exists)=>{
            if(!exists){ 
                this.logger.error('Please install "brew" before proceeding');
                return Promise.reject();
            }
            return this.execAsUser('brew update');
        }).then(()=>{
            return caddy.update();
        }).then(()=>{
            return dnsmasq.update();
        });
    }

    static attach(prog){
        const cmd = super.attach(prog);

        cmd.action((args, options, logger)=>{
            const command = new UpdateCommand({
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

UpdateCommand.COMMAND_NAME = 'update';
UpdateCommand.DESCRIPTION = 'Update toolchain';

module.exports = UpdateCommand;
