const { Command, CommandoClient } = require('discord.js-commando');
const keys = require('../../credentials.json');
const functions = require('../../functions')
const tools = require('../../tools');

module.exports = class AddCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'add',
            aliases: ['a'],
            group: 'data',
            memberName: 'add',
            description: 'This command lets you add matchups',
            args: [
                {
                    key: 'team',
                    prompt: 'input the first team (attacker).',
                    type: 'string',
                },
                {
                    key: 'team2',
                    prompt: 'input the second team (defender).',
                    type: 'string',
                },
                {
                    key: 'value',
                    prompt: 'input the attacker power.',
                    type: 'integer',
                },
                {
                    key: 'value2',
                    prompt: 'input the defender power.',
                    type: 'integer',
                },
            ],
        });
    }

    async run(message, { team, team2, value, value2 }) {
        if (message.guild == null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
            functions.updateStore(team.toLowerCase(), team2.toLowerCase(), value, value2, '0', message.author.tag, message.createdTimestamp).then(res => {
                if (res.type == 'error') {
                    return message.reply(res.msg);
                }
                return message.say(res.msg);
            }).catch(e => {
                return console.error('Error: ' + e);
            });
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
            if ((message.guild.id === keys.master_server && message.channel.id === keys.matchup_channel) || message.channel.id === keys.test_add_channel || message.channel.id === keys.beta_channel) {
                const splittedMsg = message.content.split('\n');
                if (splittedMsg.length > 1) {
                    message.reply("thanks! Going through these right now!");
                    let multiAddFeedback = '';
                    const adds = [];
                    const fails = [];
                    const promises = [];
                    for (const row of splittedMsg) {
                        const values = row.split(' ');
                        const index = values.indexOf('!a');
                        const index2 = values.indexOf('?a');
                        if (index > -1) {
                            values.splice(index, 1);
                        }
                        if (index2 > -1) {
                            values.splice(index2, 1);
                        }
                        await this.sleep(2000);
                        if (values[0] && values[1] && values[2] && values[3]) {
                            promises.push(new Promise(resolve => {
                                functions.updateStore(values[0].toLowerCase(), values[1].toLowerCase(), values[2], values[3], message.guild.id, message.author.tag, message.createdTimestamp).then(res => {
                                    if (res.type == 'error') {
                                        fails.push(values);
                                        resolve();
                                        return;
                                    }
                                    adds.push(values);
                                    resolve();
                                }).catch(e => {
                                    console.error('Error: ' + e);
                                    fails.push(values);
                                    resolve();
                                });
                            }));
                        }
                    }
                    Promise.all(promises).then(() => {
                        if (adds.length > 0 && adds.length < 31) {
                            let i = 0;
                            multiAddFeedback += "<@" + message.author.id + ">, the following matchups have been added.\n" + "\`\`\`glsl\n" + `Succes:\n`;
                            for (const add of adds) {
                                multiAddFeedback += `- ${tools.getFullKeyName(add[0].toLowerCase(), team_keys)} ~ ${add[2]} versus ${tools.getFullKeyName(add[1].toLowerCase(), team_keys)} ~ ${add[3]}\n`;
                                i++;
                            }
                            if (fails.length > 0 && adds.length + fails.length < 31) {
                                multiAddFeedback += "\nFailed:\nTry these as single line adds for feedback on the fault(s)\n";
                                for (const fail of fails) {
                                    multiAddFeedback += `- ${fail[0].toLowerCase()} ${fail[1].toLowerCase()} ${fail[2]} ${fail[3]}\n`;
                                }
                            } else if (fails.length > 0 && adds.length + fails.length > 30) {
                                multiAddFeedback += "\nFailed:\nTry these as single line adds for feedback on the fault(s)\n";
                                for (const fail of fails) {
                                    i++;
                                    if (i < 30) {
                                        multiAddFeedback += `- ${fail[0].toLowerCase()} ${fail[1].toLowerCase()} ${fail[2]} ${fail[3]}\n`;
                                    } else {
                                        multiAddFeedback += `- ${fail[0].toLowerCase()} ${fail[1].toLowerCase()} ${fail[2]} ${fail[3]}\`\`\``;
                                        message.say(multiAddFeedback);
                                        multiAddFeedback = "\`\`\`glsl\n";
                                        i = 0;
                                    }
                                }
                            }
                            if (multiAddFeedback !== "\`\`\`glsl\n") {
                                multiAddFeedback += "\`\`\`";
                                message.say(multiAddFeedback);
                            }
                        } else if (adds.length > 0 && adds.length > 30) {
                            let i = 0;
                            multiAddFeedback += "<@" + message.author.id + ">, the following matchups have been added.\n" + "\`\`\`glsl\n" + `Succes:\n`;
                            for (const add of adds) {
                                i++;
                                if (i < 30) {
                                    multiAddFeedback += `- ${tools.getFullKeyName(add[0].toLowerCase(), team_keys)} ~ ${add[2]} versus ${tools.getFullKeyName(add[1].toLowerCase(), team_keys)} ~ ${add[3]}\n`;
                                } else {
                                    multiAddFeedback += `- ${tools.getFullKeyName(add[0].toLowerCase(), team_keys)} ~ ${add[2]} versus ${tools.getFullKeyName(add[1].toLowerCase(), team_keys)} ~ ${add[3]}\`\`\``;
                                    message.say(multiAddFeedback);
                                    multiAddFeedback = "\`\`\`glsl\n";
                                    i = 0;
                                }
                            }
                            if (fails.length > 0 && i + fails.length < 31) {
                                multiAddFeedback += "\nFailed:\nTry these as single line adds for feedback on the fault(s)\n";
                                for (const fail of fails) {
                                    multiAddFeedback += `- ${fail[0].toLowerCase()} ${fail[1].toLowerCase()} ${fail[2]} ${fail[3]}\n`;
                                }
                            } else if (fails.length > 0 && i + fails.length > 30) {
                                multiAddFeedback += "\nFailed:\nTry these as single line adds for feedback on the fault(s)\n";
                                for (const fail of fails) {
                                    i++;
                                    if (i < 30) {
                                        multiAddFeedback += `- ${fail[0].toLowerCase()} ${fail[1].toLowerCase()} ${fail[2]} ${fail[3]}\n`;
                                    } else {
                                        multiAddFeedback += `- ${fail[0].toLowerCase()} ${fail[1].toLowerCase()} ${fail[2]} ${fail[3]}\`\`\``;
                                        message.say(multiAddFeedback);
                                        multiAddFeedback = "\`\`\`glsl\n";
                                        i = 0;
                                    }
                                }
                            }
                            if (multiAddFeedback !== "\`\`\`glsl\n") {
                                multiAddFeedback += "\`\`\`";
                                message.say(multiAddFeedback);
                            }
                        } else {
                            multiAddFeedback += "<@" + message.author.id + "> The following matchups have been added\n" + "\`\`\`glsl\n" + `Failed:\nTry these as single line adds for feedback on the fault(s)\n`;
                            if (fails.length > 0 && fails.length < 31) {
                                for (const fail of fails) {
                                    multiAddFeedback += `- ${fail[0].toLowerCase()} ${fail[1].toLowerCase()} ${fail[2]} ${fail[3]}\n`;
                                }
                                multiAddFeedback += "\`\`\`";
                                message.say(multiAddFeedback);
                            } else {
                                let i = 0;
                                for (const fail of fails) {
                                    i++;
                                    if (i < 30) {
                                        multiAddFeedback += `- ${fail[0].toLowerCase()} ${fail[1].toLowerCase()} ${fail[2]} ${fail[3]}\n`;
                                    } else {
                                        multiAddFeedback += `- ${fail[0].toLowerCase()} ${fail[1].toLowerCase()} ${fail[2]} ${fail[3]}\`\`\``;
                                        message.say(multiAddFeedback);
                                        multiAddFeedback = "\`\`\`glsl\n";
                                        i = 0;
                                    }
                                }
                                if (multiAddFeedback !== "\`\`\`glsl\n") {
                                    multiAddFeedback += "\`\`\`";
                                    message.say(multiAddFeedback);
                                }
                            }
                        }
                    });
                } else {
                    console.log('before updateStore')
                    functions.updateStore(team.toLowerCase(), team2.toLowerCase(), value, value2, message.guild.id, message.author.tag, message.createdTimestamp).then(res => {
                        console.log(res)
                        if (res.type == 'error') {
                            return message.reply(res.msg);
                        }
                        return message.say(res.msg);
                    }).catch(e => {
                        return console.error('Error: ' + e);
                    });
                }
            } else if (message.guild.id != keys.master_server) {
                functions.updateStore(team.toLowerCase(), team2.toLowerCase(), value, value2, message.guild.id, message.author.tag, message.createdTimestamp).then(res => {
                    if (res.type == 'error') {
                        return message.reply(res.msg);
                    }
                    return message.say(res.msg);
                }).catch(e => {
                    return console.error('Error: ' + e);
                });
            } else {
                return message.say(`Wrong channel. Please use <#${keys.matchup_channel}>.`);
            }
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};