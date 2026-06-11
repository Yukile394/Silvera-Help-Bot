const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`\n🚀 ================================`);
    console.log(`   Silvera Help Bot Aktif!`);
    console.log(`   Kullanıcı: ${client.user.tag}`);
    console.log(`   Sunucu Sayısı: ${client.guilds.cache.size}`);
    console.log(`   Ping: ${client.ws.ping}ms`);
    console.log(`=================================\n`);

    // Bot durumunu ayarla
    client.user.setPresence({
      activities: [{
        name: process.env.BOT_ACTIVITY || 'Silvera Help | /yardim',
        type: ActivityType.Watching,
      }],
      status: process.env.BOT_STATUS || 'online',
    });
  },
};
