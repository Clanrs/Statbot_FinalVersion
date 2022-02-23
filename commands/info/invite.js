const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const keys = require('../../credentials.json');
const functions = require('../../functions')

module.exports = class InviteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            group: 'info',
            memberName: 'invite',
            description: 'Invite link',
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
			.setURL('https://discord.gg/C9badgt')
			.addField("Invite link", "Get your friends in on this!\nhttps://discord.gg/C9badgt")
			.setThumbnail('https://i.imgur.com/dFwJSZU.gif')
            .setTimestamp()
            .setFooter('Statbot welcomes you!', 'https://i.imgur.com/fkyfEeA.png');
			return message.embed(embed);
    }
};