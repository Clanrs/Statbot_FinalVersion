const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const keys = require('../../credentials.json');
const functions = require('../../functions');
const infofunctions = require('../../informationalfunctions')

module.exports = class TeamsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'teams',
            aliases: ['listkey'],
            group: 'info',
            memberName: 'teams',
            description: 'This command shows all the teams available',
        });
    }

    run(message) {
        if (message.guild === null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
        }
        if (message.channel.id != keys.matchup_channel) {
            infofunctions.getKeys().then(data => {
                if (data.chunks && data.chunks.length > 0) {
                    let i = 0;
                    for (const chunk of data.chunks) {
                        i++;
                        const embed = new MessageEmbed()
                        .setColor(data.color)
                        .setDescription('Use !who "team" to see who is part of it.')
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
                    .setDescription('Use !who "team" to see who is part of it.')
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