const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const keys = require('../../credentials.json');
const functions = require('../../functions')

module.exports = class MSFGGCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'partner',
            group: 'info',
            memberName: 'partner',
            description: 'Invite link for our partners',
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
            .setFooter('Statbot integrated', 'https://i.imgur.com/fkyfEeA.png')
			.setThumbnail('https://i.imgur.com/UXy8ajQ.png')
			.addField("Invite links", "Check out our partners:\n\n**__MSF.gg__**\nUse this full package bot for roster, raid, war and alliance management (war data by WarStat) - https://discord.gg/u9pYqpJ\n\n**__MANTIS__**\nIf you play on PC or MacOS, this software provides additional interfaces and scans your roster for use in msf.gg - https://discord.gg/MkgdTTswqd\n\n**__StatsClub__**\nIf you record your war attacks in MANTIS, you can convert it to a WarStat ready command using this usefull website - https://discord.gg/8gAdsSNH9C")
            .setTimestamp();
			return message.embed(embed);
    }
};