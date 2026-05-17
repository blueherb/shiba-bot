const { EmbedBuilder } = require("discord.js");
const { readData } = require("../utils/attendance");

module.exports = {
  name: "기록",

  async execute(interaction) {
    const days = interaction.options.getInteger("기간") ?? 7; // 조회할 일수 (기본값 7일)
    const targetUser = interaction.options.getUser("유저") ?? interaction.user; // 조회할 유저 (기본값 명령어 입력한 사용자)
    const userID = targetUser.id;
    const username = targetUser.displayName ?? targetUser.username; // 닉네임이 없으면 유저네임 사용
    const data = readData(); // attendance.json에서 데이터 읽기

    // 해당 유저의 기록이 아예 없는 경우
    if (!data[userID]) {
      await interaction.reply({ content: "유저의 기록이 없습니다.", ephemeral: true });
      return;
    }

    const records = data[userID]; // 해당 유저의 날짜별 기록

    // 날짜 내림차순 정렬 후 최근 days일 기록 표시
    const lines = Object.entries(records)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, days)
      .map(([date, record]) => {
        let line = `📅 **${date}**\n🟢 \`${record.clockIn}\` 출근　🔴 \`${record.clockOut ?? "미등록"}\` 퇴근`;

        if (record.breaks?.length > 0) {
          const breakList = record.breaks
            .map((b) => `\`${b.start}~${b.end ?? "진행 중"}\``)
            .join(", ");
          const totalMins = record.breaks.reduce((sum, b) => {
            if (!b.end) return sum;
            const [sh, sm] = b.start.split(":").map(Number);
            const [eh, em] = b.end.split(":").map(Number);
            return sum + (eh * 60 + em) - (sh * 60 + sm);
          }, 0);
          line += `\n☕ ${breakList}${totalMins > 0 ? ` (총 ${totalMins}분)` : ""}`;
        }

        return line;
      });

    const embed = new EmbedBuilder()
      .setTitle(`📋 ${username}님의 근태 기록 (최근 ${days}일)`)
      .setDescription(lines.join("\n\n"))
      .setColor(0x5865f2);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
