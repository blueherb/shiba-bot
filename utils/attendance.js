// attendance.js — 근태 기록 읽기/쓰기
const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "../data/attendance.json");

// 근태 기록 파일을 불러들여 객체로 반환한다.
function readData() {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    // 파일이 없거나 JSON 파싱에 실패하면 빈 객체를 반환한다.
    fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
    fs.writeFileSync(FILE_PATH, "{}", "utf-8");
    return {};
  }
}

// 근태 기록 객체를 JSON 문자열로 변환하여 파일에 저장한다.
function writeData(data) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}
// readData와 writeData 함수를 외부에서 사용할 수 있도록 모듈로 내보냄
module.exports = { readData, writeData };
