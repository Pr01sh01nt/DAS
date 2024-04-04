"use client"

import { Button, Typography } from "@mui/material";
import Link from "next/link";
import { doctorSpecialties } from "@/constants";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/context/AuthContext";


export default function Home() {
      const navigate = useRouter();
      const { user, isLoading , role} = UserAuth();

      const handleClick = (event) => {
            console.log(event.currentTarget.getAttribute("name"), "handle it");
            navigate.push(`/hospital/${event.currentTarget.getAttribute("name")}`);
      }

      return  !isLoading.current ? role === "hospital" ? user ?
            <>


                  <h1>Hospital home page</h1>
                  <div className="border-2 flex flex-wrap justify-around max-w-full">

                        {doctorSpecialties.map(specialist => <div
                              className=" border-2 w-[300px] m-2 border-black cursor-pointer rounded p-2 max-w-[300px]"
                              onClick={handleClick}
                              name={specialist.type}
                        >

                              <Typography
                                    variant="h5"
                                    component="h5"
                                    align="center"
                              >
                                    {specialist.type}

                              </Typography>

                              <Typography
                                    variant="body1"
                                    component="p"
                                    align="justify"
                              >
                                    {/* {specialist.details} */}

                              </Typography>

                        </div>)}
                  </div>

                  <Link href="/hospital/addDoctor">
                        <Button className="bg-[rgb(75,77,187)]" variant="contained">Add Doctors</Button>
                  </Link>


            </>
            : <h1>Login First</h1>
            :<h1>you have not login with hospital , make login with client</h1>
            : <h1>Loading........</h1>

}
