'use strict';

const fsu = require('base-cli-commands').FsUtils;
const BaseCommand = require('base-cli-commands').BaseCommand;

const Table = require('cli-table-redemption');

class ListCommand extends BaseCommand {

    execute(args) {
        return new Promise(resolve => {
            this.loadMetaFile().then(hosts => {
                return this.listHosts(hosts);
            }).then(resolve);
        });
    }

    loadMetaFile() {
        const metafile = this.paths.metafile;
        const hosts = this.paths.hosts();
        return fsu.mkdirp(hosts).then(_ => {
            return fsu.readFile(metafile, 'utf-8').then((content = '') => {
                return JSON.parse(content);
            }).catch(err => {
                if (err.code !== 'ENOENT') {
                    return err;
                }
                this.logger.info('No metafile has been created...');
            });
        });
    }

    listHosts(hosts = []) {
        const table = new Table({
            head: ['Name', 'Proxy', 'Domain'],
            colWidths: [30, 60, 60]
        });

        return new Promise(resolve => {
            hosts.map((host, i) => {
                table.push([host.name, host.proxy, host.domain]);
            });
            this.logger.info(table.toString());
            resolve();
        });
    }
}

ListCommand.COMMAND_NAME = 'list';
ListCommand.DESCRIPTION = 'List all local domains';

module.exports = ListCommand;