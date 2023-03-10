const fs = require("fs");
const path = require("path");
const rootPath = path.join(__dirname, "..");
const { EmbedBuilder } = require("discord.js");

const configPath = path.join(rootPath, "data", "channel.json");

module.exports = {
	name: "messageCreate",
	async execute(message) {
		if (message.member.user.bot) return;

		const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
		const guildId = message.guild.id;
		const channelId = message.channel.id;

		const guildConfig = config[guildId];
		if (!guildConfig) return;

		if (guildConfig.channelid === channelId) {
			let lastCount = guildConfig.count;
			let calculateMsg = message.content;
			calculateMsg = calculateMsg.replace(/[^-()\d/*+^.]/g, "").replace("^", "**");
			const evaledMessage = eval(calculateMsg);
			const calculateNumber = Number(evaledMessage);

			if (calculateNumber === lastCount + 1) {
				lastCount++;

				await message.react("β");

				// if (timeout) clearTimeout(timeout);
				// timeout = setTimeout(() => message.channel.send(String(++lastCount)).catch(console.error), 30000);
			} else {
				await message
					.reply(
						`π₯  ${message.author} Messed up!\n**β  ${lastCount + 1}μ(λ₯Ό)** μλ ₯νμ΄μΌ ν©λλ€! (κ³μ°λ κ²°κ³Ό: ${calculateNumber})\nπ  μΉ΄μ΄νΈλ 1λΆν° λ€μ μμλ©λλ€`
					)
					.catch(console.error);
				lastCount = 0;

				await message.react("β");

				// if (timeout) clearTimeout(timeout);
			}

			config[guildId] = { channelid: channelId, count: lastCount };
			fs.writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");
		}
	},
};
