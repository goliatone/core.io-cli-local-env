'use strict';

const fsu = require('base-cli-commands').FsUtils;
const BaseCommand = require('base-cli-commands').BaseCommand;
const installers = require('../lib/installers');

const Promise = require('bluebird');

class InstallCommand extends BaseCommand {

    async execute(args) {

        //Ensure we have brew installed:
        const hasBrew = await this.commandExists('brew');
        if (!hasBrew) this.error('You need to have brew installed.');

        //This command tool will class with:
        //this.commandExists('valet') -> error
        //this.commandExists('marina') -> error

        const home = this.paths.home();
        const hosts = this.paths.hosts();
        const metafile = this.paths.metafile;
        const sudoers = this.paths.root('etc', 'sudoers.d');

        // this.dryRun = true;
        const Caddyfile = {
            source: this.paths.config('Caddyfile'),
            destination: this.paths.home('Caddyfile')
        };

        await this.execAsUser(`mkdir -p "${home}" "${hosts}"`);
        await this.execAsUser(`cp "${Caddyfile.source}" "${Caddyfile.destination}"`);
        await this.execAsUser(`touch ${metafile} && bash -c "echo [] > ${metafile}"`);
        //This is creating the file as root
        // fsu.writeFile(metafile, '[]'),
        await fsu.mkdirp(sudoers);

        this.logger.info('done', Caddyfile);

        try {
            for (let key in installers) {
                await this.runInstaller(installers[key]);
            }
        } catch (error) {
            this.error(error);
        }
    }

    async runInstaller(Installer) {
        const installer = new Installer({
            logger: this.logger,
            paths: this.paths
        });

        const name = installer.constructor.name;
        this.logger.info('Running installer for "%s" starting...', name);

        let installed = await installer.isInstalled();

        if (installed) {
            return this.logger.info('Installer %s already installed', name);
        }

        this.logger.info('Installing %s', name);

        let done, isService, isRunning;
        done = await installer.install();
        isService = await installer.isService();
        isRunning = await installer.isRunning();

        if (isService && !isRunning) {
            this.logger.info('Starting install "%s"...', name);
            installer.start();
        } else {
            this.logger.info(' %s installed...', name);
        }

        return done;
    }


    get useSudo() {
        return true;
    }
}

InstallCommand.COMMAND_NAME = 'install';
InstallCommand.DESCRIPTION = 'Install all dependencies. Needs sudo';

module.exports = InstallCommand;