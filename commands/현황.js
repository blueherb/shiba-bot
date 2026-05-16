const { EmbedBuilder } = require("discord.js");
const { readData } = require("../utils/attendance");

module.exports = {
  name: "현황",

  async execute(interaction) {
    const today = new Date().toISOString().slice(0, 10); // 오늘 날짜 (YYYY-MM-DD)
    const data = readData(); // attendance.json에서 데이터 읽기

    //  오늘 날짜 기록이 있는 유저들만 필터링
    const todayEntries = Object.entries(data).filter(
      ([, records]) => records[today]?.clockIn,
    );

    if (todayEntries.length === 0) {
      await interaction.reply("오늘 출근한 사람이 없습니다.");
      return;
    }

    const lines = todayEntries.map(([userID, records]) => {
      const record = records[today];
      const clockOut = record.clockOut ?? "근무 중";
      return `<@${userID}>: 출근 ${record.clockIn} / 퇴근 ${clockOut}`;
    });

    const embed = new EmbedBuilder()
      .setTitle(`📊${today} 오늘의 근태 현황`)
      .setDescription(lines.join("\n"))
      .setColor(0x57f287); // Discord 그린

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
