import { useEffect, useMemo, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc
} from "firebase/firestore";
import QRCode from "qrcode";

export default function Students(){
  const [students,setStudents]=useState([]);
  const [classes,setClasses]=useState([]);
  const [form,setForm]=useState({ full_name:'', school:'', grade:'', parent_name:'', parent_phone:'', class_id:'' });
  const [filterClass, setFilterClass] = useState('');
  const [q, setQ] = useState('');

  const load = async ()=>{
    const [cls, sts] = await Promise.all([
      getDocs(collection(db,'classes')),
      getDocs(collection(db,'students')),
    ]);
    setClasses(cls.docs.map(d=>({id:d.id, ...d.data()})));
    setStudents(sts.docs.map(d=>({id:d.id, ...d.data()})));
  };
  useEffect(()=>{ load() },[]);

  const add = async e=>{
    e.preventDefault();
    const ref = await addDoc(collection(db,'students'), form);
    const qr = await QRCode.toDataURL(ref.id);
    await updateDoc(doc(db,'students', ref.id), { qr_code_url: qr });
    setForm({ full_name:'', school:'', grade:'', parent_name:'', parent_phone:'', class_id:'' });
    load();
  };

  const remove = async id=>{
    await deleteDoc(doc(db,'students', id));
    load();
  };

  const view = useMemo(()=>{
    return students
      .filter(s=> !filterClass || s.class_id===filterClass)
      .filter(s=>{
        const t = (q||'').toLowerCase().trim();
        if(!t) return true;
        return [s.full_name, s.parent_name, s.parent_phone].join(' ').toLowerCase().includes(t);
      });
  }, [students, filterClass, q]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-xl font-bold">Students</h2>

      <form onSubmit={add} className="card grid md:grid-cols-3 gap-3">
        <input className="input" placeholder="Full name" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})}/>
        <input className="input" placeholder="School" value={form.school} onChange={e=>setForm({...form, school:e.target.value})}/>
        <input className="input" placeholder="Grade" value={form.grade} onChange={e=>setForm({...form, grade:e.target.value})}/>
        <input className="input" placeholder="Parent name" value={form.parent_name} onChange={e=>setForm({...form, parent_name:e.target.value})}/>
        <input className="input" placeholder="Parent phone" value={form.parent_phone} onChange={e=>setForm({...form, parent_phone:e.target.value})}/>
        <select className="input" value={form.class_id} onChange={e=>setForm({...form, class_id:e.target.value})}>
          <option value="">Select class</option>
          {classes.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn">Add Student</button>
      </form>

      <div className="card">
        <div className="flex gap-3 mb-3">
          <select className="input w-56" value={filterClass} onChange={e=>setFilterClass(e.target.value)}>
            <option value="">All classes</option>
            {classes.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input className="input" placeholder="Search name / parent / phone" value={q} onChange={e=>setQ(e.target.value)}/>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left">
              <th>Name</th><th>Grade</th><th>Parent</th><th>Phone</th><th>QR</th><th></th>
            </tr></thead>
            <tbody>
              {view.map(s=>(
                <tr key={s.id} className="border-t">
                  <td>{s.full_name}</td>
                  <td>{s.grade || '-'}</td>
                  <td>{s.parent_name || '-'}</td>
                  <td>{s.parent_phone || '-'}</td>
                  <td>{s.qr_code_url ? <img src={s.qr_code_url} className="w-12 h-12" alt="qr"/> : '—'}</td>
                  <td className="text-right">
                    <button className="btn-outline" onClick={()=>remove(s.id)}>Remove</button>
                  </td>
                </tr>
              ))}
              {view.length===0 && <tr><td colSpan="6" className="py-6 text-center text-gray-500">No students</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
