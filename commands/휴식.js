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
      await interaction.reply({ content: `휴식 시작: ${now}`, ephemeral: true });

    } else if (sub === "종료") {
      const current = record.breaks.findLast((b) => !b.end);
      if (!current) {
        await interaction.reply({ content: "진행 중인 휴식이 없습니다.", ephemeral: true });
        return;
      }
      current.end = now;
      writeData(data);
      await interaction.reply({ content: `휴식 종료: ${now}`, ephemeral: true });
    }
  },
};
