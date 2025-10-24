import { useEffect, useState } from 'react'
import { db } from '../../services/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
export default function AdminTeachers(){
  const [teachers,setTeachers]=useState([])
  const [form,setForm]=useState({ full_name:'', phone:'', email:'', password:'', subscription_start:'', subscription_end:'', student_limit:100, status:'active' })
  const load=async()=>{ const snap=await getDocs(collection(db,'teachers')); setTeachers(snap.docs.map(d=>({id:d.id,...d.data()}))) }
  useEffect(()=>{ if(!sessionStorage.getItem('admin')) return; load() },[])
  const add=async e=>{ e.preventDefault(); await addDoc(collection(db,'teachers'), form); setForm({ full_name:'', phone:'', email:'', password:'', subscription_start:'', subscription_end:'', student_limit:100, status:'active' }); load() }
  const remove=async id=>{ await deleteDoc(doc(db,'teachers',id)); load() }
  const suspend=async id=>{ await updateDoc(doc(db,'teachers',id), { status:'suspended' }); load() }
  const activate=async id=>{ await updateDoc(doc(db,'teachers',id), { status:'active' }); load() }
  return (<div className="max-w-6xl mx-auto px-4 py-6"><h2 className="text-xl font-bold mb-4">Teachers</h2>
    <form onSubmit={add} className="card grid md:grid-cols-3 gap-3 mb-4">
      <input className="input" placeholder="Full name" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}/>
      <input className="input" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
      <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
      <input className="input" placeholder="Temp password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
      <input type="date" className="input" value={form.subscription_start} onChange={e=>setForm({...form,subscription_start:e.target.value})}/>
      <input type="date" className="input" value={form.subscription_end} onChange={e=>setForm({...form,subscription_end:e.target.value})}/>
      <input className="input" placeholder="Student limit" value={form.student_limit} onChange={e=>setForm({...form,student_limit:e.target.value})}/>
      <button className="btn">Add Teacher</button></form>
    <div className="card overflow-x-auto"><table className="w-full text-sm">
      <thead><tr className="text-left"><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Limit</th><th>Sub End</th><th>Actions</th></tr></thead>
      <tbody>{teachers.map(t=>(<tr key={t.id} className="border-t"><td>{t.full_name}</td><td>{t.email}</td><td>{t.phone}</td><td>{t.status}</td><td>{t.student_limit}</td><td>{t.subscription_end||'-'}</td>
        <td className="space-x-2"><button className="btn-outline" onClick={()=>suspend(t.id)}>Suspend</button><button className="btn-outline" onClick={()=>activate(t.id)}>Activate</button><button className="btn-outline" onClick={()=>remove(t.id)}>Remove</button></td></tr>))}</tbody>
    </table></div></div>)
}