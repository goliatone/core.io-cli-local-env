'use strict';

const OpenCommand = require('./open');
const fsu = require('base-cli-commands').FsUtils;
const HostFile = require('../lib/hostfile');
const CaddyInstaller = require('../lib/installers/caddy');

class ServeCommand extends OpenCommand {

    execute(args) {

        const paths = this.paths;
        const logger = this.logger;
        const caddy = new CaddyInstaller({ logger });

        return new Promise((resolve, reject) => {
            this.loadHostFromDomain(args.domain).then((host = false) => {
                if (host) {
                    return reject('This domain already exists');
                }

                const hostFile = new HostFile({
                    logger,
                    paths
                });

                hostFile.fromArgs(args);

                return hostFile.create().then(_ => {
                    return this.addHostfile(hostFile);
                }).then(_ => {
                    return caddy.restart();
                }).then(_ => {
                    return this.open(args.domain);
                });
            });
        });
    }

    /**
     * The passed HostFile will be parsed and
     * added to the .metafile
     * @param {HostFile} host Hostfile definition
     */
    addHostfile(host) {
        return this.loadMetaFile().then((hosts = []) => {
            hosts.push(host.toJSON());
            return hosts;
        }).then(hosts => {
            return JSON.stringify(hosts, null, 4);
        }).then(content => {
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
        cmd.argument('<proxy>', 'Source host domain', { validator: /.*/ });
        cmd.option('--name', 'Name for quick access', { validator: prog.STRING });

        cmd.option('--save', 'Save for quick launch access', {
            validator: prog.BOOL,
            default: true
        });

        cmd.option('--open', 'Open browser page with domain', {
            validator: prog.BOOL,
            default: true
        });

        cmd.help('domain=my-app.core.test proxy=localhost:9090');
    }
}

ServeCommand.COMMAND_NAME = 'serve';
ServeCommand.DESCRIPTION = 'Proxy a local domain and save it for quick access';

module.exports = ServeCommand;
