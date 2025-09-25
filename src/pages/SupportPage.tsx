import { useState } from 'react'
import { MessageCircle, Send, MoreVertical, Circle } from 'lucide-react'

export const SupportPage = () => {
  const [message, setMessage] = useState('')
  const [isOnline] = useState(true)

  const supportMessages = [
    {
      id: 1,
      title: 'Сканирование не пройдено',
      date: '23 ноября 2023',
      content: 'Проблема с распознаванием QR-кода при сдаче инструментов. Требуется помощь оператора.',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Ошибка при выдаче',
      date: '22 ноября 2023',
      content: 'Система не может найти инструмент по коду. Проверьте правильность ввода.',
      status: 'resolved'
    },
    {
      id: 3,
      title: 'Техническое обслуживание',
      date: '21 ноября 2023',
      content: 'Инструмент требует планового технического обслуживания.',
      status: 'in_progress'
    }
  ]

  const chatMessages = [
    {
      id: 1,
      sender: 'operator',
      message: 'Здравствуйте! Чем могу помочь?',
      timestamp: '14:30'
    },
    {
      id: 2,
      sender: 'user',
      message: 'У меня проблема со сканированием QR-кода',
      timestamp: '14:32'
    },
    {
      id: 3,
      sender: 'operator',
      message: 'Попробуйте очистить камеру и перезапустить приложение',
      timestamp: '14:35'
    }
  ]

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Support Messages List */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-gray-900">
                Оператор поддержки
              </h2>
              <div className="flex items-center space-x-2">
                <Circle 
                  size={8} 
                  className={isOnline ? 'text-green-500 fill-green-500' : 'text-gray-400'} 
                />
                <span className="text-sm text-gray-600">
                  {isOnline ? 'В сети' : 'Не в сети'}
                </span>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <MoreVertical size={20} />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {supportMessages.map((msg) => (
              <div key={msg.id} className="card p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{msg.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    msg.status === 'resolved' 
                      ? 'bg-green-100 text-green-800'
                      : msg.status === 'in_progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {msg.status === 'resolved' ? 'Решено' : 
                     msg.status === 'in_progress' ? 'В работе' : 'Ожидает'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{msg.content}</p>
                <p className="text-xs text-gray-500">{msg.date}</p>
              </div>
            ))}
          </div>

          <button className="btn btn-primary w-full">
            Начать поддержку
          </button>
        </div>

        {/* Chat Interface */}
        <div className="card p-6 flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Оператор поддержки</h3>
                <div className="flex items-center space-x-2">
                  <Circle 
                    size={6} 
                    className={isOnline ? 'text-green-500 fill-green-500' : 'text-gray-400'} 
                  />
                  <span className="text-xs text-gray-600">
                    {isOnline ? 'В сети' : 'Не в сети'}
                  </span>
                </div>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <MoreVertical size={16} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Сообщение..."
              className="input flex-1"
            />
            <button className="btn btn-primary px-4">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
