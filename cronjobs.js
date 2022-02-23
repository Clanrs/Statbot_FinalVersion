const cron = require('cron');
const { MessageEmbed } = require('discord.js');

    //Cron jobs for war announcements
    function warzones(client){
        console.log('Cronjobs loaded');

        // Messages
        let startmsg = ' war started!';
        let firstmsg = ' 1st energy refresh @ 1h45 mark!';
        let secondmsg = ' 2nd energy refresh @ 5h30 mark!';
        let thirdmsg = ' 3rd energy refresh @ 9h15 mark!';
        let fourthmsg = ' 4th energy refresh @ 13h mark!';
        let fifthmsg = ' 5th energy refresh @ 16h45 mark!';
        let sixthmsg = ' final energy refresh @ 20h30 mark!';
        // Configuring cronjobs
        let z1start = new cron.CronJob('00 01 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '1') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + startmsg);
                    }    
                } catch (err) {
                    console.error('War announcement error: ' + err);
                }
            }
        });
        let z1_1st = new cron.CronJob('45 02 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '1') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        if (channel == '721797205131788308') {
                            const embed = new MessageEmbed()
                            .setImage('https://i.imgur.com/BGkXAJM.png')
                            .setColor('#8E59AB')
                            .setFooter('Courtesy of EXfieldy#8545')
                            .setTimestamp();
                            channel.send(res_data[row][3]);
                            channel.send(embed);
                        } else {
                            channel.send(res_data[row][3] + firstmsg);
                        }
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z1_2nd = new cron.CronJob('30 06 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '1') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        if (channel == '721797205131788308') {
                            const embed = new MessageEmbed()
                            .setImage('https://i.imgur.com/BGkXAJM.png')
                            .setColor('#8E59AB')
                            .setFooter('Courtesy of EXfieldy#8545')
                            .setTimestamp();
                            channel.send(res_data[row][3]);
                            channel.send(embed);
                        } else {
                            channel.send(res_data[row][3] + secondmsg);
                        }
                    }  
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z2start = new cron.CronJob('00 07 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '2') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + startmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z2_1st = new cron.CronJob('45 08 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '2') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + firstmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z1_3rd = new cron.CronJob('15 10 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '1') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        if (channel == '721797205131788308') {
                            const embed = new MessageEmbed()
                            .setImage('https://i.imgur.com/BGkXAJM.png')
                            .setColor('#8E59AB')
                            .setFooter('Courtesy of EXfieldy#8545')
                            .setTimestamp();
                            channel.send(res_data[row][3]);
                            channel.send(embed);
                        } else {
                            channel.send(res_data[row][3] + thirdmsg);
                        }
                    }  
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z2_2nd = new cron.CronJob('30 12 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '2') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + secondmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z3start = new cron.CronJob('00 13 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '3') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + startmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z1_4th = new cron.CronJob('00 14 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '1') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        if (channel == '721797205131788308') {
                            const embed = new MessageEmbed()
                            .setImage('https://i.imgur.com/BGkXAJM.png')
                            .setColor('#8E59AB')
                            .setFooter('Courtesy of EXfieldy#8545')
                            .setTimestamp();
                            channel.send(res_data[row][3]);
                            channel.send(embed);
                        } else {
                            channel.send(res_data[row][3] + fourthmsg);
                        }
                    }  
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z3_1st = new cron.CronJob('45 14 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '3') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + firstmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z2_3rd = new cron.CronJob('15 16 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '2') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + thirdmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z1_5th = new cron.CronJob('45 17 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '1') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        if (channel == '721797205131788308') {
                            const embed = new MessageEmbed()
                            .setImage('https://i.imgur.com/BGkXAJM.png')
                            .setColor('#8E59AB')
                            .setFooter('Courtesy of EXfieldy#8545')
                            .setTimestamp();
                            channel.send(res_data[row][3]);
                            channel.send(embed);
                        } else {
                            channel.send(res_data[row][3] + fifthmsg);
                        }
                    }   
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z3_2nd = new cron.CronJob('30 18 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '3') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + secondmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z4start = new cron.CronJob('00 19 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '4') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + startmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }        });
        let z2_4th = new cron.CronJob('00 20 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '2') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + fourthmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z4_1st = new cron.CronJob('45 20 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '4') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + firstmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z1_6th = new cron.CronJob('30 21 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '1') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        if (channel == '721797205131788308') {
                            const embed = new MessageEmbed()
                            .setImage('https://i.imgur.com/BGkXAJM.png')
                            .setColor('#8E59AB')
                            .setFooter('Courtesy of EXfieldy#8545')
                            .setTimestamp();
                            channel.send(res_data[row][3]);
                            channel.send(embed);
                        } else {
                            channel.send(res_data[row][3] + sixthmsg);
                        }
                    }  
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z3_3rd = new cron.CronJob('15 22 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '3') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + thirdmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z2_5th = new cron.CronJob('45 23 * * 2,4,6', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '2') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + fifthmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z4_2nd = new cron.CronJob('30 00 * * 3,5,0', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '4') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + secondmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z3_4th = new cron.CronJob('00 02 * * 3,5,0', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '3') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + fourthmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z2_6th = new cron.CronJob('30 03 * * 3,5,0', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '2') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + sixthmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z4_3rd = new cron.CronJob('15 04 * * 3,5,0', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '4') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + thirdmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z3_5th = new cron.CronJob('45 05 * * 3,5,0', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '3') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + fifthmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z4_4th = new cron.CronJob('00 08 * * 3,5,0', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '4') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + fourthmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z3_6th = new cron.CronJob('30 09 * * 3,5,0', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '3') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + sixthmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z4_5th = new cron.CronJob('45 11 * * 3,5,0', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '4') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + fifthmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });
        let z4_6th = new cron.CronJob('30 15 * * 3,5,0', () => {
            let res_data = sheet_warzone;
            let arr = [];
            for (row in res_data) {
                arr.push([res_data[row][2], res_data[row][3], res_data[row][4]]);
                //         Channel ID        Tag ID            Zone
            }
            for (row in arr) {
                try {
                    if (res_data[row][4] == '4') {
                        let channel = client.channels.cache.get(res_data[row][2]);
                        channel.send(res_data[row][3] + sixthmsg);
                    }    
                } catch (err) {
                    console.error(`War announcement error in ${res_data[row][2]}: ` + err);
                }
            }
        });

        z1start.start();
        z2start.start();
        z3start.start();
        z4start.start();
        z1_1st.start();
        z2_1st.start();
        z3_1st.start();
        z4_1st.start();
        z1_2nd.start();
        z2_2nd.start();
        z3_2nd.start();
        z4_2nd.start();
        z1_3rd.start();
        z2_3rd.start();
        z3_3rd.start();
        z4_3rd.start();
        z1_4th.start();
        z2_4th.start();
        z3_4th.start();
        z4_4th.start();
        z1_5th.start();
        z2_5th.start();
        z3_5th.start();
        z4_5th.start();
        z1_6th.start();
        z2_6th.start();
        z3_6th.start();
        z4_6th.start();
    }

module.exports = {
    warzones
};