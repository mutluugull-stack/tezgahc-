# tezgahc-

## adbtv.py — Android TV'ye ADB ile bağlanma aracı

`adbtv.py`, Android TV'ye kablosuz hata ayıklama (wireless debugging) üzerinden
bağlanmayı kolaylaştıran basit bir Python CLI aracıdır. Sistemde kurulu olan
`adb` komutunu (Android SDK Platform Tools) kullanır.

### Gereksinimler

- Python 3
- `adb` komutu PATH içinde kurulu olmalı ([Platform Tools indir](https://developer.android.com/tools/releases/platform-tools))
- TV'de **Ayarlar → Cihaz Tercihleri → Geliştirici Seçenekleri → Kablosuz hata ayıklama** açık olmalı

### Kullanım

**1. İlk bağlantı — eşleştirme (Android 11+ TV'lerde gerekir)**

TV'de "Eşleştirme koduyla eşle" ekranını açın, orada gösterilen IP, port ve
6 haneli kodu kullanarak:

```bash
python3 adbtv.py pair <TV_IP> <ESLESTIRME_PORTU> <KOD>
```

**2. Bağlanma**

Eşleştirme sonrası (veya zaten güvenilen bir cihazsa) TV'nin ana kablosuz hata
ayıklama ekranında gösterilen bağlantı portunu kullanarak:

```bash
python3 adbtv.py connect <TV_IP> [PORT]
```

`PORT` verilmezse varsayılan olarak `5555` kullanılır.

**3. Bağlantı durumunu görüntüleme**

```bash
python3 adbtv.py status
```

**4. Bağlantıyı kesme**

```bash
python3 adbtv.py disconnect [TV_IP] [PORT]
```

Argüman verilmezse tüm cihazların bağlantısı kesilir.
