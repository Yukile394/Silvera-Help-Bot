const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Bot gecikme süresini gösterir'),

  async execute(interaction, client) {
    const sent = await interaction.reply({ content: '🏓 Ölçülüyor...', fetchReply: true });
    const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
    const wsPing = client.ws.ping;

    const color = wsPing < 100 ? 0x2ecc71 : wsPing < 200 ? 0xf39c12 : 0xe74c3c;
    const emoji = wsPing < 100 ? '🟢' : wsPing < 200 ? '🟡' : '🔴';

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: '📡 WebSocket Ping', value: `${emoji} **${wsPing}ms**`, inline: true },
        { name: '↩️ Roundtrip', value: `⏱️ **${roundtrip}ms**`, inline: true },
      )
      .setFooter({ text: 'Silvera Help' })
      .setTimestamp();

    await interaction.editReply({ content: '', embeds: [embed] });
  },
};
