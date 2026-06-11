const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.warn(`⚠️ Komut bulunamadı: ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`❌ Komut hatası [${interaction.commandName}]:`, error);

      const errorEmbed = new EmbedBuilder()
        .setColor(0xff4757)
        .setTitle('❌ Bir Hata Oluştu')
        .setDescription('Bu komutu çalıştırırken beklenmedik bir hata oluştu.')
        .setFooter({ text: 'Silvera Help' })
        .setTimestamp();

      const replyOptions = { embeds: [errorEmbed], ephemeral: true };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(replyOptions).catch(() => {});
      } else {
        await interaction.reply(replyOptions).catch(() => {});
      }
    }
  },
};
