-- Tezgahçı — Neon SQL Editor'da çalıştırılacak elle kurulum betiği.
-- Bu dosya prisma/schema.prisma ile birebir aynı şemayı, Prisma CLI'a ihtiyaç
-- duymadan doğrudan SQL ile oluşturur (bu ortamda npm/prisma kurulumu
-- yapılamadığı için). Neon dashboard > SQL Editor içine yapıştırıp çalıştırın.

-- 1) Enum tipleri
DO $$ BEGIN
  CREATE TYPE "AccountType" AS ENUM ('BIREYSEL', 'BAYI');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ListingCondition" AS ENUM ('SIFIR', 'IKINCI_EL', 'YENILENMIS');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "Currency" AS ENUM ('TRY', 'USD', 'EUR');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) Tablolar
CREATE TABLE IF NOT EXISTS "users" (
  "id"           TEXT PRIMARY KEY,
  "username"     TEXT UNIQUE NOT NULL,
  "email"        TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "accountType"  "AccountType" NOT NULL DEFAULT 'BIREYSEL',
  "fullName"     TEXT,
  "companyName"  TEXT,
  "phone"        TEXT,
  "city"         TEXT,
  "approved"     BOOLEAN NOT NULL DEFAULT true,
  "isAdmin"      BOOLEAN NOT NULL DEFAULT false,
  "parentDealerId" TEXT REFERENCES "users"("id") ON DELETE CASCADE,
  "role"         TEXT,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "users_parentDealerId_idx" ON "users"("parentDealerId");

CREATE TABLE IF NOT EXISTS "listings" (
  "id"          TEXT PRIMARY KEY,
  "title"       TEXT NOT NULL,
  "category"    TEXT NOT NULL,
  "brand"       TEXT,
  "model"       TEXT,
  "year"        INTEGER,
  "condition"   "ListingCondition" NOT NULL DEFAULT 'IKINCI_EL',
  "controller"  TEXT,
  "axisCount"   TEXT,
  "workArea"    TEXT,
  "price"       INTEGER NOT NULL,
  "currency"    "Currency" NOT NULL DEFAULT 'TRY',
  "city"        TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "isSold"      BOOLEAN NOT NULL DEFAULT false,
  "isVitrin"    BOOLEAN NOT NULL DEFAULT false,
  "previewConsent" BOOLEAN NOT NULL DEFAULT false,
  "viewCount"   INTEGER NOT NULL DEFAULT 0,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT now(),
  "sellerId"    TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "listings_category_idx" ON "listings"("category");
CREATE INDEX IF NOT EXISTS "listings_city_idx" ON "listings"("city");
CREATE INDEX IF NOT EXISTS "listings_sellerId_idx" ON "listings"("sellerId");
CREATE INDEX IF NOT EXISTS "listings_createdAt_idx" ON "listings"("createdAt");

CREATE TABLE IF NOT EXISTS "listing_images" (
  "id"        TEXT PRIMARY KEY,
  "url"       TEXT NOT NULL,
  "order"     INTEGER NOT NULL DEFAULT 0,
  "listingId" TEXT NOT NULL REFERENCES "listings"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "listing_images_listingId_idx" ON "listing_images"("listingId");

CREATE TABLE IF NOT EXISTS "messages" (
  "id"         TEXT PRIMARY KEY,
  "body"       TEXT NOT NULL,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT now(),
  "read"       BOOLEAN NOT NULL DEFAULT false,
  "listingId"  TEXT NOT NULL REFERENCES "listings"("id") ON DELETE CASCADE,
  "senderId"   TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "receiverId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "messages_listingId_idx" ON "messages"("listingId");
CREATE INDEX IF NOT EXISTS "messages_receiverId_idx" ON "messages"("receiverId");
CREATE INDEX IF NOT EXISTS "messages_senderId_idx" ON "messages"("senderId");

-- 3) Başlangıç verileri (admin hesabı + örnek bayi + örnek ilanlar)
-- Admin giriş bilgileri:
--   kullanıcı adı: admin
--   şifre:         OCWEdxDGIDKAKy   (ilk girişten sonra değiştirmeniz önerilir)
INSERT INTO "users" ("id","username","email","passwordHash","accountType","fullName","approved","isAdmin")
VALUES ('usr_admin','admin','admin@tezgahci.com.tr','$2b$12$OU2iOONXrZEJqNsfYP4pz.rpvlZF1U/i3qwq4ftXcxvw5AqE0wAiu','BIREYSEL','Site Yöneticisi', true, true)
ON CONFLICT ("username") DO NOTHING;

-- Örnek bayi hesabı (giriş: ornekbayi / ornek1234)
INSERT INTO "users" ("id","username","email","passwordHash","accountType","companyName","phone","city","approved")
VALUES ('usr_ornekbayi','ornekbayi','ornekbayi@tezgahci.com.tr','$2b$12$8O/Z8F3A2Cka/0QAWsKZG.mEJKHEuTaYWPBrzh7b32mDZxMAjali2','BAYI','Tezgahçı Örnek Bayi','0212 000 00 00','İstanbul', true)
ON CONFLICT ("username") DO NOTHING;

INSERT INTO "listings" ("id","title","category","brand","model","year","condition","controller","axisCount","workArea","price","currency","city","description","isVitrin","sellerId")
VALUES
('lst_1','Haas VF-2 Dikey İşleme Merkezi','freze','Haas','VF-2',2016,'IKINCI_EL','Haas NGC','3 Eksen','762 x 406 x 508 mm',1450000,'TRY','İstanbul','Bakımlı, tek sahibinden Haas VF-2 dikey işleme merkezi. Kalibrasyonu güncel, mengene ve takım seti dahildir.', true, 'usr_ornekbayi'),
('lst_2','DMG Mori NLX 2500 CNC Torna','torna','DMG Mori','NLX 2500',2018,'IKINCI_EL','Fanuc 31i','2 Eksen','Ø 365 mm',2100000,'TRY','Bursa','Az kullanılmış, servis kayıtları eksiksiz DMG Mori NLX 2500 CNC torna tezgahı.', true, 'usr_ornekbayi'),
('lst_3','Ermaksan 3015 Fiber Lazer Kesim','lazer','Ermaksan','Cutbend Fiber 3015',2020,'IKINCI_EL','Beckhoff','-','3000 x 1500 mm',3850000,'TRY','Konya','4000W fiber lazer kesim makinesi, tam bakımlı, yedek parça stoğu ile birlikte devredilir.', false, 'usr_ornekbayi'),
('lst_4','Durma AD-R 30130 Abkant Pres','abkant','Durma','AD-R 30130',2015,'IKINCI_EL','Delem DA-66T','6 Eksen Arka Dayama','3100 x 130 ton',980000,'TRY','Kayseri','Yüksek hassasiyetli CNC abkant pres, çift silindirli, arka dayama sistemi ile birlikte satılıktır.', false, 'usr_ornekbayi')
ON CONFLICT ("id") DO NOTHING;

-- 4) Sonradan eklenen alanlar (mevcut bir veritabanını güncellemek için)
-- "Makine Önizleme" özelliği: bir ilanın fotoğraflarının bu panelde
-- gösterilebilmesi için satıcının (yalnızca Bayi hesapları) açıkça onay
-- vermiş olması gerekir. Var olan bir veritabanında bu sütun yoksa aşağıdaki
-- komutu bir kere çalıştırmanız yeterlidir (zaten varsa hata vermeden geçer).
ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "previewConsent" BOOLEAN NOT NULL DEFAULT false;

-- Yönetici Paneli / Bayi Paneli — bayi ekip yönetimi (Müşteri Temsilcisi vb.
-- alt hesaplar) için gereken sütunlar. Var olan bir veritabanında bu
-- sütunlar yoksa aşağıdaki komutları bir kere çalıştırmanız yeterlidir.
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "parentDealerId" TEXT REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" TEXT;
CREATE INDEX IF NOT EXISTS "users_parentDealerId_idx" ON "users"("parentDealerId");

-- Reklam Yönetimi (Yönetici Paneli > Reklamlar) — ana sayfa ve ilan
-- listelerindeki reklam alanlarını besleyen tablo. Var olan bir veritabanına
-- eklemek için bu bölümü bir kere çalıştırmanız yeterlidir.
DO $$ BEGIN
  CREATE TYPE "AdPlacement" AS ENUM (
    'HOME_SEARCH_BANNER',
    'HOME_AFTER_VITRIN',
    'HOME_SERVICE_CARD',
    'LISTING_TOP_BANNER',
    'LISTING_INFEED',
    'LISTING_SIDEBAR'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "ads" (
  "id"              TEXT PRIMARY KEY,
  "advertiserName"  TEXT NOT NULL,
  "imageUrlDesktop" TEXT NOT NULL,
  "imageUrlMobile"  TEXT,
  "altText"         TEXT NOT NULL,
  "targetUrl"       TEXT NOT NULL,
  "placement"       "AdPlacement" NOT NULL,
  "category"        TEXT,
  "startDate"       TIMESTAMP(3),
  "endDate"         TIMESTAMP(3),
  "priority"        INTEGER NOT NULL DEFAULT 1,
  "active"          BOOLEAN NOT NULL DEFAULT true,
  "impressions"     INTEGER NOT NULL DEFAULT 0,
  "clicks"          INTEGER NOT NULL DEFAULT 0,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "ads_placement_idx" ON "ads"("placement");
CREATE INDEX IF NOT EXISTS "ads_category_idx" ON "ads"("category");
