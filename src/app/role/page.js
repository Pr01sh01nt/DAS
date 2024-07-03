"use client"

import { UserAuth } from "@/context/AuthContext";
import { Button, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";


export default function Home() {
  const navigate = useRouter();
  const { user, isLoading } = UserAuth();


  return isLoading.current ? <h1>Loading...</h1> :
    !user ?

      <main className="min-h-screen pt-6 bg-red-300">
        <Typography variant="h3" align="center"
          className="max-sm:text-2xl font-bold text-[rgb(61,60,109)]"
        >
          <u>

          Login / SignUp as a
          </u>
        </Typography>
        <div className="flex min-h-[75vh]  items-center justify-evenly">

          <Button
            variant="outlined"
            onClick={() => { navigate.push("/role/hospital") }}
            className="bg-gradient-to-tr from-[rgba(144,255,100,0.87)] to-[rgba(255,6,6,0.93)] text-white font-bold border-0"
          >
            Hospital
          </Button>

          <Button
            variant="outlined"
            onClick={() => { navigate.push("/role/client") }}
            className="bg-gradient-to-tr from-[rgba(39,60,255,0.87)] to-[rgba(184,255,6,0.93)] text-white font-bold border-0"
          >
            Client
          </Button>

        </div>
      </main>
      : <h1>Route not available</h1>


}
