const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yardim')
    .setDescription('Silvera Help bot komutlarını listeler'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('🤖 Silvera Help — Komut Listesi')
      .setDescription('Tüm kullanılabilir komutlar aşağıda listelenmiştir.')
      .addFields(
        {
          name: '📋 Genel Komutlar',
          value: [
            '`/yardim` — Bu menüyü gösterir',
            '`/ping` — Bot gecikmesini gösterir',
            '`/sunucu` — Sunucu bilgilerini gösterir',
            '`/kullanici [@kişi]` — Kullanıcı bilgilerini gösterir',
          ].join('\n'),
        },
        {
          name: '🎲 Eğlence Komutları',
          value: [
            '`/zar [yüzler]` — Zar atar (varsayılan: 6)',
            '`/yazi-tura` — Yazı veya tura atar',
            '`/sahne` — Rastgele bir rol yapma sahnesi başlatır',
          ].join('\n'),
        },
        {
          name: '🛠️ Moderasyon Komutları',
          value: [
            '`/temizle [adet]` — Belirtilen sayıda mesaj siler',
            '`/duyuru [mesaj]` — Duyuru gönderir (yönetici)',
          ].join('\n'),
        },
      )
      .setFooter({ text: 'Silvera Help • 7/24 Hizmetinizdeyim ❤️' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
