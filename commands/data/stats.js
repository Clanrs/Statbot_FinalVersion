const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const keys = require('../../credentials.json');
const functions = require('../../functions');
const infofunctions = require('../../informationalfunctions')

module.exports = class StatsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stats',
            group: 'data',
            memberName: 'stats',
            description: 'This command shows some stats about the bot',
        });
    }

    run(message) {	
        if (message.guild === null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
        }
        if (message.channel.id != keys.matchup_channel) {
            infofunctions.getStats().then(data => {
                const embed = new MessageEmbed()
                    .setColor(data.color)
                    .setThumbnail(data.thumbnail)
                    .setTitle(data.title)
                    .setFooter('Statistics by Statbot', 'https://i.imgur.com/fkyfEeA.png')
                    .setTimestamp();
                if (data.fields) {
                    for (const field of data.fields) {
                        embed.addField(field.name, field.data, true);
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