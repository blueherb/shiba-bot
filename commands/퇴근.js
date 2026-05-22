const { EmbedBuilder } = require("discord.js");
const { readData, writeData } = require("../utils/attendance");
const { calcRealWork } = require("../utils/worktime");
const { readConfig } = require("../utils/config");

module.exports = {
  name: "퇴근",

  // interaction : 명령어 입력 정보 (누가, 어느 서버에서)
  async execute(interaction) {
    const userID = interaction.user.id; // 명령어 입력한 사용자의 ID
    const today = new Date().toLocaleDateString("sv"); // 오늘 날짜 (YYYY-MM-DD)
    const now = new Date().toTimeString().slice(0, 5); // 현재 시간 (HH:MM)

    // 출근 기록이 없는 경우 퇴근 처리 불가
    const data = readData(); // attendance.json에서 데이터 읽기
    if (!data[userID]?.[today]?.clockIn) {
      await interaction.reply({ content: "출근 기록이 없습니다.", ephemeral: true });
      return;
    }

    // 이미 퇴근한 상태인 경우 중복 방지
    if (data[userID][today].clockOut) {
      await interaction.reply({ content: "이미 퇴근처리 되었습니다.", ephemeral: true });
      return;
    }

    const record = data[userID][today];

    // 휴식 중인 경우 퇴근 시각으로 자동 종료
    if (record.breaks) {
      for (const b of record.breaks) {
        if (!b.end) b.end = now;
      }
    }

    record.clockOut = now;
    writeData(data);
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setDescription(`⬜ **퇴근 완료!**\n🕐 \`${now}\` — 오늘 하루도 수고하셨습니다!`);
    await interaction.reply({ embeds: [embed] });

    // 할당량 달성 여부 확인 후 DM 발송
    const { dailyQuotaHours } = readConfig();
    if (calcRealWork(record) >= dailyQuotaHours * 60) {
      try {
        await interaction.user.send(`오늘 할당량 ${dailyQuotaHours}시간을 달성했습니다! 수고하셨습니다 🎉`);
      } catch {
        // DM 차단 시 무시
      }
    }
  },
};
