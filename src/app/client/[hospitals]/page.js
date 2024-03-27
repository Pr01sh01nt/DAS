"use client"

import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import DoctorAppointment from "./DoctorAppointment";

export default function Home() {
    
    const pathname = usePathname().replace("%20%20", " ").replace("%20", " ").replace("%7D", " ");
    const navigate = useRouter(); 
    

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
            console.log("-_______________________-", querySnapshot.docs)
        }
        doc();
    }, [])


    return !state ?  
        <>
            <h1>List of all Doctors</h1>
            have filters for speciality, fees
            {" " + pathname.slice(8)}

            {doctors.map(doctor=><h1 onClick = {()=>{ setState(doctor)}}>{doctor.doctorName} : {doctor.specialist} registration fee Rs {doctor.fee}</h1>)} 

        </>

        : <DoctorAppointment state = {state}/>
    
}
