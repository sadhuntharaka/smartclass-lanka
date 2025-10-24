import { useEffect, useState } from 'react'
import { db } from '../../services/firebase'
import { collection, getDocs, addDoc } from 'firebase/firestore'
export default function Attendance(){
  const [cls,setCls]=useState([]); const [students,setStudents]=useState([]); const [classId,setClassId]=useState('')
  useEffect(()=>{ (async()=>{ const snap=await getDocs(collection(db,'classes')); setCls(snap.docs.map(d=>({id:d.id,...d.data()}))) })() },[])
  const loadStudents=async cid=>{ setClassId(cid); const snap=await getDocs(collection(db,'students')); const all=snap.docs.map(d=>({id:d.id,...d.data()})); setStudents(all.filter(s=>s.class_id===cid)) }
  const toggle=async (student,present)=>{ const today=new Date(); await addDoc(collection(db,'attendance'),{ student_id:student.id, date:today.toISOString().slice(0,10), time:today.toTimeString().slice(0,5), status:present?'present':'absent' }); alert('Marked '+(present?'present':'absent')) }
  return (<div className="max-w-6xl mx-auto px-4 py-6"><h2 className="text-xl font-bold mb-4">Attendance</h2>
    <div className="card mb-4">
      <select className="input" onChange={e=>loadStudents(e.target.value)} value={classId}><option value="">Select class</option>{cls.map(c=><option key={c.id} value={c.id}>{c.class_name}</option>)}</select>
      <div className="mt-3"><a href="/dashboard/qr-scan" className="btn-outline">Open QR Scanner</a></div>
    </div>
    <div className="card">
      {students.length===0 ? <p className="text-sm text-gray-500">No students</p> : <table className="w-full text-sm">
        <thead><tr className="text-left"><th>Name</th><th>Action</th></tr></thead>
        <tbody>{students.map(s=>(<tr key={s.id} className="border-t"><td>{s.full_name}</td>
          <td className="space-x-2"><button className="btn" onClick={()=>toggle(s,true)}>Present</button>
          <button className="btn-outline" onClick={()=>toggle(s,false)}>Absent</button></td></tr>))}</tbody></table>}
    </div></div>)
}