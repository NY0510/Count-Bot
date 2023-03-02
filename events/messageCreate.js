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
			let isRound = message.content.endsWith(".round()");
			let calculateMsg = message.content
				.replaceAll(/영|zero/gi, "0")
				.replaceAll(/일|하나|one/gi, "1")
				.replaceAll(/이|둘|two/gi, "2")
				.replaceAll(/삼|셋|three/gi, "3")
				.replaceAll(/사|넷|four/gi, "4")
				.replaceAll(/오|다섯|five/gi, "5")
				.replaceAll(/육|여섯|six/gi, "6")
				.replaceAll(/칠|일곱|seven/gi, "7")
				.replaceAll(/팔|여덟|eight/gi, "8")
				.replaceAll(/구|아홉|nine/gi, "9")
			
				.replaceAll(/더하기|plus/gi, "+")
				.replaceAll(/빼기|마이너스|minus/gi, "-")
				.replaceAll(/곱하기|times/gi, "*")
				.replaceAll(/나누기|divide/gi, "/")
				.replaceAll(/제곱|pow/gi, "^")
				.replace(/[^-()\d/*+^.]/g, "").replace("^", "**");
			const evaledMessage = eval(calculateMsg);
			const calculateNumber = isRound ? Math.round(Number(evaledMessage)) : Number(evaledMessage)
			

			if (calculateNumber === lastCount + 1) {
				lastCount++;

				await message.react("✅");

				// if (timeout) clearTimeout(timeout);
				// timeout = setTimeout(() => message.channel.send(String(++lastCount)).catch(console.error), 30000);
			} else {
				await message
					.reply(`💥  ${message.author} Messed up!\n**✏  ${lastCount + 1}을(를)** 입력했어야 합니다! (계산된 결과: ${evaledMessage})\n🔄  카운트는 1부터 다시 시작됩니다`)
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
