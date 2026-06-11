const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

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

    // Menü için Butonları Oluşturuyoruz
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`zar_oyna_${sides}`)
          .setLabel('🎲 Zar Oyna')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`zar_paylas_${sides}`)
          .setLabel('📢 Zar Paylaş')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`zar_iste_${sides}`)
          .setLabel('🤝 Zar İste')
          .setStyle(ButtonStyle.Secondary)
      );

    // İlk Menü Embed'i
    const menuEmbed = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle('🎲 Zar Menüsü')
      .setDescription(`**${interaction.user.username}**, d${sides} zarı için bir işlem seçin:`)
      .addFields(
        { name: '🎲 Zar Oyna', value: 'Kendi kendinize zar atarsınız.', inline: true },
        { name: '📢 Zar Paylaş', value: 'Attığınız zarı kanalda paylaşırsınız.', inline: true },
        { name: '🤝 Zar İste', value: 'Başka birinden zar atmasını istersiniz.', inline: true }
      )
      .setFooter({ text: 'Silvera Help' })
      .setTimestamp();

    // Menüyü gönderiyoruz (Herkes görebilir)
    const response = await interaction.reply({ embeds: [menuEmbed], components: [row] });

    // Buton tıklamalarını yakalamak için collector (toplayıcı) oluşturuyoruz (Zaman aşımı: 10 dakika)
    const collector = response.createMessageComponentCollector({ time: 600000 });

    collector.on('collect', async i => {
      // Buton kimliklerini ve zar yüzünü ayrıştırıyoruz
      const [action, type, sideCount] = i.customId.split('_');
      const currentSides = parseInt(sideCount);
      const result = Math.floor(Math.random() * currentSides) + 1;

      let resultEmbed = new EmbedBuilder()
        .setColor(0xf39c12)
        .setFooter({ text: 'Silvera Help' })
        .setTimestamp();

      if (type === 'oyna') {
        resultEmbed
          .setTitle('🎲 Zar Oynandı!')
          .setDescription(`**${i.user.username}** kendi için d${currentSides} zar attı!`)
          .addFields({ name: '🎯 Sonuç', value: `**${result}** / ${currentSides}` });
        
        // Sadece zarı oynayan kişinin görmesini istersen ephemral yapabilirsin, 
        // ama herkes görsün dediğin için normal yanıt olarak kanala gönderiyoruz.
        await i.reply({ embeds: [resultEmbed] });

      } else if (type === 'paylas') {
        resultEmbed
          .setTitle('📢 Zar Paylaşıldı!')
          .setDescription(`**${i.user.username}** ortaya bir d${currentSides} zar fırlattı!`)
          .addFields({ name: '🎯 Sonuç', value: `**${result}** / ${currentSides}` });
        
        await i.reply({ embeds: [resultEmbed] });

      } else if (type === 'iste') {
        resultEmbed
          .setTitle('🤝 Zar İstendi!')
          .setDescription(`**${i.user.username}** herkesten bir d${currentSides} zar atmasını istiyor!\n\nKim atmak ister?`)
          .addFields({ name: '🎲 İlk Atış Sonucu (Uğurlu)', value: `**${result}** / ${currentSides}` });
        
        await i.reply({ embeds: [resultEmbed] });
      }
    });

    // Zaman aşımı olduğunda butonları devre dışı bırakır
    collector.on('end', () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        row.components.map(button => ButtonBuilder.from(button).setDisabled(true))
      );
      interaction.editReply({ components: [disabledRow] }).catch(() => null);
    });
  },
};
