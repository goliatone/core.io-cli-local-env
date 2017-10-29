'use strict';

const BaseCommand = require('base-cli-commands').BaseCommand;
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
}

UpdateCommand.COMMAND_NAME = 'update';
UpdateCommand.DESCRIPTION = 'Update toolchain';

module.exports = UpdateCommand;
