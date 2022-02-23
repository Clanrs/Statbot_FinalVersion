const tools = require('./tools');
const functions = require('./functions');

// #############
// ### Notes ###
// #############

// Notes for 2 given teams A vs B
async function notes(team, team2) {
    // Check if input teams are known including their alias
    const no_match = [];
    const res = functions.checkKey(team);
    const res2 = functions.checkKey(team2);

    if (res.found === false) {
        no_match.push(res.key);
    }
    if (res2.found === false) {
        no_match.push(res2.key);
    }

    // If teams are unknown, return message
    if (no_match.length) {
        let prefix = `**${no_match[0]}** is not an `;
        if (no_match.length == 2) {
            prefix = `**${no_match[0]}** and **${no_match[1]}** are not `;
        }
        const suffix = (no_match.length == 2) ? `s.` : `.`;
        return { type: 'error', msg: prefix + `known team` + suffix };
    }

    // If teams are known return embed fields
    try {
        const dataArr = global.sheet_notes;
        for (i in dataArr) {
            if (dataArr[i][0] == res.key && dataArr[i][1] == res2.key) {
                const res_arr = dataArr[i];

                const fields = [];
                if (res_arr[2] != null && res_arr[2] !== '' && res_arr[2] !== 'undefined') {
                    fields.push(
                        {
                            name: '☠️ Suggested kill order',
                            data: `${res_arr[2]}`
                        }
                    )
                }
                if (res_arr[3] != null && res_arr[3] !== '' && res_arr[3] !== 'undefined') {
                    fields.push(
                        {
                            name: '™️ Strategy',
                            data: `${res_arr[3]}`
                        }
                    )
                }
                const fields2 = [];
                if (res_arr[4] != null && res_arr[4] !== '' && res_arr[4] !== 'undefined') {
                    fields2.push(
                        {
                            name: '❗ Caution and advice ❗',
                            data: `${res_arr[4]}`
                        }
                    )
                }
                if (res_arr[5] != null && res_arr[5] !== '' && res_arr[5] !== 'undefined') {
                    fields2.push(
                        {
                            name: '❗ Follow up ❗',
                            data: `${res_arr[5]}`
                        }
                    )
                }
                if (res_arr[6] != null && res_arr[6] !== '' && res_arr[6] !== 'undefined') {
                    fields2.push(
                        {
                            name: '❗ Follow up ❗',
                            data: `${res_arr[6]}`
                        }
                    )
                }
                return { type: 'true', color: '#8E59AB', title: `<:note:710959068428238951> ${tools.getFullKeyName(res_arr[0], team_keys)} versus ${tools.getFullKeyName(res_arr[1], team_keys)}`, fields: fields, fields2: fields2 };
            }
        }
        // Return message if no notes are found
        return { type: 'error', msg: `Nothing note-worthy about **${tools.getFullKeyName(team, team_keys)}** versus **${tools.getFullKeyName(team2, team_keys)}**.\nLet us know what you would like to see added here.` };
    } catch (err) {
        console.error(err);
        return { type: 'error', msg: err };
    }

}

// ######################
// ### Team functions ###
// ######################

// List teams, separate Gsheet
async function getKeys() {
    try {
        const res_data = team_keys;
        const arr = {};

        if (res_data.length > 15) {
            let i = 0; // amount of teams you have looped through
            let j = 0; // amount of messages
            arr[j] = [];

            for (row in res_data) {
                i++;
                if (i / 15 > 1) { // reset amount of teams looped and add 1 to the amount of messages
                    j++;
                    arr[j] = [];
                    i = 0;
                }
                //			abbreviation,  explanation
                arr[j].push([res_data[row][0], res_data[row][1]]);
            }

            let res_str = [];

            const arrKeys = Object.keys(arr);

            for (let x = 0; x < arrKeys.length; x++) {
                for (row in arr[arrKeys[x]]) {
                    // build list
                    if (res_str[x] == null) {
                        res_str[x] = `${arr[arrKeys[x]][row][0]}`.padEnd(10) + `${arr[arrKeys[x]][row][1]}`.padEnd(50) + `\n`;
                    } else {
                        res_str[x] += `${arr[arrKeys[x]][row][0]}`.padEnd(10) + `${arr[arrKeys[x]][row][1]}`.padEnd(50) + `\n`;
                    }
                }
            }

            const chunks = [];

            for (let y = 0; y < arrKeys.length; y++) {
                chunks.push([{
                    name: 'Short'.padEnd(20) + '  Name'.padEnd(50),
                    data: "\`\`\`glsl\n" + `${res_str[y]}` + "\`\`\`"
                }]);
            }
            return { color: '#8E59AB', title: "Teamlist", fields: null, chunks: chunks };
        } else {
            for (row in res_data) {
                //            abbreviation,  explanation
                arr.push([res_data[row][0], res_data[row][1]]);
            }

            let res_strShort = '';
            let res_strFullname = '';

            for (row in arr) {
                // build list
                res_strShort += `${arr[row][0]}\n`;
                res_strFullname += `${arr[row][1]}\n`;
            }
            const fields = [
                {
                    name: 'Short',
                    data: `${res_strShort}`
                },
                {
                    name: 'Name',
                    data: `${res_strFullname}`
                }
            ];
            return { color: '#8E59AB', title: "Teamlist", fields: fields, chunks: null };
        }
    } catch (err) {
        console.error(err);
        return { color: '#8E59AB', title: `Error: Can't find any teams.`, fields: null, chunks: null };
    }
}

