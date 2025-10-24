import { useEffect, useState } from 'react'
import { db } from '../../services/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'
export default function Classes(){
  const [items,setItems]=useState([]); const [form,setForm]=useState({class_name:'',subject:'',schedule_time:''})
  const load=async()=>{ const snap=await getDocs(collection(db,'classes')); setItems(snap.docs.map(d=>({id:d.id,...d.data()}))) }
  useEffect(()=>{ load() },[])
  const save=async e=>{ e.preventDefault(); await addDoc(collection(db,'classes'), form); setForm({class_name:'',subject:'',schedule_time:''}); load() }
  const remove=async id=>{ await deleteDoc(doc(db,'classes',id)); load() }
  return (<div className="max-w-6xl mx-auto px-4 py-6"><h2 className="text-xl font-bold mb-4">Classes</h2>
    <form onSubmit={save} className="card mb-4 grid md:grid-cols-4 gap-3">
      <input className="input" placeholder="Class name" value={form.class_name} onChange={e=>setForm({...form,class_name:e.target.value})}/>
      <input className="input" placeholder="Subject" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/>
      <input className="input" placeholder="Schedule (Mon/Wed 4:30pm)" value={form.schedule_time} onChange={e=>setForm({...form,schedule_time:e.target.value})}/>
      <button className="btn">Add</button></form>
    <div className="card overflow-x-auto"><table className="w-full text-sm">
    <thead><tr className="text-left"><th>Name</th><th>Subject</th><th>Schedule</th><th></th></tr></thead>
    <tbody>{items.map(it=>(<tr key={it.id} className="border-t">
      <td>{it.class_name}</td><td>{it.subject}</td><td>{it.schedule_time}</td>
      <td className="text-right"><button className="btn-outline" onClick={()=>remove(it.id)}>Remove</button></td></tr>))}</tbody></table></div></div>)
}