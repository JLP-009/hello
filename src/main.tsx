import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './styles.css'
import { LoginPage } from './pages/LoginPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { TerminalPage } from './pages/TerminalPage'

const protectedSections = [
  { path: '/dashboard', section: 'Dashboard' },
  { path: '/option-chain', section: 'Option Chain' },
  { path: '/strategy-builder', section: 'Strategy Builder' },
  { path: '/positions', section: 'Positions' },
  { path: '/orders', section: 'Orders' },
  { path: '/analytics', section: 'Analytics' },
  { path: '/settings', section: 'Settings' },
  { path: '/signals', section: 'Signals' },
  { path: '/alerts', section: 'Alerts' },
  { path: '/backtesting', section: 'Backtesting' },
]

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        {protectedSections.map((r) => (
          <Route
            key={r.path}
            path={r.path}
            element={
              <ProtectedRoute>
                <TerminalPage section={r.section} />
              </ProtectedRoute>
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
