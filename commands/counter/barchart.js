const { Command } = require('discord.js-commando');
const keys = require('../../credentials.json');
const functions = require('../../functions');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

module.exports = class UpdateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'barchart',
            aliases: ['bch', 'bargraph', 'bgr'],
            group: 'counter',
            memberName: 'barchart',
			description: 'This command makes a barchart on a certain matchup',
			args: [
                {
                    key: 'team',
                    prompt: 'input the first team (attacker)',
                    type: 'string',
                },
                {
                    key: 'team2',
                    prompt: 'input the second team (defender)',
                    type: 'string',
				}
			],
        });
    }

    run(message, { team, team2}) {
		if (message.guild === null) {
            functions.logUsage(message.author.tag, 'DM', message.content);
        } else {
            functions.logUsage(message.author.tag, message.guild.name, message.content);
		}
		if (team2.indexOf(' ') < 0) {
            if (message.channel.id != keys.matchup_channel) {
				functions.getBarChart(team.toLowerCase(), team2.toLowerCase()).then(data => {
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
							//ChartJS.controllers.MyType = ChartJS.controllers.bar.extend({
									// chart implementation
							//	});
							};
						const barAverage = [];
						for (row in data.data) {
							barAverage.push(data.dataAverage[0]);
						}
						const chartJSNodeCanvas = new ChartJSNodeCanvas({width, height, chartCallback});
						(async () => {
							const configuration = {
								type: 'bar',
								data: {
									labels: data.labels,
									datasets: [
										{
										label: `Average ${data.dataAverage[0]}%`,
										data: barAverage,
										borderColor: [
											//'rgba(255, 255, 255, 1)' //white
											'rgba(255, 51, 51, 1)', //red
											'rgba(255, 51, 51, 1)', //red
											'rgba(255, 51, 51, 1)', //red
										],
										pointBorderColor: [
											//'rgba(255, 255, 255, 1)' //white
											'rgba(255, 51, 51, 1)', //red
											'rgba(255, 51, 51, 1)', //red
											'rgba(255, 51, 51, 1)', //red
										],
										type: 'line',
										borderWidth: 4,
										//order: 1,
										pointStyle: 'crossRot',
										pointBorderWidth: 20,
										color: '#FFFFFF'
										},
										{
										label: 'Matchup results',
										data: data.data,
										borderColor: [
											'rgba(102, 102, 204, 0.5)', //purple
											//'rgba(255, 51, 51, 0.5)', //red
											'rgba(255 ,255 ,51 , 0.5)', //yellow
											'rgba(102, 204, 51, 0.5)' //green
										],
										backgroundColor: [
											'rgba(102, 102, 204, 1)', //purple
											//'rgba(255, 51, 51, 0.5)', //red
											'rgba(255 ,255 ,51 , 1)', //yellow
											'rgba(102, 204, 51, 1)' //green
										],
										borderWidth: 1,
										color: '#FFFFFF'
										//order: 2
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