import React, { useState } from 'react'
import { Check, CreditCard, Shield } from 'lucide-react'

const Checkout = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro')

  const plans = [
    {
      id: 'starter',
      name: 'Başlangıç',
      price: '₺99',
      period: '/ay',
      features: [
        '3 sosyal medya hesabı',
        '50 gönderi/ay',
        'Temel analitikler',
        'Email destek'
      ]
    },
    {
      id: 'pro',
      name: 'Profesyonel',
      price: '₺199',
      period: '/ay',
      popular: true,
      features: [
        '10 sosyal medya hesabı',
        'Sınırsız gönderi',
        'Gelişmiş analitikler',
        'Öncelikli destek',
        'Takım işbirliği'
      ]
    },
    {
      id: 'enterprise',
      name: 'Kurumsal',
      price: '₺399',
      period: '/ay',
      features: [
        'Sınırsız hesap',
        'Sınırsız gönderi',
        'Özel analitikler',
        '7/24 destek',
        'API erişimi',
        'Özel entegrasyonlar'
      ]
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Planınızı Seçin</h2>
        <p className="mt-4 text-lg text-gray-600">
          İhtiyaçlarınıza en uygun planı seçin ve sosyal medya yönetiminizi profesyonelleştirin
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-2xl shadow-lg ${
              plan.popular ? 'ring-2 ring-indigo-500' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  En Popüler
                </span>
              </div>
            )}
            
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-lg text-gray-500">{plan.period}</span>
              </div>
              
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => setSelectedPlan(plan.id)}
                className={`mt-8 w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  selectedPlan === plan.id
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {selectedPlan === plan.id ? 'Seçildi' : 'Planı Seç'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Form */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <CreditCard className="h-6 w-6 text-indigo-600 mr-2" />
          <h3 className="text-xl font-bold text-gray-900">Ödeme Bilgileri</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kart Numarası
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kart Sahibi
            </label>
            <input
              type="text"
              placeholder="Ad Soyad"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Son Kullanma Tarihi
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV
            </label>
            <input
              type="text"
              placeholder="123"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Shield className="h-4 w-4 mr-1" />
            Güvenli ödeme - SSL şifreli
          </div>
          
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Ödemeyi Tamamla
          </button>
        </div>
      </div>
    </div>
  )
}

export default Checkout