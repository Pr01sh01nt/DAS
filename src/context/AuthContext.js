"use client"

import { createContext, useState, useEffect, useContext, useRef } from 'react'

import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    getAuth

} from "firebase/auth";
import { auth, db } from '../lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';


const AuthContext = createContext("");


export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [role, setRole] = useState(null);
    const isLoading = useRef(true);
    console.log(auth.currentUser , "from auth ");
    // const auth = getAuth();

    console.log("render context");  
    // console.log(auth, "hjshj");

    const googleSignIn = async() => {

      console.log("signin with google");
      isLoading.current = true;
      try{
        
        const provider = new GoogleAuthProvider();
       
        
        await signInWithPopup(auth, provider);
        isLoading.current = false;

        
      }catch(err){
        isLoading.current = false;
        console.log(err)}
        
        
        return auth.currentUser;

    };

    const logOut = () => {
      isLoading.current = true;
      signOut(auth);  
      isLoading.current = false;
    };


    useEffect(() => {

      console.log("is user changed ", typeof(onAuthStateChanged));
      const unsubscribee = onAuthStateChanged(auth, async(currentUser) => {

        try{
          console.log("irun")
          console.log(currentUser);
        if(currentUser)
        {
          console.log(currentUser.uid);
          const data = await getDoc(doc(db, "users",currentUser.uid ));
          console.log(data, 'data');
          console.log(data.data(), "user data");
          setRole(data.data().role);
        }
           
      }catch(err)
      { 
        
        console.error(err);
      }
      isLoading.current = false;
      setUser(currentUser);

      });
      
      return () =>{ 
        console.log("hey , cleaner now runs  ");      
     
        unsubscribee();
        
        };
      }, [user]);

    
    const signUp = (email, password)=>{
      return createUserWithEmailAndPassword(auth, email, password);
    };

    const signIn = (email, password)=>{
      return signInWithEmailAndPassword(auth, email, password);
    };


      return (
        <>
        
        <AuthContext.Provider value={{ user, googleSignIn, logOut, signUp, signIn, isLoading , role, setRole}}>
          {children}
          {console.log("first")}
        </AuthContext.Provider>
          {console.log("second")}
        </>
      );

};


export const UserAuth = () => {
    return useContext(AuthContext);
  };