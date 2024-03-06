"use client"  

import { UserAuth } from "../context/AuthContext";
import Image from "next/image";

export default function Home() {
  
  console.log("page renders");
  const {user, googleSignIn, logOut} = UserAuth();
  console.log(user, "user");
  console.log(user?.login_hint, "login hint");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
        < button onClick = {()=>{googleSignIn()}}>sign in with google</button>
        < button onClick = {()=>{logOut()}}>Logout</button>
    
    </main>
  );
}
