// 자정 퇴근 스케줄러
const cron = require("node-cron");
const { readData, writeData } = require("./attendance");

function startScheduler(client) {
  cron.schedule("50 23 * * *", async () => {
    const today = new Date().toLocaleDateString("sv");
    const data = readData();
    let changed = false;

    for (const userID of Object.keys(data)) {
      const record = data[userID][today];
      if (!record?.clockIn || record.clockOut) continue;

      if (record.breaks) {
        for (const b of record.breaks) {
          if (!b.end) b.end = "23:50";
        }
      }

      record.clockOut = "23:50";
      changed = true;
      console.log(`[스케줄러] ${userID} 자동 퇴근 처리 (${today})`);

      try {
        const user = await client.users.fetch(userID);
        await user.send(`오늘(${today}) 퇴근 처리가 되지 않아 23:50로 자동 퇴근 처리되었습니다.`);
      } catch {
        console.log(`[스케줄러] ${userID} DM 전송 실패`);
      }
    }

    if (changed) writeData(data);
  });

  console.log("자정 퇴근 스케줄러 시작됨");
}

module.exports = { startScheduler };
