"use client"  

import { useSearchParams } from "next/navigation";
import { UserAuth } from "../context/AuthContext";
import Image from "next/image";

export default function Home() {
  const {user, isLoading, role} = UserAuth();

  
  console.log("page renders");
  const {googleSignIn, logOut} = UserAuth();
  console.log(user, "user");
  console.log(user?.login_hint, "login hint");


  return isLoading.current ? <h1>Loading......</h1> : !user ?

    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
        < button onClick = {()=>{googleSignIn()}}>sign in with google</button>
        < button onClick = {()=>{logOut()}}>Logout</button>
    
    </main>
    
    :
    <main className="min-h-screen ">
    <h1>Home page : {role}</h1>
    
    < button onClick = {()=>{logOut()}}>Logout</button>
    </main>
 
}
