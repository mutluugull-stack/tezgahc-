import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminUsername = process.env.ADMIN_SEED_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "degistir-bu-sifreyi-123";

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      email: `${adminUsername}@tezgahci.com.tr`,
      passwordHash: adminHash,
      accountType: "BIREYSEL",
      fullName: "Site Yöneticisi",
      approved: true,
      isAdmin: true,
    },
  });
  console.log(`Admin kullanıcı hazır: ${admin.username} (şifreyi .env dosyanızdan kontrol edin)`);

  const dealerHash = await bcrypt.hash("ornek1234", 10);
  const dealer = await prisma.user.upsert({
    where: { username: "ornekbayi" },
    update: {},
    create: {
      username: "ornekbayi",
      email: "ornekbayi@tezgahci.com.tr",
      passwordHash: dealerHash,
      accountType: "BAYI",
      companyName: "Tezgahçı Örnek Bayi",
      phone: "0212 000 00 00",
      city: "İstanbul",
      approved: true,
    },
  });

  const existing = await prisma.listing.count();
  if (existing === 0) {
    await prisma.listing.createMany({
      data: [
        {
          title: "Haas VF-2 Dikey İşleme Merkezi",
          category: "freze",
          brand: "Haas",
          model: "VF-2",
          year: 2016,
          condition: "IKINCI_EL",
          controller: "Haas NGC",
          axisCount: "3 Eksen",
          workArea: "762 x 406 x 508 mm",
          price: 1450000,
          currency: "TRY",
          city: "İstanbul",
          description:
            "Bakımlı, tek sahibinden Haas VF-2 dikey işleme merkezi. Kalibrasyonu güncel, mengene ve takım seti dahildir. Fabrikada çalışır vaziyette görülebilir.",
          isVitrin: true,
          sellerId: dealer.id,
        },
        {
          title: "DMG Mori NLX 2500 CNC Torna",
          category: "torna",
          brand: "DMG Mori",
          model: "NLX 2500",
          year: 2018,
          condition: "IKINCI_EL",
          controller: "Fanuc 31i",
          axisCount: "2 Eksen",
          workArea: "Ø 365 mm",
          price: 2100000,
          currency: "TRY",
          city: "Bursa",
          description:
            "Az kullanılmış, servis kayıtları eksiksiz DMG Mori NLX 2500 CNC torna tezgahı. Barfeeder opsiyonel olarak eklenebilir.",
          isVitrin: true,
          sellerId: dealer.id,
        },
        {
          title: "Ermaksan 3015 Fiber Lazer Kesim",
          category: "lazer",
          brand: "Ermaksan",
          model: "Cutbend Fiber 3015",
          year: 2020,
          condition: "IKINCI_EL",
          controller: "Beckhoff",
          axisCount: "-",
          workArea: "3000 x 1500 mm",
          price: 3850000,
          currency: "TRY",
          city: "Konya",
          description:
            "4000W fiber lazer kesim makinesi, tam bakımlı, yedek parça stoğu ile birlikte devredilir.",
          sellerId: dealer.id,
        },
        {
          title: "Durma AD-R 30130 Abkant Pres",
          category: "abkant",
          brand: "Durma",
          model: "AD-R 30130",
          year: 2015,
          condition: "IKINCI_EL",
          controller: "Delem DA-66T",
          axisCount: "6 Eksen Arka Dayama",
          workArea: "3100 x 130 ton",
          price: 980000,
          currency: "TRY",
          city: "Kayseri",
          description:
            "Yüksek hassasiyetli CNC abkant pres, çift silindirli, arka dayama sistemi ile birlikte satılıktır.",
          sellerId: dealer.id,
        },
      ],
    });
    console.log("Örnek ilanlar eklendi.");
  }

  console.log("Seed tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
