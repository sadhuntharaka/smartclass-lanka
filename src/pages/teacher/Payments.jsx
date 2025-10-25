import { useEffect, useMemo, useState } from "react";
import { db, storage } from "../../services/firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { jsPDF } from "jspdf";

export default function Payments(){
  const [students,setStudents]=useState([]);
  const [form,setForm]=useState({ student_id:'', month:'', amount:'', payment_date:'' });

  const ym = useMemo(()=>{
    const d=new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  },[]);

  useEffect(()=>{ (async ()=>{
    const { docs }=await getDocs(collection(db,'students'));
    setStudents(docs.map(d=>({id:d.id, ...d.data()})));
    setForm(f=>({...f, month: ym, payment_date: new Date().toISOString().slice(0,10)}));
  })() },[ym]);

  const save = async e=>{
    e.preventDefault();
    const s = students.find(x=>x.id===form.student_id);
    if(!s) return alert('Select student');

    // PDF
    const pdf = new jsPDF({ unit:'pt', format:'a5' });
    pdf.setFontSize(14); pdf.text('SmartClass Lanka — Fee Invoice',40,40);
    pdf.setFontSize(12);
    pdf.text(`Student: ${s.full_name}`,40,70);
    pdf.text(`Month: ${form.month}`,40,90);
    pdf.text(`Amount: Rs.${form.amount}`,40,110);
    pdf.text(`Date: ${form.payment_date}`,40,130);
    pdf.text('Thank you.',40,160);

    const blob = pdf.output('blob');
    const path = `invoices/${s.id}_${Date.now()}.pdf`;
    const rf = ref(storage, path);
    await uploadBytes(rf, blob, { contentType:'application/pdf' });
    const url = await getDownloadURL(rf);

    await addDoc(collection(db,'payments'),{
      student_id: s.id,
      student_name: s.full_name || '',
      month: form.month,
      amount: Number(form.amount),
      payment_date: form.payment_date,
      invoice_url: url,
      created_at: serverTimestamp(),
    });

    const msg = `Hello ${s.parent_name||'Parent'}, receipt for ${s.full_name} (${form.month}). Amount Rs.${form.amount}. Invoice: ${url}`;
    const wa = `https://wa.me/${s.parent_phone}?text=${encodeURIComponent(msg)}`;
    window.open(wa,'_blank');
    alert('Saved & opened WhatsApp');
    setForm({ student_id:'', month: ym, amount:'', payment_date: new Date().toISOString().slice(0,10) });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Record Payment & Invoice</h2>
      <form onSubmit={save} className="card grid md:grid-cols-2 gap-3">
        <select className="input" value={form.student_id} onChange={e=>setForm({...form, student_id:e.target.value})}>
          <option value="">Select student</option>
          {students.map(s=><option key={s.id} value={s.id}>{s.full_name}</option>)}
        </select>
        <input className="input" placeholder="Month (YYYY-MM)" value={form.month} onChange={e=>setForm({...form, month:e.target.value})}/>
        <input className="input" placeholder="Amount (Rs.)" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})}/>
        <input type="date" className="input" value={form.payment_date} onChange={e=>setForm({...form, payment_date:e.target.value})}/>
        <button className="btn">Save & Open WhatsApp</button>
      </form>
    </div>
  );
}
