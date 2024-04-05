"use client"

import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import DoctorAppointment from "./DoctorAppointment";
import { UserAuth } from "@/context/AuthContext";
import { Avatar, Typography } from "@mui/material";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

export default function Home() {

    const pathname = usePathname().replace("%20%20", " ").replace("%20", " ").replace("%7D", " ");



    const navigate = useRouter();
    const { user, isLoading } = UserAuth();

    const [state, setState] = useState();
    const [doctors, setDoctors] = useState([]);
    useEffect(() => {
        const q = query(collection(db, "doctors"), where("hospitalName", "==", pathname.slice(24)));

        const doc = async () => {

            const querySnapshot = await getDocs(q);


            let sdata = [];
            querySnapshot.docs.forEach((doc) => {
                sdata.push({ id: doc.id, ...doc.data() });
            });

            setDoctors(sdata);

            // console.log(sdata, "-___-", querySnapshot.docs);
        }
        doc();
    }, [])

    console.log(doctors);

    return !isLoading.current ? user ? !state ?
        <>

            <div className="flex flex-col items-center mt-5 w-full ">
                <Typography
                    variant="h3"
                    component="h3"
                    align="center"
                    sx={{ mb: 2 }}
                >
                    Doctors List
                </Typography>

                {doctors.map(doctor =>
                    <div
                        key={doctor.id}
                        className="flex justify-between md:flex-row flex-col  cursor-pointer mb:2 mt:2 border-red-300 border-2 rounded p-2 shadow-md shadow-black"
                        onClick={() => { setState(doctor) }}

                    >

                        <div
                            className="mr-2 md:w-[45%] flex justify-center "
                        >
                            <Avatar alt="image"
                                // sx={{ width: 100, height: 100 }}
                                className="w-[200px] h-[200px] aspect-square"
                                src={doctor.imageURL} />

                        </div>

                        <div
                            className="md:w-[45%]"
                        >
                            <Typography
                                variant="h4"
                                component="h4"
                                align="center"
                                sx={{ mt: 1, mb: 1 }}
                            >

                                {doctor.doctorName}
                            </Typography>

                            <div className="flex justify-between mb-2">
                                <div className="w-[50%] font-medium">Education</div>
                                <div className="w-[50%]">

                                    {doctor.education}
                                </div>
                            </div>

                            <div className="flex justify-between mb-2">
                                <span>Specialist</span>
                                <span>

                                    {doctor.specialist}

                                </span>
                            </div>



                            <div>
                                <div className="w-[50%] inline-block mb-2">
                                    Hospital
                                    <LocalHospitalIcon />
                                </div>
                                <div className="w-[50%] inline-block text-right">

                                    {doctor.hospitalName}
                                </div>

                            </div>

                            <div className="flex justify-between">
                                <span>Location</span>
                                <span>

                                    {doctor.location}

                                </span>
                            </div>



                        </div>

                    </div>)}

            </div>

        </>

        : <DoctorAppointment state={state} /> :
        <h1>route not available , login first</h1>
        : <h1>Loading........</h1>

}
