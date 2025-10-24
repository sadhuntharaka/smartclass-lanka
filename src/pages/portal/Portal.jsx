import { useEffect, useState } from 'react'
import { db } from '../../services/firebase'
import { doc, getDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
export default function Portal(){
  const [student,setStudent]=useState(null); const [payments,setPayments]=useState([]); const [attendance,setAttendance]=useState([]); const [marks,setMarks]=useState([]); const nav=useNavigate()
  useEffect(()=>{ const id=sessionStorage.getItem('student_id'); if(!id){ nav('/student-login'); return } (async()=>{
    const s=await getDoc(doc(db,'students', id)); if(!s.exists()) return; setStudent({ id, ...s.data() })
    const paySnap=await getDocs(query(collection(db,'payments'), where('student_id','==', id), orderBy('payment_date','desc')))
    const attSnap=await getDocs(query(collection(db,'attendance'), where('student_id','==', id), orderBy('date','desc')))
    const mkSnap=await getDocs(query(collection(db,'marks'), where('student_id','==', id), orderBy('test_date','desc')))
    setPayments(paySnap.docs.map(d=>({id:d.id,...d.data()}))); setAttendance(attSnap.docs.map(d=>({id:d.id,...d.data()}))); setMarks(mkSnap.docs.map(d=>({id:d.id,...d.data()})))
  })() },[])
  return (<div className="max-w-6xl mx-auto px-4 py-6"><h2 className="text-xl font-bold mb-4">Student / Parent Portal</h2>
    {!student ? <p>Loading…</p> : <div className="grid md:grid-cols-2 gap-4">
      <div className="card"><h3 className="font-semibold mb-2">Profile</h3><p><b>{student.full_name}</b></p><p>Parent: {student.parent_name} ({student.parent_phone})</p></div>
      <div className="card"><h3 className="font-semibold mb-2">Recent Attendance</h3><ul className="text-sm space-y-1">{attendance.slice(0,5).map(a=>(<li key={a.id}>{a.date} — {a.status}</li>))}</ul></div>
      <div className="card"><h3 className="font-semibold mb-2">Payments</h3><ul className="text-sm space-y-1">{payments.map(p=>(<li key={p.id}>{p.month}: Rs.{p.amount} — <a className="text-primary underline" href={p.invoice_url} target="_blank">Invoice</a></li>))}</ul></div>
      <div className="card"><h3 className="font-semibold mb-2">Marks</h3><ul className="text-sm space-y-1">{marks.map(m=>(<li key={m.id}>{m.test_date} — {m.test_name}: {m.score}/{m.max_score}</li>))}</ul></div>
    </div>}
  </div>)
}