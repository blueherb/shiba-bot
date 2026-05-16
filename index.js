// 사용자 환경변수를 사용하기 위한 구문
require("dotenv").config();
// Discord.js 라이브러리에서 현재 코드에서 필요한 Client 클래스와 GatewayIntentBits 객체를 가져옴
const { Client, GatewayIntentBits } = require("discord.js");
// Client 객체를 생성, 봇이 서버에서 어떤 이벤트를 수신할지 설정 (여기서는 서버 관련 이벤트만 수신)
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

/**
 * Discord 연결 완료 시 1회 실행되는 핸들러.
 * 참조: client.user (로그인된 봇 객체)
 */
client.once("ready", () => {
  console.log(`로그인 완료: ${client.user.tag}`);
});

/**
 * 슬래시 명령어 입력마다 실행되는 핸들러.
 * 참조: process.env (없음), Discord 서버로부터 전달된 interaction 객체
 */
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return; // 슬래시 명령어가 아니면 무시

  // 명령어명이 "ping"인 경우, "Pong!"이라는 응답을 보냄
  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});

// process.env.DISCORD_TOKEN을 읽어 Discord에 로그인, 이후 이벤트 수신 시작
client.login(process.env.DISCORD_TOKEN);
