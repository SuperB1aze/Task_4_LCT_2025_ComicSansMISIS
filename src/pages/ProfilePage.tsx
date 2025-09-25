import { useState } from 'react'
import { User, Settings, Bell, Shield, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export const ProfilePage = () => {
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card p-8">
          {/* Header */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.name || 'Профиль пользователя'}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500">{user?.department}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 border-b border-gray-200 mb-8">
            {[
              { id: 'profile', label: 'Профиль', icon: User },
              { id: 'settings', label: 'Настройки', icon: Settings },
              { id: 'notifications', label: 'Уведомления', icon: Bell },
              { id: 'security', label: 'Безопасность', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 pb-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Отдел
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.department}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Роль
                  </label>
                  <select className="input w-full">
                    <option value="engineer">Инженер</option>
                    <option value="supervisor">Супервизор</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button className="btn btn-outline">
                  Отмена
                </button>
                <button className="btn btn-primary">
                  Сохранить изменения
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Общие настройки
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
                    <span className="text-sm text-gray-700">
                      Получать уведомления по email
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
                    <span className="text-sm text-gray-700">
                      Автоматическое сканирование QR-кодов
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
                    <span className="text-sm text-gray-700">
                      Темная тема
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Настройки уведомлений
              </h3>
              
              <div className="space-y-4">
                <div className="card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Уведомления о выдаче инструментов
                      </h4>
                      <p className="text-sm text-gray-600">
                        Получать уведомления при выдаче инструментов
                      </p>
                    </div>
                    <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
                  </div>
                </div>
                
                <div className="card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Уведомления о возврате
                      </h4>
                      <p className="text-sm text-gray-600">
                        Получать уведомления при возврате инструментов
                      </p>
                    </div>
                    <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
                  </div>
                </div>
                
                <div className="card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Уведомления о техническом обслуживании
                      </h4>
                      <p className="text-sm text-gray-600">
                        Получать уведомления о необходимости ТО
                      </p>
                    </div>
                    <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Безопасность
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Текущий пароль
                  </label>
                  <input
                    type="password"
                    className="input w-full max-w-md"
                    placeholder="Введите текущий пароль"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Новый пароль
                  </label>
                  <input
                    type="password"
                    className="input w-full max-w-md"
                    placeholder="Введите новый пароль"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Подтвердите пароль
                  </label>
                  <input
                    type="password"
                    className="input w-full max-w-md"
                    placeholder="Подтвердите новый пароль"
                  />
                </div>
                
                <button className="btn btn-primary">
                  Изменить пароль
                </button>
              </div>
              
              <div className="border-t pt-6">
                <button
                  onClick={handleLogout}
                  className="btn btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Выйти из системы</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
