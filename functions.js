const keys = require('./credentials.json');
const tools = require('./tools');
const { google, gamesConfiguration_v1configuration } = require('googleapis');
const googclient = connect();
const { MessageEmbed } = require('discord.js');
const input_upperlimit = 1000;
const input_lowerlimit = 100;
const list_mincount = 3;

global.team_keys = [];
global.sheet_notes = [];
global.sheet_autocounters = [];
global.sheet_autotargets = [];
global.sheet_commands = [];
global.sheet_stats = [];
global.sheet_results = [];
global.sheet_store = [];
global.sheet_warzone = [];
global.sheet_roomlist = [];
global.sheet_rooms = [];

//Connect to DB
function connect() {
    const client = new google.auth.JWT(keys.client_email, null, keys.private_key, ['https://www.googleapis.com/auth/spreadsheets']);
    console.log('Progress: Connecting to Google.');
    client.authorize(function (err) {
        if (err) {
            console.error('Failure: ' + err);
            return;
        }
    });
    console.log('Succes: Connected to Google.');
    return client;
}

// ######################
// ### Data functions ###
// ######################

// Load sheets into memory
function loadGlobals() {
    updateResultsSheet().then(console.log("Updating results at bot start-up"));
    getInfo('keys').then(res => global.team_keys = res).then(console.log("Keys loaded")).catch(err => console.error(err));
    getInfo('autocounters').then(res => global.sheet_autocounters = res).then(console.log("Autocounters loaded")).catch(err => console.error(err));
    getInfo('autotargets').then(res => global.sheet_autotargets = res).then(console.log("Autotargets loaded")).catch(err => console.error(err));
    getInfo('notes').then(res => global.sheet_notes = res).then(console.log("Notes loaded")).catch(err => console.error(err));
    getInfo('commands').then(res => global.sheet_commands = res).then(console.log("Commands loaded")).catch(err => console.error(err));
    getInfo('roomlist').then(res => global.sheet_roomlist = res).then(console.log("Room list loaded")).catch(err => console.error(err));
    getInfo('rooms').then(res => global.sheet_rooms = res).then(console.log("Confirmed rooms loaded")).catch(err => console.error(err));
    getData('stats').then(res => global.sheet_stats = res).then(console.log("Stats loaded")).catch(err => console.error(err));
    setTimeout(function () {
        getData('store').then(res => global.sheet_store = res).then(console.log("Store loaded")).catch(err => console.error(err));
        setTimeout(function () {
            getData('results').then(res => global.sheet_results = res).then(console.log("Results loaded")).catch(err => console.error(err));
        }, 7000);
    }, 10000);
    getAllianceInfo('warzone').then(res => global.sheet_warzone = res).then(console.log("Warzones loaded")).catch(err => console.error(err));
}

// Reload specific data
function reloadDB(db, logText) {
    return new Promise((resolve, reject) => {
        switch (db) {
            case 'keys':
                getInfo(db).then(res => global.team_keys = res).then(console.log(`${logText}: ${db} reloaded`)).then(() => {
                    resolve();
                }).catch(err => console.error(err));
                break;
            case 'notes':
                getInfo(db).then(res => global.sheet_notes = res).then(console.log(`${logText}: ${db} reloaded`)).then(() => {
                    resolve();
                }).catch(err => console.error(err));
                break;
            case 'stats':
                getData('stats').then(res => global.sheet_stats = res).then(console.log(`${logText}: ${db} reloaded`)).then(() => {
                    resolve();
                }).catch(err => console.error(err));
                break;
            case 'commands':
                getInfo('commands').then(res => global.sheet_commands = res).then(console.log(`${logText}: ${db} reloaded`)).then(() => {
                    resolve();
                }).catch(err => console.error(err));
                break;
            case 'roomlist':
                getInfo('roomlist').then(res => global.sheet_roomlist = res).then(console.log(`${logText}: ${db} reloaded`)).then(() => {
                    resolve();
                }).catch(err => console.error(err));
                break;    
            case 'rooms':
                getInfo('rooms').then(res => global.sheet_rooms = res).then(console.log(`${logText}: ${db} reloaded`)).then(() => {
                    resolve();
                }).catch(err => console.error(err));
                break;
            case 'store':
                getData('store').then(res => global.sheet_store = res).then(console.log(`${logText}: ${db} reloaded`)).then(() => {
                    resolve();
                }).catch(err => console.error(err));
                break;
            case 'results':
                updateResultsSheet().then(console.log(`${logText}: update sent to results`));
                setTimeout(function () {
                    getData('results').then(res => global.sheet_results = res).then(console.log(`${logText}: ${db} reloaded`)).then(() => {
                        resolve();
                    }).catch(err => console.error(err));
                }, 10000);
                break;
            case 'warzone':
                getAllianceInfo('warzone').then(res => global.sheet_warzone = res).then(console.log(`${logText} -> ${db} reloaded`)).then(() => {
                    resolve();
                }).catch(err => console.error(err));
                break;
            default:
                reject();
        }
    })
}

// Reload results into memory
function reloadResults(logText) {
    updateResultsSheet().then(console.log(`${logText}: Sent update to data_results`));
    return new Promise((resolve, reject) => {
        let buStats = global.sheet_stats;
        getData('stats').then(res => global.sheet_stats = res).then(() => {
            if (global.sheet_stats == 'undefined' || global.sheet_stats == [] || global.sheet_stats == '' || global.sheet_stats == null) {
                global.sheet_stats = buStats;
                let pre = 'BU ';
                console.log(`${logText}: ${pre}stats loaded`)
            } else {
                let pre = '';
                console.log(`${logText}: ${pre}Stats loaded`)
            }
            let buStore = global.sheet_store;
            getData('store').then(res => global.sheet_store = res).then(() => {
                if (global.sheet_store == 'undefined' || global.sheet_store == [] || global.sheet_store == '' || global.sheet_store == null) {
                    global.sheet_store = buStore;
                    let pre = 'BU ';
                    console.log(`${logText}: ${pre}store loaded`)
                } else {
                    let pre = '';
                    console.log(`${logText}: ${pre}Store loaded`)
                }
                let buResults = global.sheet_results;
                setTimeout(function () {
                    getData('results').then(res => global.sheet_results = res).then(() => {
                        if (global.sheet_results == 'undefined' || global.sheet_results == [] || global.sheet_results == '' || global.sheet_results == null) {
                            global.sheet_results = buResults;
                            let pre = 'BU ';
                            console.log(`${logText}: ${pre}results loaded`)
                        } else {
                            let pre = '';
                            console.log(`${logText}: ${pre}Results loaded`)
                        }
                        resolve();
                    }).catch(err => {
                        console.error(err)
                        reject();
                    });
                }, 7000);
            }).catch(err => {
                console.error(err)
                reject();
            });
        }).catch(err => {
            console.error(err)
            reject();
        });
    });
}

