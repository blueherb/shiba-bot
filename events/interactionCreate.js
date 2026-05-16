module.exports = {
  name: "interactionCreate",

  // client: 봇 전체 객체 / interaction: 입력된 명령어 정보가 담긴 객체
  async execute(client, interaction) {
    if (!interaction.isChatInputCommand()) return; // 슬래시 명령어가 아니면 무시

    // commands 컬렉션에서 명령어 이름으로 핸들러를 찾아 실행
    const command = client.commands.get(interaction.commandName);
    if (!command) return; // 명령어 핸들러가 없으면 무시

    await command.execute(interaction); // 명령어 핸들러 실행
  },
};
