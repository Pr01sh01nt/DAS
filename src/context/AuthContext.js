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
import { auth } from '../lib/firebase/config';


const AuthContext = createContext("");


export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({isLoading:true});
    const isLoading = useRef(true);
    console.log(auth.currentUser , "from auth ");
    // const auth = getAuth();

    console.log("render context");  
    // console.log(auth, "hjshj");

    const googleSignIn = async() => {

      console.log("signin with google")
      isLoading.current = true;
      try{
        
        const provider = new GoogleAuthProvider();
       
        
        await signInWithPopup(auth, provider);

      }catch(err){
        isLoading.current = false;
        console.log(err)}


    };

    const logOut = () => {
        signOut(auth);
        isLoading.current = true;
    };

    function hello(){
      console.log("cleanrer hello runs")
    }

    useEffect(() => {

      console.log("is user changed ", typeof(onAuthStateChanged));
      const unsubscribee = onAuthStateChanged(auth, (currentUser) => {
        console.log("irun")
        isLoading.current = false;
        setUser(currentUser);
      });
      // console.log(unsubscribee);
      // const unsubscribee = hello();
      return () =>{ 
        console.log("hey , cleaner now runs ");
        // console.log("HE");
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
        
        <AuthContext.Provider value={{ user, googleSignIn, logOut, signUp, signIn, isLoading }}>
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