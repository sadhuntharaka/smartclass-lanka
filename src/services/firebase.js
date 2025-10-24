import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore, collection, getDocs, query, where
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  "apiKey": "AIzaSyBJFUkbfGhN95sZXkEWeikolvXn3d18PGI",
  "authDomain": "smartclass-lanka.firebaseapp.com",
  "projectId": "smartclass-lanka",
  storageBucket: "smartclass-lanka.appspot.com",
  "messagingSenderId": "981074409095",
  "appId": "1:981074409095:web:4c146c6e8fc34fe2f2ea22",
  "measurementId": "G-W35QFEPYN2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// MVP: teacher sign-in via Firestore (plain password stored in 'teachers' docs)
export async function signInTeacher(email, password) {
  email = email.trim().toLowerCase();
  password = password.trim();

  const teachersRef = collection(db, "teachers");
  const q = query(teachersRef, where("email", "==", email), where("status", "==", "active"));
  const snap = await getDocs(q);

  if (snap.empty) return null;

  const docRef = snap.docs[0];
  const teacher = { id: docRef.id, ...docRef.data() };

  if (teacher.password !== password) return null;

  return teacher;
}
