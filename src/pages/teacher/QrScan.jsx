import { useEffect } from 'react'
import { db } from '../../services/firebase'
import { collection, addDoc } from 'firebase/firestore'
export default function QrScan(){
  useEffect(()=>{
    const onScanSuccess=async decoded=>{ const id=decoded.trim(); const t=new Date(); await addDoc(collection(db,'attendance'),{ student_id:id, date:t.toISOString().slice(0,10), time:t.toTimeString().slice(0,5), status:'present' }); alert('Marked present for '+id) }
    const onScanFailure=e=>{}
    if(window.Html5QrcodeScanner){ const s=new window.Html5QrcodeScanner('reader',{fps:10,qrbox:250}); s.render(onScanSuccess,onScanFailure); return ()=>s.clear() }
  },[])
  return (<div className="max-w-3xl mx-auto card"><h2 className="text-xl font-bold mb-3">QR Scanner</h2><div id="reader"/></div>)
}