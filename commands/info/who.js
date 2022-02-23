const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const keys = require('../../credentials.json');
const functions = require('../../functions');
const infofunctions = require('../../informationalfunctions')

module.exports = class WhoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'who',
            aliases: ['wh', 'w'],
            group: 'info',
            memberName: 'whoteam',
            description: 'This command shows all possible members for a team',
            args: [
                {
                    key: 'team',
                    prompt: 'input the team you are looking for.',
                    type: 'string',
                }
            ],
        });
    }

    run(message, { team }) {
        if (message.guild === null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
        }
        if (team.indexOf(' ') < 0) {
            if (message.channel.id != keys.matchup_channel) {
                infofunctions.WhoTeam(team.toLowerCase()).then(data => {
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
                    if (data.teamimage) {
                        for (const teamimage of data.teamimage) {     
                            embed.setImage(teamimage.data);
                        }
                    }
                    if (data.warnote) {
                        for (const warnote of data.warnote) {     
                            embed.addField(warnote.name, warnote.data, false);
                        }
                    }
						return message.embed(embed);
                }).catch(e => {
                    return console.error('Error: ' + e);
                });
            } else {
                return message.say(`Wrong channel. Please use <#${keys.spam_channel}>.`);
            }
        } else {
            return message.say(`Too many arguments given for this command`);
        }
    }
};