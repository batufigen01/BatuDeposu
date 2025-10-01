import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Platform {
  id: string;
  name: string;
  color: string;
  description: string;
}

const platforms: Platform[] = [
  { id: 'instagram', name: 'Instagram', color: 'from-pink-500 to-orange-500', description: 'Fotoğraf ve video paylaşımı' },
  { id: 'facebook', name: 'Facebook', color: 'from-blue-600 to-blue-700', description: 'Sosyal ağ ve topluluk' },
  { id: 'linkedin', name: 'LinkedIn', color: 'from-blue-700 to-blue-800', description: 'Profesyonel ağ' },
  { id: 'youtube', name: 'YouTube', color: 'from-red-600 to-red-700', description: 'Video paylaşım platformu' },
  { id: 'pinterest', name: 'Pinterest', color: 'from-red-600 to-red-800', description: 'Görsel keşif platformu' },
  { id: 'tiktok', name: 'TikTok', color: 'from-slate-900 to-slate-800', description: 'Kısa video platformu' },
  { id: 'twitter', name: 'X (Twitter)', color: 'from-slate-900 to-slate-800', description: 'Mikroblog platformu' },
  { id: 'snapchat', name: 'Snapchat', color: 'from-yellow-400 to-yellow-500', description: 'Geçici içerik paylaşımı' },
  { id: 'twitch', name: 'Twitch', color: 'from-purple-600 to-purple-700', description: 'Canlı yayın platformu' },
];

interface AddAccountModalProps {
  onClose: () => void;
  onAccountAdded: () => void;
}

export function AddAccountModal({ onClose, onAccountAdded }: AddAccountModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [accountName, setAccountName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlatform || !user) return;

    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('social_accounts')
        .insert([
          {
            user_id: user.id,
            platform: selectedPlatform,
            account_id: accountId || `${selectedPlatform}_${Date.now()}`,
            account_name: accountName,
            is_active: true,
          },
        ]);

      if (insertError) throw insertError;

      onAccountAdded();
    } catch (err: any) {
      console.error('Error adding account:', err);
      setError(err.message || 'Hesap eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Sosyal Hesap Ekle</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!selectedPlatform ? (
            <div>
              <p className="text-slate-600 mb-6">
                Bağlamak istediğiniz platformu seçin
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className="flex items-center space-x-4 p-4 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                      {platform.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900">{platform.name}</h3>
                      <p className="text-sm text-slate-600 truncate">{platform.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${platforms.find(p => p.id === selectedPlatform)?.color} flex items-center justify-center text-white font-bold`}>
                  {platforms.find(p => p.id === selectedPlatform)?.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {platforms.find(p => p.id === selectedPlatform)?.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlatform(null);
                      setAccountName('');
                      setAccountId('');
                      setError('');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Değiştir
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Demo Mod:</strong> Şu anda OAuth entegrasyonu aktif değil.
                  Hesap bilgilerini manuel olarak girebilirsiniz. Gerçek entegrasyon için
                  backend OAuth akışı kurulması gerekiyor.
                </p>
              </div>

              <div>
                <label htmlFor="accountName" className="block text-sm font-medium text-slate-700 mb-2">
                  Hesap Adı / Kullanıcı Adı
                </label>
                <input
                  id="accountName"
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="örnek: kullanici_adi"
                />
              </div>

              <div>
                <label htmlFor="accountId" className="block text-sm font-medium text-slate-700 mb-2">
                  Hesap ID (Opsiyonel)
                </label>
                <input
                  id="accountId"
                  type="text"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Platform hesap ID'si"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Bağlanıyor...' : 'Hesabı Bağla'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
