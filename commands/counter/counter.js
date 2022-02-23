const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const keys = require('../../credentials.json');
const functions = require('../../functions')

module.exports = class CounterCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'counter',
            aliases: ['c', 'cp', 'c%'],
            group: 'counter',
            memberName: 'counter',
            description: 'This command shows 7 counters of a specific team',
            args: [
                {
                    key: 'team',
                    prompt: 'input the team for which I can find you a counterlist.',
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
                    default: 'false'
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
                functions.TopCounter(team.toLowerCase(), 10, power, sort).then(data => {
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