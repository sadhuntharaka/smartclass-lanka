import { useEffect, useState } from 'react'
import { db } from '../../services/firebase'
import { collection, getCountFromServer } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
export default function Dashboard(){
  const [stats,setStats]=useState({students:0,classes:0}); const nav=useNavigate()
  useEffect(()=>{ const tid=sessionStorage.getItem('teacher_id'); if(!tid){ nav('/login'); return } (async()=>{
    const sSnap=await getCountFromServer(collection(db,'students')); const cSnap=await getCountFromServer(collection(db,'classes'))
    setStats({students:sSnap.data().count, classes:cSnap.data().count})
  })() },[])
  return (<div className="max-w-6xl mx-auto px-4 py-6"><h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
    <div className="grid md:grid-cols-3 gap-4">
      <div className="kpi"><div className="text-sm text-gray-500">Students</div><div className="text-3xl font-extrabold">{stats.students}</div></div>
      <div className="kpi"><div className="text-sm text-gray-500">Classes</div><div className="text-3xl font-extrabold">{stats.classes}</div></div>
      <div className="kpi"><div className="text-sm text-gray-500">Pending Fees</div><div className="text-3xl font-extrabold">—</div></div>
    </div>
    <div className="mt-6 flex flex-wrap gap-3">
      <Link className="btn" to="/dashboard/students">Add Student</Link>
      <Link className="btn-outline" to="/dashboard/attendance">Take Attendance</Link>
      <Link className="btn-outline" to="/dashboard/payments">Record Payment</Link>
      <Link className="btn-outline" to="/dashboard/messages">Message Generator</Link>
    </div></div>)
}