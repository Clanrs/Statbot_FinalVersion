const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const keys = require('../../credentials.json');
const functions = require('../../functions')


module.exports = class TargetIntervalCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'counterinterval',
            aliases: ['ci'],
            group: 'admin',
			ownerOnly: true,
            memberName: 'counter intervals',
            description: 'This command starts the auto-messages',
			args: [
                {
                    key: 'team',
                    prompt: 'error when searching for specified team',
                    type: 'string',
                },
                {
                    key: 'hours',
                    prompt: 'cant use these hours',
                    type: 'integer',
                },
            ],
        });
    }

    run(message, { team, hours }) {
        if (message.member.roles.has(keys.admin_role) && message.guild.id == keys.master_server) {
			if (message.channel.id != keys.spam_channel && message.channel.id != keys.test_channel) {
				message.say('Counterinterval for **' + team + '** started for every **' + hours + '**h.');
				functions.TopCounter(team.toLowerCase(), 20).then(data => {
					const embed = new MessageEmbed()
						.setColor(data.color)
						.setTitle(data.title)
                        .setFooter('Always available from Statbot', 'https://i.imgur.com/fkyfEeA.png')
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
				setInterval(function (){
					functions.TopCounter(team.toLowerCase(), 20).then(data => {
						const embed = new MessageEmbed()
							.setColor(data.color)
							.setTitle(data.title)
							.setFooter('Always available from Statbot', 'https://i.imgur.com/fkyfEeA.png')
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
				}, 3600000 * hours);
			} else {
				return message.reply("wrong channel.")
			}
        } else {
            return message.reply("sorry! Not for you.")
        }
    }
};