// Reload info into memory
function reloadInfo(logText) {
    return new Promise((resolve, reject) => {
        let buKeys = global.team_keys;
        getInfo('keys').then(res => global.team_keys = res).then(() => {
            if (global.team_keys == 'undefined' || global.team_keys == [] || global.team_keys == '' || global.team_keys == null) {
                global.team_keys = buKeys;
                let pre = 'BU ';
                console.log(`${logText}: ${pre}keys loaded`)
            } else {
                let pre = '';
                console.log(`${logText}: ${pre}Keys loaded`)
            }
            let buNotes = global.sheet_notes;
            getInfo('notes').then(res => global.sheet_notes = res).then(() => {
                if (global.sheet_notes == 'undefined' || global.sheet_notes == [] || global.sheet_notes == '' || global.sheet_notes == null) {
                    global.sheet_notes = buNotes;
                    let pre = 'BU ';
                    console.log(`${logText}: ${pre}notes loaded`)
                } else {
                    let pre = '';
                    console.log(`${logText}: ${pre}Notes loaded`)
                }
                let buCommands = global.sheet_commands;
                getInfo('commands').then(res => global.sheet_commands = res).then(() => {
                    if (global.sheet_commands == 'undefined' || global.sheet_commands == [] || global.sheet_commands == '' || global.sheet_commands == null) {
                        global.sheet_commands = buCommands;
                        let pre = 'BU ';
                        console.log(`${logText}: ${pre}commands loaded`)
                    } else {
                        let pre = '';
                        console.log(`${logText}: ${pre}Commands loaded`)
                    }
                    let buRoomlist = global.sheet_roomlist;
                    getInfo('roomlist').then(res => global.sheet_roomlist = res).then(() => {
                        if (global.sheet_roomlist == 'undefined' || global.sheet_roomlist == [] || global.sheet_roomlist =='' || global.sheet_roomlist == null) {
                            global.sheet_roomlist = buRoomlist;
                            let pre = 'BU ';
                            console.log(`${logText}: ${pre}Roomlist loaded`)
                        } else {
                            let pre = '';
                            console.log(`${logText}: ${pre}Roomlist loaded`)
                        }
                        let buRooms = global.sheet_rooms;
                        getInfo('rooms').then(res => global.sheet_rooms = res).then(() => {
                            if (global.sheet_rooms == 'undefined' || global.sheet_rooms == [] || global.sheet_rooms =='' || global.sheet_rooms == null) {
                                global.sheet_rooms = buRooms;
                                let pre = 'BU ';
                                console.log(`${logText}: ${pre}Confirmed Rooms loaded`)
                            } else {
                                let pre = '';
                                console.log(`${logText}: ${pre}Confirmed Rooms loaded`)
                            }
                        resolve();
                        }).catch(err => {
                            console.error(err)
                            reject();
                        });
                     }).catch(err => {
                        console.error(err)
                        reject();
                    });
                }).catch(err => {
                    console.error(err)
                    reject();
                });
            }).catch(err => {
                console.error(err)
                reject();
            });
        }).catch(err => {
            console.error(err)
            reject();
        });
    });
}

// Reload Alliance info into memory
function reloadAllianceInfo(logText) {
    return new Promise((resolve, reject) => {
        let buWarzone = global.sheet_warzone;
        getAllianceInfo('warzone').then(res => global.sheet_warzone = res).then(() => {
            if (global.sheet_warzone == 'undefined' || global.sheet_warzone == [] || global.sheet_warzone == '' || global.sheet_warzone == null) {
                global.sheet_warzone = buWarzone;
                let pre = 'BU ';
                console.log(`${logText}: ${pre}warzones reloaded`)
            } else {
                let pre = '';
                console.log(`${logText}: ${pre}warzones reloaded`)
            }
            resolve();
        }).catch(err => {
            console.error(err)
            reject();
        });
    });
}

// Update the results page for accurate data
// Automatically done when adding new values
async function updateResultsSheet() {
    let store_items = await getData('store');
    let arg1 = null;
    let arg2 = null;
    const new_results = [];

    for (row in store_items) {
        if (store_items[row][0] == arg1 && store_items[row][1] == arg2) {
            continue;
        }

        // Push accurate formula
        arg1 = store_items[row][0];
        arg2 = store_items[row][1];
        const start = tools.storeSearch(store_items, [arg1, arg2], 'index');
        const match_arr = tools.storeSearch(store_items, [arg1, arg2], 'arr');
        const end = match_arr.length > 1 ? (start + match_arr.length - 1) : start;
        const per = `=FLOOR.PRECISE(AVERAGE(data_store!H${start}:H${end});0,01)`;
        const avg = `=FLOOR.PRECISE(AVERAGE(data_store!G${start}:G${end});0,01)`;
        const min = `=MIN(data_store!G${start}:G${end})`;
        const max = `=MAX(data_store!G${start}:G${end})`;
        const records = `=COUNT(data_store!G${start}:G${end})`;

        new_results.push([arg1, arg2, avg, min, max, records, per]);
    }
    return modifyResultsSheet(new_results);
}

// #############################
// ### Data lookup functions ###
// #############################

