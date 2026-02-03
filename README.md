## wa-bot

Bot WhatsApp berbasis `whatsapp-web.js` + Gemini untuk membalas pesan, dengan injeksi knowledge (opsional) dan gaya tulisan.

### Menjalankan
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm start`

### Konfigurasi
Set env var:
- `Gemini_API_KEY`
- `WA_ALLOWED_NUMBERS` (opsional): allowlist nomor yang boleh dibalas, pisahkan dengan koma. Contoh: `6281234567890,6289876543210` (atau format lengkap `628123...@c.us`). Jika tidak di-set, bot membalas semua chat pribadi.

### Gaya Balasan (Ilham)
Bot meniru gaya tulisan “Ilham” lewat `systemInstruction` Gemini.

- Profil gaya ada di `src/data/styleProfile.ts` (`ilhamStyleSystemInstruction`).
- Dipakai di `src/services/geminiAi.ts` (digabung ke `systemInstruction`).
- Untuk hemat token, history chat dibatasi di `src/handlers/messages/textHandler.ts` (fetch `limit`).

