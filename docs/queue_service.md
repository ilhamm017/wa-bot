# Dokumentasi Layanan Antrian (Queue Service)

File: `src/services/queue.ts`

Layanan ini digunakan untuk mengelola antrian pesan yang masuk dari setiap chat. Hal ini memungkinkan bot untuk menampung beberapa pesan dari pengirim yang sama sebelum memproses atau membalasnya, berguna untuk memberikan konteks yang lebih baik pada AI.

## Interface `QueueItem`

Struktur data untuk setiap pesan dalam antrian.

```typescript
interface QueueItem {
    messageId: string; // ID unik pesan
    timestamp: number; // Waktu pesan diterima
    message: string;   // Isi pesan teks
    replied: boolean;  // Status apakah pesan sudah dibalas
}
```

## Metode `queueService`

### 1. `add(chatId: string, item: QueueItem)`

Menambahkan pesan baru ke dalam antrian untuk `chatId` tertentu.

-   **Parameter:**
    -   `chatId`: ID chat (misal: nomor telepon atau ID grup).
    -   `item`: Objek `QueueItem` pesan baru.
-   **Logika:** Jika antrian untuk `chatId` belum ada, akan dibuat baru. Jika sudah ada, pesan akan ditambahkan ke array yang ada.

**Contoh Penggunaan:**
```typescript
queueService.add('12345@c.us', {
    messageId: 'msg_001',
    timestamp: Date.now(),
    message: 'Halo bot',
    replied: false
});
```

### 2. `get(chatId: string)`

Mengambil seluruh daftar pesan dalam antrian untuk `chatId` tertentu.

-   **Parameter:**
    -   `chatId`: ID chat yang ingin diambil antriannya.
-   **Return:** `QueueItem[]` atau `undefined` jika tidak ada antrian.

**Contoh Penggunaan:**
```typescript
const pendingMessages = queueService.get('12345@c.us');
if (pendingMessages) {
    console.log(`Ada ${pendingMessages.length} pesan tertunda.`);
}
```

### 3. `set(chatId: string, items: QueueItem[])`

Mengganti seluruh antrian untuk `chatId` dengan daftar pesan baru. Biasanya digunakan setelah memfilter pesan yang sudah diproses.

-   **Parameter:**
    -   `chatId`: ID chat.
    -   `items`: Array `QueueItem` baru.

**Contoh Penggunaan:**
```typescript
// Hapus pesan tertentu dari antrian
const current = queueService.get(chatId);
const updated = current.filter(m => m.messageId !== 'processed_id');
queueService.set(chatId, updated);
```

### 4. `remove(chatId: string)`

Menghapus seluruh antrian untuk `chatId` tertentu dari memori.

-   **Parameter:**
    -   `chatId`: ID chat yang antriannya akan dihapus.

**Contoh Penggunaan:**
```typescript
// Bersihkan antrian setelah selesai membalas
queueService.remove('12345@c.us');
```

### 5. `has(chatId: string)`

Mengecek apakah ada antrian aktif untuk `chatId` tersebut.

-   **Parameter:**
    -   `chatId`: ID chat.
-   **Return:** `boolean` (`true` jika ada, `false` jika tidak).

**Contoh Penggunaan:**
```typescript
if (queueService.has('12345@c.us')) {
    console.log('User ini sedang dalam percakapan aktif di antrian.');
}
```
