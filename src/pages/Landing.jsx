import Header from '../components/Header.jsx'
import { Link } from 'react-router-dom'
export default function Landing(){
  return (<div>
    <Header/>
    <section className="max-w-6xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Teach smarter. Track faster.</h1>
      <p className="text-gray-600 mb-6">Attendance, fees, invoices, messages, and marks — in one clean dashboard.</p>
      <div className="flex justify-center gap-3">
        <Link className="btn" to="/request-access">Start Free Month</Link>
        <a className="btn-outline" href="#pricing">See Pricing</a>
      </div>
    </section>
    <section className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-4">
      {['Attendance via QR','Invoices & Fees','Emergency Messages','Marks & Reports','Parent Portal','Admin Control'].map((it,i)=>(
        <div key={i} className="card"><h3 className="font-semibold mb-2">{it}</h3>
          <p className="text-sm text-gray-600">Simple tools that save hours every week.</p></div>
      ))}
    </section>
    <section id="pricing" className="max-w-6xl mx-auto px-4 mt-12">
      <div className="card text-center">
        <h2 className="text-2xl font-bold">Pricing</h2>
        <p className="mt-2">Rs. <b>3000</b> / month / teacher — up to <b>100</b> students</p>
        <p className="text-sm text-gray-500 mt-2">1‑month free trial on request approval</p>
        <Link className="btn mt-4" to="/request-access">Request Access</Link>
      </div>
    </section>
    <footer className="text-center text-sm text-gray-500 py-10">© SmartClass Lanka</footer>
  </div>)
}