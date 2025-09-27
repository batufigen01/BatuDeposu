import React, { useState } from 'react'
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const SocialAuth = () => {
  const [connectedAccounts, setConnectedAccounts] = useState([
    { platform: 'Instagram', username: '@sosyalpro', connected: true, followers: '12.5K' },
    { platform: 'Twitter', username: '@sosyalpro_tr', connected: true, followers: '8.2K' }
  ])

  const availablePlatforms = [
    { name: 'Instagram', icon: Instagram, color: 'bg-pink-500', connected: true },
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600', connected: false },
    { name: 'Twitter', icon: Twitter, color: 'bg-blue-400', connected: true },
    { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700', connected: false },
    { name: 'YouTube', icon: Youtube, color: 'bg-red-600', connected: false },
    { name: 'TikTok', icon: () => <div className="w-6 h-6 bg-black rounded"></div>, color: 'bg-black', connected: false }
  ]

  const handleConnect = (platform: string) => {
    // OAuth entegrasyonu burada yapılacak
    console.log(`${platform} bağlantısı başlatılıyor...`)
    alert(`${platform} OAuth entegrasyonu henüz aktif değil. Geliştirme aşamasında...`)
  }

  const handleDisconnect = (platform: string) => {
    setConnectedAccounts(prev => prev.filter(acc => acc.platform !== platform))
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Sosyal Medya Hesapları</h2>
        <p className="mt-4 text-lg text-gray-600">
          Sosyal medya hesaplarınızı bağlayın ve tek yerden yönetin
        </p>
      </div>

      {/* Connected Accounts */}
      {connectedAccounts.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            Bağlı Hesaplar
          </h3>
          
          <div className="space-y-4">
            {connectedAccounts.map((account, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{account.platform}</h4>
                    <p className="text-sm text-gray-500">{account.username}</p>
                    <p className="text-sm text-gray-500">{account.followers} takipçi</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Aktif
                  </span>
                  <button
                    onClick={() => handleDisconnect(account.platform)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Bağlantıyı Kes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Platforms */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Plus className="h-6 w-6 text-indigo-600 mr-2" />
          Hesap Ekle
        </h3>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availablePlatforms.map((platform) => (
            <div
              key={platform.name}
              className={`relative p-6 border-2 rounded-lg transition-all ${
                platform.connected
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 hover:border-indigo-300 hover:shadow-md cursor-pointer'
              }`}
              onClick={() => !platform.connected && handleConnect(platform.name)}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center`}>
                  <platform.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{platform.name}</h4>
                  <p className="text-sm text-gray-500">
                    {platform.connected ? 'Bağlı' : 'Bağlantı kur'}
                  </p>
                </div>
                {platform.connected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Plus className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OAuth Status */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Geliştirme Aşamasında</h4>
            <p className="text-sm text-yellow-700 mt-1">
              OAuth entegrasyonları şu anda geliştirme aşamasındadır. 
              Gerçek bağlantılar için backend API'lerinin yapılandırılması gerekmektedir.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialAuth