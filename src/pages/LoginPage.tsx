import { Eye, EyeOff, Lock, User, CandlestickChart } from 'lucide-react'
import { motion } from 'framer-motion'
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const { login, error, loading } = useAuthStore()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const ok = await login(username, password)
    if (ok) navigate('/dashboard')
  }

  return <div className="grid min-h-screen grid-cols-1 bg-terminal-bg-primary lg:grid-cols-2">
    <div className="flex items-center justify-center bg-white px-8 py-10">
      <motion.form onSubmit={onSubmit} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-slate-800"><CandlestickChart size={18} /><span className="font-semibold">QuantEdge Terminal</span></div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">Professional options trading infrastructure.</p>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Username</label>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2"><User size={16} className="text-slate-400" /><input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full bg-transparent text-sm text-slate-800 outline-none"/></div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Password</label>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2"><Lock size={16} className="text-slate-400" /><input type={show?'text':'password'} value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full bg-transparent text-sm text-slate-800 outline-none"/><button type="button" onClick={()=>setShow(!show)} className="text-slate-400">{show?<EyeOff size={16}/>:<Eye size={16}/>}</button></div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-terminal-accent-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">{loading ? 'Signing In...' : 'Sign In'}</button>
      </motion.form>
    </div>
    <div className="relative hidden overflow-hidden bg-terminal-bg-secondary lg:block">
      <div className="absolute inset-0 bg-gradient-to-br from-terminal-bg-secondary via-terminal-bg-elevated to-terminal-bg-primary" />
      <div className="relative z-10 flex h-full flex-col justify-center p-12">
        <p className="text-label-xs uppercase tracking-[0.08em] text-terminal-text-secondary">Institutional Suite</p>
        <h2 className="mt-3 text-4xl font-bold text-terminal-text-primary">Professional Options Trading Infrastructure</h2>
        <p className="mt-4 max-w-xl text-secondary-sm text-terminal-text-secondary">Deploy strategies with precision execution, deep option-chain analytics, and resilient workstation tooling trusted by serious derivatives desks.</p>
      </div>
    </div>
  </div>
}
