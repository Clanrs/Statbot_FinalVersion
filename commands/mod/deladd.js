const { Command } = require('discord.js-commando');
const keys = require('../../credentials.json');
const functions = require('../../functions')

module.exports = class DeleteAddCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'deladd',
            group: 'mod',
            aliases: ['da'],
            memberName: 'deladd',
            description: 'This command lets you delete a single add',
            args: [
                {
                    key: 'attacker',
                    prompt: 'please give me an attacker abbreviation',
                    type: 'string',
                },
                {
                    key: 'defender',
                    prompt: 'please give me an defender abbreviation',
                    type: 'string',
                },
                {
                    key: 'attackervalue',
                    prompt: 'please give me an attacker value',
                    type: 'string',
                },
                {
                    key: 'defendervalue',
                    prompt: 'please give me an defender value',
                    type: 'string',
                }
            ],
        });
    }

    async run(message, { attacker, defender, attackervalue, defendervalue }) {
        if (message.guild === null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
            return message.reply("Please use a Statbot Discord channel for this command.")
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
            if (message.member.roles.cache.has(keys.admin_role) && message.channel.id == '712717158827819019') {
                functions.delAdd(attacker, defender, attackervalue, defendervalue).then(data => { 
                    return message.reply(data)
                }).catch(e => {
                    return console.error('ERROR: ' + e);
                });
            } else {
                return message.reply("sorry! You are not allowed to do this here.")
            }
        }
    }
};