"use client"

import { UserAuth } from "@/context/AuthContext";
import { Button, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";


export default function Home() {
  const navigate = useRouter();
  const {user, isLoading} = UserAuth();


  return isLoading.current ? <h1>Loading...</h1> : 
    !user ?

    <main className="min-h-screen pt-6">
      <Typography variant="h3" align="center">

        Login / SignUp as a 
      </Typography> 
    <div className="flex min-h-[75vh]  items-center justify-evenly">

        <Button variant="contained" onClick={()=>{navigate.push("/role/hospital")}}> Hospital</Button>
        <Button variant="contained" onClick={()=>{navigate.push("/role/client")}}>Client</Button>
    
    </div>
    </main>
    : <h1>Route not available</h1>

  
}
