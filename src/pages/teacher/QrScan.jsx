import { useEffect } from "react";
import { db } from "../../services/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function QrScan(){
  useEffect(()=>{
    const onScanSuccess = async (decodedText)=>{
      const id = decodedText.trim();
      const t = new Date();
      await addDoc(collection(db,'attendance'),{
        student_id: id,
        date: t.toISOString().slice(0,10),
        time: t.toTimeString().slice(0,5),
        status: 'present'
      });
      alert('Marked present: '+id);
    };
    const onScanFailure = ()=>{};

    // html5-qrcode script is included in index.html via CDN
    if(window.Html5QrcodeScanner){
      const scanner = new window.Html5QrcodeScanner('reader', { fps:10, qrbox:250 });
      scanner.render(onScanSuccess, onScanFailure);
      return ()=> scanner.clear();
    }
  },[]);

  return (
    <div className="max-w-3xl mx-auto card">
      <h2 className="text-xl font-bold mb-3">QR Scanner</h2>
      <div id="reader" />
    </div>
  );
}
