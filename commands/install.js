'use strict';

const BaseCommand = require('./base');
const fsu = require('../lib/fs-utils');

class InstallCommand extends BaseCommand {

    execute(args) {

        //Ensure we have brew installed:
        //! this.commandExists('brew') -> error
        //This command tool will class with:
        //this.commandExists('valet') -> error
        //this.commandExists('marina') -> error

        const home = this.paths.home();
        const hosts = this.paths.hosts();

        // this.dryRun = true;

        const Caddyfile = {
			source: this.paths.config('Caddyfile'),
			destination: this.paths.home('Caddyfile')
		};

        return Promise.all([
			this.execAsUser(`mkdir -p "${home}" "${hosts}"`),
			this.execAsUser(`cp "${Caddyfile.source}" "${Caddyfile.destination}"`),
			// fsu.mkdirp('${home}/etc/sudoers.d')
			// this.exec(`mkdir -p "${home}/etc/sudoers.d"`),
			fsu.mkdirp(`mkdir -p "${home}/etc/sudoers.d"`)
		]).then(()=>{
            this.logger.info('done', Caddyfile);
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
