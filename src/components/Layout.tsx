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
    <div className="min-h-screen flex bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/assets/background.svg)' }}>
      {!isHomePage && <Sidebar />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}