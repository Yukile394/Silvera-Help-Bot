const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('zar')
    .setDescription('Zar atar')
    .addIntegerOption(opt =>
      opt.setName('yuzler')
        .setDescription('Zarın kaç yüzü olacak (varsayılan: 6)')
        .setMinValue(2)
        .setMaxValue(1000)
        .setRequired(false)
    ),

  async execute(interaction) {
    const sides = interaction.options.getInteger('yuzler') ?? 6;
    const result = Math.floor(Math.random() * sides) + 1;

    const embed = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle('🎲 Zar Atıldı!')
      .setDescription(`**${interaction.user.username}** d${sides} zar attı ve...`)
      .addFields({ name: '🎯 Sonuç', value: `**${result}** / ${sides}` })
      .setFooter({ text: 'Silvera Help' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
