"use client"

import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import DoctorAppointment from "./DoctorAppointment";
import { UserAuth } from "@/context/AuthContext";
import { Avatar } from "@mui/material";

export default function Home() {

    const pathname = usePathname().replace("%20%20", " ").replace("%20", " ").replace("%7D", " ");
    const navigate = useRouter();
    const { user, isLoading } = UserAuth();

    const [state, setState] = useState();
    const [doctors, setDoctors] = useState([]);
    useEffect(() => {
        const q = query(collection(db, "doctors"), where("hospitalName", "==", pathname.slice(8)));

        const doc = async () => {

            const querySnapshot = await getDocs(q);


            let sdata = [];
            querySnapshot.docs.forEach((doc) => {
                sdata.push({ id: doc.id, ...doc.data() });
            });

            setDoctors(sdata);

            console.log(sdata, "-___-", querySnapshot.docs)
        }
        doc();
    }, [])


    return !isLoading.current ? user ? !state ?
        <>
            <h1>List of all Doctors</h1>
            have filters for speciality, fees
            {" " + pathname.slice(8)}

            {doctors.map(doctor =>
                <div
                    onClick={() => { setState(doctor) }}
                    className="flex"
                >
                    <Avatar alt="image" sx={{ width: 100, height: 100 }} src={doctor.imageURL} />
                    <div>
                        {doctor.doctorName}
                        {doctor.education}
                        {doctor.hospialName}
                        {doctor.location}
                        {doctor.specialist}
                    </div>

                </div>)}

        </>

        : <DoctorAppointment state={state} /> :
        <h1>route not available , login first</h1>
        : <h1>Loading........</h1>

}
