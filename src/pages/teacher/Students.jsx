import { useEffect, useState } from 'react'
import { db } from '../../services/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import QRCode from 'qrcode'
export default function Students(){
  const [students,setStudents]=useState([]); const [classes,setClasses]=useState([])
  const [form,setForm]=useState({ full_name:'', school:'', grade:'', parent_name:'', parent_phone:'', class_id:'', qr_code_url:'' })
  const load=async()=>{ const [cls,sts]=await Promise.all([getDocs(collection(db,'classes')),getDocs(collection(db,'students'))]); setClasses(cls.docs.map(d=>({id:d.id,...d.data()}))); setStudents(sts.docs.map(d=>({id:d.id,...d.data()}))) }
  useEffect(()=>{ load() },[])
  const add=async e=>{ e.preventDefault(); const ref=await addDoc(collection(db,'students'), form); const qr=await QRCode.toDataURL(ref.id); await updateDoc(doc(db,'students',ref.id), { qr_code_url: qr }); setForm({ full_name:'', school:'', grade:'', parent_name:'', parent_phone:'', class_id:'', qr_code_url:'' }); load() }
  const remove=async id=>{ await deleteDoc(doc(db,'students',id)); load() }
  return (<div className="max-w-6xl mx-auto px-4 py-6"><h2 className="text-xl font-bold mb-4">Students</h2>
    <form onSubmit={add} className="card grid md:grid-cols-3 gap-3 mb-4">
      <input className="input" placeholder="Full name" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}/>
      <input className="input" placeholder="School" value={form.school} onChange={e=>setForm({...form,school:e.target.value})}/>
      <input className="input" placeholder="Grade" value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})}/>
      <input className="input" placeholder="Parent name" value={form.parent_name} onChange={e=>setForm({...form,parent_name:e.target.value})}/>
      <input className="input" placeholder="Parent phone" value={form.parent_phone} onChange={e=>setForm({...form,parent_phone:e.target.value})}/>
      <select className="input" value={form.class_id} onChange={e=>setForm({...form,class_id:e.target.value})}>
        <option value="">Select class</option>{classes.map(c=><option key={c.id} value={c.id}>{c.class_name}</option>)}
      </select>
      <button className="btn">Add Student</button></form>
    <div className="card overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left"><th>Name</th><th>Grade</th><th>Parent</th><th>Phone</th><th>QR</th><th></th></tr></thead>
    <tbody>{students.map(s=>(<tr key={s.id} className="border-t"><td>{s.full_name}</td><td>{s.grade}</td><td>{s.parent_name}</td><td>{s.parent_phone}</td>
      <td>{s.qr_code_url ? <img src={s.qr_code_url} className="w-12 h-12" /> : '—'}</td>
      <td className="text-right"><button className="btn-outline" onClick={()=>remove(s.id)}>Remove</button></td></tr>))}</tbody></table></div></div>)
}