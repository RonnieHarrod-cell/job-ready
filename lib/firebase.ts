import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import type {
  UserProfile,
  Scenario,
  InterviewSession,
  BugReport,
} from "@/types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

// auth
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  await ensureUserProfile(result.user);
  return result.user;
}

export async function signOutUser() {
  await signOut(auth);
}

export { onAuthStateChanged };
export type { User };

// user profiles
export async function ensureUserProfile(user: User) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName ?? "Anon",
      photoURL: user.photoURL ?? undefined,
      createdAt: Date.now(),
      sessionsCompleted: 0,
      customScenarios: [],
    };
    await setDoc(ref, profile);
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

// custom scenarios
export async function createScenario(
  scenario: Omit<Scenario, "id">,
  uid: string,
): Promise<string> {
  const ref = await addDoc(collection(db, "scenarios"), {
    ...scenario,
    createdBy: uid,
    createdAt: Date.now(),
  });
  // track on user profile
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const existing: string[] = userSnap.data().customScenarios ?? [];
    await updateDoc(userRef, { customScenarios: [...existing, ref.id] });
  }
  return ref.id;
}

export async function getUserScenarios(uid: string): Promise<Scenario[]> {
  const q = query(
    collection(db, "scenarios"),
    where("createdBy", "==", uid),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Scenario);
}

export async function getPublicScenarios(): Promise<Scenario[]> {
  const q = query(
    collection(db, "scenarios"),
    where("isPublic", "==", true),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Scenario);
}

export async function deleteScenario(scenarioId: string, uid: string) {
  await deleteDoc(doc(db, "scenarios", scenarioId));
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const existing: string[] = userSnap.data().customScenarios ?? [];
    await updateDoc(userRef, {
      customScenarios: existing.filter((id) => id !== scenarioId),
    });
  }
}

// sessions
export async function saveSession(
  session: Omit<InterviewSession, "id">,
): Promise<string> {
  const ref = await addDoc(collection(db, "sessions"), {
    ...session,
    endedAt: Date.now(),
  });
  // increment counter
  await updateDoc(doc(db, "users", session.userId), {
    sessionsCompleted:
      (await getUserProfile(session.userId))!.sessionsCompleted + 1,
  });
  return ref.id;
}

export async function getUserSessions(
  uid: string,
): Promise<InterviewSession[]> {
  const q = query(
    collection(db, "sessions"),
    where("userId", "==", uid),
    orderBy("startedAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as InterviewSession);
}

// bug reports
export async function submitBugReport(
  report: Omit<BugReport, "id" | "status" | "createdAt">,
): Promise<string> {
    const ref = await addDoc(collection(db, "bugs"), {
        ...report,
        status: "open",
        createdAt: Date.now(),
    });
    return ref.id;
}

export async function getBugReports(): Promise<BugReport[]> {
    const q = query(collection(db, "bugs"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BugReport));
}

export async function updateBugStatus(
    bugId: string,
    status: BugReport["status"]
) {
    await updateDoc(doc(db, "bugs", bugId), { status });
}
