// import the SlashCommandBuilder class from the builders library
const { SlashCommandBuilder } = require('@discordjs/builders');

// create an object to export
module.exports = {
	// add a data property set to a new SlashCommandBuilder
	data: new SlashCommandBuilder()
		// give the command a name
		.setName('ping')
		// and a description
		.setDescription('Replies with pong!'),
        
	// add the execute method, taking client and interaction at parameters
	async execute(client, interaction) {
		// reply to the interaction with content "Pong!"
        await interaction.reply({ content: "Pong!" });
	},
};