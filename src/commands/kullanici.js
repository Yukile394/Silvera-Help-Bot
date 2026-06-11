const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kullanici')
    .setDescription('Bir kullanıcı hakkında bilgi verir')
    .addUserOption(opt =>
      opt.setName('kisi')
        .setDescription('Bilgi almak istediğin kullanıcı')
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getMember('kisi') || interaction.member;
    const user = target.user;

    const statusEmoji = {
      online: '🟢 Çevrimiçi',
      idle: '🟡 Boşta',
      dnd: '🔴 Rahatsız Etme',
      offline: '⚫ Çevrimdışı',
    };

    const roles = target.roles.cache
      .filter(r => r.id !== interaction.guild.id)
      .sort((a, b) => b.position - a.position)
      .map(r => `<@&${r.id}>`)
      .slice(0, 5)
      .join(', ') || 'Yok';

    const embed = new EmbedBuilder()
      .setColor(target.displayHexColor || 0x5865f2)
      .setTitle(`👤 ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: '🆔 Kullanıcı ID', value: user.id, inline: true },
        { name: '📛 Görünen Ad', value: target.displayName, inline: true },
        { name: '🤖 Bot mu?', value: user.bot ? 'Evet' : 'Hayır', inline: true },
        { name: '📅 Discord\'a Katılma', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '📅 Sunucuya Katılma', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: '💬 Durum', value: statusEmoji[target.presence?.status] || '⚫ Çevrimdışı', inline: true },
        { name: `🎭 Roller (${target.roles.cache.size - 1})`, value: roles },
      )
      .setFooter({ text: 'Silvera Help' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
