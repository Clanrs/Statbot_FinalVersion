const { Command } = require('discord.js-commando');
const functions = require('../../functions')

module.exports = class ThankCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'thanks',
			aliases: ['thank you', 'ty', 'bless you', 'thx'],
            group: 'info',
            memberName: 'thanks',
            description: 'Accept thanks',
        });
    }

    run(message) {
        if (message.guild === null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
        }
		return message.reply("you're welcome!");
    }
};