// Match-up function A vs B, power value is optional but is always value of B
async function search(team, team2, power) {
    const no_match = [];
    // Check if input teams are known including their alias
    const res = checkKey(team);
    const res2 = checkKey(team2);

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
        const dataArr = sheet_results;
        const dataConfirmed = sheet_rooms;
        for (i in dataArr) {
            if (dataArr[i][0] == res.key && dataArr[i][1] == res2.key) {
                const res_arr = dataArr[i];

                // If a power argument is given, calculate value based on %.
                let avgAmount = (power) ? calcPower(1, res_arr[6], power, res_arr[2]) : res_arr[2];
                let avgPerc = res_arr[6];

                const fields = [
                    {
                        name: 'Average',
                        data: `**${avgAmount}**k ~ **${avgPerc}**%`
                    },
                    {
                        name: 'Minimum',
                        data: `*${res_arr[3]}k*`
                    },
                    {
                        name: 'Maximum',
                        data: `*${res_arr[4]}k*`
                    },
                    {
                        name: '# records',
                        data: `*${res_arr[5]}*`
                    },
                ];
                const fields2 = [];
                for (i in dataConfirmed) {
                    if (dataConfirmed[i][0] == res.key && dataConfirmed[i][1] == res2.key) {
                        let confirmedRooms = '';
                        if (dataConfirmed[i][2] != null && dataConfirmed[i][2] !== '' && dataConfirmed[i][2] !== 'undefined') {
                            confirmedRooms += '> ' + dataConfirmed[i][2] + '\n';
                        }
                        if (dataConfirmed[i][3] != null && dataConfirmed[i][3] !== '' && dataConfirmed[i][3] !== 'undefined') {
                            confirmedRooms += '> ' + dataConfirmed[i][3] + '\n';
                        }
                        if (dataConfirmed[i][4] != null && dataConfirmed[i][4] !== '' && dataConfirmed[i][4] !== 'undefined') {
                            confirmedRooms += '> ' + dataConfirmed[i][4] + '\n';
                        }
                        if (dataConfirmed[i][5] != null && dataConfirmed[i][5] !== '' && dataConfirmed[i][5] !== 'undefined') {
                            confirmedRooms += '> ' + dataConfirmed[i][5] + '\n';
                        }
                        if (dataConfirmed[i][6] != null && dataConfirmed[i][6] !== '' && dataConfirmed[i][6] !== 'undefined') {
                            confirmedRooms += '> ' + dataConfirmed[i][6] + '\n';
                        }
                        if (dataConfirmed[i][7] != null && dataConfirmed[i][7] !== '' && dataConfirmed[i][7] !== 'undefined') {
                            confirmedRooms += '> ' + dataConfirmed[i][7] + '\n';
                        }
                        if (dataConfirmed[i][8] != null && dataConfirmed[i][8] !== '' && dataConfirmed[i][8] !== 'undefined') {
                            confirmedRooms += '> ' + dataConfirmed[i][8] + '\n';
                        }
                        if (dataConfirmed[i][9] != null && dataConfirmed[i][9] !== '' && dataConfirmed[i][9] !== 'undefined') {
                            confirmedRooms += '> ' + dataConfirmed[i][9];
                        }
                        fields2.push(
                        {
                            name: 'Community confirmed in following room combinations',
                            data: `${confirmedRooms}`
                        });
                    }
                }
                return { type: 'true', color: '#8E59AB', title: `${tools.getFullKeyName(res_arr[0], team_keys)} versus ${tools.getFullKeyName(res_arr[1], team_keys)}`, fields: fields, fields2: fields2 };
            }
        }
        // Return message if specific match-up is not found
        return { type: 'error', msg: `No records were found on **${tools.getFullKeyName(res.key, team_keys)}** versus **${tools.getFullKeyName(res2.key, team_keys)}**.` };
    } catch (err) {
        console.error(err);
        return { type: 'error', msg: err };
    }

}

// Top counter list
async function TopCounter(target, amount, power, sort) {
    // Check if input teams are known including their alias
    const match = checkKey(target);

    if (match.found === false) {
        return { color: '#8E59AB', title: `**${match.key}** is not an known team.`, fields: null };
    } else {
        try {
            // Value feedback				Target, length of list, index, column number of results, average value, percentage, optional power value
            const data = await getTargets(match.key, amount, 1, 0, 2, 6, power, sort);
            if (data.chunks && data.chunks.length > 0) {
                const dataChunks = [];
                for (const chunk of data.chunks) {
                    if (chunk.count != null && chunk.count > 0) {
                        dataChunks.push([
                            {
                                name: 'Name'.padEnd(94) + 'Average'.padEnd(15) + '     #',
                                data: "\`\`\`glsl\n" + `${chunk.feedback}` + "\`\`\`"
                            }
                        ]);
                    }
                }
                return { color: '#8E59AB', title: `Against ${tools.getFullKeyName(match.key, team_keys)} pick one of these:`, fields: null, chunks: dataChunks };
            } else {
                if (data.count == null || data.count < 1) {
                    return { color: '#8E59AB', title: `No records found, add some using !a`, fields: null };
                }

                const fields = [
                    {
                        name: 'Name'.padEnd(94) + 'Average'.padEnd(15) + '     #',
                        data: "\`\`\`glsl\n" + `${data.feedback}` + "\`\`\`"
                    }
                ];
                return { color: '#8E59AB', title: `Against ${tools.getFullKeyName(match.key, team_keys)} pick one of these:`, fields: fields };
            }
        } catch (err) {
            console.error(err);
            return { color: '#8E59AB', title: `Can't find any counters.`, fields: null };
        }
    }
}

// Top target list
async function TopTarget(target, amount, power, sort) {
    // Check if input teams are known including their alias
    const match = checkKey(target);

    if (match.found === false) {
        return { color: '#8E59AB', title: `**${match.key}** is not an known team.`, fields: null };
    } else {
        try {
            // Value feedback			Target, length of list, index, column number of results, average value, percentage, optional power value
            const data = await getTargets(match.key, amount, 0, 1, 2, 6, power, sort);
            if (data.chunks && data.chunks.length > 0) {
                const dataChunks = [];
                for (const chunk of data.chunks) {
                    if (chunk.count != null && chunk.count > 0) {
                        dataChunks.push([
                            {
                                name: 'Name'.padEnd(94) + 'Average'.padEnd(15) + '     #',
                                data: "\`\`\`glsl\n" + `${chunk.feedback}` + "\`\`\`"
                            }
                        ]);
                    }
                }
                return { color: '#8E59AB', title: `Using ${tools.getFullKeyName(match.key, team_keys)} target one of these:`, fields: null, chunks: dataChunks };
            } else {
                if (data.count == null || data.count < 1) {
                    return { color: '#8E59AB', title: `No records found, add some using !a`, fields: null };
                }

                const fields = [
                    {
                        name: 'Name'.padEnd(94) + 'Average'.padEnd(15) + '     #',
                        data: "\`\`\`glsl\n" + `${data.feedback}` + "\`\`\`"
                    }
                ];
                return { color: '#8E59AB', title: `Using ${tools.getFullKeyName(match.key, team_keys)} target one of these:`, fields: fields };
            }
        } catch (err) {
            console.error(err);
            return { color: '#8E59AB', title: `Can't find any targets.`, fields: null };
        }
    }
}

