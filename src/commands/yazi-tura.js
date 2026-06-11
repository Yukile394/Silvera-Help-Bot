const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yazi-tura')
    .setDescription('Yazı veya tura atar'),

  async execute(interaction) {
    const result = Math.random() < 0.5;
    const text = result ? '🟡 **TURA**' : '⚪ **YAZI**';

    const embed = new EmbedBuilder()
      .setColor(result ? 0xf1c40f : 0x95a5a6)
      .setTitle('🪙 Yazı Tura!')
      .setDescription(`${interaction.user.username} parayı havaya attı...\n\n${text}`)
      .setFooter({ text: 'Silvera Help' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
