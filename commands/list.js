'use strict';

const BaseCommand = require('./base');

class ListCommand extends BaseCommand {

}

ListCommand.COMMAND_NAME = 'list';
ListCommand.DESCRIPTION = 'List all local domains';

module.exports = ListCommand;
