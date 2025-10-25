import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  getCountFromServer,
  orderBy,
  limit
} from "firebase/firestore";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    classes: 0,
    presentToday: 0,
    paidThisMonth: 0,
    pendingThisMonth: 0,
  });
  const [todayClasses, setTodayClasses] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);
  const ym = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

  useEffect(() => {
    (async () => {
      try {
        // summary counts
        const [sSnap, cSnap] = await Promise.all([
          getCountFromServer(collection(db, "students")),
          getCountFromServer(collection(db, "classes")),
        ]);
        const students = sSnap.data().count;
        const classes = cSnap.data().count;

        // attendance today
        const attQ = query(
          collection(db, "attendance"),
          where("date", "==", today),
          where("status", "==", "present")
        );
        const attDocs = await getDocs(attQ);

        // payments this month
        const payQ = query(collection(db, "payments"), where("month", "==", ym));
        const payDocs = await getDocs(payQ);
        const paidThisMonth = payDocs.size;
        const pendingThisMonth = Math.max(0, students - paidThisMonth);

        // today's classes
        const clsQ = query(collection(db, "classes"), where("day", "==", new Date().getDay()));
        const clsDocs = await getDocs(clsQ);
        const todayCls = clsDocs.docs.map((d) => ({ id: d.id, ...d.data() }));

        // recent payments or attendance (5 items)
        const recQ = query(collection(db, "payments"), orderBy("created_at", "desc"), limit(5));
        const recDocs = await getDocs(recQ);
        const recentItems = recDocs.docs.map((d) => ({ id: d.id, ...d.data() }));

        setStats({ students, classes, presentToday: attDocs.size, paidThisMonth, pendingThisMonth });
        setTodayClasses(todayCls);
        setRecent(recentItems);
      } finally {
        setLoading(false);
      }
    })();
  }, [today, ym]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="text-sm text-gray-300">
          Today: {today} • Month: {ym}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <SummaryCard label="Students" value={stats.students} />
        <SummaryCard label="Classes" value={stats.classes} />
        <SummaryCard label="Present Today" value={stats.presentToday} />
        <SummaryCard label="Pending Fees" value={stats.pendingThisMonth} />
      </div>

      {/* Daily Summary */}
      <div className="bg-white/5 p-4 rounded-lg text-gray-100">
        <h2 className="text-lg font-semibold mb-3">Daily Summary</h2>
        {loading && <p className="text-sm text-gray-400">Loading...</p>}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p>Attendance Today</p>
            <h3 className="text-xl font-bold">{stats.presentToday} present</h3>
          </div>
          <div>
            <p>Fees This Month</p>
            <h3 className="text-xl font-bold">{stats.paidThisMonth} paid</h3>
          </div>
          <div>
            <p>Pending Fees</p>
            <h3 className="text-xl font-bold">{stats.pendingThisMonth} students</h3>
          </div>
        </div>
      </div>

      {/* Today’s Classes */}
      <div className="bg-white/5 p-4 rounded-lg text-gray-100">
        <h2 className="text-lg font-semibold mb-3">Today’s Classes</h2>
        {todayClasses.length === 0 && <p className="text-sm text-gray-400">No classes scheduled for today.</p>}
        <ul className="divide-y divide-gray-700">
          {todayClasses.map((c) => (
            <li key={c.id} className="py-2 flex justify-between">
              <span>{c.name} ({c.subject})</span>
              <span className="text-sm text-gray-400">{c.time}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 p-4 rounded-lg text-gray-100">
        <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
        {recent.length === 0 && <p className="text-sm text-gray-400">No recent activity.</p>}
        <ul className="divide-y divide-gray-700">
          {recent.map((r) => (
            <li key={r.id} className="py-2 flex justify-between">
              <span>{r.student_name || r.studentId}</span>
              <span className="text-sm text-gray-400">{r.amount ? `LKR ${r.amount}` : ""}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-white/10 p-4 rounded-lg text-center">
      <div className="text-gray-300 text-sm">{label}</div>
      <div className="text-3xl font-extrabold text-white">{value}</div>
    </div>
  );
}
