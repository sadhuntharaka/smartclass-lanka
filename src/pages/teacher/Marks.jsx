import { useEffect, useState } from 'react'
import { db } from '../../services/firebase'
import { collection, getDocs, addDoc } from 'firebase/firestore'
export default function Marks(){
  const [students,setStudents]=useState([]); const [form,setForm]=useState({ student_id:'', test_name:'', max_score:'', score:'', test_date:'' })
  useEffect(()=>{ (async()=>{ const { docs }=await getDocs(collection(db,'students')); setStudents(docs.map(d=>({id:d.id,...d.data()}))) })() },[])
  const save=async e=>{ e.preventDefault(); await addDoc(collection(db,'marks'),{ student_id:form.student_id, test_name:form.test_name, max_score:Number(form.max_score), score:Number(form.score), test_date:form.test_date }); alert('Saved'); setForm({ student_id:'', test_name:'', max_score:'', score:'', test_date:'' }) }
  return (<div className="max-w-6xl mx-auto px-4 py-6"><h2 className="text-xl font-bold mb-4">Marks</h2>
    <form onSubmit={save} className="card grid md:grid-cols-2 gap-3">
      <select className="input" value={form.student_id} onChange={e=>setForm({...form,student_id:e.target.value})}><option value="">Select student</option>{students.map(s=><option key={s.id} value={s.id}>{s.full_name}</option>)}</select>
      <input className="input" placeholder="Test name" value={form.test_name} onChange={e=>setForm({...form,test_name:e.target.value})}/>
      <input className="input" placeholder="Max score" value={form.max_score} onChange={e=>setForm({...form,max_score:e.target.value})}/>
      <input className="input" placeholder="Score" value={form.score} onChange={e=>setForm({...form,score:e.target.value})}/>
      <input type="date" className="input" value={form.test_date} onChange={e=>setForm({...form,test_date:e.target.value})}/>
      <button className="btn">Save</button></form></div>)
}