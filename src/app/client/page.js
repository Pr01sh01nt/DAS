"use client"

import { styled } from '@mui/material/styles';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { UserAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,  Tooltip, Typography } from "@mui/material";


const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme?.palette?.background?.paper,
}));



export default function Home() {
    const navigate = useRouter();
    const { user, isLoading, role } = UserAuth();
    const [myAppointments, setMyAppointments] = useState([]);






    useEffect(() => {



        const getMyAppointment = async () => {
            try {
                const q = query(collection(db, "reciept"), where("uid", "==", user?.uid), orderBy("timestampField", "desc"), limit(5));
                const querySnapshot = await getDocs(q);


                let sdata = [];
                querySnapshot.docs.forEach((doc) => {
                    sdata.push({ id: doc.id, ...doc.data() });
                });
                // console.log(sdata, "__..__");
                setMyAppointments(sdata);

            } catch (err) {
                console.log(err);
            }

        }

        getMyAppointment();



    }, [user]);

    // console.log(user, '::');

 

    return !isLoading.current ? role === "client" ? user ?
        <>
        <div className="flex flex-col items-center min-h-screen">
            <h1 className='text-[35px] font-bold mb-5 mt-2'>My Appointments</h1>

        {myAppointments.length!==0 ?
        
            <TableContainer sx={{ maxWidth: 650 }} component={Paper}>
                <Table sx={{ maxWidth: 650 }}>
                    <TableHead>
                        <TableRow className="font-bold ">
                            <TableCell className="font-extrabold bg-[rgba(0,0,0,0.72)] text-[rgb(255,255,255)] ">Doctor</TableCell>
                            <TableCell align="right" className="font-extrabold bg-[rgba(0,0,0,0.72)] text-[rgb(255,255,255)] ">Start Time</TableCell>
                            <TableCell align="right" className="font-extrabold bg-[rgba(0,0,0,0.72)] text-[rgb(255,255,255)] ">End Time</TableCell>
                            <TableCell align="right" className="font-extrabold bg-[rgba(0,0,0,0.72)] text-[rgb(255,255,255)] ">Fee (in Rs)</TableCell>
                            <TableCell align="right" className="font-extrabold bg-[rgba(0,0,0,0.72)] text-[rgb(255,255,255)] ">Registered At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {myAppointments.map((appointment) => (
                            <TableRow
                                key={appointment.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >

                                <TableCell component="th" scope="row" className="font-semibold bg-[rgba(0,0,0,0.57)] text-[rgb(255,255,255)]">
                                    {appointment.appointedDoctor}
                                </TableCell>
                                <TableCell align="right" className="font-semibold bg-[rgba(0,0,0,0.57)] text-[rgb(255,255,255)]">{appointment.startTime}</TableCell>
                                <TableCell align="right" className="font-semibold bg-[rgba(0,0,0,0.57)] text-[rgb(255,255,255)]">{appointment.endTime}</TableCell>
                                <TableCell align="right" className="font-semibold bg-[rgba(0,0,0,0.57)] text-[rgb(255,255,255)]">{appointment.fee}</TableCell>
                                <TableCell align="right" className="font-semibold bg-[rgba(0,0,0,0.57)] text-[rgb(255,255,255)]">{(new Date(parseInt(appointment.timestampField))).toLocaleString()}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer> : 
            <Typography
                    variant='h6'
            >
                No Appointments Made
            </Typography>
        }


            <Button
                onClick={()=>{navigate.push('/client/makeappointment')}}
                sx={{mt:5}}
                className='text-white bg-gradient-to-b from-[rgba(0,255,242,0.84)] to-[rgba(0,4,255,0.88)] hover:to-blue-500 w-fit shadow-xl shadow-[rgba(114,152,255,0.62)]'
                >
                Book an Appointment

            </Button>
        </div>









        </> : <h1>Login First</h1>
        : <h1>you have not login with client , make login with hospital</h1>
        : <h1>Loading........</h1>

}
