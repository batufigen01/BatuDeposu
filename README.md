# SosyalPro (Vite + React + TS)

Bu repo, SosyalPro'nun demo arayüzünü içerir. Aşağıdaki adımlarla ortam değişkenlerini ve OAuth bağlantılarını ayarlayabilirsiniz.

## Kurulum

```bash
npm install
```

## Geliştirme Sunucusu

```bash
npm run dev
```

## Ortam Değişkenleri

Aşağıdaki değerleri `.env.local` dosyanıza ekleyin (örnek için `.env.example` dosyasına bakın):

```
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Demo video (YouTube embed veya MP4)
VITE_DEMO_VIDEO_URL=https://www.youtube.com/embed/VIDEO_ID

# OAuth başlangıç URL'leri (backend yönlendirme uçları)
VITE_OAUTH_INSTAGRAM_URL=https://your-backend.example.com/oauth/instagram/start
VITE_OAUTH_FACEBOOK_URL=https://your-backend.example.com/oauth/facebook/start
VITE_OAUTH_LINKEDIN_URL=https://your-backend.example.com/oauth/linkedin/start
VITE_OAUTH_YOUTUBE_URL=https://your-backend.example.com/oauth/google/start?scope=youtube
VITE_OAUTH_PINTEREST_URL=https://your-backend.example.com/oauth/pinterest/start
VITE_OAUTH_TIKTOK_URL=https://your-backend.example.com/oauth/tiktok/start
VITE_OAUTH_X_URL=https://your-backend.example.com/oauth/twitter/start
VITE_OAUTH_SNAPCHAT_URL=https://your-backend.example.com/oauth/snapchat/start
VITE_OAUTH_TWITCH_URL=https://your-backend.example.com/oauth/twitch/start
```

## OAuth Entegrasyon Mimarisi (Öneri)

- **Frontend (bu proje)**
  - `Sosyal Hesaplar > Hesap Ekle` modalında platform seçildiğinde ilgili `VITE_OAUTH_*` URL'ine yönlendirir.
  - Callback tamamlandıktan sonra UI, `social_accounts` tablosunu sorgulayacak şekilde güncellenebilir.

- **Backend (önerilen uç noktalar)**
  - `GET /oauth/:provider/start`: İlgili sağlayıcının OAuth ekranına yönlendirir.
  - `GET /oauth/:provider/callback`: Yetkilendirme kodu ile çağrılır; access/refresh token alınır, Supabase'e (veya veritabanınıza) kaydedilir, frontende redirect edilir.

- **Supabase tablo şeması (öneri)**
  - Tablo: `social_accounts`
    - `id` (uuid, pk)
    - `user_id` (uuid)
    - `platform` (text)
    - `account_id` (text)
    - `account_name` (text)
    - `access_token` (encrypted)
    - `refresh_token` (encrypted, nullable)
    - `expires_at` (timestamp, nullable)
    - `created_at` (timestamp)
    - `updated_at` (timestamp)

> Not: Token'ları istemci tarafında tutmayın. Sunucuda saklayın ve yalnızca gerekli kısa özet bilgileri (hesap adı vb.) istemciye gönderin.

## Özellik Durumu

- [x] Supabase istemcisi (`src/lib/supabase.ts`)
- [x] Giriş/Kayıt akışı (şartlar ve gizlilik onayı zorunlu)
- [x] Landing sayfası modal linkleri
- [x] Paketler ve fiyatlar
- [x] Sosyal Hesaplar sayfası
  - [x] Boş durum + Hesap Ekle modali
  - [x] Çoklu platform listesi (Instagram, Facebook, LinkedIn, YouTube, Pinterest, TikTok, X, Snapchat, Twitch)
  - [x] OAuth URL'ine yönlendirme (env tabanlı)
- [x] Gönderi Planlama boş başlangıç
- [x] Analitik sayfası (boş durum + yönlendirmeler)

## Yol Haritası

- [ ] Backend OAuth akışı (Node/Next.js veya mevcut backend)
- [ ] Callback sonrası hesap kaydı ve UI yenileme
- [ ] Gerçek analitik grafikleri (Chart.js/Recharts) ve tarih filtreleri
- [ ] Supabase RLS politikaları ve güvenlik iyileştirmeleri
