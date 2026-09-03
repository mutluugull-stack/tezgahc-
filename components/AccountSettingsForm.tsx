"use client";

import { useEffect, useState } from "react";
import { CITIES } from "@/lib/constants";

type Profile = {
  username: string;
  email: string;
  accountType: "BIREYSEL" | "BAYI";
  fullName: string | null;
  companyName: string | null;
  phone: string | null;
  city: string | null;
  address: string | null;
  role: string | null;
  logoUrl: string | null;
};

// Yönetici Paneli > Ayarlar ve Bayi Paneli > Ayarlar sayfalarında ortak
// kullanılan hesap ayarları formu: profil bilgileri + şifre değiştirme.
export default function AccountSettingsForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ fullName: "", companyName: "", phone: "", city: "", address: "" });
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", newPassword2: "" });
  const [pwBusy, setPwBusy] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState("");

  useEffect(() => {
    fetch("/api/account/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setProfile(data.user);
        setForm({
          fullName: data.user.fullName || "",
          companyName: data.user.companyName || "",
          phone: data.user.phone || "",
          city: data.user.city || "",
          address: data.user.address || "",
        });
      });
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileBusy(true);
    setProfileMsg("");
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setProfileMsg(res.ok ? "Bilgileriniz güncellendi." : "Güncellenemedi, tekrar deneyin.");
    } finally {
      setProfileBusy(false);
    }
  }

  async function uploadLogo(file: File) {
    setLogoUploading(true);
    setLogoError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "logos");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setLogoError(data.error || "Logo yüklenemedi.");
        return;
      }
      const patchRes = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoUrl: data.url }),
      });
      if (!patchRes.ok) {
        setLogoError("Logo kaydedilemedi.");
        return;
      }
      setProfile((p) => (p ? { ...p, logoUrl: data.url } : p));
    } catch {
      setLogoError("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setLogoUploading(false);
    }
  }

  async function removeLogo() {
    setLogoUploading(true);
    setLogoError("");
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoUrl: "" }),
      });
      if (res.ok) setProfile((p) => (p ? { ...p, logoUrl: null } : p));
    } finally {
      setLogoUploading(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwMsg("");
    if (pwForm.newPassword !== pwForm.newPassword2) {
      setPwError("Yeni şifreler eşleşmiyor.");
      return;
    }
    setPwBusy(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data.error || "Şifre değiştirilemedi.");
        return;
      }
      setPwMsg("Şifreniz değiştirildi.");
      setPwForm({ currentPassword: "", newPassword: "", newPassword2: "" });
    } finally {
      setPwBusy(false);
    }
  }

  if (!profile) {
    return <p className="text-sm text-ink-muted">Yükleniyor...</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      {profile.accountType === "BAYI" && !profile.role && (
        <div className="card flex flex-col gap-3 p-5">
          <h2 className="font-display text-lg font-semibold">Firma Logosu</h2>
          <p className="text-xs text-ink-muted">
            Logonuz ilan detay sayfanızda ve bayi panelinizde görünür. JPEG, PNG veya WEBP, en fazla 8MB.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface2">
              {profile.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.logoUrl} alt="Firma logosu" className="h-full w-full object-contain" />
              ) : (
                <span className="text-[10px] text-ink-muted">Logo yok</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="input inline-flex w-fit cursor-pointer items-center rounded-lg px-3 py-1.5 text-xs font-semibold">
                {logoUploading ? "Yükleniyor..." : "Logo Yükle"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={logoUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadLogo(file);
                  }}
                  className="hidden"
                />
              </label>
              {profile.logoUrl && (
                <button
                  type="button"
                  onClick={removeLogo}
                  disabled={logoUploading}
                  className="w-fit text-xs font-medium text-ink-muted hover:text-red-500 disabled:opacity-60"
                >
                  Logoyu Kaldır
                </button>
              )}
              {logoError && <p className="text-xs text-red-500">{logoError}</p>}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={saveProfile} className="card flex flex-col gap-4 p-5">
        <h2 className="font-display text-lg font-semibold">Profil Bilgileri</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Kullanıcı Adı
            </label>
            <input value={profile.username} disabled className="input w-full rounded-lg px-3 py-2.5 text-sm opacity-60" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              E-posta
            </label>
            <input value={profile.email} disabled className="input w-full rounded-lg px-3 py-2.5 text-sm opacity-60" />
          </div>
          {profile.accountType === "BIREYSEL" ? (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Ad Soyad
              </label>
              <input
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                className="input w-full rounded-lg px-3 py-2.5 text-sm"
              />
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {profile.role ? "Ad Soyad" : "Firma Adı"}
              </label>
              <input
                value={profile.role ? form.fullName : form.companyName}
                onChange={(e) =>
                  setForm((f) => (profile.role ? { ...f, fullName: e.target.value } : { ...f, companyName: e.target.value }))
                }
                className="input w-full rounded-lg px-3 py-2.5 text-sm"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Telefon
            </label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Şehir
            </label>
            <select
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            >
              <option value="">Seçin</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Açık Adres
            </label>
            <textarea
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              rows={2}
              placeholder="Mahalle, cadde, no, ilçe..."
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
        </div>
        {profileMsg && <p className="text-sm text-ink-muted">{profileMsg}</p>}
        <button disabled={profileBusy} type="submit" className="btn-accent self-start rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60">
          {profileBusy ? "Kaydediliyor..." : "Bilgileri Kaydet"}
        </button>
      </form>

      <form onSubmit={changePassword} className="card flex flex-col gap-4 p-5">
        <h2 className="font-display text-lg font-semibold">Şifre Değiştir</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Mevcut Şifre
            </label>
            <input
              type="password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Yeni Şifre
            </label>
            <input
              type="password"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Yeni Şifre (Tekrar)
            </label>
            <input
              type="password"
              value={pwForm.newPassword2}
              onChange={(e) => setPwForm((f) => ({ ...f, newPassword2: e.target.value }))}
              className="input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
        </div>
        {pwError && <p className="text-sm text-red-500">{pwError}</p>}
        {pwMsg && <p className="text-sm text-emerald-600">{pwMsg}</p>}
        <button disabled={pwBusy} type="submit" className="input self-start rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60">
          {pwBusy ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
        </button>
      </form>
    </div>
  );
}
