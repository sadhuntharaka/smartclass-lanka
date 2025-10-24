import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
export default function Admin(){
  const nav=useNavigate(); useEffect(()=>{ if(!sessionStorage.getItem('admin')) nav('/admin-login') },[])
  return (<div className="max-w-6xl mx-auto px-4 py-6"><h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
    <div className="grid md:grid-cols-3 gap-4">
      <Link className="card hover:bg-gray-50" to="/admin/teachers"><b>Manage Teachers</b></Link>
      <Link className="card hover:bg-gray-50" to="/admin/exports"><b>Exports</b></Link>
      <Link className="card hover:bg-gray-50" to="/request-access"><b>Access Requests</b></Link>
    </div></div>)
}