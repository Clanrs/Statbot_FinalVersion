const { Command } = require('discord.js-commando');
const functions = require('../../functions')

module.exports = class InfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'info',
            group: 'info',
			aliases: ['start'],
            memberName: 'info',
            description: 'InfoGraph',
        });
    }

    run(message) {
        if (message.guild === null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
        }
		return message.say("https://i.imgur.com/acJeaFs.png");
    }
};