import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası ve KVKK Aydınlatma Metni | Tezgahçı",
  description: "Tezgahçı'nın kişisel verilerinizi nasıl işlediğine dair KVKK aydınlatma metni ve gizlilik politikası.",
};

export default function GizlilikPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-1 font-display text-2xl font-bold">Gizlilik Politikası ve KVKK Aydınlatma Metni</h1>
      <p className="mb-8 text-sm text-ink-muted">Son güncelleme: 4 Eylül 2026</p>

      <div className="flex flex-col gap-6 text-sm leading-relaxed text-ink">
        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">1. Veri Sorumlusu</h2>
          <p className="text-ink-muted">
            6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, Tezgahçı platformunu
            (&quot;Tezgahçı&quot;, &quot;Platform&quot;, www.tezgahci.com.tr) işleten <strong className="text-ink">[Şirket unvanı buraya
            eklenecek]</strong> veri sorumlusu sıfatıyla hareket etmektedir. Bu metin, Platform üzerinden
            topladığımız kişisel verilerin hangi amaçlarla işlendiğini, kimlerle paylaşılabileceğini ve
            haklarınızı ne şekilde kullanabileceğinizi açıklamak amacıyla hazırlanmıştır.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">2. İşlenen Kişisel Veriler</h2>
          <p className="mb-2 text-ink-muted">Üyelik ve ilan işlemleri sırasında aşağıdaki veriler işlenebilir:</p>
          <p className="text-ink-muted">
            Kimlik ve iletişim bilgileri (ad soyad veya firma unvanı, kullanıcı adı, e-posta, telefon,
            adres, şehir); bayi hesapları için güncel faaliyet belgesi ve imza sirküleri gibi resmi
            belgeler; ilan içerikleri ve fotoğraflar; alıcı-satıcı arasındaki mesajlaşma içerikleri; hesap
            güvenliği için şifrenin şifrelenmiş (hash&apos;lenmiş) hâli; site kullanımına dair teknik veriler
            (IP adresi, tarayıcı bilgisi, görüntülenme istatistikleri).
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">3. İşleme Amaçları</h2>
          <p className="text-ink-muted">
            Kişisel verileriniz; üyelik oluşturma ve kimlik doğrulama, ilan yayınlama ve yönetme,
            alıcı-satıcı arasında iletişim kurulmasını sağlama, bayi başvurularının incelenip
            onaylanması, dolandırıcılık ve kötüye kullanımın önlenmesi, yasal yükümlülüklerin yerine
            getirilmesi ve Platform&apos;un güvenliğinin sağlanması amaçlarıyla işlenir.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">4. Aktarım</h2>
          <p className="text-ink-muted">
            Kişisel verileriniz, yalnızca hizmetin sunulması için gerekli olduğu ölçüde barındırma
            (hosting), bulut depolama ve altyapı hizmeti aldığımız tedarikçilerimizle ve yasal
            zorunluluk hâlinde yetkili kamu kurum ve kuruluşlarıyla paylaşılabilir. Verileriniz
            pazarlama amacıyla üçüncü taraflara satılmaz veya kiralanmaz.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">5. Saklama Süresi</h2>
          <p className="text-ink-muted">
            Kişisel veriler, ilgili işleme amacının gerektirdiği süre boyunca ve mevzuatta öngörülen
            yasal saklama süreleri boyunca muhafaza edilir; bu sürelerin sonunda silinir, yok edilir
            veya anonim hâle getirilir.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">6. Çerezler</h2>
          <p className="text-ink-muted">
            Platform, oturumunuzu yönetmek ve tercihlerinizi hatırlamak amacıyla zorunlu çerezler
            kullanır. Sitede gezinmeye devam ederek çerez kullanımını kabul etmiş olursunuz; tarayıcı
            ayarlarınızdan çerezleri yönetebilir veya silebilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">7. KVKK Kapsamındaki Haklarınız</h2>
          <p className="mb-2 text-ink-muted">KVKK&apos;nın 11. maddesi uyarınca her veri sahibi;</p>
          <p className="text-ink-muted">
            kişisel verisinin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme,
            işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya
            yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini
            isteme, silinmesini veya yok edilmesini isteme, bu işlemlerin aktarıldığı üçüncü kişilere
            bildirilmesini isteme, işlenen verilerin münhasıran otomatik sistemler ile analiz edilmesi
            nedeniyle aleyhine bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işlenmesi
            sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme haklarına sahiptir.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">8. Başvuru ve İletişim</h2>
          <p className="text-ink-muted">
            Yukarıdaki haklarınızı kullanmak için taleplerinizi, kayıtlı e-posta adresinizden{" "}
            <strong className="text-ink">[iletişim e-postası buraya eklenecek]</strong> adresine
            iletebilirsiniz. Talepleriniz, mevzuatta öngörülen süreler içinde değerlendirilip
            sonuçlandırılır.
          </p>
        </section>
      </div>

      <div className="mt-10 border-t border-border pt-4 text-sm">
        <Link href="/kullanim-sartlari" className="font-semibold text-blueprint hover:underline">
          Kullanım Şartları →
        </Link>
      </div>
    </div>
  );
}
