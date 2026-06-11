const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
    // Hoş geldin kanalını bul (ismi "genel" veya "hoş-geldiniz" olan)
    const welcomeChannel = member.guild.channels.cache.find(
      ch => ch.name === 'genel' || ch.name === 'hoş-geldiniz' || ch.name === 'welcome'
    );

    if (!welcomeChannel) return;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('🎉 Yeni Üye!')
      .setDescription(`**${member.user.username}** sunucumuza hoş geldi!\n\n📋 Kuralları okumayı unutma.\n🎮 Eğlenceli vakit geçirmeni dileriz!`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: '👤 Üye', value: `<@${member.id}>`, inline: true },
        { name: '📅 Hesap Oluşturma', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '👥 Toplam Üye', value: `${member.guild.memberCount}. üye`, inline: true },
      )
      .setFooter({ text: 'Silvera Help' })
      .setTimestamp();

    await welcomeChannel.send({ embeds: [embed] }).catch(() => {});
  },
};
