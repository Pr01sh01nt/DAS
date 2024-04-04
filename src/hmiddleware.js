import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    getAuth,
    signInWithRedirect

} from "firebase/auth";
import { auth, db } from './lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';


import { NextRequest, NextResponse } from "next/server";

export async function middleware(){
  
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider);

}