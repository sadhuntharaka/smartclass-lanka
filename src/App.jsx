import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import StudentLogin from './pages/StudentLogin.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import Dashboard from './pages/teacher/Dashboard.jsx'
import Classes from './pages/teacher/Classes.jsx'
import Students from './pages/teacher/Students.jsx'
import Attendance from './pages/teacher/Attendance.jsx'
import QrScan from './pages/teacher/QrScan.jsx'
import Payments from './pages/teacher/Payments.jsx'
import Messages from './pages/teacher/Messages.jsx'
import Marks from './pages/teacher/Marks.jsx'
import Portal from './pages/portal/Portal.jsx'
import Admin from './pages/admin/Admin.jsx'
import AdminTeachers from './pages/admin/AdminTeachers.jsx'
import AdminExports from './pages/admin/AdminExports.jsx'
import RequestAccess from './pages/RequestAccess.jsx'

export default function App(){
  return (<Routes>
    <Route path='/' element={<Landing/>} />
    <Route path='/login' element={<Login/>} />
    <Route path='/student-login' element={<StudentLogin/>} />
    <Route path='/admin-login' element={<AdminLogin/>} />
    <Route path='/request-access' element={<RequestAccess/>} />
    <Route path='/dashboard' element={<Dashboard/>} />
    <Route path='/dashboard/classes' element={<Classes/>} />
    <Route path='/dashboard/students' element={<Students/>} />
    <Route path='/dashboard/attendance' element={<Attendance/>} />
    <Route path='/dashboard/qr-scan' element={<QrScan/>} />
    <Route path='/dashboard/payments' element={<Payments/>} />
    <Route path='/dashboard/messages' element={<Messages/>} />
    <Route path='/dashboard/marks' element={<Marks/>} />
    <Route path='/portal' element={<Portal/>} />
    <Route path='/admin' element={<Admin/>} />
    <Route path='/admin/teachers' element={<AdminTeachers/>} />
    <Route path='/admin/exports' element={<AdminExports/>} />
    <Route path='*' element={<Navigate to='/' />} />
  </Routes>)
}