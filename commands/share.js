'use strict';

const BaseCommand = require('./base');
const fsu = require('../lib/fs-utils');
const ChildProcess = require('child-process-promise');

class ShareCommand extends BaseCommand {

    execute(args){
        return new Promise((resolve)=>{
            const project = args.project;
            this.loadMetaFile().then((hosts)=>{
                return this.findHost(project, hosts);
            }).then((host=false)=>{
                if(!host){
                    return this.logger.error('Host %s does not exists', project);
                }

                const ngrok = this.paths.home('ngrok');

                return ChildProcess.spawn(ngrok, [ 'http', host.proxy ], {
                    stdio: 'inherit'
                });
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
        cmd.argument('<project>', 'Project to share', /.*/);

        cmd.action((args, options, logger)=>{
            const command = new ShareCommand({
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

ShareCommand.COMMAND_NAME = 'share';
ShareCommand.DESCRIPTION = 'Generate a shareable URL for a project';

module.exports = ShareCommand;
