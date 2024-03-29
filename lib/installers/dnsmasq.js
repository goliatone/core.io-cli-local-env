'use strict';
const BaseBrewInstaller = require('./brewbase');
const path = require('path');

const RESOLVER_DIR = '/etc/resolver';
const CONFIG_PATH = '/usr/local/etc/dnsmasq.conf';
const EXAMPLE_CONFIG_PATH = '/usr/local/opt/dnsmasq/dnsmasq.conf.example';

class DnsmasqInstaller extends BaseBrewInstaller {
    constructor(options) {
        super(options);
        this._isBrewService = true;
        this._formula = 'dnsmasq';
    }

    isInstalled() {
        return super.isInstalled()
            .then(installed => {
                if (installed) return true;

                if (!this.configExists()) {
                    return false;
                }

                if (!this.localConfigExists()) {
                    return false;
                }
                const configPath = CONFIG_PATH;
                return this.readFile(configPath)
                    .then(config => {
                        return config.indexOf(this.localConfigPath) >= 0;
                    });
            }).catch(err => {
                console.error('Is installed error ', err);
                return err;
            });
    }

    install() {
        return super.install().then(async _ => {
            let configCopy, localConfig;
            if (!this.configExists()) {
                configCopy = this.exec(`cp "${EXAMPLE_CONFIG_PATH}" "${CONFIG_PATH}"`);
            }

            if (!this.localConfigExists()) {
                const cfpath = this.localConfigPath;
                const domain = this.domain;
                localConfig = this.exec(`bash -c "echo 'address=/${domain}/127.0.0.1' > '${cfpath}'"`);
            }


            try {
                await configCopy;
                await localConfig;
                let config = await this.readFile(CONFIG_PATH);

                if (config.indexOf(this.localConfigPath) < 0) {
                    config += `\nconf-file="${this.localConfigPath}"`;
                    await this.writeFile(CONFIG_PATH, [config]);
                }
                //BUG: This fails?
                await this.mkdirsp(RESOLVER_DIR);
                //BUG: This fails, possibly due to no dir.
                return this.writeFile(this.resolverPath, ['nameserver 127.0.0.1']);

            } catch (error) {
                return Promise.reject(error);
            }
        });
    }

    configExists() {
        const configPath = CONFIG_PATH;
        return this.fileExistsSync(configPath);
    }

    localConfigExists() {
        return this.fileExistsSync(this.localConfigPath);
    }

    get resolverPath() {
        //TODO: we should support multiple domains
        return path.join(RESOLVER_DIR, 'test');
    }

    get localConfigPath() {
        return this.paths.home('dnsmasq.conf');
    }

    get domain() {
        //TODO: we should support multiple domains
        return '.test';
    }
}

module.exports = DnsmasqInstaller;
