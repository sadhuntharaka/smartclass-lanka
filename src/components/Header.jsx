import { Link } from 'react-router-dom'
export default function Header(){
  return (<header className="bg-white border-b">
    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <Link to="/" className="font-extrabold text-primary">SmartClass Lanka</Link>
      <nav className="flex items-center gap-3">
        <Link to="/login" className="btn-outline">Teacher Login</Link>
        <Link to="/student-login" className="btn-outline">Student Portal</Link>
        <Link to="/request-access" className="btn">Request Access</Link>
      </nav>
    </div></header>)
}