// Who is in a given team?
async function WhoTeam(target) {
    const match = functions.checkKey(target);

    if (match.found === false) {
        return { color: '#8E59AB', title: `**${match.key}** is not an known team.`, fields: null };
    } else {
        try {
            const dataArr = team_keys;
            for (i in dataArr) {
                if (dataArr[i][0] == match.key) {
                    const res_arr = dataArr[i];

                    const fields = [
                        {
                            name: 'Core',
                            data: `${res_arr[8]}`
                        },
                    ];

                    if (res_arr[9] != null && res_arr[9] !== '' && res_arr[9] !== 'undefined') {
                        fields.push(
                            {
                                name: 'Best sub',
                                data: `${res_arr[9]}`
                            }
                        )
                    }
                    if (res_arr[10] != null && res_arr[10] !== '' && res_arr[10] !== 'undefined') {
                        fields.push(
                            {
                                name: '2nd option',
                                data: `${res_arr[10]}`
                            }
                        )
                    }
                    if (res_arr[11] != null && res_arr[11] !== '' && res_arr[11] !== 'undefined') {
                        fields.push(
                            {
                                name: '3rd option',
                                data: `${res_arr[11]}`
                            }
                        )
                    }
                    if (res_arr[12] != null && res_arr[12] !== '' && res_arr[12] !== 'undefined') {
                        fields.push(
                            {
                                name: '4th option',
                                data: `${res_arr[12]}`
                            }
                        )
                    }
                    if (res_arr[13] != null && res_arr[13] !== '' && res_arr[13] !== 'undefined') {
                        fields.push(
                            {
                                name: '5th option',
                                data: `${res_arr[13]}`
                            }
                        )
                    };
                    const warnote = [];
                    if (res_arr[14] != null && res_arr[14] !== '' && res_arr[14] !== 'undefined') {
                        warnote.push(
                            {
                                name: ':crossed_swords: War notes :shield:',
                                data: `${res_arr[14]}`
                            }
                        )
                    };
                    const teamimage = [
                        {
                            data: `${res_arr[7]}`
                        },
                    ];
                    return { type: 'true', color: '#8E59AB', title: `${tools.getFullKeyName(match.key, team_keys)} consists out of:`, fields: fields, warnote: warnote, teamimage: teamimage };
                }
            }
            // Return message if no team is found
            return { type: 'error', msg: `I could not find anyone part of this team.\nUse "!teams" for a list of what I know.` };
        } catch (err) {
            console.error(err);
            return { type: 'error', msg: err };
        }
    }
}

