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

				await message.react("✅");

				// if (timeout) clearTimeout(timeout);
				// timeout = setTimeout(() => message.channel.send(String(++lastCount)).catch(console.error), 30000);
			} else {
				await message
					.reply(
						`💥  ${message.author} Messed up!\n**✏  ${lastCount + 1}을(를)** 입력했어야 합니다! (계산된 결과: ${calculateNumber})\n🔄  카운트는 1부터 다시 시작됩니다`
					)
					.catch(console.error);
				lastCount = 0;

				await message.react("❌");

				// if (timeout) clearTimeout(timeout);
			}

			config[guildId] = { channelid: channelId, count: lastCount };
			fs.writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");
		}
	},
};
