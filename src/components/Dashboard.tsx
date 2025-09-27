import React from 'react'
import { BarChart3, Users, TrendingUp, Calendar } from 'lucide-react'

const Dashboard = () => {
  const stats = [
    { name: 'Toplam Takipçi', value: '12,345', icon: Users, change: '+12%' },
    { name: 'Bu Ay Etkileşim', value: '8,432', icon: TrendingUp, change: '+18%' },
    { name: 'Planlanan Gönderiler', value: '24', icon: Calendar, change: '+3' },
    { name: 'Analitik Puanı', value: '87', icon: BarChart3, change: '+5%' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <div className="text-sm text-gray-500">
          Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Son Aktiviteler
          </h3>
          <div className="space-y-4">
            {[
              { platform: 'Instagram', action: 'Yeni gönderi paylaşıldı', time: '2 saat önce' },
              { platform: 'Twitter', action: 'Tweet planlandı', time: '4 saat önce' },
              { platform: 'Facebook', action: 'Sayfa güncellendi', time: '1 gün önce' },
              { platform: 'LinkedIn', action: 'Makale paylaşıldı', time: '2 gün önce' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.platform}</span> - {activity.action}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard