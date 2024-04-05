"use client"

import { useSearchParams } from "next/navigation";
import { UserAuth } from "../context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isLoading, role } = UserAuth();
  const navigate = useRouter();


  // console.log("page renders");
  // const { googleSignIn, logOut } = UserAuth();
  // console.log(user, "user");
  // console.log(user?.login_hint, "login hint");


  return isLoading.current ? <h1>Loading......</h1> : !user ?

    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* hero page */}
      <img
        src="/assests/doctorIllustraion.webp" 
        className="w-screen"
        alt="doctorIllustration"
      />

    
    
      <div className="border-2 divide-slate-500 border-black">

        i have black border
      </div>

    </main>

    :
    navigate.replace(`/${role}`);
  

}
