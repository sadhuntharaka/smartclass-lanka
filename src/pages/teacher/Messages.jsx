import { useEffect, useState } from 'react'
import { db } from '../../services/firebase'
import { collection, getDocs } from 'firebase/firestore'
const T={ reminder:(n,m)=>`Dear Parent, class fee for ${n} (${m}) is due. Kindly settle at next class. Thank you.`, thanks:(n,m,a)=>`Hello, receipt confirmed for ${n} - ${m}. Amount Rs.${a}.`, emergency:(cls,time,next)=>`Today’s ${cls} class at ${time} is cancelled due to unavoidable reasons. Next class on ${next}.`, general:(t)=>t }
export default function Messages(){
  const [students,setStudents]=useState([]); const [studentId,setStudentId]=useState(''); const [text,setText]=useState('')
  useEffect(()=>{ (async()=>{ const { docs }=await getDocs(collection(db,'students')); setStudents(docs.map(d=>({id:d.id,...d.data()}))) })() },[])
  const openWA=()=>{ const s=students.find(x=>x.id===studentId); const phone=s?.parent_phone||''; window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`,'_blank') }
  return (<div className="max-w-6xl mx-auto px-4 py-6"><h2 className="text-xl font-bold mb-4">Message Generator</h2>
    <div className="card space-y-3"><div className="grid md:grid-cols-3 gap-3">
      <select className="input" value={studentId} onChange={e=>setStudentId(e.target.value)}><option value="">Select student (optional)</option>{students.map(s=><option key={s.id} value={s.id}>{s.full_name}</option>)}</select>
      <button className="btn-outline" onClick={()=>{ const s=students.find(x=>x.id===studentId); setText(T.reminder(s?.full_name||'Student','this month')) }}>Fee Reminder</button>
      <button className="btn-outline" onClick={()=>{ setText(T.emergency('class','4:30 PM','[date]')) }}>Emergency Cancel</button></div>
      <textarea className="input h-40" value={text} onChange={e=>setText(e.target.value)} placeholder="Message preview (editable)"/>
      <div className="flex gap-3"><button className="btn" onClick={openWA}>Open WhatsApp</button><button className="btn-outline" onClick={()=>navigator.clipboard.writeText(text)}>Copy</button></div>
    </div></div>)
}