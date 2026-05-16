const { EmbedBuilder } = require("@discordjs/builders");
const { readData, writeData } = require("../utils/attendance");

module.exports = {
  name: "기록",

  async execute(interaction) {
    const userID = interaction.user.id; // 명령어 입력한 사용자의 ID
    const username = interaction.user.displayName; // 명령어 입력한 사용자의 이름
    const data = readData(); // attendance.json에서 데이터 읽기

    // 해당 유저의 기록이 아예 없는 경우
    if (!data[userID]) {
      await interaction.reply("유저의 기록이 없습니다.");
      return;
    }

    const records = data[userID]; // 해당 유저의 날짜별 기록

    // 날짜 내림차순 정렬 후 최근 7일 기록 표시
    const lines = Object.entries(records)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 7)
      .map(([date, record]) => {
        const clockOut = record.clockOut ?? "미등록";
        return `**${date}**\n출근 ${record.clockIn}, 퇴근 ${clockOut}`;
      });

    // Discord Embed 메시지 형식 응답
    const embed = new EmbedBuilder()
      .setTitle(`📋 ${username}님의 근퇴 기록`)
      .setDescription(lines.join("\n\n"))
      .setColor(0x5865f2); // Discord 블루

    await interaction.reply({ embeds: [embed] });
  },
};
