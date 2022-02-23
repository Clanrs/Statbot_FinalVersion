const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const keys = require('../../credentials.json');
const functions = require('../../functions');
const infofunctions = require('../../informationalfunctions')

module.exports = class NotesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'notes',
            aliases: ['note'],
            group: 'counter',
            memberName: 'note',
            description: 'This command displays notes for a specific match-up',
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
                }
            ],
        });
    }

    run(message, { team, team2}) {
        if (message.guild === null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
        }
        if (team2.indexOf(' ') < 0) {
            if (message.channel.id != keys.matchup_channel) {
                infofunctions.notes(team.toLowerCase(), team2.toLowerCase()).then(data => {
                    if (data.type == 'true') {
                        const embed = new MessageEmbed()
                            .setColor(data.color)
                            .setTitle(data.title)
                            .setFooter('Gathered by Statbot', 'https://i.imgur.com/fkyfEeA.png')
                            .setTimestamp();
                        if (data.fields) {
                            for (const field of data.fields) {
                                embed.addField(field.name, field.data);
                            }
                        }
                        if (data.fields2) {
                            for (const field2 of data.fields2) {
                                embed.addField(field2.name, field2.data, true);
                            }
                        }
                        return message.embed(embed);
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