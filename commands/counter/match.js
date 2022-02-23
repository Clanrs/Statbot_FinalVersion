const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const keys = require('../../credentials.json');
const functions = require('../../functions');
const infofunctions = require('../../informationalfunctions')

module.exports = class MatchCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'match',
            aliases: ['m'],
            group: 'counter',
            memberName: 'match',
            description: 'This command finds matches for 2 teams',
            args: [
                {
                    key: 'team',
                    prompt: 'input the first team (attacker)',
                    type: 'string',
                },
                {
                    key: 'team2',
                    prompt: 'input the second team (defender)',
                    type: 'string',
                },
                {
                    key: 'power',
                    prompt: 'third argument is an *optional* power number',
                    type: 'string',
                    default: 0
                }
            ],
        });
    }

    run(message, { team, team2, power }) {
        if (message.guild === null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
        }
        if (team2.indexOf(' ') < 0) {
            if (message.channel.id != keys.matchup_channel) {
                functions.search(team.toLowerCase(), team2.toLowerCase(), power).then(data => {
                    if (data.type == 'true') {
                        const embed = new MessageEmbed()
                            .setColor(data.color)
                            .setTitle(data.title)
                            .setFooter('Math done by Statbot', 'https://i.imgur.com/fkyfEeA.png')
                            .setTimestamp();
                        if (data.fields) {
                            for (const field of data.fields) {
                                embed.addField(field.name, field.data, true);
                            }
                        }
                        if (data.fields2) {
                            for (const field2 of data.fields2) {
                                embed.addField(field2.name, field2.data);
                            }
                        }
                        infofunctions.notes(team.toLowerCase(), team2.toLowerCase()).then(data => {
                            if (data.type == 'true') {
                                const Notesembed = new MessageEmbed()
                                    .setColor(data.color)
                                    .setTitle(data.title)
                                    .setFooter('Gathered by Statbot', 'https://i.imgur.com/fkyfEeA.png')
                                    .setTimestamp();
                                if (data.fields) {
                                    for (const field of data.fields) {
                                        Notesembed.addField(field.name, field.data);
                                    }
                                }
                                if (data.fields2) {
                                    for (const field2 of data.fields2) {
                                        Notesembed.addField(field2.name, field2.data, true);
                                    }
                                }
                                message.embed(embed);
                                return message.embed(Notesembed);
                            } else {
                                return message.embed(embed);
                            }
                        }).catch(e => {
                            console.error('Error: ' + e);
                        });
                    } else {
                        return message.say(data.msg);
                    }
                }).catch(e => {
                    console.error('Error: ' + e);
                });
            } else {
                return message.say(`Wrong channel. Please use <#${keys.spam_channel}>.`);
            }
        } else {
            return message.say(`Too many arguments given for this command`);
        }
    }
};