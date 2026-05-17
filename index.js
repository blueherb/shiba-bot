// 사용자 환경변수를 사용하기 위한 구문
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { startScheduler } = require("./utils/scheduler");
// Client 객체를 생성, 봇이 서버에서 어떤 이벤트를 수신할지 설정 (여기서는 서버 관련 이벤트만 수신)
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// 명령어를 이름으로 찾을 수 있는 컬렉션 객체
client.commands = new Collection();

// commands/ 폴더의 모든 .js 파일을 읽어 컬렉션에 등록
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// events/ 폴더의 모든 .js 파일을 읽어 이벤트 구독
const eventFiles = fs
  .readdirSync(path.join(__dirname, "events"))
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  // 이벤트 이름으로 구독시키기
  client.on(event.name, (...args) => event.execute(client, ...args));
}

client.once("ready", () => {
  console.log(`로그인 완료: ${client.user.tag}`);
  startScheduler(client);
});

// process.env.DISCORD_TOKEN을 읽어 Discord에 로그인, 이후 이벤트 수신 시작
client.login(process.env.DISCORD_TOKEN);
