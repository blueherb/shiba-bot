// 자정 퇴근 스케줄러
const cron = require("node-cron");
const { readData, writeData } = require("./attendance");
const { readConfig } = require("./config");

function startScheduler(client) {
  const { autoClockOutTime } = readConfig();
  const [h, m] = autoClockOutTime.split(":").map(Number);
  const cronExpr = `${m} ${h} * * *`;

  cron.schedule(cronExpr, async () => {
    const { autoClockOutTime: clockOutTime } = readConfig();
    const today = new Date().toLocaleDateString("sv");
    const data = readData();
    let changed = false;

    for (const userID of Object.keys(data)) {
      const record = data[userID][today];
      if (!record?.clockIn || record.clockOut) continue;

      if (record.breaks) {
        for (const b of record.breaks) {
          if (!b.end) b.end = clockOutTime;
        }
      }

      record.clockOut = clockOutTime;
      changed = true;
      console.log(`[스케줄러] ${userID} 자동 퇴근 처리 (${today})`);

      try {
        const user = await client.users.fetch(userID);
        await user.send(`퇴근을 잊으신 것 같아서 ${clockOutTime}에 처리해뒀어요 시바 🐾`);
      } catch {
        console.log(`[스케줄러] ${userID} DM 전송 실패`);
      }
    }

    if (changed) writeData(data);
  });

  console.log(`자정 퇴근 스케줄러 시작됨 (${autoClockOutTime})`);
}

module.exports = { startScheduler };
