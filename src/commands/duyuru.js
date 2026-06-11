const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('duyuru')
    .setDescription('Bir duyuru gönderir')
    .addStringOption(opt =>
      opt.setName('mesaj')
        .setDescription('Duyuru metni')
        .setRequired(true)
    )
    .addChannelOption(opt =>
      opt.setName('kanal')
        .setDescription('Duyuru kanalı (varsayılan: mevcut kanal)')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const message = interaction.options.getString('mesaj');
    const channel = interaction.options.getChannel('kanal') || interaction.channel;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('📢 Duyuru')
      .setDescription(message)
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setFooter({ text: `Duyuran: ${interaction.user.tag} • Silvera Help` })
      .setTimestamp();

    await channel.send({ content: '@here', embeds: [embed] });

    await interaction.reply({
      content: `✅ Duyuru <#${channel.id}> kanalına gönderildi!`,
      ephemeral: true,
    });
  },
};
