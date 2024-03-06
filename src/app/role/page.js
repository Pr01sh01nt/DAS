"use client"

import { Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";


export default function Home() {
  const navigate = useRouter();
    
  return (
    <main className="min-h-screen pt-6">
      <Typography variant="h3" align="center">

        Login / SignUp as a 
      </Typography>
    <div className="flex min-h-[75vh]  items-center justify-evenly">

        <Button variant="contained" onClick={()=>{navigate.push("/role/hospital")}}> Hospital</Button>
        <Button variant="contained" onClick={()=>{navigate.push("/role/client")}}>Client</Button>
    
    </div>
    </main>
  );
}