// Function to build lists
async function getTargets(target, amount, targetIndex, sourceX, sourceY, sourceZ, power, countsort) {
    const res_items = sheet_results;
    const arr = [];
    let res_arr = [];

    for (row in res_items) {
        if (res_items[row][targetIndex] == target) {
            // Anything with less than 3 records will be skipped
            if (res_items[row][5] < list_mincount) {
                continue;
            }
            arr.push([res_items[row][sourceX], res_items[row][sourceZ], res_items[row][sourceY], res_items[row][5]]);
        }			// opponent	0		       percentage 1             average 2               count 3          
    }
    // If there are no results because the minimum count is not met, then I would still like to see everything.
    if (arr != null && arr.length < 1) {
        for (row in res_items) {
            if (res_items[row][targetIndex] == target) {
                arr.push([res_items[row][sourceX], res_items[row][sourceZ], res_items[row][sourceY], res_items[row][5]]);
            }			// opponent	0		       percentage 1             average 2               count 3          
        }
    }

    if (countsort == 'true') {
        res_arr = arr.sort(function (a, b) {
            return b[3] - a[3];
        }).slice(0, amount);
    } else {
        res_arr = arr.sort(tools.Comparator).slice(0, amount);
    }
    // let resFullName = '';
    // let resAverage = '';
    let resCount = '';
    let resFeedback = '';
    const dataArr = sheet_notes;
    const roomArr = sheet_rooms;

    if (res_arr.length > 12) {
        let x = 0;
        let y = 0
        const chunks = [];

        for (row in res_arr) {
            y++;
            x++;

            //Note  and rooms var reset
            let resNote = '';
            let resConfirmed = '';

            //Targets and counter different index
            let attacker = (targetIndex === 1) ? res_arr[row][0] : target;
            let defender = (targetIndex === 1) ? target : res_arr[row][0];

            //Check notes for each row
            for (i in dataArr) {
                if (dataArr[i][0] == attacker && dataArr[i][1] == defender) {
                    resNote = `!notes ${attacker} ${defender}`;
                }
            }
            //Check confirmed rooms for each row
            for (i in roomArr) {
                if (roomArr[i][0] == attacker && roomArr[i][1] == defender) {
                    resConfirmed = `✅`;
                }
            }

            let avgAmount = (power) ? calcPower(targetIndex, res_arr[row][1], power, res_arr[row][2]) : res_arr[row][2];
            let avgPerc = res_arr[row][1];
            // resAverage = `${avgAmount}k ~ ${avgPerc}%`;
            // resFullName += `${tools.getFullKeyName(res_arr[row][0], team_keys)} *(${res_arr[row][0]})*${resNote}`;
            resCount = `${res_arr[row][3]}`;
            // Feedback is the only value currently being used and is outlined
            if (resConfirmed.length < 1) {
                resFeedback += `${tools.getFullKeyName(res_arr[row][0], team_keys)} (${res_arr[row][0]}) `.padEnd(34) + `${avgAmount}k`.padEnd(7) + `~ ${avgPerc}%`.padEnd(8) + `#${res_arr[row][3]} ${resNote}\n`
            } else {
                resFeedback += `${tools.getFullKeyName(res_arr[row][0], team_keys)} (${res_arr[row][0]}) ${resConfirmed}`.padEnd(34) + `${avgAmount}k`.padEnd(7) + `~ ${avgPerc}%`.padEnd(8) + `#${res_arr[row][3]} ${resNote}\n`
            }
            if (x / 12 > 1) { // reset amount of teams looped and add 1 to the amount of messages
                // chunks.push({ fullName: resFullName, average: resAverage, count: resCount, feedback: resFeedback });
                chunks.push({ count: resCount, feedback: resFeedback });
                // resFullName = '';
                // resAverage = '';
                resCount = '';
                resFeedback = '';
                x = 0;
            }
            if (y === res_arr.length) {
                // chunks.push({ fullName: resFullName, average: resAverage, count: resCount, feedback: resFeedback });
                chunks.push({ count: resCount, feedback: resFeedback });
            }
        }
        return { chunks: chunks }
    } else {
        for (row in res_arr) {

            //Note en room var reset
            let resNote = '';
            let resConfirmed = '';

            //Targets and counter different index
            let attacker = (targetIndex === 1) ? res_arr[row][0] : target;
            let defender = (targetIndex === 1) ? target : res_arr[row][0];

            //Check notes for each row
            for (i in dataArr) {
                if (dataArr[i][0] == attacker && dataArr[i][1] == defender) {
                    resNote = `!notes ${attacker} ${defender}`;
                }
            }
            
            //Check confirmed rooms for each row
            for (i in roomArr) {
                if (roomArr[i][0] == attacker && roomArr[i][1] == defender) {
                    resConfirmed = `✅`;
                }
            }

            let avgAmount = (power) ? calcPower(targetIndex, res_arr[row][1], power, res_arr[row][2]) : res_arr[row][2];
            let avgPerc = res_arr[row][1];
            // resAverage = `${avgAmount}k ~ ${avgPerc}%`;
            // resFullName += `${tools.getFullKeyName(res_arr[row][0], team_keys)} *(${res_arr[row][0]})*${resNote}`;
            resCount = `${res_arr[row][3]}`;
            // Feedback is the only value currently being used and is outlined
            if (resConfirmed.length < 1) {
                resFeedback += `${tools.getFullKeyName(res_arr[row][0], team_keys)} (${res_arr[row][0]}) `.padEnd(34) + `${avgAmount}k`.padEnd(7) + `~ ${avgPerc}%`.padEnd(8) + `#${res_arr[row][3]} ${resNote}\n`
            } else {
                resFeedback += `${tools.getFullKeyName(res_arr[row][0], team_keys)} (${res_arr[row][0]}) ${resConfirmed}`.padEnd(34) + `${avgAmount}k`.padEnd(7) + `~ ${avgPerc}%`.padEnd(8) + `#${res_arr[row][3]} ${resNote}\n`
            }
        }
        // return { fullName: resFullName, average: resAverage, count: resCount, feedback: resFeedback }
        return { count: resCount, feedback: resFeedback }
    }
}

// Calculate power value if given on lists and matchups
function calcPower(index, value, power, amount = 0) {
    const input = (typeof power != 'number') ? Number(power) : power;
    const val1 = (typeof value != 'number') ? Number(value) : value;
    const val2 = (typeof amount != 'number') ? Number(amount) : amount;

    // Reverse engineer % based on your team for counter or the given team on target
    const perc = (val1 + 100) / 100;
    const res = Math.floor((index == 1) ? input / perc : input * perc);

    if (res > 0)
        return res;
    else
        return val2;
}

// ########################
// ### Helper functions ###
// ########################

// Check if a team is known, including alias
function checkKey(key, keys_table = team_keys) {
    for (k in keys_table) {
        if (key == keys_table[k][0] || key == keys_table[k][2].toLowerCase() || key == keys_table[k][3] || key == keys_table[k][4] || key == keys_table[k][5]) {
            return { found: true, key: keys_table[k][0] };
        }
    }
    return { found: false, key: key };
}

