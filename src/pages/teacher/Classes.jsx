import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc
} from "firebase/firestore";

const DAYS = [
  {v:0, n:"Sun"}, {v:1, n:"Mon"}, {v:2, n:"Tue"},
  {v:3, n:"Wed"}, {v:4, n:"Thu"}, {v:5, n:"Fri"}, {v:6, n:"Sat"},
];

export default function Classes(){
  const [items,setItems]=useState([]);
  const [students,setStudents]=useState([]);
  const [form,setForm]=useState({ name:'', subject:'', day:1, time:'', fee:'' });
  const [assign, setAssign] = useState({ classId:'', studentIds:[] });

  const load = async ()=>{
    const [clsSnap, stsSnap] = await Promise.all([
      getDocs(collection(db,'classes')), getDocs(collection(db,'students'))
    ]);
    setItems(clsSnap.docs.map(d=>({id:d.id, ...d.data()})));
    setStudents(stsSnap.docs.map(d=>({id:d.id, ...d.data()})));
  };

  useEffect(()=>{ load() },[]);

  const save = async e=>{
    e.preventDefault();
    await addDoc(collection(db,'classes'), form);
    setForm({ name:'', subject:'', day:1, time:'', fee:'' });
    load();
  };

  const remove = async id=>{
    await deleteDoc(doc(db,'classes', id));
    load();
  };

  const assignStudents = async e=>{
    e.preventDefault();
    const ops = assign.studentIds.map(sid => updateDoc(doc(db,'students', sid), { class_id: assign.classId }));
    await Promise.all(ops);
    setAssign({ classId:'', studentIds:[] });
    load();
    alert('Assigned selected students to class');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-xl font-bold">Classes</h2>

      <form onSubmit={save} className="card grid md:grid-cols-5 gap-3">
        <input className="input" placeholder="Class name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <input className="input" placeholder="Subject" value={form.subject} onChange={e=>setForm({...form, subject:e.target.value})}/>
        <select className="input" value={form.day} onChange={e=>setForm({...form, day:Number(e.target.value)})}>
          {DAYS.map(d=><option key={d.v} value={d.v}>{d.n}</option>)}
        </select>
        <input className="input" placeholder="Time (e.g., 5:00–6:30)" value={form.time} onChange={e=>setForm({...form, time:e.target.value})}/>
        <button className="btn">Add</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left">
            <th>Name</th><th>Subject</th><th>Day</th><th>Time</th><th></th>
          </tr></thead>
          <tbody>
            {items.map(it=>(
              <tr key={it.id} className="border-t">
                <td>{it.name}</td>
                <td>{it.subject}</td>
                <td>{DAYS.find(d=>d.v===it.day)?.n ?? '-'}</td>
                <td>{it.time || '-'}</td>
                <td className="text-right">
                  <button className="btn-outline" onClick={()=>remove(it.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign students to class */}
      <form onSubmit={assignStudents} className="card">
        <h3 className="font-semibold mb-2">Assign Students to Class</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <select className="input" value={assign.classId} onChange={e=>setAssign({...assign, classId:e.target.value})}>
            <option value="">Select class</option>
            {items.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="border rounded-lg p-3 max-h-60 overflow-auto">
            {students.map(s=>(
              <label key={s.id} className="flex items-center gap-2 py-1">
                <input type="checkbox"
                  checked={assign.studentIds.includes(s.id)}
                  onChange={e=>{
                    const checked = e.target.checked;
                    setAssign(a=>{
                      const next = new Set(a.studentIds);
                      if(checked) next.add(s.id); else next.delete(s.id);
                      return {...a, studentIds:[...next]};
                    });
                  }}/>
                <span className="text-sm">{s.full_name} {s.class_id ? <em className="text-gray-500">(in class)</em>:null}</span>
              </label>
            ))}
          </div>
          <button className="btn">Assign Selected</button>
        </div>
      </form>
    </div>
  );
}
