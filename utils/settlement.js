// settlement.js — 퇴근 결산 DM 임베드 생성 및 발송
const { EmbedBuilder } = require("discord.js");
const { calcRealWork } = require("./worktime");

function fmtMins(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

async function sendSettlementDM(user, record, dailyQuotaHours) {
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
    await user.send({ embeds: [dmEmbed] });
  } catch {
    // DM 차단 시 무시
  }
}

module.exports = { sendSettlementDM };
