const { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ChannelType, 
  PermissionFlagsBits 
} = require('discord.js');

// Sunucundan aldığımız ID'ler entegre edildi
const YETKILI_ROL_ID = '1504120266782019634'; 
const KATEGORI_ID = '1392629270546743378'; 

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

    // Menüyü gönderiyoruz (Herkes görebilir)
    const response = await interaction.reply({ embeds: [menuEmbed], components: [row] });

    // Buton etkileşimlerini dinlemek için toplayıcı
    const collector = interaction.channel.createMessageComponentCollector({ time: 0 });

    collector.on('collect', async i => {
      
      // ================= DESTEK AÇMA SÜRECİ =================
      if (i.customId === 'destek_ac') {
        await i.deferReply({ ephemeral: true });

        const guild = i.guild;

        try {
          // Özel destek kanalı oluşturuluyor
          const supportChannel = await guild.channels.create({
            name: `destek-${i.user.username}`,
            type: ChannelType.GuildText,
            parent: KATEGORI_ID, 
            permissionOverwrites: [
              {
                id: guild.roles.everyone.id,
                deny: [PermissionFlagsBits.ViewChannel], // Herkese gizle
              },
              {
                id: i.user.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory], // Desteği açana göster
              },
              {
                id: YETKILI_ROL_ID,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory], // Yetkililere göster
              },
            ],
          });

          // Destek kapatma butonu
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

          // Oluşturulan yeni kanala ilk mesaj ve kapatma butonu gönderiliyor
          await supportChannel.send({ content: `${i.user} | <@&${YETKILI_ROL_ID}>`, embeds: [channelEmbed], components: [closeRow] });

          // Komut butonuna basan kişiye gizli onay mesajı
          await i.editReply({ content: `✅ Destek talebiniz başarıyla oluşturuldu! Kanal: ${supportChannel}` });

        } catch (error) {
          console.error(error);
          await i.editReply({ content: '❌ Destek kanalı oluşturulurken bir hata meydana geldi. Botun gerekli yetkilere sahip olduğundan emin olun.' });
        }
      }

      // ================= DESTEK KAPATMA SÜRECİ =================
      if (i.customId === 'destek_kapat') {
        await i.reply({ content: '🔒 Bu destek kanalı 5 saniye içinde kalıcı olarak siliniyor...' });
        
        // 5 saniye bekleyip kanalı imha ediyor
        setTimeout(async () => {
          await i.channel.delete().catch(() => null);
        }, 5000);
      }

    });
  },
};
