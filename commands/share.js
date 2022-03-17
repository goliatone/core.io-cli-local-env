'use strict';

const fsu = require('base-cli-commands').FsUtils;
const BaseCommand = require('base-cli-commands').BaseCommand;
const ChildProcess = require('child-process-promise');

class ShareCommand extends BaseCommand {

    execute(args) {
        return new Promise((resolve) => {
            const project = args.project;
            this.loadMetaFile().then((hosts) => {
                return this.findHost(project, hosts);
            }).then((host = false) => {
                if (!host) {
                    return this.logger.error('Host %s does not exists', project);
                }

                const ngrok = this.paths.home('ngrok');

                return ChildProcess.spawn(ngrok, ['http', host.proxy], {
                    stdio: 'inherit'
                });
            });
        });
    }

    loadMetaFile() {
        const metafile = this.paths.metafile;
        return fsu.readFile(metafile, 'utf-8').then((content = '') => {
            return JSON.parse(content);
        });
    }

    findHost(hostname, hosts = []) {
        return new Promise((resolve) => {
            let output;
            hosts.map((host) => {
                if (host.name === hostname) {
                    output = host;
                }
            });
            resolve(output);
        });
    }

    static describe(prog, cmd) {
        cmd.argument('<project>', 'Project to share', { validator: /.*/ });
    }
}

ShareCommand.COMMAND_NAME = 'share';
ShareCommand.DESCRIPTION = 'Generate a shareable URL for a project';

module.exports = ShareCommand;