// Get data from Gsheet
async function getData(db = 0, client = googclient) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const sheet_range = tools.getSheetRange(db);
    const opt = {
        spreadsheetId: keys.spreadsheet_db,
        range: sheet_range,
    };

    try {
        const data = await gsapi.spreadsheets.values.get(opt);
        return data.data.values;
    } catch (err) {
        console.error(err);
    }
}

// Get info from Gsheet
async function getInfo(db = 0, client = googclient) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const sheet_range = tools.getSheetRange(db);
    const opt = {
        spreadsheetId: keys.spreadsheet_info,
        range: sheet_range,
    };

    try {
        const data = await gsapi.spreadsheets.values.get(opt);
        return data.data.values;
    } catch (err) {
        console.error(err);
    }
}

// Get Alliance info from Gsheet
async function getAllianceInfo(db = 0, client = googclient) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const sheet_range = tools.getSheetRange(db);
    const opt = {
        spreadsheetId: keys.spreadsheet_allianceinfo,
        range: sheet_range,
    };

    try {
        const data = await gsapi.spreadsheets.values.get(opt);
        return data.data.values;
    } catch (err) {
        console.error(err);
    }
}

// #############################
// ### Add data to the sheet ###
// #############################

// Add value to GSheet
async function updateStore(team, team2, value, value2, serverid, username, msgtimestamp, client = googclient) {
    return new Promise(resolve => {
        const no_match = [];
        // Check if input teams are known
        const res = checkKey(team);
        const res2 = checkKey(team2);

        if (res.found === false) {
            no_match.push(res.key);
        }
        if (res2.found === false) {
            no_match.push(res2.key);
        }

        if (no_match.length) {
            let prefix = `**${no_match[0]}** is not an `;
            if (no_match.length == 2) {
                prefix = `**${no_match[0]}** and **${no_match[1]}** are not `;
            }
            const suffix = (no_match.length == 2) ? `s.` : `.`;
            resolve({ type: 'error', msg: prefix + `known team` + suffix });
            return;
        }
        if (isNaN(value)) {
            resolve({ type: 'error', msg: `the third argument, in this case **${value}**, should be a number.` });
            return;
        }
        if (isNaN(value2)) {
            resolve({ type: 'error', msg: `the last argument, in this case **${value2}**, should be a number.` });
            return;
        }
        if (value > input_upperlimit) {
            resolve({ type: 'error', msg: `the third argument, in this case **${value}**, is too high!\nIt should be below ${input_upperlimit}.` });
            return;
        }
        if (value2 > input_upperlimit) {
            resolve({ type: 'error', msg: `the last argument, in this case **${value2}**, is too high!\nIt should be below ${input_upperlimit}.` });
            return;
        }
        if (value < input_lowerlimit) {
            resolve({ type: 'error', msg: `the third argument, in this case **${value}**, is too low!\nIt should be above ${input_lowerlimit}.` });
            return;
        }
        if (value2 < input_lowerlimit) {
            resolve({ type: 'error', msg: `the last argument, in this case **${value2}**, is too low!\nIt should be above ${input_lowerlimit}.` });
            return;
        }
        if ((value2 - value) > 450) {
            resolve({ type: 'error', msg: `that seems unlikely...\nPlease send your screenshot to the main server. Use !invite for the link.` });
            return;
        }
        if (value2 < value) {
            // If not accurate, don't add.
            const resultsArr = global.sheet_results
            for (i in resultsArr) {
                if (resultsArr[i][0] == res.key && resultsArr[i][1] == res2.key) {
                    if (resultsArr[i][5] > 9) {
                        if ((value2 - value + 20) < resultsArr[i][3]) {
                            resolve({ type: 'error', msg: `our data doesn't seem to agree with this claim, please reach out to us on Warstat. Use !invite for the link.` });
                            return;
                        }
                    }
                }
            }
        }

        // if not main discord, save on separate Gsheet
        let DB = '';
        let gsheetID = '';
        if (serverid == keys.master_server) {
            DB = `data_store!A2:F`;
            gsheetID = keys.spreadsheet_db;
        } else {
            DB = `external_adds!A1:F`;
            gsheetID = keys.spreadsheet_info;
        }
        var theDate = new Date(msgtimestamp);

        // Save data on Gsheet including username and timestamp
        const gsapi = google.sheets({ version: 'v4', auth: client }),
            opt = {
                spreadsheetId: gsheetID,
                range: DB,
                valueInputOption: 'USER_ENTERED',
                insertDataOption: 'INSERT_ROWS',
                resource: { values: [[res.key, res2.key, value, value2, username, theDate]] }
            };

        gsapi.spreadsheets.values.append(opt, (err) => {
            if (err) {
                console.log('Failure: Retrying external adds.')
                // If main DB failed, try external adding
                const opt2 = {
                    spreadsheetId: keys.spreadsheet_info,
                    range: `external_adds!A1:F`,
                    valueInputOption: 'USER_ENTERED',
                    insertDataOption: 'INSERT_ROWS',
                    resource: { values: [[res.key, res2.key, value, value2, username, theDate]] }
                };
                gsapi.spreadsheets.values.append(opt2, (err) => {
                    if (err) {
                        console.error(err);
                        resolve({ type: 'error', msg: 'An error has occurred. Please try again in a few minutes.' });
                        return;
                    }
                    if (serverid == keys.master_server) {
                        resolve({ type: 'succes', msg: "\`\`\`glsl\n" + `New attack history has been added.\n${tools.getFullKeyName(res.key, team_keys)} ~ ${value} versus ${tools.getFullKeyName(res2.key, team_keys)} ~ ${value2}` + "\`\`\`" });
                        return;
                    } else {
                        resolve({ type: 'succes', msg: "\`\`\`glsl\n" + `Statbot thanks you for your contribution, this data will be added as soon as possible.\n${tools.getFullKeyName(res.key, team_keys)} ~ ${value} versus ${tools.getFullKeyName(res2.key, team_keys)} ~ ${value2}` + "\`\`\`" });
                        return;
                    }
                });
            }
            if (serverid == keys.master_server) {
                resolve({ type: 'succes', msg: "\`\`\`glsl\n" + `New attack history has been added.\n${tools.getFullKeyName(res.key, team_keys)} ~ ${value} versus ${tools.getFullKeyName(res2.key, team_keys)} ~ ${value2}` + "\`\`\`" });
                return;
            } else {
                resolve({ type: 'succes', msg: "\`\`\`glsl\n" + `Statbot thanks you for your contribution, this data will be added as soon as possible.\n${tools.getFullKeyName(res.key, team_keys)} ~ ${value} versus ${tools.getFullKeyName(res2.key, team_keys)} ~ ${value2}` + "\`\`\`" });
                return;
            }
        });
    });
}

