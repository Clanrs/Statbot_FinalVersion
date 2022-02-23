const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const keys = require('../../credentials.json');
const functions = require('../../functions');
const infofunctions = require('../../informationalfunctions')

module.exports = class AliasCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'alias',
            group: 'info',
            memberName: 'alias',
            description: 'This command shows all the aliases available',
        });
    }

    run(message) {
        if (message.guild === null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
        }
        if (message.channel.id != keys.matchup_channel) {
            infofunctions.getAlias().then(data => {
                if (data.chunks && data.chunks.length > 0) {
                    let i = 0;
                    for (const chunk of data.chunks) {
                        i++;
                        const embed = new MessageEmbed()
                        .setColor(data.color)
                        .setTitle(data.title + ' ' + i + '/' + data.chunks.length )
                        .setFooter('Provided by Statbot', 'https://i.imgur.com/fkyfEeA.png')
                        .setTimestamp();
                        if (chunk && chunk.length > 0) {
                            for (const field of chunk) {
                                embed.addField(field.name, field.data, true);
                            }
                        }
                        if (i < data.chunks.length) {
                            message.embed(embed);
                        } else {
                            return message.embed(embed);
                        }
                    }
                } else {
                    const embed = new MessageEmbed()
                    .setColor(data.color)
                    .setTitle(data.title)
                    .setFooter('Provided by Statbot', 'https://i.imgur.com/fkyfEeA.png')
                    .setTimestamp();
                    if (data.fields) {
                        for (const field of data.fields) {
                            embed.addField(field.name, field.data, true);
                        }
                    }
                    return message.embed(embed);
                }
            }).catch(e => {
                return console.error('Error: ' + e);
            });
        } else {
            return message.say(`Wrong channel. Please use <#${keys.spam_channel}>.`);
        }
    }
};