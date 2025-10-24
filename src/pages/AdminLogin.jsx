import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
export default function AdminLogin(){
  const [u,setU]=useState(''); const [p,setP]=useState(''); const [err,setErr]=useState(''); const nav=useNavigate()
  const submit=e=>{ e.preventDefault(); if(u==='dimuthu'&&p==='2002'){ sessionStorage.setItem('admin','1'); nav('/admin') } else setErr('Invalid admin credentials') }
  return (<div className="max-w-md mx-auto card mt-10"><h2 className="text-xl font-bold mb-4">Admin Login</h2>
    <form onSubmit={submit} className="space-y-3">
      <input className="input" placeholder="Username" value={u} onChange={e=>setU(e.target.value)}/>
      <input type="password" className="input" placeholder="Password" value={p} onChange={e=>setP(e.target.value)}/>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button className="btn w-full">Login</button>
    </form></div>)
}