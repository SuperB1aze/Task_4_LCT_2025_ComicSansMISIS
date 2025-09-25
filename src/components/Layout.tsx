import React from 'react'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex bg-transparent">
      <Sidebar />
      <main className="flex-1 bg-transparent">
        {children}
      </main>
    </div>
  )
}