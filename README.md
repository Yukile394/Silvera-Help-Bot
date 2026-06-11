# 🤖 Silvera Help Bot

7/24 aktif Discord yardım botu. GitHub Actions ile otomatik deploy.

---

## 📁 Proje Yapısı

```
silvera-bot/
├── .github/
│   └── workflows/
│       └── deploy.yml        ← GitHub Actions CI/CD
├── src/
│   ├── commands/
│   │   ├── yardim.js         ← /yardim
│   │   ├── ping.js           ← /ping
│   │   ├── sunucu.js         ← /sunucu
│   │   ├── kullanici.js      ← /kullanici
│   │   ├── zar.js            ← /zar
│   │   ├── yazi-tura.js      ← /yazi-tura
│   │   ├── temizle.js        ← /temizle (moderasyon)
│   │   └── duyuru.js         ← /duyuru (admin)
│   ├── events/
│   │   ├── ready.js          ← Bot hazır eventi
│   │   ├── interactionCreate.js ← Slash komut handler
│   │   └── guildMemberAdd.js ← Hoş geldin mesajı
│   ├── index.js              ← Ana giriş noktası
│   └── deploy-commands.js    ← Slash komut deploy scripti
├── ecosystem.config.js       ← PM2 yapılandırması
├── .env.example              ← Örnek environment dosyası
├── package.json
└── README.md
```

---

## 🚀 Kurulum (Adım Adım)

### 1. Discord Bot Oluştur

1. [Discord Developer Portal](https://discord.com/developers/applications) → **New Application**
2. **Bot** sekmesi → **Add Bot** → Token'ı kopyala
3. **OAuth2 → URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: `Administrator` (veya gerekli izinler)
4. Oluşan linki tarayıcıda aç → Botunu sunucuya ekle

### 2. Projeyi Hazırla

```bash
git clone https://github.com/KULLANICI/silvera-bot.git
cd silvera-bot
npm install

# .env dosyasını oluştur
cp .env.example .env
nano .env  # Token ve ID'leri gir
```

**.env** dosyasını doldur:
```env
DISCORD_TOKEN=Bot tokenin buraya
CLIENT_ID=Application ID buraya
BOT_ACTIVITY=Silvera Help | /yardim
```

### 3. Slash Komutları Deploy Et

```bash
node src/deploy-commands.js
```

### 4. Botu Başlat

```bash
# Geliştirme (otomatik yeniden başlatma)
npm run dev

# Üretim (PM2 ile 7/24)
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # Sunucu yeniden başladığında otomatik başlat
```

---

## 🔧 GitHub Actions Kurulumu

Otomatik deploy için GitHub repository **Secrets** ekle:

| Secret | Açıklama |
|--------|----------|
| `DISCORD_TOKEN` | Bot token |
| `CLIENT_ID` | Application ID |
| `SSH_HOST` | Sunucu IP adresi |
| `SSH_USERNAME` | SSH kullanıcı adı (örn: `ubuntu`) |
| `SSH_PRIVATE_KEY` | SSH private key (tüm içerik) |
| `SSH_PORT` | SSH portu (varsayılan: 22) |
| `DISCORD_WEBHOOK` | Deploy bildirim webhook URL'i |

**Secrets ekleme:** GitHub Repo → Settings → Secrets and variables → Actions → New secret

### Deploy Akışı

```
main'e push
    ↓
🔍 Lint & Syntax Check
    ↓
🚀 SSH ile Sunucuya Deploy
    ↓
📋 Slash Komutları Güncelle
    ↓
📣 Discord'a Bildirim Gönder
```

---

## 💬 Komutlar

| Komut | Açıklama | İzin |
|-------|----------|------|
| `/yardim` | Komut listesi | Herkes |
| `/ping` | Bot gecikmesi | Herkes |
| `/sunucu` | Sunucu bilgisi | Herkes |
| `/kullanici [@kişi]` | Kullanıcı bilgisi | Herkes |
| `/zar [yüzler]` | Zar at | Herkes |
| `/yazi-tura` | Yazı tura | Herkes |
| `/temizle [adet]` | Mesaj sil | Mesaj Yönet |
| `/duyuru [mesaj]` | Duyuru gönder | Yönetici |

---

## ➕ Yeni Komut Eklemek

`src/commands/` altında yeni `.js` dosyası oluştur:

```js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('komutadi')
    .setDescription('Komut açıklaması'),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('Başlık')
      .setDescription('İçerik');

    await interaction.reply({ embeds: [embed] });
  },
};
```

Sonra slash komutları tekrar deploy et:
```bash
node src/deploy-commands.js
```

---

## 📝 Lisans

MIT
