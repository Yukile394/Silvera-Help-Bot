const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('temizle')
    .setDescription('Belirtilen sayıda mesajı siler')
    .addIntegerOption(opt =>
      opt.setName('adet')
        .setDescription('Silinecek mesaj sayısı (1-100)')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('adet');

    await interaction.deferReply({ ephemeral: true });

    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);

      const embed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle('🗑️ Mesajlar Silindi')
        .setDescription(`**${deleted.size}** mesaj başarıyla silindi.`)
        .setFooter({ text: `Silindi: ${interaction.user.tag} • Silvera Help` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      const embed = new EmbedBuilder()
        .setColor(0xe74c3c)
        .setTitle('❌ Hata')
        .setDescription('Mesajlar silinirken hata oluştu. (14 günden eski mesajlar silinemez)')
        .setFooter({ text: 'Silvera Help' });

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
