const { EmbedBuilder } = require("discord.js");
const { readData, writeData } = require("../utils/attendance");
const { calcRealWork } = require("../utils/worktime");
const { readConfig } = require("../utils/config");

// 분 → "Xh Ym" 또는 "Ym"
function fmtMins(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

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
      await interaction.reply({ content: "출근 기록이 없어요. 저도 못 봤어요 시바.", ephemeral: true });
      return;
    }

    // 이미 퇴근한 상태인 경우 중복 방지
    if (data[userID][today].clockOut) {
      await interaction.reply({ content: "이미 퇴근하셨어요. 시바가 기록해뒀어요.", ephemeral: true });
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
      .setDescription(`⬜ **퇴근 완료!**\n🕐 \`${now}\` — 오늘도 정말 수고하셨어요 시바 🐾`);
    await interaction.reply({ embeds: [embed] });

    // 근무 결산 DM 발송
    const { dailyQuotaHours } = readConfig();
    const quotaMins = dailyQuotaHours * 60;
    const realMins = calcRealWork(record);
    const pct = (realMins / quotaMins) * 100;
    const diff = realMins - quotaMins;

    let color, diffText, message;
    if (pct >= 120) {
      color = 0x57f287;
      diffText = `+${fmtMins(diff)} 초과 달성!`;
      message = "오늘 정말 불태우셨네요! 잠깐 쉬어가세요 시바 🐾";
    } else if (pct >= 100) {
      color = 0x57f287;
      diffText = diff > 0 ? `+${fmtMins(diff)} 초과 달성!` : "딱 맞게 달성!";
      message = "오늘도 완주! 시바도 같이 퇴근할게요 🐾";
    } else if (pct >= 80) {
      color = 0xfee75c;
      diffText = `-${fmtMins(Math.abs(diff))} 부족`;
      message = "아쉽게 조금 못 미쳤지만 충분히 잘 하셨어요 시바 🐾";
    } else if (pct >= 50) {
      color = 0xfee75c;
      diffText = `-${fmtMins(Math.abs(diff))} 부족`;
      message = "오늘은 절반 넘게 달리셨어요. 내일 다시 도전 시바 🐾";
    } else {
      color = 0xed4245;
      diffText = `-${fmtMins(Math.abs(diff))} 부족`;
      message = "오늘은 좀 쉬어가는 날이었군요. 괜찮아요 시바 🐾";
    }

    const filled = Math.min(Math.round((realMins / quotaMins) * 10), 10);
    const bar = "█".repeat(filled) + "░".repeat(10 - filled);

    const dmEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle("🏁 오늘의 근무 결산")
      .addFields(
        { name: "실 근무", value: fmtMins(realMins), inline: true },
        { name: "할당량", value: fmtMins(quotaMins), inline: true },
        { name: "​", value: `${bar}  ${diffText}` },
        { name: "​", value: message }
      );

    try {
      await interaction.user.send({ embeds: [dmEmbed] });
    } catch {
      // DM 차단 시 무시
    }
  },
};
