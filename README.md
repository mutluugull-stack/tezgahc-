# Tezgahçı — CNC Makine Pazarı

Türkiye'nin CNC tezgahları için ilan platformu. Next.js 14 (App Router) + TypeScript,
Tailwind CSS, Prisma ORM + PostgreSQL, NextAuth.js ile kimlik doğrulama ve Vercel Blob
ile fotoğraf yükleme kullanır.

## Özellikler

- Bireysel ve Bayi olmak üzere ayrı üyelik/giriş akışları (bayi hesapları admin onayı bekler)
- İlan verme, düzenleme, satıldı/vitrin işaretleme
- Kategori, şehir, durum, fiyat aralığına göre filtrelenebilir, liste/ızgara görünümlü ilan sayfası
- İlan bazlı site içi mesajlaşma (gelen kutusu, konuşma bazlı görünüm)
- Yönetici paneli: istatistikler, kategori dağılımı, bayi onay/onay kaldırma, tüm kullanıcılar listesi
- Karanlık/aydınlık tema desteği
- Fotoğraf yükleme (Vercel Blob; yapılandırılmazsa devre dışı kalır, site yine çalışır)

## ⚠️ Önemli not

Bu proje, npm paket kurulumuna ağ erişimi olmayan bir ortamda elle (satır satır) yazıldı;
yani `npm install`, `next build` gibi komutlar burada **çalıştırılıp doğrulanamadı**.
Kodun sözdizimi (TS/TSX) otomatik bir araçla tek tek kontrol edildi, ancak gerçek bir
`npm install && npm run build` denemesi yapılmadı. Kurulum sırasında bir hatayla
karşılaşırsanız (eksik bir tip, bir paket sürüm uyuşmazlığı vb.) hata mesajını
buraya iletin, birlikte düzeltelim.

## Yerel Kurulum

1. **Bağımlılıkları kurun**

   ```bash
   npm install
   ```

