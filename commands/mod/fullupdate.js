const { Command } = require('discord.js-commando');
const keys = require('../../credentials.json');
const functions = require('../../functions');

module.exports = class UpdateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'fullupdate',
            group: 'mod',
            alias: ['fu'],
            memberName: 'fullupdate',
            description: 'This command updates all data',
        });
    }

    run(message) {
        let logText = 'Manual update';
        if (message.guild === null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
            if (message.author.id == '419784288834420757') {
                functions.reloadInfo(logText).then(() => {
                    functions.reloadResults(logText).then(() => {
                    message.reply("all done!");
                    })
                    return message.say("Info updated, results updating.");
                });
            }
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
            if (message.member.roles.cache.has(keys.admin_role) && message.guild.id == keys.master_server) {
                functions.reloadInfo(logText).then(() => {
                    functions.reloadResults(logText).then(() => {
                    message.reply("all done!");
                    })
                    return message.say("Info updated, results updating.");
                });
            } else {
                return message.reply("sorry! Not for you.")
            }
        }
        
    }
};