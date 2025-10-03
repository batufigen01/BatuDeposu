# OAuth Kurulum Rehberi

Bu rehber, sosyal medya platformlarının OAuth entegrasyonunu nasıl kuracağınızı gösterir.

## Genel Bakış

OAuth edge functions `supabase/functions/` dizininde bulunmaktadır:
- `oauth-instagram/` - Instagram OAuth
- `oauth-facebook/` - Facebook OAuth
- `oauth-linkedin/` - LinkedIn OAuth
- `oauth-twitter/` - Twitter/X OAuth

## Kurulum Adımları

### 1. Platform API Credentials Alma

Her platform için developer portalından OAuth credentials almanız gerekir:

#### Instagram
1. [Meta for Developers](https://developers.facebook.com/) sayfasına gidin
2. Yeni bir uygulama oluşturun
3. Instagram Basic Display API'yi ekleyin
4. Client ID ve Client Secret'i alın
5. Redirect URI'yi ayarlayın: `https://YOUR_PROJECT.supabase.co/functions/v1/oauth-instagram/callback`

#### Facebook
1. [Meta for Developers](https://developers.facebook.com/) sayfasına gidin
2. Yeni bir uygulama oluşturun
3. Facebook Login'i ekleyin
4. App ID ve App Secret'i alın
5. Redirect URI'yi ayarlayın: `https://YOUR_PROJECT.supabase.co/functions/v1/oauth-facebook/callback`

#### LinkedIn
1. [LinkedIn Developers](https://www.linkedin.com/developers/) sayfasına gidin
2. Yeni bir uygulama oluşturun
3. Client ID ve Client Secret'i alın
4. Redirect URL'yi ayarlayın: `https://YOUR_PROJECT.supabase.co/functions/v1/oauth-linkedin/callback`
5. Gerekli izinleri ekleyin: `openid`, `profile`, `w_member_social`

#### Twitter/X
1. [Twitter Developer Portal](https://developer.twitter.com/) sayfasına gidin
2. Yeni bir proje ve app oluşturun
3. OAuth 2.0 ayarlarını yapın
4. Client ID ve Client Secret'i alın
5. Callback URL'yi ayarlayın: `https://YOUR_PROJECT.supabase.co/functions/v1/oauth-twitter/callback`
6. OAuth 2.0 izinlerini ayarlayın

### 2. Edge Functions Deploy Etme

Edge functions'ları deploy etmek için Supabase CLI kullanmanıza gerek yok.
Aşağıdaki komutu kullanarak deploy edebilirsiniz:

```bash
# Instagram OAuth
supabase functions deploy oauth-instagram

# Facebook OAuth
supabase functions deploy oauth-facebook

# LinkedIn OAuth
supabase functions deploy oauth-linkedin

# Twitter OAuth
supabase functions deploy oauth-twitter
```

NOT: Eğer Supabase CLI kullanamıyorsanız, Supabase Dashboard'dan manuel olarak deploy edebilirsiniz.

### 3. Environment Variables Ayarlama

Supabase Dashboard'da Edge Functions secrets ayarlayın:

```bash
# Instagram
supabase secrets set INSTAGRAM_CLIENT_ID=your_value
supabase secrets set INSTAGRAM_CLIENT_SECRET=your_value

# Facebook
supabase secrets set FACEBOOK_CLIENT_ID=your_value
supabase secrets set FACEBOOK_CLIENT_SECRET=your_value

# LinkedIn
supabase secrets set LINKEDIN_CLIENT_ID=your_value
supabase secrets set LINKEDIN_CLIENT_SECRET=your_value

# Twitter
supabase secrets set TWITTER_CLIENT_ID=your_value
supabase secrets set TWITTER_CLIENT_SECRET=your_value

# Frontend URL
supabase secrets set FRONTEND_URL=https://your-domain.com
```

### 4. Frontend .env Dosyası

`.env` dosyanızda sadece Supabase credentials'ları olmalı:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## OAuth Akışı

1. Kullanıcı "Hesap Ekle" butonuna tıklar
2. Platform seçer (örn: Instagram)
3. "OAuth Bağlantısı" sekmesinde "Instagram ile Bağlan" butonuna tıklar
4. Edge function `/oauth-instagram/start` endpoint'ine yönlendirilir
5. Platform'un OAuth sayfasına yönlendirilir
6. Kullanıcı izinleri onaylar
7. Platform callback URL'ye yönlendirir: `/oauth-instagram/callback?code=...`
8. Edge function:
   - Authorization code'u access token ile değiştirir
   - Kullanıcı profilini çeker
   - `social_accounts` tablosuna kaydeder
   - Frontend'e geri yönlendirir

## Güvenlik Notları

1. **Access Token'lar Saklanmıyor**: Şu anki implementasyonda access token'lar saklanmıyor. Gerçek üretim ortamında:
   - Token'ları şifreleyerek database'de saklayın
   - Refresh token mekanizması ekleyin
   - Token expiration kontrolü yapın

2. **State Parameter**: CSRF koruması için state parameter kullanılıyor

3. **HTTPS Zorunlu**: OAuth callback'leri HTTPS gerektirir

## Test Etme

1. Uygulamayı çalıştırın
2. Kayıt olun / Giriş yapın
3. "Sosyal Hesaplar" sekmesine gidin
4. "Hesap Ekle" butonuna tıklayın
5. Bir platform seçin
6. "OAuth Bağlantısı" sekmesinde bağlan
7. Platform'un OAuth sayfasına yönlendirileceksiniz
8. İzinleri onaylayın
9. Başarılı bağlantı sonrası hesap listesinde görünecek

## Sorun Giderme

### "OAuth not configured" hatası
- Supabase secrets'ları kontrol edin
- Client ID ve Secret'in doğru ayarlandığından emin olun

### "Invalid redirect URI" hatası
- Platform developer console'da redirect URI'yi doğru ayarladığınızdan emin olun
- URI tam olarak eşleşmeli (trailing slash dahil)

### "State mismatch" hatası
- Cookie ayarlarını kontrol edin
- HTTPS kullandığınızdan emin olun

### Hesap eklenmedi
- Browser console'da hataları kontrol edin
- Supabase Edge Function logs'larını kontrol edin
- RLS politikalarının doğru ayarlandığından emin olun
