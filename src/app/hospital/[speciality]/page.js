"use client"
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";
import { usePathname} from 'next/navigation'
import { useEffect, useState } from "react";
import Doctor from "./Doctor";


export default function Home() {

    const pathname = usePathname();
    const [doctors, setDoctors] = useState([]);
    const [state, setState] = useState(null);
    useEffect(() => {
        const q = query(collection(db, "doctors"), where("specialist", "==", pathname.slice(10)));

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
            {"         " + pathname.slice(10)}
            {doctors?.map((doctor) => <h1 onClick = {()=>{setState(doctor)}} >
                {doctor.doctorName}
            
            </h1 >)}
        </>
        :
        <>
        <Doctor state =  {state}/>
        </>

}
