"use client"

import { Button, Typography } from "@mui/material";
import Link from "next/link";
import { doctorSpecialties } from "@/constants";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/context/AuthContext";


export default function Home() {
      const navigate = useRouter();
      const { user, isLoading, role } = UserAuth();

      const handleClick = (event) => {
            // console.log(event.currentTarget.getAttribute("name"), "handle it");
            navigate.push(`/hospital/${event.currentTarget.getAttribute("name")}`);
      }

      return !isLoading.current ? role === "hospital" ? user ?
            <>



                  <div className="flex flex-wrap justify-around max-w-full">

                        {doctorSpecialties.map(specialist =>
                              <div
                                    key={specialist.type}
                                    className={`flex justify-center items-center border-2 w-[300px] m-2 border-black  font-bold  cursor-pointer rounded p-2 max-w-[200px] min-h-[100px]`}
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

                                    {/* <Typography
                                    variant="body1"
                                    component="p"
                                    align="justify"
                              >
                              </Typography> */}

                              </div>)}
                  </div>

                  <Link href="/hospital/addDoctor" className="flex justify-center">
                        <Button
                              className="bg-[rgb(75,77,187)] pd-4"
                              variant="contained"
                        >
                              Add Doctors
                        </Button>
                  </Link>


            </>
            : <h1>Login First</h1>
            : <h1>you have not login with hospital , make login with client</h1>
            : <h1>Loading........</h1>

}
