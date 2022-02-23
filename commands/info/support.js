const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const keys = require('../../credentials.json');
const functions = require('../../functions')

module.exports = class support extends Command {
    constructor(client) {
        super(client, {
            name: 'support',
            aliases: ['patron', 'patreon', 'donate'],
            group: 'info',
            memberName: 'support',
            description: 'Invite link donate money',
        });
    }

    run(message) {
        if (message.guild === null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
        }
        const embed = new MessageEmbed()
            .setColor()
            .setFooter('Humbly provided by Statbot', 'https://i.imgur.com/fkyfEeA.png')
			.setDescription('If you want to support us even more, you can make a donation here.\nEvery small amount goes a long way!')
			.setThumbnail('https://i.imgur.com/dFwJSZU.gif')
			.addField("Patreon pledge", "https://www.patreon.com/msfwarstat/")
			.addField("One-time donation", "https://paypal.me/msfstatbot")
            .setTimestamp();
			return message.embed(embed);
    }
};