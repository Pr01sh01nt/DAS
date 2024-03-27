import { db } from '@/lib/firebase/config';
import { Button } from '@mui/material';
import { collection, doc, getDocs, query, runTransaction, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

const DoctorAppointment = ({ state }) => {

    let [appointment, setAppointment] = useState([]);

    useEffect(() => {


        const q = query(collection(db, "appointments"), where("id", "==", state.id));

        const doc = async () => {

            const querySnapshot = await getDocs(q);


            let sdata = [];
            querySnapshot.docs.forEach((doc) => {
                sdata.push({ docID: doc.id, ...doc.data() });
            });


            setAppointment(sdata);
            console.log("-_______________________-", querySnapshot.docs, sdata);
        }
        doc();

    }, []);

    const handleClick = async (count, docId) => {

        try {
            if (count === 0) {alert("seat full");
                throw "no seat available";
            }
            else {

                const sfDocRef = doc(db, "appointments",  docId);

                const newCount = await runTransaction(db, async (transaction) => {
                    const sfDoc = await transaction.get(sfDocRef);
                    if (!sfDoc.exists()) {
                        throw "Document does not exist!";
                      }

                    const nCount = sfDoc.data().patientCount - 1;
                    if(nCount >= 0)
                    {
                        transaction.update(sfDocRef, {patientCount : nCount});
                        return nCount;
                    }else {
                        return Promise.reject("Sorry! seat not avaialable");
                      }

                  
                });
                
                console.log("Seats decreased to ", newCount);
                appointment = appointment.map((doc)=>{
                    if(doc.docID == docId)
                      doc.patientCount = newCount;
                    return doc;
                });
                setAppointment(appointment);
                // make stripe integration here
            }


        } catch (err) {
            console.log(err);
        }
    }


    return (
        <div>
            <h1>time of appointment shown

                with doctor details
            </h1>

            {appointment.map((data) => <>

                <h1>Start Time</h1>
                {data.startTime + " "}
                <h1>End Time</h1>
                {data.endTime + " "}
                <h1>Fee (in Rs) </h1>
                {data.fee}
                <h1>Seats Left</h1>
                {data.patientCount + " "}
                <br />
                <Button variant="contained" className='bg-black' onClick={() => { handleClick(data.patientCount, data.docID) }}>Apply</Button>

            </>)}

            select the available time
            doctor have fixed number of patient checking in a particular shift
            so if the doctor is available then
            allow client to fill the form

            else not allow

            fill form and make payment , if payment successful
            increase total number of patient by one


            CHALLANGE:
            it should be real time

        </div>
    )
}

export default DoctorAppointment
