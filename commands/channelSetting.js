require("dotenv").config();
const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const fs = require("fs");
const path = require("path");
const rootPath = path.join(__dirname, "..");

const configPath = path.join(rootPath, "data", "channel.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("채널설정")
		.setDescription("카운트 할 채널을 설정합니다")
		.addChannelOption(option => option.setName("채널").setDescription("채널을 선택해주세요").setRequired(true)),

	async execute(interaction) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || !interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
			return interaction.reply("서버 관리자나 채널 관리 권한이 필요합니다", { ephemeral: true });

		const channel = interaction.options.getChannel("채널");
		const guildId = interaction.guild.id;
		const channelId = channel.id;

		const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
		config[guildId] = { channelid: channelId, count: 0 };

		fs.writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");

		await interaction.reply(`카운트 채널을 ${channel}로 설정했습니다`);
	},
};
