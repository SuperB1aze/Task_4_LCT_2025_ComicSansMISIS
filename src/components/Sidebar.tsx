import { Link, useLocation } from 'react-router-dom'

const navigation = [
  { name: 'Главная', href: '/', icon: '/assets/menu.svg?v=2' },
  { name: 'Выдача', href: '/inventory', icon: '/assets/instruments.svg' },
  { name: 'Сдача', href: '/tools', icon: '/assets/instruments.svg' },
  { name: 'Q&A', href: '/reports', icon: '/assets/fixwheel.svg' },
]

export const Sidebar = () => {
  const location = useLocation()

  return (
    <div className="w-20 bg-white/90 backdrop-blur-sm min-h-screen flex flex-col items-center py-6 rounded-r-2xl border-r border-white/20 shadow-2xl">
      {/* Navigation Items */}
      <nav className="space-y-6 mt-8">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-primary-100 text-primary-500'
                  : 'text-gray-900 hover:bg-gray-50'
              }`}
            >
              <img 
                src={item.icon} 
                alt={item.name}
                className="w-6 h-6 mb-1" 
                style={{ objectFit: 'contain' }}
              />
              <span className="text-xs font-medium transition-all duration-200 ease-out whitespace-nowrap">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
