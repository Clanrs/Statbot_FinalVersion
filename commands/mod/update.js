const { Command } = require('discord.js-commando');
const keys = require('../../credentials.json');
const functions = require('../../functions');
const { reloadInfo } = require('../../functions');

module.exports = class UpdateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'update',
            group: 'mod',
            memberName: 'update',
            description: 'This command updates the sheet data and reloads the keys and aliases',
            args: [
                {
                    key: 'db',
                    prompt: 'please choose from "keys", "stats", "notes", "commands", "store", "results".',
                    type: 'string',
                }
            ],
        });
    }

    run(message, data) {
        const db = data.db;
        let logText = 'Single DB update';
        if (message.guild === null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
            if (message.author.id == '419784288834420757') {
                functions.reloadDB(db, logText).then(() => {
                    message.reply(`${db} reloaded.`);
                }).catch(err => console.error(err));
            }
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
            if (message.member.roles.cache.has(keys.admin_role) && message.guild.id == keys.master_server) {
                functions.reloadDB(db, logText).then(() => {
                    message.reply(`${db} reloaded.`);
                }).catch(err => console.error(err));
            } else {
                return message.reply("sorry! Not for you.")
            }
        }
    }
};