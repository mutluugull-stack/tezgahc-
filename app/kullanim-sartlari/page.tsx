import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Şartları | Tezgahçı",
  description: "Tezgahçı platformunu kullanırken geçerli olan kullanım şartları ve kurallar.",
};

export default function KullanimSartlariPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-1 font-display text-2xl font-bold">Kullanım Şartları</h1>
      <p className="mb-8 text-sm text-ink-muted">Son güncelleme: 4 Eylül 2026</p>

      <div className="flex flex-col gap-6 text-sm leading-relaxed text-ink">
        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">1. Kabul</h2>
          <p className="text-ink-muted">
            www.tezgahci.com.tr (&quot;Tezgahçı&quot;, &quot;Platform&quot;) üzerinden üye olarak veya siteyi
            kullanarak bu Kullanım Şartları&apos;nı kabul etmiş sayılırsınız. Bu şartları kabul etmiyorsanız
            Platform&apos;u kullanmamalısınız.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">2. Platformun Niteliği</h2>
          <p className="text-ink-muted">
            Tezgahçı, CNC tezgahları, makineleri ve bunlara ait yedek parça, yağ, aparat ve divizör gibi
            ürünlerin alıcı ve satıcılarını buluşturan bir ilan/pazar yeri platformudur. Tezgahçı, ilan
            veren kullanıcılar ile alıcılar arasındaki alım-satım işlemlerine taraf değildir; ödeme,
            teslimat ve garanti gibi konular tamamen taraflar arasındadır. Tezgahçı bu işlemlerin
            sonucundan sorumlu tutulamaz.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">3. Üyelik</h2>
          <p className="text-ink-muted">
            Üyelik için verdiğiniz bilgilerin doğru, güncel ve eksiksiz olması gerekir. Hesabınızın
            güvenliğinden (şifrenizin gizliliği dâhil) siz sorumlusunuz. Bayi hesapları, yönetici onayı
            ile aktif hâle gelir; onay sürecinde talep edilen faaliyet belgesi ve imza sirküleri gibi
            belgelerin gerçek ve güncel olması zorunludur.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">4. İlan Verme Kuralları</h2>
          <p className="text-ink-muted">
            İlana konu ürünün mülkiyetinize ait olması veya satışa yetkili olmanız gerekir. Yanıltıcı,
            gerçek dışı, hukuka aykırı veya üçüncü kişilerin haklarını ihlal eden içerik (izinsiz
            fotoğraf/marka kullanımı dâhil) paylaşılamaz. Tezgahçı, bu kurallara aykırı ilanları veya
            hesapları önceden bildirimde bulunmaksızın kaldırma/askıya alma hakkını saklı tutar.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">5. İçerik ve Sorumluluk</h2>
          <p className="text-ink-muted">
            İlan başlığı, açıklama, fiyat ve fotoğraflar dâhil tüm ilan içeriğinden ilanı veren kullanıcı
            sorumludur. Tezgahçı, ilanların doğruluğunu garanti etmez ve ilan içeriğinden doğabilecek
            zararlardan sorumlu tutulamaz. Alıcıların, satın alma kararı öncesinde satıcı ve ürünle
            ilgili makul özeni göstermesi beklenir.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">6. Yasaklı Davranışlar</h2>
          <p className="text-ink-muted">
            Platform&apos;u kötüye kullanma, sahte ilan/hesap oluşturma, diğer kullanıcıları taciz etme,
            spam gönderme, Platform&apos;un teknik altyapısına zarar verecek girişimlerde bulunma ve
            hukuka aykırı içerik paylaşma yasaktır. Bu kurallara aykırı davranan hesaplar askıya
            alınabilir veya kalıcı olarak kapatılabilir.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">7. Fikri Mülkiyet</h2>
          <p className="text-ink-muted">
            Platform&apos;un tasarımı, yazılımı ve markası Tezgahçı&apos;ya aittir. Kullanıcılar tarafından
            yüklenen ilan fotoğrafları ve metinlerinin telif hakları kullanıcılara ait olup, bu
            içeriklerin Platform üzerinde görüntülenmesi için Tezgahçı&apos;ya gerekli kullanım izni
            verilmiş sayılır.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">8. Değişiklikler</h2>
          <p className="text-ink-muted">
            Tezgahçı, bu Kullanım Şartları&apos;nı zaman zaman güncelleyebilir. Güncel metin her zaman bu
            sayfada yayınlanır ve yayınlandığı andan itibaren geçerli olur.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">9. İletişim</h2>
          <p className="text-ink-muted">
            Kullanım Şartları hakkındaki sorularınız için{" "}
            <strong className="text-ink">[iletişim e-postası buraya eklenecek]</strong> adresinden bize
            ulaşabilirsiniz.
          </p>
        </section>
      </div>

      <div className="mt-10 border-t border-border pt-4 text-sm">
        <Link href="/gizlilik" className="font-semibold text-blueprint hover:underline">
          ← Gizlilik Politikası ve KVKK Aydınlatma Metni
        </Link>
      </div>
    </div>
  );
}
