'use client';
import { useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/lib/utils/firebase';
import { apiRequest } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage(){
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone'|'otp'>('phone');
  const [confirmation, setConfirmation] = useState<any>(null);
  const setToken = useAuthStore((s)=>s.setToken);
  const router = useRouter();

  const sendOtp = async ()=>{ try {
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
    const result = await signInWithPhoneNumber(auth, phone, verifier);
    setConfirmation(result); setStep('otp'); toast.success('OTP sent');
  } catch { toast.error('Failed to send OTP'); }};

  const verifyOtp = async ()=>{ try {
    const userCred = await confirmation.confirm(otp);
    const idToken = await userCred.user.getIdToken();
    const response = await apiRequest('/auth/verify-otp',{method:'POST',body:JSON.stringify({id_token:idToken,phone_number:phone})});
    setToken(response.access_token); toast.success('Logged in'); router.push('/dashboard');
  } catch { toast.error('OTP verification failed'); }};

  return <main className='min-h-screen flex items-center justify-center'><div id='recaptcha-container'/><div className='glass p-8 rounded-xl w-[420px] space-y-4'><h2 className='text-2xl font-semibold'>Phone Login</h2>{step==='phone'?<><input className='w-full p-2 rounded bg-zinc-900' value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder='+14155552671'/><button className='w-full p-2 rounded bg-indigo-500' onClick={sendOtp}>Send OTP</button></>:<><input className='w-full p-2 rounded bg-zinc-900' value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder='123456'/><button className='w-full p-2 rounded bg-indigo-500' onClick={verifyOtp}>Verify OTP</button></>}</div></main>
}
