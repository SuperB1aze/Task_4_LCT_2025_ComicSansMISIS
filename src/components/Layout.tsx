import React from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div 
      className="min-h-screen flex bg-transparent"
      style={{ 
        backgroundImage: 'url(/assets/background.svg)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat' 
      }}
    >
      {!isHomePage && <Sidebar />}
      <main className="flex-1 bg-transparent">
        {children}
      </main>
    </div>
  )
}