// Add new match-up to results
function modifyResultsSheet(vals, client = googclient) {
    const gsapi = google.sheets({ version: 'v4', auth: client }),
        opt = {
            spreadsheetId: keys.spreadsheet_db,
            range: `data_results!A2`,
            valueInputOption: 'USER_ENTERED',
            resource: { values: vals }
        };

    try {
        gsapi.spreadsheets.values.update(opt, (err) => {
            if (err) {
                console.error(err);
                return 'An error has occurred. Please check the log or try again.';
            }
        });
        return true;
    } catch (err) {
        console.log('Failure: Results update:' + err);
        setTimeout(function () {
            try {
                gsapi.spreadsheets.values.update(opt, (err) => {
                    if (err) {
                        console.error(err);
                        return 'An error has occurred. Please check the log or try again.';
                    }
                });
                return true;
            } catch (err) {
                console.log('Failure: Results update failed again: ' + err);
            }
        }, 600000);
        return "Can't update.";
    }
}

// ##############################
// ### Alliance specific info ###
// ##############################

// Subscribe to a warzone
async function subscribe(author, channelname, channelid, role, warzone, guildname, offset, client = googclient) {
    return new Promise(resolve => {
        let logText = 'Subscribers! '
        reloadDB('warzone', logText);
        setTimeout(function () {
            const res_data = sheet_warzone;
            for (row in res_data) {
                if (channelid == res_data[row][2] && role == res_data[row][3] && warzone == res_data[row][4]) {
                    resolve({ type: 'error', msg: "you're already subscribed for these announcements.\nI don't want to spam you!" });
                    return;
                }
            }
            try {
                // Save data on Gsheet 
                const gsapi = google.sheets({ version: 'v4', auth: client }),
                    opt = {
                        spreadsheetId: keys.spreadsheet_allianceinfo,
                        range: 'alliance_warzones!A2:G',
                        valueInputOption: 'USER_ENTERED',
                        insertDataOption: 'INSERT_ROWS',
                        resource: { values: [[author, channelname, channelid, role, warzone, guildname, offset]] }
                    };
                gsapi.spreadsheets.values.append(opt, (err) => {
                    if (err) {
                        console.log('Failure: Could not connect to Alliance Info sheet.')
                        resolve({ type: 'error', msg: 'I failed 😢, please try again later.' });
                        return;
                    } else {
                        resolve({ type: 'success', msg: `I will tag them for you in <#${channelid}> for all **zone ${warzone}** announcements! 🥳\n This should go into effect shortly.` });
                        return;
                    }
                });
            } catch (err) {
                console.error(err);
            }
        }, 2000);
    });
}

// Get subscription row
async function getSubscriptionRow(channelid, zone) {
    const data = await getAllianceInfo('warzone');
    return new Promise(resolve => {
        try {
            let index = tools.getWarzoneSheetRowIndex(channelid, zone, data);
            if (index == '0' || index == 'undefined' || index == [] || index == '' || index == null) {
                resolve('no warzone subscription found.');
            } else {
                deleteSubscription(channelid, zone, index).then(msg => {
                    resolve(msg);
                });
            }
        } catch (err) {
            console.error(err);
            resolve("I failed 😢, please try again later.");
        }
    });
}

// Delete subscription
function deleteSubscription(channelid, zone, index, client = googclient) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const opt = {
        spreadsheetId: keys.spreadsheet_allianceinfo,
        resource: {
            "requests": [
                {
                    "deleteDimension": {
                        "range": {
                            "sheetId": keys.alliancesubscription_sheetid,
                            "dimension": "ROWS",
                            "startIndex": index - 1,
                            "endIndex": index,
                        }
                    }
                }
            ]
        }
    };

    return new Promise(resolve => {
        try {
            gsapi.spreadsheets.batchUpdate(opt, (err) => {
                if (err) {
                    console.error(err);
                    resolve('I failed 😢, please try again later.');
                }
                resolve(`as soon as possible, you will no longer receive **zone ${zone}** announcements in <#${channelid}>.`);
            });
        } catch (err) {
            console.error(err);
            resolve('I failed 😢, please try again later.');
        };
    });
}

// ###############
// ### Charts! ###
// ###############

async function getLineChart(team, team2, sort) {
    const no_match = [];
    // Check if input teams are known including their alias
    const res = checkKey(team);
    const res2 = checkKey(team2);

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

    // If teams are known gather data for chart
    try {
        const arrPercent = [];
        const arrLabels = [];
        let arrAverage = [];
        let arrZero = [];
        const arrStore = sheet_store;
        const arrResults = sheet_results; //average
        if (sort == 'true') {
            arrStore.sort();
        }
        for (i in arrStore) {
            if (arrStore[i][0] == res.key && arrStore[i][1] == res2.key) {
                arrPercent.push(arrStore[i][7]); //% from match
                arrLabels.push(`${arrStore[i][2]} - ${arrStore[i][3]}`); // attacker value - defendervalue
            }
        }

        for (i in arrResults) {
            if (arrResults[i][0] == res.key && arrResults[i][1] == res2.key) {
                let strAverage = arrResults[i][6]; // average % from results
                arrAverage = new Array(arrPercent.length).fill(strAverage);
            }
        }

        // 0 point line
        arrZero = new Array(arrPercent.length).fill('0');
        if (arrPercent.length > 0) {
            return { type: 'true', labels: arrLabels, data: arrPercent, msg: `Chart for ${tools.getFullKeyName(res.key, team_keys)} vs ${tools.getFullKeyName(res2.key, team_keys)}`, dataAverage: arrAverage, dataZero: arrZero };
        } else {
            return { type: 'error', msg: `No records found for ${tools.getFullKeyName(res.key, team_keys)} vs ${tools.getFullKeyName(res2.key, team_keys)}` }
        }
    } catch (err) {
        console.error(err);
        return { type: 'error', msg: err };
    }
}	//end async getChart

