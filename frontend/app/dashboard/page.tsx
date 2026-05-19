'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

export default function Dashboard(){
  const token = useAuthStore((s)=>s.token); const setToken = useAuthStore((s)=>s.setToken); const router=useRouter();
  useEffect(()=>{ if(!token) router.push('/login'); },[token, router]);
  return <main className='min-h-screen flex'><aside className='w-64 border-r border-white/10 p-4 space-y-3'><h3 className='font-semibold'>SaaS</h3><nav className='space-y-2 text-zinc-300'><p>Dashboard</p><p>Analytics</p><p>Users</p><p>Settings</p><button onClick={()=>{setToken(null);router.push('/')}}>Logout</button></nav></aside><section className='flex-1 p-8'><div className='glass rounded-2xl p-8'><div className='flex justify-between'><h1 className='text-3xl'>Welcome</h1><Link href='#'>Notifications</Link></div><p className='text-zinc-400 mt-4'>Modular workspace ready for future SaaS modules.</p></div></section></main>
}
