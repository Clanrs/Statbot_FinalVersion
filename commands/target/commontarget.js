const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const keys = require('../../credentials.json');
const functions = require('../../functions')

module.exports = class CommonTargetCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'commontarget',
            aliases: ['ct', 'ctp', 'ct%'],
            group: 'target',
            memberName: 'commontarget',
            description: 'This command shows 7 most common targets for a specific team',
            args: [
                {
                    key: 'team',
                    prompt: 'input the team for which I can find you a targetlist.',
                    type: 'string',
                },
                {
                    key: 'power',
                    prompt: 'I need an *optional* power value.',
                    type: 'string',
                    default: 0
                },
                {
                    key: 'sort',
                    prompt: 'Sort on #?',
                    type: 'string',
                    default: 'true'
                }
            ],
        });
    }

    run(message, { team, power, sort }) {
        if (message.guild === null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
        }
        if (team.indexOf(' ') < 0) {
            if (message.channel.id != keys.matchup_channel) {
//				if (team.toLowerCase() = 'hand') {
//					message.react(656195707618983976);
//				}				
                functions.TopTarget(team.toLowerCase(), 10, power, sort).then(data => {
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