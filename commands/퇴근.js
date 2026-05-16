const { readData, writeData } = require("../utils/attendance");

module.exports = {
  name: "퇴근",

  // interaction : 명령어 입력 정보 (누가, 어느 서버에서)
  async execute(interaction) {
    const userID = interaction.user.id; // 명령어 입력한 사용자의 ID
    const today = new Date().toISOString().slice(0, 10); // 오늘 날짜 (YYYY-MM-DD)
    const now = new Date().toTimeString().slice(0, 5); // 현재 시간 (HH:MM)

    // 출근 기록이 없는 경우 퇴근 처리 불가
    const data = readData(); // attendance.json에서 데이터 읽기
    if (!data[userID]?.[today]?.clockIn) {
      await interaction.reply("출근 기록이 없습니다.");
      return;
    }

    // 이미 퇴근한 상태인 경우 중복 방지
    if (data[userID][today].clockOut) {
      await interaction.reply("이미 퇴근처리 되었습니다.");
      return;
    }

    // 퇴근 시간 기록
    data[userID][today].clockOut = now;
    writeData(data); // attendance.json에 데이터 저장
    await interaction.reply(`퇴근 완료: ${now}`);
  },
};
