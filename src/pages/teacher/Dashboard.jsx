import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../services/firebase";
import {
  collection, getCountFromServer, getDocs, query, where, orderBy, limit
} from "firebase/firestore";

export default function Dashboard(){
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ students:0, classes:0, presentToday:0, paidThisMonth:0, pendingThisMonth:0 });
  const [todayClasses, setTodayClasses] = useState([]);
  const [recent, setRecent] = useState([]);

  const today = useMemo(()=> new Date().toISOString().slice(0,10), []);
  const ym = useMemo(()=> {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  }, []);

  useEffect(()=>{
    const tid = sessionStorage.getItem('teacher_id');
    if(!tid){ nav('/login'); return }

    (async ()=>{
      try{
        const [sSnap, cSnap] = await Promise.all([
          getCountFromServer(collection(db,'students')),
          getCountFromServer(collection(db,'classes')),
        ]);
        const students = sSnap.data().count;
        const classes = cSnap.data().count;

        const attQ = query(
          collection(db,'attendance'),
          where('date','==', today),
          where('status','==','present')
        );
        const attDocs = await getDocs(attQ);

        const payQ = query(collection(db,'payments'), where('month','==', ym));
        const payDocs = await getDocs(payQ);
        const paidThisMonth = payDocs.size;
        const pendingThisMonth = Math.max(0, students - paidThisMonth);

        const clsQ = query(collection(db,'classes'), where('day','==', new Date().getDay()));
        const clsDocs = await getDocs(clsQ);
        const tClasses = clsDocs.docs.map(d=>({id:d.id, ...d.data()}));

        const recQ = query(collection(db,'payments'), orderBy('created_at','desc'), limit(5));
        const recDocs = await getDocs(recQ);
        const recentItems = recDocs.docs.map(d=>({id:d.id, ...d.data()}));

        setStats({ students, classes, presentToday: attDocs.size, paidThisMonth, pendingThisMonth });
        setTodayClasses(tClasses);
        setRecent(recentItems);
      } finally { setLoading(false) }
    })();
  }, [nav, today, ym]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">Today: {today} • Month: {ym}</div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Kpi title="Students" value={stats.students}/>
        <Kpi title="Classes" value={stats.classes}/>
        <Kpi title="Present Today" value={stats.presentToday}/>
        <Kpi title="Pending Fees" value={stats.pendingThisMonth}/>
      </div>

      <div className="card mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Daily Summary</h2>
          {loading && <span className="text-xs text-gray-500">Loading…</span>}
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <Sum label="Attendance Today" value={`${stats.presentToday} present`}/>
          <Sum label="Fees This Month" value={`${stats.paidThisMonth} paid`}/>
          <Sum label="Pending Dues" value={`${stats.pendingThisMonth} students`}/>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="card">
          <h3 className="font-semibold mb-2">Today’s Classes</h3>
          {todayClasses.length===0 ? <p className="text-sm text-gray-500">No classes scheduled.</p> :
            <ul className="text-sm divide-y">
              {todayClasses.map(c=>(
                <li key={c.id} className="py-2 flex items-center justify-between">
                  <span>{c.name} ({c.subject})</span>
                  <span className="text-gray-500">{c.time || '—'}</span>
                </li>
              ))}
            </ul>}
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          {recent.length===0 ? <p className="text-sm text-gray-500">No recent activity.</p> :
            <ul className="text-sm divide-y">
              {recent.map(r=>(
                <li key={r.id} className="py-2 flex items-center justify-between">
                  <span>{r.student_name || r.studentId}</span>
                  <span className="text-gray-500">{r.amount ? `Rs.${r.amount}` : ''}</span>
                </li>
              ))}
            </ul>}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="btn" to="/dashboard/students">Add Student</Link>
        <Link className="btn-outline" to="/dashboard/classes">Manage Classes</Link>
        <Link className="btn-outline" to="/dashboard/attendance">Take Attendance</Link>
        <Link className="btn-outline" to="/dashboard/payments">Record Payment</Link>
        <Link className="btn-outline" to="/dashboard/messages">Message Generator</Link>
      </div>
    </div>
  );
}

function Kpi({title, value}){ return (
  <div className="kpi">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-3xl font-extrabold">{value}</div>
  </div>
)}
function Sum({label, value}){ return (
  <div>
    <div className="text-sm text-gray-500 mb-1">{label}</div>
    <div className="text-xl font-bold">{value}</div>
  </div>
)}