async function getBarChart(team, team2) {
    const no_match = [];
    // Check if input teams are known including their alias
    const res = checkKey(team);
    const res2 = checkKey(team2);

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

    // If teams are known gather data for chart
    try {
        let arrAverage = [];
        let arrData = [];
        const arrResults = sheet_results; //average
        const arrLabels = [];
        for (i in arrResults) {
            if (arrResults[i][0] == res.key && arrResults[i][1] == res2.key) {
                arrData.push(arrResults[i][2], arrResults[i][3], arrResults[i][4]); // from match
                arrLabels.push(`Avg ${arrResults[i][2]}k`, `Min ${arrResults[i][3]}k`, `Max ${arrResults[i][4]}k`);
            }
        }
        for (i in arrResults) {
            if (arrResults[i][0] == res.key && arrResults[i][1] == res2.key) {
                arrAverage = new Array(arrData.length).fill(arrResults[i][6]); // average % from results
            }
        }
        if (arrData.length > 0) {
            return { type: 'true', labels: arrLabels, data: arrData, dataAverage: arrAverage, msg: `Barchart for ${tools.getFullKeyName(res.key, team_keys)} vs ${tools.getFullKeyName(res2.key, team_keys)}` };
        } else {
            return { type: 'error', msg: `No records found for ${tools.getFullKeyName(res.key, team_keys)} vs ${tools.getFullKeyName(res2.key, team_keys)}` }
        }
    } catch (err) {
        console.error(err);
        return { type: 'error', msg: err };
    }
}	//end async getChart

// ###############
// ### Logging ###
// ###############

//Log Usage
function logUsage(user, guild, msg) {
    console.log("User: " + user + ", from: " + guild + ", used: " + msg);
}

// ##################
// ### Start jobs ###
// ##################

// Start counterintervals
async function startCounterIntervals(client) {
    try {
        const res_data = sheet_autocounters;
        let arr = [];
        let sort = 'false';
        let power = '0';

        for (row in res_data) {
            arr.push([res_data[row][0], res_data[row][1]]);
        }
        for (row in arr) {
            let channel = client.channels.cache.get(arr[row][0]);
            TopCounter(arr[row][1], 9999, power, sort).then(data => {
                if (data.chunks && data.chunks.length > 0) {
                    let i = 0;
                    for (const chunk of data.chunks) {
                        i++;
                        const embed = new MessageEmbed()
                            .setColor(data.color)
                            .setTitle(data.title + ' ' + i + '/' + data.chunks.length)
                            .setFooter('Always available from Statbot', 'https://i.imgur.com/fkyfEeA.png')
                            .setTimestamp();
                        if (chunk && chunk.length > 0) {
                            for (const field of chunk) {
                                embed.addField(field.name, field.data, true);
                            }
                        }
                        if (i < data.chunks.length) {
                            channel.send(embed)
                        } else {
                            channel.send(embed)
                        }
                    }
                } else {
                    const embed = new MessageEmbed()
                        .setColor(data.color)
                        .setTitle(data.title)
                        .setFooter('Always available from Statbot', 'https://i.imgur.com/fkyfEeA.png')
                        .setTimestamp();
                    if (data.fields) {
                        for (const field of data.fields) {
                            embed.addField(field.name, field.data, true);
                        }
                    }
                    channel.send(embed)
                }
            }).catch(e => {
                return console.error('Error: ' + e);
            });
        }
        setInterval(function () {
            for (row in arr) {
                let channel = client.channels.cache.get(arr[row][0]);
                TopCounter(arr[row][1], 9999, power, sort).then(data => {
                    if (data.chunks && data.chunks.length > 0) {
                        let i = 0;
                        for (const chunk of data.chunks) {
                            i++;
                            const embed = new MessageEmbed()
                                .setColor(data.color)
                                .setTitle(data.title + ' ' + i + '/' + data.chunks.length)
                                .setFooter('Always available from Statbot', 'https://i.imgur.com/fkyfEeA.png')
                                .setTimestamp();
                            if (chunk && chunk.length > 0) {
                                for (const field of chunk) {
                                    embed.addField(field.name, field.data, true);
                                }
                            }
                            if (i < data.chunks.length) {
                                channel.send(embed)
                            } else {
                                channel.send(embed)
                            }
                        }
                    } else {
                        const embed = new MessageEmbed()
                            .setColor(data.color)
                            .setTitle(data.title)
                            .setFooter('Always available from Statbot', 'https://i.imgur.com/fkyfEeA.png')
                            .setTimestamp();
                        if (data.fields) {
                            for (const field of data.fields) {
                                embed.addField(field.name, field.data, true);
                            }
                        }
                        channel.send(embed)
                    }
                }).catch(e => {
                    return console.error('Error: ' + e);
                });
            }
        }, 7200000);
        console.log('Succes: Autocounters started')
    } catch (err) {
        console.error(err);
    }
}

// Start targetintervals
async function startTargetIntervals(client) {
    try {
        const res_data = sheet_autotargets;
        let arr = [];
        let sort = 'false';
        let power = '0';

        for (row in res_data) {
            arr.push([res_data[row][0], res_data[row][1]]);
        }
        for (row in arr) {
            let channel = client.channels.cache.get(arr[row][0]);
            TopTarget(arr[row][1], 9999, power, sort).then(data => {
                if (data.chunks && data.chunks.length > 0) {
                    let i = 0;
                    for (const chunk of data.chunks) {
                        i++;
                        const embed = new MessageEmbed()
                            .setColor(data.color)
                            .setTitle(data.title + ' ' + i + '/' + data.chunks.length)
                            .setFooter('Always available from Statbot', 'https://i.imgur.com/fkyfEeA.png')
                            .setTimestamp();
                        if (chunk && chunk.length > 0) {
                            for (const field of chunk) {
                                embed.addField(field.name, field.data, true);
                            }
                        }
                        if (i < data.chunks.length) {
                            channel.send(embed)
                        } else {
                            channel.send(embed)
                        }
                    }
                } else {
                    const embed = new MessageEmbed()
                        .setColor(data.color)
                        .setTitle(data.title)
                        .setFooter('Always available from Statbot', 'https://i.imgur.com/fkyfEeA.png')
                        .setTimestamp();
                    if (data.fields) {
                        for (const field of data.fields) {
                            embed.addField(field.name, field.data, true);
                        }
                    }
                    channel.send(embed)
                }
            }).catch(e => {
                return console.error('Error: ' + e);
            });
        }
        setInterval(function () {
            for (row in arr) {
                let channel = client.channels.cache.get(arr[row][0]);
                TopTarget(arr[row][1], 9999, power, sort).then(data => {
                    if (data.chunks && data.chunks.length > 0) {
                        let i = 0;
                        for (const chunk of data.chunks) {
                            i++;
                            const embed = new MessageEmbed()
                                .setColor(data.color)
                                .setTitle(data.title + ' ' + i + '/' + data.chunks.length)
                                .setFooter('Always available from Statbot', 'https://i.imgur.com/fkyfEeA.png')
                                .setTimestamp();
                            if (chunk && chunk.length > 0) {
                                for (const field of chunk) {
                                    embed.addField(field.name, field.data, true);
                                }
                            }
                            if (i < data.chunks.length) {
                                channel.send(embed)
                            } else {
                                channel.send(embed)
                            }
                        }
                    } else {
                        const embed = new MessageEmbed()
                            .setColor(data.color)
                            .setTitle(data.title)
                            .setFooter('Always available from Statbot', 'https://i.imgur.com/fkyfEeA.png')
                            .setTimestamp();
                        if (data.fields) {
                            for (const field of data.fields) {
                                embed.addField(field.name, field.data, true);
                            }
                        }
                        channel.send(embed)
                    }
                }).catch(e => {
                    return console.error('Error: ' + e);
                });
            }
        }, 7200000);
        console.log('Succes: Autotargets started')
    } catch (err) {
        console.error(err);
    }
}

