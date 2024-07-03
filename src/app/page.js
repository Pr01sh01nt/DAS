"use client"

import { useSearchParams } from "next/navigation";
import { UserAuth } from "../context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Typography } from "@mui/material";

export default function Home() {
  const { user, isLoading, role } = UserAuth();
  const navigate = useRouter();


  // console.log("page renders");
  // const { googleSignIn, logOut } = UserAuth();
  // console.log(user, "user");
  // console.log(user?.login_hint, "login hint");


  return isLoading.current ? <h1>Loading......</h1> : !user ?

    <main className="min-h-screen bg-[url('/assests/doctorIllustraion.webp')] bg-no-repeat bg-scroll bg-cover">
      {/* hero page */}

      <div
        className="ml-16 pt-4  pl-2 w-[50vw]" 
      >

        <Typography
          variant="h3"
          className=" pd-[10px] font-bold"
        >
          Book an Appointment with Any Doctor, Anytime, Anywhere
        </Typography>

        <Typography
          variant="h6"
          className="pt-[4px] pr-[4px]"
        > 
          Find and book appointments with the best doctors in the top hospitals near you
        </Typography>

      </div>






    </main>

    :
    navigate.replace(`/${role}`);


}
