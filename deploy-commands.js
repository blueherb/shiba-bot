  // .env 파일에서 환경 변수 로드
  // Discord.js 라이브러리에서 REST, Routes, SlashCommandBuilder 클래스 가져오기
  require('dotenv').config();
  const { REST, Routes, SlashCommandBuilder } = require('discord.js');

  // 등록할 슬래시 명령어 목록
  // setName: 명령어 이름, setDescription: Discord UI에 표시될 설명
  const commands = [
    new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Pong으로 응답합니다')
      .toJSON(), // Discord API가 요구하는 JSON 형태로 변환
  ];

  // .env의 DISCORD_TOKEN으로 Discord REST API 클라이언트 생성
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);

  // CLIENT_ID 서버(GUILD_ID)에 명령어 등록 → Discord에 PUT 요청
  // 길드(서버) 등록은 즉시 반영, 전역 등록은 최대 1시간 소요
  (async () => {
    console.log('슬래시 명령어 등록 중...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('등록 완료');
  })();