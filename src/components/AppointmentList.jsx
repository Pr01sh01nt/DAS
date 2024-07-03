"use client"

import { db } from "@/lib/firebase/config";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from "react";



const AppointmentList = ({ id }) => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {


        const q = query(collection(db, "appointments"), where("id", "==", id));

        const doc = async () => {

            const querySnapshot = await getDocs(q);


            let sdata = [];
            querySnapshot.docs.forEach((doc) => {
                sdata.push({ docID: doc.id, ...doc.data() });
            });


            setAppointments(sdata);
            // console.log("-__-",  sdata);
        }
        doc();

    }, []);


    const handleReset = async(docID, fixPatientCount)=>{

        await updateDoc(doc(db,"appointments", docID), {
            patientCount: fixPatientCount,
          });
        // console.log("reset done");
     
        
    }

    const handleDelete = async(docID)=>{
        await deleteDoc(doc(db, "appointments", docID));
        // console.log("deleted");
    }

    return (
        <>
        {appointments?.length!==0 &&
        
        
            <TableContainer sx={{ maxWidth: 650 }} component={Paper}
                className="mb-4"
            >
                <Table sx={{ maxWidth: 650 }}>
                    <TableHead>
                        <TableRow className="font-bold ">
                            <TableCell className="font-extrabold bg-[rgba(0,0,0,0.72)] text-[rgb(255,255,255)] ">Start Time</TableCell>
                            <TableCell className="font-extrabold bg-[rgba(0,0,0,0.72)] text-[rgb(255,255,255)] ">End TIme</TableCell>
                            <TableCell align="right" className="font-extrabold bg-[rgba(0,0,0,0.72)] text-[rgb(255,255,255)] ">Fee (in Rs)</TableCell>
                            <TableCell align="right" className="font-extrabold bg-[rgba(0,0,0,0.72)] text-[rgb(255,255,255)] ">Patinet Count</TableCell>
                            <TableCell align="right" className="font-extrabold bg-[rgba(0,0,0,0.72)] text-[rgb(255,255,255)] ">

                            </TableCell>
                            <TableCell align="right" className="font-extrabold bg-[rgba(0,0,0,0.72)] text-[rgb(255,255,255)] ">

                            </TableCell>



                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {appointments.map((appointment) => (    
                            <TableRow
                                key={appointment.docID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >

                                <TableCell component="th" scope="row" className="font-semibold bg-[rgba(0,0,0,0.57)] text-[rgb(255,255,255)]">
                                    {appointment.startTime}

                                </TableCell>
                                <TableCell align="right" className="font-semibold bg-[rgba(0,0,0,0.57)] text-[rgb(255,255,255)]">{appointment.endTime}</TableCell>
                                <TableCell align="right" className="font-semibold bg-[rgba(0,0,0,0.57)] text-[rgb(255,255,255)]">{appointment.fee}</TableCell>
                                <TableCell align="right" className="font-semibold bg-[rgba(0,0,0,0.57)] text-[rgb(255,255,255)]">{appointment.patientCount}</TableCell>
                                <TableCell align="right" className="font-semibold bg-[rgba(0,0,0,0.57)] text-[rgb(255,255,255)]">
                                    <Button
                                        varaint="filled"
                                        color='error'
                                        className="font-semibold rounded-lg border-2 bg-[rgba(162,96,96,0.71)]"
                                        onClick={()=>{handleDelete(appointment.docID)}}
                                        >Delete</Button>
                                </TableCell>
                                <TableCell align="right" className="font-semibold bg-[rgba(0,0,0,0.57)] text-[rgb(255,255,255)]">
                                    <Button
                                        varaint="filled"
                                        color='success'
                                        className="font-semibold rounded-lg border-2 bg-[rgba(126,176,100,0.62)]"
                                        onClick={()=>{handleReset(appointment.docID, appointment.fixPatientCount)}}
                                    >Reset</Button>
                                </TableCell>

                            </TableRow>
                        ))}


                    </TableBody>
                </Table>
            </TableContainer>
        }
        </>
    )
}

export default AppointmentList;