// ################
// ### Outdated ###
// ################

// add new team - deprecated
//async function modifyKeysSheet(val, client = googclient) {
//    const gsapi = google.sheets({ version: 'v4', auth: client }),
//        opt = {
//            spreadsheetId: keys.spreadsheet_id,
//            range: `data_keys!A2:A`,
//            valueInputOption: 'USER_ENTERED',
//            insertDataOption: 'INSERT_ROWS',
//            resource: { values: [[val]] }
//        };
//
//    try {
//        gsapi.spreadsheets.values.append(opt, (err) => {
//            if (err) {
//                console.error(err);
//                return 'An error has occurred. Please check the log or try again.';
//            }
//            (async () => {
//                team_keys = await getData('keys');
//            })();
//            return `**${val}** has been added to teams.`;
//        });
//    } catch (err) {
//        console.error(err);
//        return 'Error has occurred';
//    };
//}

// delete team - deprecated
//async function deleteKey(val, index, client = googclient) {
//    const gsapi = google.sheets({ version: 'v4', auth: client }),
//        opt = {
//            spreadsheetId: keys.spreadsheet_id,
//            resource: {
//                "requests": [
//                    {
//                        "deleteDimension": {
//                            "range": {
//                                "sheetId": keys.data_keys_id,
//                                "dimension": "ROWS",
//                                "startIndex": index - 1,
//                                "endIndex": index,
//                            }
//                        }
//                    }
//                ]
//            }
//        };
//
//    try {
//        gsapi.spreadsheets.batchUpdate(opt, (err) => {
//            if (err) {
//                console.error(err);
//                return 'An error has occurred. Please check the log or try again.';
//            }
//            (async () => {
//                team_keys = await getData('keys');
//            })();
//            return `**${val}** has been removed from teams.`;
//        });
//    } catch (err) {
//        console.error(err);
//        return 'Error deleting a key has occurred';
//    };
//}

// Add extra team to Gsheet - deprecated
//async function addKey(arg) {
//    try {
//        let data = await getData('keys');
//        let exists = false;
//
//        for (i in data) {
//            if (data[i][0].toLowerCase() == arg) {
//                exists = true;
//                break;
//            }
//        }
//
//        if (exists) {
//            return `Team already exists.`;
//        }
//
//        modifyKeysSheet(arg);
//        return `**${arg}** added.`;
//    } catch (err) {
//        console.error(err);
//    }
//}

// Delete team - deprecated
//async function getDel(arg) {
//    try {
//        const data = await getData('keys');
//        const match = checkKey(arg);
//
//        if (match.found === false) {
//            return `**${arg}** was not found in keys.`;
//        }
//
//        const index = tools.getSheetRowIndex(arg, data);
//        return deleteKey(arg, index);
//    } catch (err) {
//        console.error(err);
//    }
//}

// Find add to delete
//async function getDelAdd(atkarg, defarg, atkval, defval) {
//   try {
//       const data = await getData('store');
//       for (i in data) {
//          if (data[i][0] == atkarg && data[i][1] == defarg && data[i][2] == atkval && data[i][3] == defval) {
//              return { type: 'true', msg: `record found. Continue to delete **${atkarg} ${defarg} ${atkval} ${defval}**? \nReply with *'yes'* or *'no'*`};
//         } else {
//             return { type: 'error', msg: `no records found.` };
//         }
//     }
//  } catch (err) {
//      console.error(err);
//  }
//}

// Delete add
async function delAdd(atkarg, defarg, atkval, defval) {
    const data = await getData('store');
    return new Promise(resolve => {
        try {
            let index = tools.getStoreSheetRowIndex(atkarg, defarg, atkval, defval, data);
            if (index == '0' || index == 'undefined' || index == [] || index == '' || index == null) {
                resolve('no records found.');
            } else {
                deleteStoreRecord(atkarg, defarg, atkval, defval, index).then(msg => {
                    resolve(msg);
                });
            }            
        } catch (err) {
            console.error(err);
            resolve ('Could not delete the record, please check the log');
        }
    });
}

// Delete add in store
async function deleteStoreRecord(atkarg, defarg, atkval, defval, index, client = googclient) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const opt = {
            spreadsheetId: keys.spreadsheet_db,
            resource: {
                "requests": [
                    {
                        "deleteDimension": {
                            "range": {
                                "sheetId": "0",
                                "dimension": "ROWS",
                                "startIndex": index - 1,
                                "endIndex": index,
                            }
                        }
                    }
                ]
            }
        };

        return new Promise(resolve => {
            try {
                gsapi.spreadsheets.batchUpdate(opt, (err) => {
                    if (err) {
                        console.error(err);
                        resolve('could not access the database.');
                    } else {
                        console.log(`INFO: Removed Line (${index} - 1) containing ${atkarg} - ${atkval} vs ${defarg} - ${defval}`)
                        let reloadMsg = "Update after delete";
                       reloadResults(reloadMsg);
                        resolve(`this record was removed.\n**${atkarg}** - **${atkval}** vs **${defarg}** - **${defval}**`);
                    }
                });
            } catch (err) {
                console.error(err);
                resolve('I failed 😢, please try again later.');
            };
        });
    }

module.exports = {
    search,
    reloadResults,
    reloadInfo,
    loadGlobals,
    reloadDB,
    updateResultsSheet,
    TopCounter,
    TopTarget,
    //    addKey,
    //    getDel,
    checkKey,
    getData,
    getInfo,
    updateStore,
    modifyResultsSheet,
    //modifyKeysSheet,
    //deleteKey,
    getTargets,
    startCounterIntervals,
    startTargetIntervals,
    logUsage,
    getLineChart,
    getBarChart,
    delAdd,
    deleteStoreRecord,
    reloadAllianceInfo,
    subscribe,
    getSubscriptionRow,
    deleteSubscription
};