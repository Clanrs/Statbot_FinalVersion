const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const keys = require('../../credentials.json');
const functions = require('../../functions');
const infofunctions = require('../../informationalfunctions')

module.exports = class CommandsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'statbot',
			aliases: ['commands', 'help'],
            group: 'info',
            memberName: 'statbot',
            description: 'This command shows all the commands available',
        });
    }

    run(message) {
        if (message.guild === null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
        }
        if (message.channel.id != keys.matchup_channel) {
            infofunctions.getCommands().then(data => {
                const embed = new MessageEmbed()
                    .setColor(data.color)
                    .setFooter('Provided by Statbot', 'https://i.imgur.com/fkyfEeA.png')
                    .setTimestamp();
                if (data.fields) {
                    for (const field of data.fields) {
                        embed.addField(field.name, field.data);
                    }
                }
                return message.embed(embed);
            }).catch(e => {
                return console.error('Error: ' + e);
            });
        } else {
            return message.say(`Wrong channel. Please use <#${keys.spam_channel}>.`);
        }
    }
};