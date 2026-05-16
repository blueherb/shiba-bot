// 이 명령어의 이름과 실행될 함수를 모듈로 내보낼 수 있도록 함.
module.exports = {
  name: "ping",

  // interaction: 누가 어떤 명령어를 입력했는지 등의 정보가 담긴 객체
  async execute(interaction) {
    // interaction.reply: 명령어 입력한 사용자에게 응답을 보냄
    await interaction.reply("Pong!");
  },
};