2. **Ortam değişkenlerini ayarlayın**

   `.env.example` dosyasını `.env` olarak kopyalayın ve doldurun:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL`: Bir PostgreSQL bağlantı adresi. Yerelde Docker ile hızlıca
     ayağa kaldırabilirsiniz:
     ```bash
     docker run --name tezgahci-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=tezgahci -p 5432:5432 -d postgres:16
     ```
     ve `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tezgahci"` yazın.
     Üretimde [Neon](https://neon.tech) veya [Supabase](https://supabase.com) gibi
     yönetilen bir Postgres kullanmanızı öneririz (ikisi de ücretsiz katman sunar).
   - `NEXTAUTH_SECRET`: `openssl rand -base64 32` ile üretin.
   - `NEXTAUTH_URL`: Yerelde `http://localhost:3000`.
   - `BLOB_READ_WRITE_TOKEN`: Fotoğraf yükleme için (aşağıya bakın). Boş bırakılırsa
     ilan verme formu fotoğrafsız çalışır.
   - `ADMIN_SEED_USERNAME` / `ADMIN_SEED_PASSWORD`: İlk yönetici hesabınızın bilgileri.

3. **Veritabanı şemasını oluşturun ve örnek verileri ekleyin**

   ```bash
   npm run db:push
   npm run db:seed
   ```

   Bu, `ADMIN_SEED_USERNAME`/`ADMIN_SEED_PASSWORD` ile bir yönetici hesabı ve birkaç
   örnek ilan oluşturur.

4. **Geliştirme sunucusunu başlatın**

   ```bash
   npm run dev
   ```

   `http://localhost:3000` adresinden siteyi açabilirsiniz.

## Fotoğraf Yükleme (Vercel Blob)

1. Vercel hesabınızda projeyi oluşturun (aşağıdaki dağıtım adımına bakın).
2. Vercel proje panelinde **Storage → Create Database → Blob** ile bir Blob deposu
   oluşturun ve projeye bağlayın.
3. Vercel projeyi depoya otomatik bağlar (OIDC ile `BLOB_STORE_ID` değişkenini
   ekler); eski hesaplarda bunun yerine klasik `BLOB_READ_WRITE_TOKEN` de
   çalışır. Yerel geliştirme için Vercel panelinden `vercel env pull` ile
   güncel değişkenleri çekebilir ya da klasik token'ı kopyalayıp `.env`
   dosyanıza yapıştırabilirsiniz.

Bu adım atlanırsa ilan verme formu çalışmaya devam eder, sadece fotoğraf alanı
devre dışı kalır (kullanıcıya bilgilendirme mesajı gösterilir).

## tezgahci.com.tr Alan Adına Dağıtım (Vercel)

1. [vercel.com](https://vercel.com) üzerinde ücretsiz bir hesap açın, GitHub'a bu
   projeyi push'layın ve Vercel'de "Import Project" ile bağlayın.
2. Vercel proje ayarlarında **Environment Variables** kısmına `.env` dosyanızdaki
   tüm değişkenleri ekleyin (`DATABASE_URL`, `NEXTAUTH_SECRET`,
   `NEXTAUTH_URL=https://tezgahci.com.tr`, `BLOB_READ_WRITE_TOKEN`,
   `ADMIN_SEED_USERNAME`, `ADMIN_SEED_PASSWORD`).
3. İlk dağıtımdan sonra bir kerelik şema kurulumu ve seed için, Vercel'in verdiği
   Postgres bağlantısına yerelden bağlanıp şunu çalıştırın:
   ```bash
   npm run db:push
   npm run db:seed
   ```
   (Ya da Neon/Supabase panelinden aynı işlemi bir SQL istemcisiyle de yapabilirsiniz.)
4. **Alan adını bağlama**: Vercel proje ayarlarında **Settings → Domains** kısmına
   `tezgahci.com.tr` ve `www.tezgahci.com.tr` ekleyin. Vercel size eklemeniz gereken
   DNS kayıtlarını (genellikle bir `A` kaydı ve bir `CNAME`) gösterecektir. Bu
   kayıtları domain'i satın aldığınız sağlayıcının (isim tescil firmanızın) DNS
   yönetim panelinden ekleyin. DNS yayılması birkaç dakika ile birkaç saat sürebilir.
5. Domain doğrulandıktan sonra siteniz `https://tezgahci.com.tr` üzerinden canlıya
   çıkar (Vercel otomatik olarak ücretsiz SSL sertifikası sağlar).

## Proje Yapısı

```
app/                  Next.js App Router sayfaları ve API route'ları
  page.tsx            Ana sayfa (vitrin, kategori kısayolları, hizmet reklamları)
  ilanlar/             İlan listeleme (filtre + liste/ızgara görünümü)
  ilan/[id]/           İlan detay sayfası
  ilan-ver/            Yeni ilan formu
  giris/, kayit/       Giriş / üyelik (bireysel-bayi sekmeleri)
  mesajlarim/          Gelen kutusu
  admin/               Yönetici paneli (middleware.ts ile korunur)
  api/                 REST API route'ları (auth, register, listings, messages, upload, admin)
components/           Paylaşılan React bileşenleri
lib/                   Prisma istemcisi, NextAuth ayarları, sabitler
prisma/schema.prisma   Veritabanı şeması
prisma/seed.ts         Örnek veri / ilk admin hesabı betiği
```

## Bilinen sınırlamalar / sonraki adımlar

- Şifre sıfırlama (e-posta ile) henüz yok; şimdilik yönetici veritabanından elle
  sıfırlayabilir.
- E-posta bildirimleri (yeni mesaj, bayi onayı vb.) henüz yok — istenirse Resend
  veya benzeri bir servisle kolayca eklenebilir.
- Ödeme/öne çıkarma (ücretli vitrin) altyapısı yok; `isVitrin` alanı şimdilik
  yalnızca ilan sahibi/admin tarafından manuel açılıp kapatılıyor.
