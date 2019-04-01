'use strict';

const fsu = require('base-cli-commands').FsUtils;
const TemplateRenderer = require('base-cli-commands').TemplateRenderer;

const defaults = {
    templateFile: 'Caddyfile'
};

class HostFile {

    constructor(options) {
        this.logger = options.logger;
        this.paths = options.paths;
        this.template = new TemplateRenderer(options);
    }

    fromArgs(args) {
        //TODO: proxy should NOT have http://
        this.proxy = args.proxy && args.proxy.replace(/https?:\/\//, '');
        this.domain = args.domain && args.domain.replace(/https?:\/\//, '');

        const options = args.options || {};
        this.name = options.name || this.domain;
        this.doSave = options.save;

        return this;
    }

    create() {
        return this.render().then(content => {
            return this.save(content);
        });
    }

    toJSON() {
        return {
            proxy: this.proxy,
            domain: this.domain,
            name: this.name
        };
    }

    render(template = defaults.templateFile) {
        return this.template.render(template, this.toJSON()).then(content => {
            this.content = content;
            return content;
        });
    }

    save(content = this.content) {
        if (!this.doSave) return Promise.resolve();
        return fsu.writeFile(this.filepath, this.content);
    }

    unlink() {
        if (fsu.existsSync(this.filepath)) {
            return fsu.unlink(this.filepath);
        }
        return Promise.resolve(false);
    }

    get filepath() {
        return this.paths.hosts(`${this.name}.conf`);
    }
}


module.exports = HostFile;