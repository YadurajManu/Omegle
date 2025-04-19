// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDt0kbnYKMOWD2oa6xr5pSpqaqE8-0YT48",
  authDomain: "egle-a6ab2.firebaseapp.com",
  projectId: "egle-a6ab2",
  storageBucket: "egle-a6ab2.firebasestorage.app",
  messagingSenderId: "901009176268",
  appId: "1:901009176268:web:fdcb327ee774275de87469",
  measurementId: "G-3NEDNNCCF9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const logInWithEmailAndPassword = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const registerWithEmailAndPassword = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile in Firestore
    await setDoc(doc(db, "users", result.user.uid), {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName || "",
      photoURL: result.user.photoURL || "",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      username: "",
      bio: "",
      location: "",
      gender: "",
      birthdate: "",
      phoneNumber: "",
      interests: []
    });
    
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Check if user profile exists
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    
    // If user profile doesn't exist, create it
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || "",
        photoURL: result.user.photoURL || "",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        username: "",
        bio: "",
        location: "",
        gender: "",
        birthdate: "",
        phoneNumber: "",
        interests: []
      });
    } else {
      // Update lastLogin
      await updateDoc(doc(db, "users", result.user.uid), {
        lastLogin: serverTimestamp()
      });
    }
    
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Firestore functions for user profile
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { 
        success: false, 
        error: "User profile not found" 
      };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (uid, profileData) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...profileData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export { auth, db }; 