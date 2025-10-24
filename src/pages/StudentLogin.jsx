import { useState } from 'react'
import { db } from '../services/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
export default function StudentLogin(){
  const [studentId,setStudentId]=useState(''); const [parentPhone,setParentPhone]=useState(''); const [err,setErr]=useState(''); const nav=useNavigate()
  const onSubmit=async e=>{ e.preventDefault(); setErr(''); const snap=await getDoc(doc(db,'students', studentId)); if(!snap.exists()){ setErr('Invalid ID'); return } const d=snap.data(); if(String(d.parent_phone||'').trim()!==String(parentPhone).trim()){ setErr('Phone mismatch'); return } sessionStorage.setItem('student_id', studentId); nav('/portal') }
  return (<div className="max-w-md mx-auto card mt-10"><h2 className="text-xl font-bold mb-4">Student / Parent Login</h2>
    <form onSubmit={onSubmit} className="space-y-3">
      <input className="input" placeholder="Student ID" value={studentId} onChange={e=>setStudentId(e.target.value)}/>
      <input className="input" placeholder="Parent Phone" value={parentPhone} onChange={e=>setParentPhone(e.target.value)}/>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button className="btn w-full">Login</button>
    </form></div>)
}