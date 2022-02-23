const { Command } = require('discord.js-commando');
const { CommandoClient } = require('discord.js-commando');
const functions = require('../../functions')
const client = new CommandoClient();

module.exports = class Subscribe extends Command {
    constructor(client) {
        super(client, {
            name: 'subscribe',
            aliases: ['warzone', 'sub'],
            group: 'info',
            memberName: 'warzone',
            description: 'Warzone subscription',
            args: [
                {
                    key: 'zone',
                    prompt: 'Choose a warzone :1, 2, 3 or 4',
                    type: 'string',
                },
                {
                    key: 'tag',
                    prompt: 'Who do I need to tag?',
                    type: 'string',
                },
                {
                    key: 'offset',
                    prompt: 'How many minutes should I delay the announcement?',
                    type: 'string',
                    default: 0
                }]
        });
    }

    run(message, warzone) {
        functions.logUsage(message.author.tag, message.guild.name, message.content);
        if (message.member.hasPermission("ADMINISTRATOR")) {
            if ((warzone.tag.startsWith("<@&") && warzone.tag.endsWith(">")) || warzone.tag == '@everyone') {
                if (warzone.zone != '1' && warzone.zone != '2' && warzone.zone != '3' && warzone.zone != '4') {
                    console.log('Wrong warzone');
                    message.reply("please choose a correct warzone. 1 through 4.")
                } else {
                    //if (Number(warzone.offset) > 60 || Number(warzone.offset) < 1 || isNaN(warzone.offset)) {
                    //    console.log('Offset out of bounds');
                    //    message.reply("please choose an offset between 1-60 minutes")
                    //} else {
                        functions.subscribe(message.author.tag, message.channel.name, message.channel.id, warzone.tag, warzone.zone, message.guild.name, warzone.offset).then(data => {
                            return message.reply(data.msg);
                        }).catch(e => {
                            return console.error('Error: ' + e);
                        });
                    //}
                }
            } else {
                console.log('Not a role');
                message.reply("please tag a role as second argument.")
            }
        } else {
            console.log('Not an Admin');
            message.reply("please ask an Admin to subscribe for you.")
        }
    }
};