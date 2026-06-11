const { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ChannelType, 
  PermissionFlagsBits 
} = require('discord.js');

// Sunucundan aldığımız ID'ler buraya tanımlandı
const YETKILI_ROL_ID = '1186445970737737778'; 
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

    // İstediğin 5 satırlık açıklama menüsü embed'i
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

    // Buton etkileşimlerini (Açma ve Kapatma) dinlemek için toplayıcı
    const collector = interaction.channel.createMessageComponentCollector({ time: 0 }); // Sınırsız süre aktif

    collector.on('collect', async i => {
      
      // ================= DESTEK AÇMA SÜRECİ =================
      if (i.customId === 'destek_ac') {
        // İşlem sürebileceği için Discord'a "bekle" sinyali gönderiyoruz (sadece tıklayan görür)
        await i.deferReply({ ephemeral: true });

        const guild = i.guild;

        try {
          // Özel destek kanalı oluşturuluyor
          const supportChannel = await guild.channels.create({
            name: `destek-${i.user.username}`,
            type: ChannelType.GuildText,
            parent: KATEGORI_ID, // Belirttiğin kategorinin altında açılır
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

          // Yeni açılan kanalın içine yetkilileri etiketleyip kapatma butonunu gönderiyoruz
          await supportChannel.send({ content: `${i.user} | <@&${YETKILI_ROL_ID}>`, embeds: [channelEmbed], components: [closeRow] });

          // "Destek Aç" butonuna basan kişiye gizli onay mesajı ve kanal linki veriyoruz
          await i.editReply({ content: `✅ Destek talebiniz başarıyla oluşturuldu! Kanalınız: ${supportChannel}` });

        } catch (error) {
          console.error(error);
          await i.editReply({ content: '❌ Destek kanalı oluşturulurken bir hata meydana geldi. Botun "Kanalları Yönet" yetkisi olduğundan emin olun.' });
        }
      }

      // ================= DESTEK KAPATMA SÜRECİ =================
      if (i.customId === 'destek_kapat') {
        // Butona tıklandığı an kanala geri sayım mesajı atıyoruz
        await i.reply({ content: '🔒 Bu destek kanalı 5 saniye içinde kalıcı olarak siliniyor...' });
        
        // 5 saniye bekleyip kanalı tamamen siliyoruz
        setTimeout(async () => {
          await i.channel.delete().catch(() => null);
        }, 5000);
      }

    });
  },
};

