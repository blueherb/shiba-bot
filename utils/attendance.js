const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "../data/attendance.json");

// attendance.json 전체를 읽어 객체로 전환
function readData() {
  const raw = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(raw);
}

// 객체를 받아 attendance.json를 덮음
function writeData(data) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// readData와 writeData 함수를 외부에서 사용할 수 있도록 모듈로 내보냄
module.exports = { readData, writeData };