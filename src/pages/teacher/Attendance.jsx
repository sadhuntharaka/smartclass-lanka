import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection, getDocs, addDoc, query, where
} from "firebase/firestore";

export default function Attendance(){
  const [classes,setClasses]=useState([]);
  const [students,setStudents]=useState([]);
  const [classId,setClassId]=useState('');
  const [mode, setMode] = useState('list'); // 'list' | 'qr'

  useEffect(()=>{ (async ()=>{
    const clsSnap=await getDocs(collection(db,'classes'));
    setClasses(clsSnap.docs.map(d=>({id:d.id, ...d.data()})));
  })() },[]);

  const loadStudents = async (cid)=>{
    setClassId(cid);
    const stsSnap=await getDocs(collection(db,'students'));
    const all=stsSnap.docs.map(d=>({id:d.id, ...d.data()}));
    setStudents(all.filter(s=>s.class_id===cid));
  };

  const mark = async (sid, present=true)=>{
    const t=new Date();
    await addDoc(collection(db,'attendance'),{
      student_id:sid,
      date: t.toISOString().slice(0,10),
      time: t.toTimeString().slice(0,5),
      status: present ? 'present' : 'absent'
    });
    alert(`${present?'Present':'Absent'} marked`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <h2 className="text-xl font-bold">Attendance</h2>

      <div className="card flex flex-col gap-3">
        <div className="flex flex-wrap gap-3">
          <select className="input" value={classId} onChange={e=>loadStudents(e.target.value)}>
            <option value="">Select class</option>
            {classes.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="inline-flex rounded-lg border overflow-hidden">
            <button className={`px-3 py-2 ${mode==='list'?'bg-primary text-white':''}`} onClick={()=>setMode('list')}>List</button>
            <a className={`px-3 py-2 ${mode==='qr'?'bg-primary text-white':''}`} href="/dashboard/qr-scan">QR Scanner</a>
          </div>
        </div>

        {mode==='list' && (
          <div className="card">
            {students.length===0 ? <p className="text-sm text-gray-500">No students</p> :
              <table className="w-full text-sm">
                <thead><tr className="text-left"><th>Name</th><th>Action</th></tr></thead>
                <tbody>
                  {students.map(s=>(
                    <tr key={s.id} className="border-t">
                      <td>{s.full_name}</td>
                      <td className="space-x-2">
                        <button className="btn" onClick={()=>mark(s.id,true)}>Present</button>
                        <button className="btn-outline" onClick={()=>mark(s.id,false)}>Absent</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>}
          </div>
        )}
      </div>
    </div>
  );
}
