const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "../data/config.json");

const DEFAULTS = {
  dailyQuotaHours: 5,
  autoClockOutTime: "23:50",
};

function readConfig() {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
    fs.writeFileSync(FILE_PATH, JSON.stringify(DEFAULTS, null, 2), "utf-8");
    return { ...DEFAULTS };
  }
}

module.exports = { readConfig };
