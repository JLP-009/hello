import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './styles.css'
import { LoginPage } from './pages/LoginPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { TerminalPage } from './pages/TerminalPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><TerminalPage section="Dashboard" /></ProtectedRoute>} />
        <Route path="/option-chain" element={<ProtectedRoute><TerminalPage section="Option Chain" /></ProtectedRoute>} />
        <Route path="/strategy-builder" element={<ProtectedRoute><TerminalPage section="Strategy Builder" /></ProtectedRoute>} />
        <Route path="/positions" element={<ProtectedRoute><TerminalPage section="Positions" /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><TerminalPage section="Orders" /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><TerminalPage section="Analytics" /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
