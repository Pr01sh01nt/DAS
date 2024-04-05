"use client"

import { createContext, useState, useEffect, useContext, useRef } from 'react'

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signInWithRedirect,
  getRedirectResult,

} from "firebase/auth";
import { auth, db } from '../lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';


const AuthContext = createContext("");


export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [role, setRole] = useState(null);
  const isLoading = useRef(true);
  const navigate = useRouter();

  

  const googleSignIn = async () => {

    // console.log("signin with google");
    isLoading.current = true;
    try {

      const provider = new GoogleAuthProvider();


      // await signInWithPopup(auth, provider);

      navigate.push("/");
      await signInWithRedirect(auth, provider);

      isLoading.current = false;





    } catch (err) {
      isLoading.current = false;
      console.error(err)
    }


    return auth.currentUser;

  };

  const logOut = () => {
    isLoading.current = true;
    signOut(auth);
    isLoading.current = false;
  };


  useEffect(() => {

    
    const unsubscribee = onAuthStateChanged(auth, async (currentUser) => {

      try {
        
        // console.log(currentUser);
        if (currentUser) {
          // console.log(currentUser.uid);
          const data = await getDoc(doc(db, "users", currentUser.uid));
          // console.log(data, 'data');
          
          setRole(data.data().role);
        }

      } catch (err) {

        console.error(err);
      }
      isLoading.current = false;
      setUser(currentUser);

    });

    return () => {

      unsubscribee();

    };
  }, [user]);


  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };


  return (
    <>

      <AuthContext.Provider value={{ user, googleSignIn, logOut, signUp, signIn, isLoading, role, setRole }}>
        {children}

      </AuthContext.Provider>

    </>
  );

};


export const UserAuth = () => {
  return useContext(AuthContext);
};