import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { ToolsPage } from './pages/ToolsPage'
import { InventoryPage } from './pages/InventoryPage'
import { ReportsPage } from './pages/ReportsPage'
import { ProfilePage } from './pages/ProfilePage'
import { SupportPage } from './pages/SupportPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
    </Layout>
  )
}

export default App