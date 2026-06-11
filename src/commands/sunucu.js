const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sunucu')
    .setDescription('Sunucu hakkında bilgi verir'),

  async execute(interaction) {
    const guild = interaction.guild;
    await guild.members.fetch();

    const totalMembers = guild.memberCount;
    const onlineMembers = guild.members.cache.filter(m => m.presence?.status !== 'offline').size;
    const botCount = guild.members.cache.filter(m => m.user.bot).size;
    const channelCount = guild.channels.cache.size;
    const roleCount = guild.roles.cache.size;

    const verificationLevels = {
      0: 'Yok',
      1: 'Düşük',
      2: 'Orta',
      3: 'Yüksek',
      4: 'Çok Yüksek',
    };

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`📊 ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: '🆔 Sunucu ID', value: guild.id, inline: true },
        { name: '👑 Sahip', value: `<@${guild.ownerId}>`, inline: true },
        { name: '📅 Oluşturma', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '👥 Toplam Üye', value: `${totalMembers}`, inline: true },
        { name: '🟢 Çevrimiçi', value: `${onlineMembers}`, inline: true },
        { name: '🤖 Bot', value: `${botCount}`, inline: true },
        { name: '💬 Kanallar', value: `${channelCount}`, inline: true },
        { name: '🎭 Roller', value: `${roleCount}`, inline: true },
        { name: '🔒 Doğrulama', value: verificationLevels[guild.verificationLevel] || 'Bilinmiyor', inline: true },
      )
      .setFooter({ text: 'Silvera Help' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
