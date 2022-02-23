const { Command } = require('discord.js-commando');
const keys = require('../../credentials.json');
const functions = require('../../functions')

module.exports = class KeyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'delkey',
            group: 'admin',
			ownerOnly: true,
            memberName: 'delkey',
            description: 'This command lets you delete keys',
            args: [
                {
                    key: 'key',
                    prompt: 'error deleting the key',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { key }) {
//		functions.logUsage(message.member.user.tag, message.guild.name, message.content);
//        if (key.indexOf(' ') < 0) {
//            if (message.member.roles.has(keys.admin_role) && message.guild.id == keys.master_server) {
//                functions.getDel(key.toLowerCase()).then(msg => {
//                    return message.say(msg);
//                }).catch(e => {
//                    return console.error('Error: ' + e);
//                });
//            } else {
                return message.reply("sorry! You are not allowed to do this.")
//            }
//        } else {
//            return message.say(`Too many arguments given for this command`);
//        }
    }
};