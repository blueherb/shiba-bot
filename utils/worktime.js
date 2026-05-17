const { readConfig } = require("./config");

// "HH:MM" → 분
function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// 분 → "Xh Ym"
function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// 텍스트 프로그레스바 (10칸)
function progressBar(current, total, length = 10) {
  const filled = Math.min(Math.round((current / total) * length), length);
  return "█".repeat(filled) + "░".repeat(length - filled);
}

// 실근무 시간(분) 계산 — clockOut 없으면 현재 시각 기준
function calcRealWork(record) {
  if (!record?.clockIn) return 0;
  const end = record.clockOut ?? new Date().toTimeString().slice(0, 5);
  const elapsed = toMinutes(end) - toMinutes(record.clockIn);
  const breakMins = (record.breaks ?? []).reduce((sum, b) => {
    if (!b.end) return sum;
    return sum + toMinutes(b.end) - toMinutes(b.start);
  }, 0);
  return Math.max(0, elapsed - breakMins);
}

// 실근무 + 프로그레스바 한 줄 반환
function workSummaryLine(record) {
  const { dailyQuotaHours } = readConfig();
  const quotaMins = dailyQuotaHours * 60;
  const realMins = calcRealWork(record);
  const bar = progressBar(realMins, quotaMins);

  let quota;
  if (realMins >= quotaMins) {
    const overtimeMins = realMins - quotaMins;
    const overtimeStr = overtimeMins > 0 ? ` +${formatDuration(overtimeMins)}` : "";
    quota = `${bar} ✅${overtimeStr}`;
  } else {
    const pct = Math.round((realMins / quotaMins) * 100);
    quota = `${bar} ${pct}%`;
  }

  return `⏱ \`${formatDuration(realMins)}\` / ${dailyQuotaHours}h  ${quota}`;
}

module.exports = { calcRealWork, workSummaryLine };
