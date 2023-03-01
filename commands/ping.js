require("dotenv").config();
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("ping").setDescription("핑-퐁!"),

	async execute(interaction) {
		await interaction.reply("Pong!");
	},
};