// List Aliases
async function getAlias() {
    try {
        const res_data = team_keys;
        const arr = {};

        //                     Number of rows
        if (res_data.length > 11) {
            let i = 0; // amount of teams you have looped through
            let j = 0; // amount of messages
            arr[j] = [];

            for (row in res_data) {
                i++;
                if (i / 11 > 1) { // reset amount of teams looped and add 1 to the amount of messages
                    j++;
                    arr[j] = [];
                    i = 0;
                }
                //		abbreviation               alias1				alias2			alias3
                arr[j].push([res_data[row][2], res_data[row][3], res_data[row][4], res_data[row][5]]);
            }

            let res_str = [];

            const arrKeys = Object.keys(arr);

            for (let x = 0; x < arrKeys.length; x++) {
                for (row in arr[arrKeys[x]]) {
                    // build list
                    if (res_str[x] == null) {
                        res_str[x] = `${arr[arrKeys[x]][row][0]}`.padEnd(28) + `${arr[arrKeys[x]][row][1]}`.padEnd(11) + `${arr[arrKeys[x]][row][2]}`.padEnd(11) + `${arr[arrKeys[x]][row][3]}`.padEnd(11) + `\n`;
                    } else {
                        res_str[x] += `${arr[arrKeys[x]][row][0]}`.padEnd(28) + `${arr[arrKeys[x]][row][1]}`.padEnd(11) + `${arr[arrKeys[x]][row][2]}`.padEnd(11) + `${arr[arrKeys[x]][row][3]}`.padEnd(11) + `\n`;
                    }
                }
            }

            const chunks = [];

            for (let y = 0; y < arrKeys.length; y++) {
                chunks.push([{
                    name: 'Fullname'.padEnd(62) + '  Aliases',
                    data: "\`\`\`glsl\n" + `${res_str[y]}` + "\`\`\`"
                }]);
            }
            return { color: '#8E59AB', title: "Aliaslist", fields: null, chunks: chunks };
        }
    } catch (err) {
        console.error(err);
        return { color: '#8E59AB', title: `Error: Can't find any aliases.`, fields: null, chunks: null };
    }
}

// ########################
// ### Stats & Commands ###
// ########################

// Stats as embed
async function getStats() {
    try {
        const res_data = sheet_stats;
        const fields = [
            {
                name: 'Total # records',
                data: `${res_data[1][0]}`
            },
            {
                name: 'Unique matchups',
                data: `${res_data[1][1]}`
            },
            {
                name: 'Most flexible offense',
                data: `<:fire:728250933196095599> ${tools.getFullKeyName(res_data[3][0], team_keys)}`
            },
            {
                name: 'Most common defense',
                data: `<:rhino:728251188989919303> ${tools.getFullKeyName(res_data[3][1], team_keys)}`
            },
            {
                name: 'Biggest Punch Up',
                data: `${res_data[5][0]}k\n<:crossed_swords:711863568420569098> ${tools.getFullKeyName(res_data[5][1], team_keys)}\n<:shield:711864309830910003> ${tools.getFullKeyName(res_data[5][2], team_keys)}`
            },
            {
                name: 'Biggest Punch Up %',
                data: `${res_data[7][0]}%\n<:crossed_swords:711863568420569098> ${tools.getFullKeyName(res_data[7][1], team_keys)}\n<:shield:711864309830910003> ${tools.getFullKeyName(res_data[7][2], team_keys)}`
            },
            {
                name: 'Most recorded match up',
                data: `#${res_data[9][0]}\n<:crossed_swords:711863568420569098> ${tools.getFullKeyName(res_data[9][1], team_keys)}\n<:shield:711864309830910003> ${tools.getFullKeyName(res_data[9][2], team_keys)}`
            },
            {
                name: '🏅 Top contributors',
                data: `${res_data[11][0]} ~ ${res_data[11][1]}\n${res_data[12][0]} ~ ${res_data[12][1]}\n${res_data[13][0]} ~ ${res_data[13][1]}\n${res_data[14][0]} ~ ${res_data[14][1]}\n${res_data[15][0]} ~ ${res_data[15][1]}\n${res_data[16][0]} ~ ${res_data[16][1]}\n${res_data[17][0]} ~ ${res_data[17][1]}`
            },
        ]
        return { color: '#8E59AB', thumbnail: 'https://i.imgur.com/dFwJSZU.gif', title: "Statbot's numbers", fields: fields };
    } catch (err) {
        console.error(err);
        return { color: '#8E59AB', title: `Error: Can't find any stats.`, fields: null };
    }
}

