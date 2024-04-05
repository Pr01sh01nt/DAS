"use client"

import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react";
import Doctor from "./Doctor";
import { UserAuth } from "@/context/AuthContext";
import { Typography } from "@mui/material";
import DoctorList from "@/components/shared/DoctorList";




export default function Home() {

    const pathname = usePathname();
    const [doctors, setDoctors] = useState([]);
    const [state, setState] = useState(null);
    const { user, isLoading } = UserAuth();

    useEffect(() => {
        const q = query(collection(db, "doctors"), where("specialist", "==", pathname.slice(10)));

        const doc = async () => {

            const querySnapshot = await getDocs(q);


            let sdata = [];
            querySnapshot.docs.forEach((doc) => {
                sdata.push({ id: doc.id, ...doc.data() });
            });

            setDoctors(sdata);
            // console.log("-___-", querySnapshot.docs);
        }
        doc();
    }, [])

    return !isLoading.current ? user ? !state ?
        <>
            <div className="flex justify-center mt-5 w-full ">

                {doctors.length !== 0 ? <Typography
                    variant="h3"
                    component="h3"
                    align="center"
                    sx={{ mb: 2 }}
                >
                    Avialable {doctors[0].specialist}
                </Typography> : <h1>No available doctors</h1>}

            </div>



            <DoctorList setState={setState} doctors={doctors} />


        </>
        :
        <>
            <Doctor state={state} />
        </>
        :
        <h1>Login First</h1>
        : <h1>Loading.......</h1>

}
