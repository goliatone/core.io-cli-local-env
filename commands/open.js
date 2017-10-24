'use strict';

const BaseCommand = require('./base');
const fsu = require('../lib/fs-utils');

/**
 * In a project directory we might have
 * a meta file with domain names.
 */
class OpenCommand extends BaseCommand {

    execute(args){
        return new Promise((resolve)=>{
            this.loadMetaFile().then((hosts)=>{
                return this.findHost(args.domain, hosts);
            }).then((host=false)=>{
                if(!host){
                    return this.logger.error('Host %s does not exists', args.domain);
                }
                return this.exec(`open "http://${host.domain}"`);
            });
        });
    }

    loadMetaFile(){
        const metafile = this.paths.metafile;
        return fsu.readFile(metafile, 'utf-8').then((content='')=>{
            return JSON.parse(content);
        });
    }

    findHost(hostname, hosts=[]){
        return new Promise((resolve)=>{
            let output;
            hosts.map((host)=>{
                if(host.name === hostname){
                    output = host;
                }
            });
            resolve(output);
        });
    }

    static attach(prog){
        const cmd = super.attach(prog);

        cmd.argument('<domain>', 'Domain to open', /.*/);

        cmd.action((args, options, logger)=>{

            const command = new OpenCommand({
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

OpenCommand.COMMAND_NAME = 'open';
OpenCommand.DESCRIPTION = 'Open domain in default browser';

module.exports = OpenCommand;
