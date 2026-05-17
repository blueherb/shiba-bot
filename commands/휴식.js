const { EmbedBuilder } = require("discord.js");
const { readData, writeData } = require("../utils/attendance");

module.exports = {
  name: "휴식",

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const userID = interaction.user.id;
    const today = new Date().toLocaleDateString("sv");
    const now = new Date().toTimeString().slice(0, 5);

    const data = readData();

    if (!data[userID]?.[today]?.clockIn) {
      await interaction.reply({ content: "출근 기록이 없습니다.", ephemeral: true });
      return;
    }

    const record = data[userID][today];
    if (!record.breaks) record.breaks = [];

    if (sub === "시작") {
      if (record.breaks.some((b) => !b.end)) {
        await interaction.reply({ content: "이미 휴식 중입니다.", ephemeral: true });
        return;
      }
      record.breaks.push({ start: now });
      writeData(data);
      const startEmbed = new EmbedBuilder()
        .setColor(0xfee75c)
        .setDescription(`🟡 **휴식 시작!**\n🕐 \`${now}\` — 잠시 쉬어가세요~`);
      await interaction.reply({ embeds: [startEmbed] });

    } else if (sub === "종료") {
      const current = record.breaks.findLast((b) => !b.end);
      if (!current) {
        await interaction.reply({ content: "진행 중인 휴식이 없습니다.", ephemeral: true });
        return;
      }
      current.end = now;
      writeData(data);
      const endEmbed = new EmbedBuilder()
        .setColor(0x57f287)
        .setDescription(`🟢 **휴식 종료!**\n🕐 \`${now}\` — 다시 달려봐요!`);
      await interaction.reply({ embeds: [endEmbed] });
    }
  },
};
