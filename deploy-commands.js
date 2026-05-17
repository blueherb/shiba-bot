// .env 파일에서 환경 변수 로드
// Discord.js 라이브러리에서 REST, Routes, SlashCommandBuilder 클래스 가져오기
require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

// 등록할 슬래시 명령어 목록
// setName: 명령어 이름, setDescription: Discord UI에 표시될 설명
const commands = [
  new SlashCommandBuilder()
    .setName("출근")
    .setDescription("출근 시간을 기록합니다")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("퇴근")
    .setDescription("퇴근 시간을 기록합니다")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("기록")
    .setDescription("근태 기록을 조회합니다(본인만 보임)")
    .addIntegerOption((option) =>
      option
        .setName("기간")
        .setDescription("조회할 일수 (기본값: 7)")
        .setRequired(false),
    )
    .addUserOption((option) =>
      option
        .setName("유저")
        .setDescription("조회할 유저 (기본값: 본인)")
        .setRequired(false),
    )
    .toJSON(),

  new SlashCommandBuilder()
    .setName("현황")
    .setDescription("오늘 출근한 사람들의 현황을 보여줍니다(본인만 보임)")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("휴식")
    .setDescription("휴식 시간을 기록합니다")
    .addSubcommand((sub) =>
      sub.setName("시작").setDescription("휴식을 시작합니다"),
    )
    .addSubcommand((sub) =>
      sub.setName("종료").setDescription("휴식을 종료합니다"),
    )
    .toJSON(),
];

// .env의 DISCORD_TOKEN으로 Discord REST API 클라이언트 생성
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// CLIENT_ID 서버(GUILD_ID)에 명령어 등록 → Discord에 PUT 요청
// 길드(서버) 등록은 즉시 반영, 전역 등록은 최대 1시간 소요
(async () => {
  console.log("슬래시 명령어 등록 중...");
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID,
    ),
    { body: commands },
  );
  console.log("등록 완료");
})();
