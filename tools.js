function Comparator(a,b) {
    var x = parseInt(a[1], 10);
    var y = parseInt(b[1], 10);

    if (x === 0 && y === 0)
        return 1 / x - 1 / y || 0;
    else return y - x;
}

function storeSearch(arr, args, item) {
    let res = [];

    for (i in arr) {
        if (arr[i][0] == args[0] && arr[i][1] == args[1])
            if(item == 'arr')
                res.push(arr[i]);
            else
                return Number(i) + 2;
    }
    return res;
}

function getSheetRowIndex(target, sheet) {
    let res = '';
    for(row in sheet) {
        if(target == sheet[row][0]) {
            res = Number(row);
            break;
        }
    }
    return res + 2;
}

function getWarzoneSheetRowIndex(target, target2, sheet) {
    let res = '';
    for(row in sheet) {
        if(target == sheet[row][2] && target2 == sheet[row][4]) {
            res = Number(row);
            break;
        }
    }
    if (res != 0) {
        return res + 2;
    } else {
        return 0;
    }
}

function getStoreSheetRowIndex(target1, target2, target3, target4, sheet) {
    let res = '';
    for(row in sheet) {
        if(target1 == sheet[row][0] && target2 == sheet[row][1] && target3 == sheet[row][2] && target4 == sheet[row][3]) {
            res = Number(row);
            break;
        }
    }
    if (res != 0) {
        return res + 2;
    } else {
        return 0;
    }
}

function getSheetRange(target) {
    let res = '';

    switch(target) {
        case 'store':
            res = 'data_store!A2:H';
            break; 
        case 'results':
            res = 'data_results!A2:H';                
            break;
        case 'keys':
            res = 'info_keys!A2:N';
            break;
		case 'commands':
            res = 'info_commands!A2:B';
            break;
		case 'stats':
            res = 'data_stats!A1:D';
            break;
		case 'autocounters':
            res = 'automation_counters!A2:B';
            break;
        case 'autotargets':
            res = 'automation_targets!A2:B';
            break;
		case 'notes':
            res = 'info_notes!A2:G';
            break;
		case 'external':
            res = 'external_adds!A2:F';
            break;
        case 'warzone':
            res = 'alliance_warzones!A2:G';
            break;
        case 'roomlist':
            res = 'info_rooms!A2:B';
            break;
        case 'rooms':
            res = 'info_confirmed!A2:J';
            break;
    }

    return res;
}

function getFullKeyName(target, keys) {
    let result = '';

    for(i in keys) {
        if(keys[i][0] == target || keys[i][2].toLowerCase() == target || keys[i][3] == target || keys[i][4] == target || keys[i][5] == target) {
            result = keys[i][2];
            break;
        }            
    }

    return result;
}

module.exports = {Comparator, storeSearch, getSheetRowIndex, getSheetRange, getFullKeyName, getStoreSheetRowIndex, getWarzoneSheetRowIndex};