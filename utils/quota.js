// quota.js — 근무 중 할당량 달성 실시간 감지 및 DM 알림
const { readData, writeData } = require("./attendance");
const { readConfig } = require("./config");
const { calcRealWork } = require("./worktime");

async function checkQuota(client) {
  const { dailyQuotaHours } = readConfig();
  const quotaMins = dailyQuotaHours * 60;
  const today = new Date().toLocaleDateString("sv");
  const data = readData();
  let changed = false;

  for (const [userID, records] of Object.entries(data)) {
    const record = records[today];
    // 출근 중 + 미퇴근 + 아직 알림 안 보낸 경우만 체크
    if (!record?.clockIn || record.clockOut || record.quotaNotified) continue;

    if (calcRealWork(record) >= quotaMins) {
      record.quotaNotified = true;
      changed = true;
      try {
        const user = await client.users.fetch(userID);
        await user.send(`할당량 ${dailyQuotaHours}시간을 달성했습니다 시바 🐾`);
      } catch {
        // DM 차단 시 무시
      }
    }
  }

  if (changed) writeData(data);
}

module.exports = { checkQuota };
