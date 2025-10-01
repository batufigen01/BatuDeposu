import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SocialAccounts } from './SocialAccounts';
import { ScheduledPosts } from './ScheduledPosts';
import { Analytics } from './Analytics';
import { LayoutDashboard, Calendar, BarChart3, Users, LogOut } from 'lucide-react';

type TabType = 'overview' | 'accounts' | 'schedule' | 'analytics';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('accounts');
  const { profile, signOut } = useAuth();

  const tabs = [
    { id: 'overview' as TabType, label: 'Genel Bakış', icon: LayoutDashboard },
    { id: 'accounts' as TabType, label: 'Sosyal Hesaplar', icon: Users },
    { id: 'schedule' as TabType, label: 'Gönderi Planlama', icon: Calendar },
    { id: 'analytics' as TabType, label: 'Analitik', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-slate-900">SosyalPro</h1>
              <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {profile?.subscription_tier}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{profile?.full_name}</p>
                <p className="text-xs text-slate-500">{profile?.email}</p>
              </div>
              <button
                onClick={signOut}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Çıkış Yap"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="text-center py-12">
            <LayoutDashboard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Genel Bakış</h2>
            <p className="text-slate-600">Dashboard özet bilgileri yakında eklenecek</p>
          </div>
        )}

        {activeTab === 'accounts' && <SocialAccounts />}
        {activeTab === 'schedule' && <ScheduledPosts />}
        {activeTab === 'analytics' && <Analytics />}
      </main>
    </div>
  );
}
