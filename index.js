const { CommandoClient } = require('discord.js-commando');
const { token } = require('./disconfig.json');
const path = require('path');
const functions = require('./functions');
const cronjobs = require('./cronjobs');
const beta = 'false';
const client = new CommandoClient({
	commandPrefix: '?',
	owner: [],
	invite: 'https://discord.gg/cU3xpNj',
	unknownCommandResponse: false,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['info', 'Informational commands'],
		['counter', 'Counter commands'],
		['target', 'Target commands'],
		['data', 'Data commands'],
		['admin', 'Admin commands'],
		['mod', 'Moderator commands']
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
		commandState: false,
		eval: false,
		help: false
	})
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	console.log('Number of servers: ' + client.guilds.cache.size);
	client.user.setActivity('yours');
	functions.loadGlobals();
	if (beta === 'false') {
		client.commandPrefix = '!';
		setInterval(function (){
			let logText = 'Hourly results update';
			functions.reloadResults(logText);
			functions.reloadAllianceInfo(logText);
		}, 3600000);
		setInterval(function (){
			let logText = '6-hourly info update';
			functions.reloadInfo(logText);
		}, 21600000);
		setTimeout(function () {
			functions.startCounterIntervals(client);
			functions.startTargetIntervals(client);
		}, 720000);
		setTimeout(function () {
			cronjobs.warzones(client);
		}, 60000);
	};
});

client.on('error', console.error);

client.login(token);

process.on('uncaughtException', function (err) {
    console.error(err);
});
