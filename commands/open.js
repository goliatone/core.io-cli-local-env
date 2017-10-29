'use strict';

const BaseCommand = require('./base');
const fsu = require('../lib/fs-utils');

/**
 * In a project directory we might have
 * a meta file with domain names.
 */
class OpenCommand extends BaseCommand {

    execute(args){
        return new Promise((resolve, reject)=>{
            this.loadHostFromDomain(args.domain).then((host=false)=>{
                if(!host){
                    const msg = `Host ${args.domain} does not exists`;
                    this.logger.error(msg);
                    return reject(msg);
                }
                return this.open(host.domain);
            });
        });
    }

    open(domain){
        return this.exec(`open "http://${domain}"`);
    }

    loadHostFromDomain(domain){
        return this.loadMetaFile().then((hosts)=>{
                return this.findHost(domain, hosts);
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

    static describe(prog, cmd){
        cmd.argument('<domain>', 'Domain to open', /.*/);
    }
}

OpenCommand.COMMAND_NAME = 'open';
OpenCommand.DESCRIPTION = 'Open domain in default browser';

module.exports = OpenCommand;
