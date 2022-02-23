const { Command } = require('discord.js-commando');
const keys = require('../../credentials.json');
const functions = require('../../functions');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

module.exports = class UpdateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lifelinechart',
            aliases: ['llch', 'lifelinegraph', 'llgr', 'chrono'],
            group: 'counter',
            memberName: 'lifelinechart',
			description: 'This command makes a chronological linechart for all data on a matchup',
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
                    key: 'sort',
                    prompt: 'Sort on values?',
                    type: 'string',
                    default: 'false'
                }
			],
        });
    }

    run(message, { team, team2, sort}) {
		if (message.guild === null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
		}
		if (team2.indexOf(' ') < 0) {
            if (message.channel.id != keys.matchup_channel) {
				functions.getLineChart(team.toLowerCase(), team2.toLowerCase(), sort).then(data => {
					if (data.type == 'true') {
							
						const width = 1000;
						const height = 1000;
						const chartCallback = (ChartJS) => {
					
							// Global config example: https://www.chartjs.org/docs/latest/configuration/
							ChartJS.defaults.elements.bar.borderWidth = 2;
							// Global plugin example: https://www.chartjs.org/docs/latest/developers/plugins.html
							ChartJS.register({
								// plugin implementation
							});
							// New chart type example: https://www.chartjs.org/docs/latest/developers/charts.html
							//ChartJS.controllers.MyType = ChartJS.DatasetController.extend({
									// chart implementation
							//	});
							};
						const purpleCh = [];
						const whiteCh = [];
						const redCh = [];
						for (row in data.data) {
							purpleCh.push('rgba(102, 102, 204, 1)');
							whiteCh.push('rgba(255, 255, 255, 1)');
							redCh.push('rgba(255, 51, 51, 1)');
						}
						const chartJSNodeCanvas = new ChartJSNodeCanvas({width, height, chartCallback});
						(async () => {
							const configuration = {
								type: 'line',
								data: {
									labels: data.labels,
									datasets: [{
										fill: false, //no fill
										label: '% punch up/down of each record',
										data: data.data,
										borderColor: [
											'rgba(102, 102, 204, 1)' //purple
										],
										borderWidth: 4
										},
										{
										fill: false, //no fill
										label: `Average ${data.dataAverage[0]}%`,
										data: data.dataAverage,
										borderColor: [
											'rgba(255, 51, 51, 1)' //red
										],
										borderWidth: 4
										},
										{
										fill: false, //no fill
										label: '0 reference line',
										data: data.dataZero,
										borderColor: [
											'rgba(255, 255, 255, 1)' //white
										],
										borderWidth: 2,	
										borderDash: [10, 10]
										}]
								},
								options: {
									scales: {
										yAxes: [{
											ticks: {
												beginAtZero: true,
												callback: (value) => value
											}
										}]
									}
								}
							};
							const image = await chartJSNodeCanvas.renderToBuffer(configuration);
							return message.say(data.msg, {
								files: [image]
							});
						})().catch(err => console.error(err));
					} else {
                        return message.say(data.msg);
                    }	
				}).catch(e => {
					console.error('Error: ' + e);
				});
			} else {
                return message.say(`Wrong channel. Please use <#${keys.spam_channel}>.`);
            }
        } else {
            return message.say(`Too many arguments given for this command`);
        }
    }
};