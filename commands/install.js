'use strict';

const fsu = require('../lib/fs-utils');

const BaseCommand = require('./base');
const installers = require('../lib/installers');

class InstallCommand extends BaseCommand {

    execute(args) {

        //Ensure we have brew installed:
        //! this.commandExists('brew') -> error
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

        return Promise.all([
            this.execAsUser(`mkdir -p "${home}" "${hosts}"`),
            this.execAsUser(`cp "${Caddyfile.source}" "${Caddyfile.destination}"`),
            fsu.writeFile(metafile, '[]'),
            fsu.mkdirp(sudoers)
        ]).then(()=>{
            this.logger.info('done', Caddyfile);

            installers.each((Installer)=> {
                const installer = new Installer({
                    logger: this.logger,
                    paths: this.paths
                });

                const name = installer.constructor.name;
                console.log('name', name);

                installer.isInstalled().then((installed)=>{
                    console.log('installed', installed);
                    if(installed){
                        return this.logger.info('Installer %s already installed', name);
                    }

                    this.logger.info('Installing %s', name);

                    return Promise.all([
                        installer.install(),
                        installer.isService(),
                        installer.isRunning()
                    ]).then(([done, isService, isRunning])=>{
                        if(isService && !isRunning) {
                            this.logger.info('Starting %s', name);
                            installer.start();
                        } else {
                            this.logger.info('Installed...');
                        }
                    });
                });
            });
        });
    }

    get useSudo(){
        return true;
    }

    static attach(prog){
        const cmd = super.attach(prog);
        cmd.action((args, options, logger) => {
            const command = new InstallCommand({
                logger: logger
            });

            args.options = options;

            command.ready()
                .execute(args)
                .then((context) => {
                    logger.info('install command complete...');
                    process.exit(0);
                })
                .catch(logger.error);
        });
    }
}

InstallCommand.COMMAND_NAME = 'install';
InstallCommand.DESCRIPTION = 'Install all dependencies';



module.exports = InstallCommand;
