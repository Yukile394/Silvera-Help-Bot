const { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ChannelType, 
  PermissionFlagsBits 
} = require('discord.js');

// 🛠️ BURALARI KENDİ SUNUCUNA GÖRE DOLDUR!
const YETKILI_ROL_ID = 'YETKILI_ROL_ID_BURAYA'; // Destek kanallarını görebilecek yetkili rolünün ID'si
const KATEGORI_ID = 'KATEGORI_ID_BURAYA'; // Destek kanallarının açılacağı kategorinin ID'si

module.exports = {
  data: new SlashCommandBuilder()
    .setName('destek')
    .setDescription('Destek sistemini başlatır.'),

  async execute(interaction) {
    // Herkesin görebileceği "Destek Aç" butonu
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('destek_ac')
          .setLabel('🎫 Destek Aç')
          .setStyle(ButtonStyle.Success)
      );

    // 5 Satırlık Açıklama Menüsü Embed'i
    const menuEmbed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle('✨ Silvera Destek Sistemi')
      .setDescription(
        `👋 Merhaba! Yaşadığınız sorunları çözmek için buradayız.\n` +
        `📝 Lütfen aşağıdaki butona tıklayarak bir destek talebi oluşturun.\n` +
        `⏳ Talebiniz açıldıktan sonra yetkililerimiz en kısa sürede dönüş yapacaktır.\n` +
        `⚠️ Gereksiz yere destek talebi açmak ve yetkilileri etiketlemek yasaktır.\n` +
        `🤝 Silvera ekibi olarak size yardımcı olmaktan mutluluk duyarız!`
      )
      .setFooter({ text: 'Silvera Help' })
      .setTimestamp();

    // Menüyü gönderiyoruz (ephemeral olmadığı için herkes görebilir)
    const response = await interaction.reply({ embeds: [menuEmbed], components: [row] });

    // Buton tıklamalarını dinlemek için sonsuz (veya uzun süreli) bir toplayıcı oluşturuyoruz
    const collector = response.createMessageComponentCollector({ time: 0 }); // 0 = Sınırsız süre

    collector.on('collect', async i => {
      // Sadece "Destek Aç" butonuna basıldığında tetiklenir
      if (i.customId === 'destek_ac') {
        await i.deferReply({ ephemeral: true }); // İşlemin uzun sürebileceğini Discord'a bildiriyoruz

        const guild = i.guild;

        try {
          // Özel destek kanalını oluşturuyoruz
          const supportChannel = await guild.channels.create({
            name: `destek-${i.user.username}`,
            type: ChannelType.GuildText,
            parent: KATEGORI_ID, // Kanalların açılacağı kategori
            permissionOverwrites: [
              {
                id: guild.roles.everyone.id,
                deny: [PermissionFlagsBits.ViewChannel], // Herkese kapatıyoruz
              },
              {
                id: i.user.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory], // Desteği açan kişiye açıyoruz
              },
              {
                id: YETKILI_ROL_ID,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory], // Yetkililere açıyoruz
              },
            ],
          });

          // Açılan kanalın içindeki "Destek Kapat" butonu
          const closeRow = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('destek_kapat')
                .setLabel('🔒 Desteği Kapat')
                .setStyle(ButtonStyle.Danger)
            );

          const channelEmbed = new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle('🎫 Destek Kanalı Açıldı!')
            .setDescription(
              `Merhaba ${i.user}, destek talebiniz başarıyla oluşturuldu.\n` +
              `Yetkililerimiz en kısa sürede sizinle ilgilenecektir.\n\n` +
              `**İşiniz bittiğinde aşağıdaki butona tıklayarak kanalı kapatabilirsiniz.**`
            )
            .setFooter({ text: 'Silvera Help' })
            .setTimestamp();

          // Yeni açılan kanala mesajı gönderiyoruz
          await supportChannel.send({ content: `${i.user} | <@&${YETKILI_ROL_ID}>`, embeds: [channelEmbed], components: [closeRow] });

          // Kişiye gizli mesaj olarak kanalın açıldığını söylüyoruz
          await i.editReply({ content: `✅ Destek talebiniz başarıyla oluşturuldu! Kanal: ${supportChannel}` });

        } catch (error) {
          console.error(error);
          await i.editReply({ content: '❌ Destek kanalı oluşturulurken bir hata meydana geldi. Lütfen yetkililere bildirin.' });
        }
      }
    });
  },
};

// 🔒 Kapatma butonunu tetiklemek için Client (Bot) seviyesinde bir dinleyici gerekir.
// Eğer ana bot dosyanızda (index.js / main.js) interactionCreate eventiniz varsa, 
// destek kapatma butonunu çalıştırmak için aşağıdaki kodu event'in içine eklemeniz yeterlidir:
/*
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;
  
  if (interaction.customId === 'destek_kapat') {
    await interaction.reply({ content: '🔒 Bu destek kanalı 5 saniye içinde siliniyor...' });
    setTimeout(async () => {
      await interaction.channel.delete().catch(() => null);
    }, 5000);
  }
});
*/
