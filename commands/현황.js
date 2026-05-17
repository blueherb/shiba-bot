const { EmbedBuilder } = require("discord.js");
const { readData } = require("../utils/attendance");
const { workSummaryLine } = require("../utils/worktime");

module.exports = {
  name: "현황",

  async execute(interaction) {
    const today = new Date().toLocaleDateString("sv"); // 오늘 날짜 (YYYY-MM-DD)
    const data = readData(); // attendance.json에서 데이터 읽기

    //  오늘 날짜 기록이 있는 유저들만 필터링
    const todayEntries = Object.entries(data).filter(
      ([, records]) => records[today]?.clockIn,
    );

    if (todayEntries.length === 0) {
      await interaction.reply({ content: "오늘 출근한 사람이 없습니다.", ephemeral: true });
      return;
    }

    const lines = todayEntries.map(([userID, records]) => {
      const record = records[today];
      const onBreak = record.breaks?.some((b) => !b.end);
      const statusEmoji = record.clockOut ? "⬜" : (onBreak ? "🟡" : "🟢");
      const statusText = record.clockOut
        ? `\`${record.clockOut}\` 퇴근`
        : (onBreak ? "휴식 중" : "근무 중");
      return `${statusEmoji} <@${userID}>\n　🕐 \`${record.clockIn}\` 출근 → ${statusText}\n　${workSummaryLine(record)}`;
    });

    const embed = new EmbedBuilder()
      .setTitle(`📊${today} 오늘의 근태 현황`)
      .setDescription(lines.join("\n"))
      .setColor(0x57f287); // Discord 그린

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
