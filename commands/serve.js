'use strict';

const OpenCommand = require('./open');
const fsu = require('../lib/fs-utils');
const HostFile = require('../lib/hostfile');
const CaddyInstaller = require('../lib/installers/caddy');

class ServeCommand extends OpenCommand {

    execute(args){

        const paths = this.paths;
        const logger = this.logger;
        const caddy = new CaddyInstaller({logger});

        return new Promise((resolve, reject) => {
            this.loadHostFromDomain(args.domain).then((host=false)=>{
                if(host){
                    return reject('This domain already exists');
                }

                const hostFile = new HostFile({
                    logger,
                    paths
                });

                hostFile.fromArgs(args);

                return hostFile.create().then(()=>{
                    return this.addHostfile(hostFile);
                }).then(()=>{
                    return caddy.restart();
                }).then(()=>{
                    return this.open(args.domain);
                });
            });
        });
    }

    addHostfile(host){
        return this.loadMetaFile().then((hosts=[])=>{
            hosts.push(host.toJSON());
            return hosts;
        }).then((hosts)=>{
            return JSON.stringify(hosts, null, 4);
        }).then((content)=>{
            return this.saveMetaFile(content);
        });
    }

    saveMetaFile(content) {
        const metafile = this.paths.metafile;
        return fsu.writeFile(metafile, content);
    }

    static attach(prog){
        const cmd = prog.command(this.COMMAND_NAME, this.DESCRIPTION);

        cmd.argument('<domain>', 'Domain to use', /.*/);
        cmd.argument('<proxy>', 'Source host domain', /.*/);
        cmd.option('--name', 'Name for quick access', prog.BOOL);
        cmd.option('--save', 'Save for quick launch access', prog.BOOL, true);
        cmd.option('--open', 'Open browser page with domain', prog.BOOL, true);

        cmd.help('domain=my-app.core.test proxy=localhost:9090');

        cmd.action((args, options, logger)=>{
            const command = new ServeCommand({
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

ServeCommand.COMMAND_NAME = 'serve';
ServeCommand.DESCRIPTION = 'Proxy a local domain and save it for quick access';

module.exports = ServeCommand;
