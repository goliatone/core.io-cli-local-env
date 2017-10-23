'use strict';
const fsu = require('../fs-utils');
const ChildProcess = require('child-process-promise');

class BaseInstaller {

    constructor(options){
        this.logger = options.logger || console;
        this.paths = options.paths;
    }

    isInstalled() {
		throw new Error('Subclasses must implement.');
	}

	install() {
		throw new Error('Subclasses must implement.');
	}

	uninstall() {
		throw new Error('Subclasses must implement.');
	}

    update(){
        return this.install();
    }

    isService(){
        return false;
    }

    isRunning(){
        throw new Error('Subclasses must implement.');
    }

    start(){
        throw new Error('Subclasses must implement.');
    }

    stop(){
        throw new Error('Subclasses must implement.');
    }

    restart(){
        if(!this.isService){
            return;
        }
        const isRunning = this.isRunning();

        let stop;
        if(isRunning){
            stop = this.stop();
        }

        return Promise.resolve(stop).then(()=>{
            return this.start();
        });
    }

    readFile(file){
        return fsu.readFile(file)
            .then((content)=>{
                return content.toString();
            });
    }

    writeFile(file, content){
        if(Array.isArray(content)){
            content = `${content.join('\n')}\n`;
        }
        return fsu.writeFile(file, content);
    }

    removeFile(file) {
        return fsu.unlink(file)
            .catch((err)=>{
                this.logger.error('Unable to remove file: %s', file);
                return err;
            });
    }

    fileExists(file){
        return fsu.exists(file);
    }

    fileExistsSync(file){
        return fsu.existsSync(file);
    }

    mkdirp(...args){
        return fsu.mkdirp(...args);
    }

    exec(command, options){
        if(this.isRootUser()) {
			return ChildProcess.exec(`sudo -u "${process.env.SUDO_USER}" ${command}`, options);
		}

		return ChildProcess.exec(command, options);
	}

	sudo(command, options) {
		if(this.isRootUser()) {
			return ChildProcess.exec(command, options);
		}

		return ChildProcess.exec(`sudo ${command}`, options);
	}

    isRootUser(){
        return process.env.USER === 'root';
    }
}

module.exports = BaseInstaller;
