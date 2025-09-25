import React from 'react'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
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
      <Sidebar />
      <main className="flex-1 bg-transparent">
        {children}
      </main>
    </div>
  )
}