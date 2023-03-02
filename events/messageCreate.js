const fs = require("fs");
const path = require("path");
const rootPath = path.join(__dirname, "..");
const { EmbedBuilder } = require("discord.js");
const { extractNumber } = require("kor-to-number");

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
			let isRound = message.content.startsWith("[ROUND]");
			let calculateMsg = message.content
				.replaceAll(/zero|ゼロ/gi, "0")
				.replaceAll(/one|一|Ⅰ/gi, "1")
				.replaceAll(/two|ニ|Ⅱ/gi, "2")
				.replaceAll(/three|三|Ⅲ/gi, "3")
				.replaceAll(/four|四|Ⅳ/gi, "4")
				.replaceAll(/five|五|Ⅴ/gi, "5")
				.replaceAll(/six|六|Ⅵ/gi, "6")
				.replaceAll(/seven|七|Ⅶ/gi, "7")
				.replaceAll(/eight|八|Ⅷ/gi, "8")
				.replaceAll(/nine|九|Ⅸ/gi, "9")

				.replaceAll(/더하기|plus|足し算|たす/gi, "+")
				.replaceAll(/빼기|마이너스|minus|引き算|ひく/gi, "-")
				.replaceAll(/곱하기|times|掛け算|かける/gi, "*")
				.replaceAll(/나누기|divide|割り算|わる/gi, "/")
				.replaceAll(/제곱|pow|二乗|にじょう/gi, "**");
			calculateMsg = extractNumber(calculateMsg).replace(/[^-()\d/*+^.]/g, "");
			const evaledMessage = eval(calculateMsg);
			const calculateNumber = Number(isRound ? Math.round(evaledMessage) : evaledMessage);

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
