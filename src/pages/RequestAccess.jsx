import { useState } from 'react'
import { db } from '../services/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
export default function RequestAccess(){
  const [form, setForm] = useState({ full_name:'', whatsapp:'', email:'', students:'', message:'' })
  const [ok, setOk] = useState(false)
  const submit = async (e)=>{
    e.preventDefault()
    await addDoc(collection(db, 'access_requests'), { ...form, created_at: serverTimestamp(), status:'new' })
    setOk(true); setForm({ full_name:'', whatsapp:'', email:'', students:'', message:'' })
  }
  if(ok) return (<div className="max-w-md mx-auto card mt-10"><h2 className="text-xl font-bold mb-2">Request sent ✅</h2><p>We will review and send your credentials via WhatsApp shortly.</p></div>)
  return (<div className="max-w-md mx-auto card mt-10">
    <h2 className="text-xl font-bold mb-4">Request Access (Free Month)</h2>
    <form onSubmit={submit} className="space-y-3">
      <input className="input" placeholder="Full Name" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} />
      <input className="input" placeholder="WhatsApp Number" value={form.whatsapp} onChange={e=>setForm({...form, whatsapp:e.target.value})} />
      <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
      <input className="input" placeholder="Estimated Students (e.g., 60)" value={form.students} onChange={e=>setForm({...form, students:e.target.value})} />
      <textarea className="input h-28" placeholder="Short message (subjects, classes, etc.)" value={form.message} onChange={e=>setForm({...form, message:e.target.value})} />
      <button className="btn w-full">Send Request</button>
    </form></div>)
}