'use strict';

const OpenCommand = require('./open');
const fsu = require('base-cli-commands').FsUtils;
const HostFile = require('../lib/hostfile');
const CaddyInstaller = require('../lib/installers/caddy');

class RemoveCommand extends OpenCommand {

    async execute(args) {

        const paths = this.paths;
        const logger = this.logger;
        const caddy = new CaddyInstaller({ logger });

        //by name:
        //Load metahosts, find proxy by name and remove
        //Remove host file
        // const hosts = await this.loadMetaFile();

        return new Promise((resolve, reject) => {
            this.loadHostFromDomain(args.domain).then((host = false) => {
                if (!host) {
                    return reject('This domain does not exist');
                }

                const hostFile = new HostFile({
                    logger,
                    paths
                });

                hostFile.fromArgs(host);

                return hostFile.unlink().then(_ => {
                    return this.removeHostfile(host);
                }).then(_ => {
                    return caddy.restart();
                });
            });
        });
    }

    /**
     * The passed HostFile will be parsed and
     * added to the .metafile
     * @param {HostFile} host Hostfile definition
     */
    removeHostfile(host) {
        return this.loadMetaFile().then((hosts = []) => {
            //find index of host, remove by index
            hosts.splice(hosts.findIndex(i => {
                return i.domain === host.domain;
            }), 1);

            return hosts;
        }).then(hosts => {
            return JSON.stringify(hosts, null, 4);
        }).then((content) => {
            return this.saveMetaFile(content);
        });
    }

    /**
     * Update `.metafile` with new content.
     * @param {String} content Content to be written
     */
    saveMetaFile(content) {
        const metafile = this.paths.metafile;
        return fsu.writeFile(metafile, content);
    }

    static describe(prog, cmd) {

        cmd.argument('<domain>', 'Domain to use', { validator: /.*/ });
        // cmd.option('--name', 'Name for quick access', prog.BOOL);

        cmd.help('domain=my-app.core.test');
    }
}

RemoveCommand.COMMAND_NAME = 'remove';
RemoveCommand.DESCRIPTION = 'Remove a previously added domain';

module.exports = RemoveCommand;
