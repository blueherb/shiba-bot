const { readData, writeData } = require("../utils/attendance");

module.exports = {
  name: "출근",

  // interaction : 명령어 입력 정보 (누가, 어느 서버에서)
  async execute(interaction) {
    const userID = interaction.user.id; // 명령어 입력한 사용자의 ID
    const today = new Date().toISOString().slice(0, 10); // 오늘 날짜 (YYYY-MM-DD)
    const now = new Date().toTimeString().slice(0, 5); // 현재 시간 (HH:MM)

    // 이미 출근한 상태인 경우 중복 방지
    const data = readData(); // attendance.json에서 데이터 읽기
    if (data[userID]?.[today]?.clockIn) {
      await interaction.reply("이미 출근처리 되었습니다.");
      return;
    }

    // 유저 데이터가 없다면 초기화
    if (!data[userID]) data[userID] = {};
    data[userID][today] = { clockIn: now, clockOut: null }; // 출근 시간 기록
    writeData(data); // attendance.json에 데이터 저장
    await interaction.reply(`출근 완료: ${now}`);
  },
};
