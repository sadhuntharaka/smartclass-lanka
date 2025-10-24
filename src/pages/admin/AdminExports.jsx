import { db } from '../../services/firebase'
import { collection, getDocs } from 'firebase/firestore'
async function exportTable(name){
  const snap=await getDocs(collection(db,name))
  const rows=snap.docs.map(d=>({ id:d.id, ...d.data() }))
  const headers=Object.keys(rows[0]||{})
  const csv=[headers.join(',')]
  for(const r of rows){ csv.push(headers.map(h=>JSON.stringify(r[h] ?? '')).join(',')) }
  const blob=new Blob([csv.join('\n')],{type:'text/csv'})
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`${name}.csv`; a.click()
}
export default function AdminExports(){
  return (<div className="max-w-6xl mx-auto px-4 py-6 card space-y-3"><h2 className="text-xl font-bold">Exports</h2>
    {['teachers','classes','students','attendance','payments','marks','access_requests'].map(t=> (<button key={t} className="btn-outline" onClick={()=>exportTable(t)}>Export {t}.csv</button>))}
  </div>)
}