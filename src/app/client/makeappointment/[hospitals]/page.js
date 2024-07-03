"use client"

import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import DoctorAppointment from "./DoctorAppointment";
import { UserAuth } from "@/context/AuthContext";
import {  Typography } from "@mui/material";
import DoctorList from "@/components/shared/DoctorList";

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
        <div
            className="min-h-screen"
        >

            <div className="flex justify-center mt-5 w-full ">

                <Typography
                    variant="h3"
                    component="h3"
                    align="center"
                    sx={{ mb: 2 }}
                >
                    Doctors List
                </Typography>

            </div>

         

            <DoctorList setState={setState} doctors={doctors}/>
        </div>


        </>

        : <DoctorAppointment state={state} /> :
        <h1>route not available , login first</h1>
        : <h1>Loading........</h1>

}
