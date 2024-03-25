"use client"

import { Button } from "@mui/material";
import Link from "next/link";
import { doctorSpecialties } from "@/constants";
import { useRouter } from "next/navigation";


export default function Home() {
      const navigate = useRouter();

      const handleClick = (event)=>{
            console.log(event.target.getAttribute("name"), "handle it");
            navigate.push(`/hospital/${event.target.getAttribute("name")}`);
      }

      return (
            <>

                  
                  <h1>Hospital home page</h1>
                  <div className="border-2 flex flex-wrap">

                  {doctorSpecialties.map(specialist=><div className=" border-2 w-2/12 m-2 border-black" onClick={handleClick} name={specialist}>

                              {specialist + ' '}
                  </div>)}
                  </div>
                  
                  <Link href="/hospital/addDoctor">
                  <Button className="bg-[rgb(75,77,187)]" variant = "contained">Add Doctors</Button>
                  </Link>

                  
            </>
      );
}
