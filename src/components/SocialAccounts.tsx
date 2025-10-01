import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { SocialAccount } from '../types';
import { AddAccountModal } from './AddAccountModal';

const platformConfig = {
  instagram: { name: 'Instagram', color: 'from-pink-500 to-orange-500' },
  facebook: { name: 'Facebook', color: 'from-blue-600 to-blue-700' },
  linkedin: { name: 'LinkedIn', color: 'from-blue-700 to-blue-800' },
  youtube: { name: 'YouTube', color: 'from-red-600 to-red-700' },
  pinterest: { name: 'Pinterest', color: 'from-red-600 to-red-800' },
  tiktok: { name: 'TikTok', color: 'from-slate-900 to-slate-800' },
  twitter: { name: 'X (Twitter)', color: 'from-slate-900 to-slate-800' },
  snapchat: { name: 'Snapchat', color: 'from-yellow-400 to-yellow-500' },
  twitch: { name: 'Twitch', color: 'from-purple-600 to-purple-700' },
};

export function SocialAccounts() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadAccounts();
  }, [user]);

  const loadAccounts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('connected_at', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountAdded = () => {
    loadAccounts();
    setShowModal(false);
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm('Bu hesabı kaldırmak istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', accountId);

      if (error) throw error;
      loadAccounts();
    } catch (error) {
      console.error('Error disconnecting account:', error);
      alert('Hesap kaldırılırken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sosyal Hesaplar</h2>
          <p className="text-slate-600 mt-1">Sosyal medya hesaplarınızı bağlayın ve yönetin</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Hesap Ekle</span>
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Henüz bağlı hesap yok
            </h3>
            <p className="text-slate-600 mb-6">
              Sosyal medya hesaplarınızı bağlayarak içerik yönetimini tek bir yerden yapın
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>İlk Hesabınızı Ekleyin</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => {
            const config = platformConfig[account.platform];
            return (
              <div
                key={account.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center text-white font-bold`}>
                    {account.platform.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={() => handleDisconnect(account.id)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Hesabı Kaldır"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{config.name}</h3>
                <p className="text-sm text-slate-600 mb-3">@{account.account_name}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded-full ${
                    account.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {account.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                  <span className="text-slate-500">
                    {new Date(account.connected_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <AddAccountModal
          onClose={() => setShowModal(false)}
          onAccountAdded={handleAccountAdded}
        />
      )}
    </div>
  );
}
