/* ═══════════════════════════════════════════════════════════
   ROAST & RICH — Firebase Configuration
   
   HOW TO SET UP (one-time, 10 minutes):
   1. Go to console.firebase.google.com
   2. Click "Add project" → name it "roastandrich"
   3. Go to Authentication → Get Started → Enable Email/Password + Google
   4. Go to Firestore Database → Create database → Start in test mode
   5. Go to Project Settings (gear icon) → Your apps → Add Web App
   6. Copy the firebaseConfig object and paste it below
   7. Replace the placeholder values below with your actual config
   
   Your data will then sync across all devices automatically!
═══════════════════════════════════════════════════════════ */

/* ── PASTE YOUR FIREBASE CONFIG HERE ── */
const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

/* ── Firebase availability check ── */
/* If Firebase is not configured yet, the app falls back to localStorage */
const FIREBASE_READY = (
  FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY" &&
  FIREBASE_CONFIG.projectId !== "YOUR_PROJECT_ID"
);

/* ── DB abstraction layer ──
   Works with Firebase when configured, localStorage otherwise.
   This means the app works perfectly for demo without Firebase,
   and upgrades automatically when Firebase is added. */

class DB {
  constructor() {
    this._fb     = null;
    this._auth   = null;
    this._db     = null;
    this._uid    = null;
    this._ready  = false;
    this._listeners = [];
  }

  async init() {
    if (!FIREBASE_READY) {
      this._ready = false;
      return false;
    }
    try {
      /* Dynamic import of Firebase SDKs */
      const { initializeApp }              = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
      const { getAuth, onAuthStateChanged,
              signInWithEmailAndPassword,
              createUserWithEmailAndPassword,
              signOut, GoogleAuthProvider,
              signInWithPopup }            = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
      const { getFirestore, doc, setDoc,
              getDoc, updateDoc, onSnapshot } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

      this._fb   = initializeApp(FIREBASE_CONFIG);
      this._auth = getAuth(this._fb);
      this._db   = getFirestore(this._fb);
      this._fns  = { signInWithEmailAndPassword, createUserWithEmailAndPassword,
                     signOut, GoogleAuthProvider, signInWithPopup,
                     onAuthStateChanged, doc, setDoc, getDoc, updateDoc, onSnapshot };
      this._ready = true;
      return true;
    } catch(e) {
      console.warn('Firebase init failed, using localStorage:', e.message);
      this._ready = false;
      return false;
    }
  }

  /* ── AUTH ── */
  async signUp(email, password, name) {
    if (!this._ready) return this._localSignUp(name, email);
    try {
      const { user } = await this._fns.signInWithEmailAndPassword(this._auth, email, password)
        .catch(() => this._fns.createUserWithEmailAndPassword(this._auth, email, password));
      this._uid = user.uid;
      return { uid: user.uid, email: user.email, name: name || user.displayName || email.split('@')[0] };
    } catch(e) { return { error: e.message }; }
  }

  async signInEmail(email, password) {
    if (!this._ready) return this._localSignIn();
    try {
      const { user } = await this._fns.signInWithEmailAndPassword(this._auth, email, password);
      this._uid = user.uid;
      return { uid: user.uid, email: user.email };
    } catch(e) { return { error: e.message }; }
  }

  async signInGoogle() {
    if (!this._ready) return { error: 'Firebase not configured' };
    try {
      const provider = new this._fns.GoogleAuthProvider();
      const { user } = await this._fns.signInWithPopup(this._auth, provider);
      this._uid = user.uid;
      return { uid: user.uid, email: user.email, name: user.displayName, photo: user.photoURL };
    } catch(e) { return { error: e.message }; }
  }

  async signOut() {
    if (this._ready && this._auth) await this._fns.signOut(this._auth).catch(()=>{});
    this._uid = null;
    const theme = localStorage.getItem('rr_theme');
    localStorage.clear();
    if (theme) localStorage.setItem('rr_theme', theme);
  }

  /* ── DATA ── */
  async saveProfile(profile) {
    localStorage.setItem('rr_profile', JSON.stringify(profile));
    if (!this._ready || !this._uid) return;
    try {
      await this._fns.setDoc(
        this._fns.doc(this._db, 'users', this._uid),
        { profile, updatedAt: Date.now() },
        { merge: true }
      );
    } catch(e) { /* silent fallback to localStorage */ }
  }

  async loadProfile() {
    const local = localStorage.getItem('rr_profile');
    if (!this._ready || !this._uid) return local ? JSON.parse(local) : null;
    try {
      const snap = await this._fns.getDoc(this._fns.doc(this._db, 'users', this._uid));
      if (snap.exists() && snap.data().profile) {
        const p = snap.data().profile;
        localStorage.setItem('rr_profile', JSON.stringify(p));
        return p;
      }
    } catch(e) {}
    return local ? JSON.parse(local) : null;
  }

  async saveActivity(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    if (!this._ready || !this._uid) return;
    try {
      await this._fns.setDoc(
        this._fns.doc(this._db, 'users', this._uid),
        { [key]: data, updatedAt: Date.now() },
        { merge: true }
      );
    } catch(e) {}
  }

  /* ── LOCAL FALLBACKS ── */
  _localSignUp(name, email) {
    const uid = 'local_' + Date.now();
    localStorage.setItem('rr_logged', '1');
    localStorage.setItem('rr_uid', uid);
    return { uid, email: email || 'demo@roastandrich.app', name: name || 'Demo User', local: true };
  }
  _localSignIn() {
    const uid = localStorage.getItem('rr_uid') || ('local_' + Date.now());
    localStorage.setItem('rr_logged', '1');
    localStorage.setItem('rr_uid', uid);
    return { uid, local: true };
  }

  get isFirebase() { return this._ready; }
  get uid() { return this._uid || localStorage.getItem('rr_uid'); }
}

/* Global DB instance */
const db = new DB();