// List commands, separate Gsheet
async function getCommands() {
    try {
        const res_data = sheet_commands;
        const arr = [];

        for (row in res_data) {
            //		Commands			explanation
            arr.push([res_data[row][0], res_data[row][1]]);
        }

        //let res_str = '';
//
        //for (row in arr) {
        //    res_str += arr[row][0].padEnd(26) + arr[row][1] + `\n`;
        //}
        const fields = [
            {
                name: 'Contribute match-ups to Statbot\n<:zap:763499844513562625> Attacker vs Defender <:zap:763499844513562625>',
                data: "\`" + arr[0][0].padEnd(26) + "\`" + arr[0][1]
            },
            {
                name: '<:crossed_swords:711863568420569098> Best counters for any opponent with these commands',
                data: "\`" + arr[1][0].padEnd(26) + "\`" + arr[1][1] + `\n` + 
                "\`" + arr[2][0].padEnd(26) + "\`" + arr[2][1] + `\n` + 
                "\`" + arr[3][0].padEnd(26) + "\`" + arr[3][1] + `\n` + 
                "\`" + arr[4][0].padEnd(26) + "\`" + arr[4][1] + `\n`
            },
            {
                name: '<:anger:763493972848934962> Find your target with these commands',
                data: "\`" + arr[5][0].padEnd(26) + "\`" + arr[5][1] + `\n` + 
                "\`" + arr[6][0].padEnd(26) + "\`" + arr[6][1] + `\n` + 
                "\`" + arr[7][0].padEnd(26) + "\`" + arr[7][1] + `\n` + 
                "\`" + arr[8][0].padEnd(26) + "\`" + arr[8][1] + `\n`
            },
            {
                name: '<:mag_right:763495545603489823> Get more details with match lookup commands',
                data: "\`" + arr[9][0].padEnd(26) + "\`" + arr[9][1] + `\n` + 
                "\`" + arr[10][0].padEnd(26) + "\`" + arr[10][1] + `\n` + 
                "\`" + arr[11][0].padEnd(26) + "\`" + arr[11][1] + `\n` + 
                "\`" + arr[12][0].padEnd(26) + "\`" + arr[12][1] + `\n`
            },
            {
                name: "<:compass:763494662799097876> Unsure who's who?",
                data: "\`" + arr[13][0].padEnd(26) + "\`" + arr[13][1] + `\n` + 
                "\`" + arr[14][0].padEnd(26) + "\`" + arr[14][1] + `\n` + 
                "\`" + arr[15][0].padEnd(26) + "\`" + arr[15][1] + `\n`
            },
            {
                name: "🛎️ Stay ahead of the competition",
                data: "\`" + arr[16][0].padEnd(26) + "\`" + arr[16][1] + `\n` + 
                "\`" + arr[17][0].padEnd(26) + "\`" + arr[17][1] + `\n`
            },
            {
                name: "<:bulb:763495172553572397> More info this way",
                data: "\`" + arr[18][0].padEnd(26) + "\`" + arr[18][1] + `\n` + 
                "\`" + arr[19][0].padEnd(26) + "\`" + arr[19][1] + `\n` + 
                "\`" + arr[20][0].padEnd(26) + "\`" + arr[20][1] + `\n` + 
                "\`" + arr[21][0].padEnd(26) + "\`" + arr[21][1] + `\n`
            }
//            {
//                name: 'Counter Commands',
//                data: "\`\`\`" + res_str + "\`\`\`"
//            },
        ];
        return { color: '#8E59AB', title: "Commandlist", fields: fields };
    } catch (err) {
        console.error(err);
        return { color: '#8E59AB', title: `Can't find any commands. Please try again.`, fields: null };
    }
}

// List Rooms, separate Gsheet
async function getRooms() {
    try {
        const res_data = sheet_roomlist;
        const arr = [];

        for (row in res_data) {
            //		Room			icon
            arr.push([res_data[row][0], res_data[row][1]]);
        }

        const fields = [
            {
                name: 'Room'.padEnd(15) + '~'.padEnd(10) + 'Icon',
                data: "\`" + arr[0][0].padEnd(15) + "\` " + arr[0][1] + `\n` + 
                "\`" + arr[1][0].padEnd(15) + "\` " + arr[1][1] + `\n` + 
                "\`" + arr[2][0].padEnd(15) + "\` " + arr[2][1] + `\n` + 
                "\`" + arr[3][0].padEnd(15) + "\` " + arr[3][1] + `\n` + 
                "\`" + arr[4][0].padEnd(15) + "\` " + arr[4][1] + `\n` + 
                "\`" + arr[5][0].padEnd(15) + "\` " + arr[5][1] + `\n` + 
                "\`" + arr[6][0].padEnd(15) + "\` " + arr[6][1] + `\n` + 
                "\`" + arr[7][0].padEnd(15) + "\` " + arr[7][1] + `\n` + 
                "\`" + arr[8][0].padEnd(15) + "\` " + arr[8][1] + `\n`  
            }
        ];
        return { color: '#8E59AB', title: "Roomlist", fields: fields };
    } catch (err) {
        console.error(err);
        return { color: '#8E59AB', title: `Can't find any rooms. Where am I?`, fields: null };
    }
}

module.exports = {
    notes,
    getKeys,
    getAlias,
    getCommands,
    getStats,
    WhoTeam,
    getRooms
};