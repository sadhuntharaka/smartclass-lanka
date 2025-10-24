import { useState } from 'react'
import { signInTeacher } from '../services/firebase'
import { useNavigate } from 'react-router-dom'
export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [err,setErr]=useState(''); const nav=useNavigate()
  const onSubmit=async e=>{ e.preventDefault(); setErr(''); const teacher=await signInTeacher(email,password); if(!teacher){ setErr('Invalid credentials or suspended'); return } sessionStorage.setItem('teacher_id', teacher.id); nav('/dashboard') }
  return (<div className="max-w-md mx-auto card mt-10"><h2 className="text-xl font-bold mb-4">Teacher Login</h2>
    <form onSubmit={onSubmit} className="space-y-3">
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input type="password" className="input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button className="btn w-full">Login</button>
    </form></div>)
}