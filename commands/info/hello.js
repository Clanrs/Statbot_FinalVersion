const { Command } = require('discord.js-commando');
const functions = require('../../functions')

module.exports = class HelloCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hello',
			aliases: ['hi', 'sup', 'sup?', 'morning', "👋"],
            group: 'info',
            memberName: 'hello',
            description: 'Say hi',
        });
    }

    run(message) {
        if (message.guild === null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
        }
		return message.reply('hi! How can I help you?\n Use !statbot for a list of my possibilities.').then(message.react("👋"));
    }
};