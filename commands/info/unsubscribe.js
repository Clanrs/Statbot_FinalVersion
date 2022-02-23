const { Command } = require('discord.js-commando');
const { CommandoClient } = require('discord.js-commando');
const functions = require('../../functions')
const client = new CommandoClient();

module.exports = class Unsubscribe extends Command {
    constructor(client) {
        super(client, {
            name: 'unsubscribe',
            aliases: ['nowarzone', 'unsub'],
            group: 'info',
            memberName: 'unsubscribe',
            description: 'Unsubscribe for warzone announcements',
            args: [
                {
                    key: 'zone',
                    prompt: 'Choose a warzone to unsubscribe:1, 2, 3 or 4',
                    type: 'string',
                }],
        });
    }

    run(message, warzone) {
        functions.logUsage(message.author.tag, message.guild.name, message.content);
        if (message.member.hasPermission("ADMINISTRATOR")) {
            if (warzone.zone != '1' && warzone.zone != '2' && warzone.zone != '3' && warzone.zone != '4') {
                message.reply("please choose a correct warzone. 1 through 4.")
            } else {
                functions.getSubscriptionRow(message.channel.id, warzone.zone).then(data => {
                    return message.reply(data);
                }).catch(e => {
                    return console.error('Error: ' + e);
                });
            }
        } else {
            message.reply("please ask an Admin to unsubscribe for you.")
        }
    }
};