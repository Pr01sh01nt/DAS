import AppointmentList from '@/components/AppointmentList';
import { db } from '@/lib/firebase/config';
import { Avatar, Box, Button, TextField, Typography } from '@mui/material'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import axios from 'axios';

const Doctor = ({ state }) => {
    const [time, setTime] = useState({ startTime: " ", endTime: " " });

    // console.log(state, "state");
    const handleSubmit = async (event) => {

        try {
            event.preventDefault();

            const data = new FormData(event.currentTarget);
            if (data.get('startTime') === "" || data.get("endTime") === "") {
                alert('fill everything');
                throw new Error("Provide Start Time and End Time");
            }
            else {
                
                // creating product in stripe
                // console.log("creating product in stripe");
                const res = await axios("/api/hospital", {
                    params:{
                        name: state.doctorName,
                        amount: data.get('fee'), 
                    }
                });
                // console.log(res.data , "responses from stripe");
                
                // creating payment link
                // console.log("creating payment link");
                const paymentLinkRes = await axios("/api/hospital/genratePaymentLink",{
                    params:{
                        priceId : res.data,
                    }
                });
                // console.log(paymentLinkRes.data);

                // saving to firestore
                const docRef = await addDoc(collection(db, "appointments"), {
                    id: state.id,
                    startTime: data.get('startTime'),
                    endTime: data.get('endTime'),
                    fee: data.get('fee'),
                    patientCount: data.get('patientCount'),
                    fixPatientCount: data.get('patientCount'),
                    paymentLink : paymentLinkRes.data
                    
                    

                });

                // console.log(docRef, "saved");
                

            }
        } catch (err) {
            console.error(err);
        }

    }

    return (
        <>

            <Box
                component="div"
                className="flex justify-around flex-col md:flex-row items-center md:items-start"

            >
                <Box
                    component="div"
                    className="w-[48%]"
                >



                    <Box
                        component="div"
                        className='flex justify-center mt-5'
                    >
                        <Avatar
                            alt="avatar"
                            sx={{ width: 100, height: 100 }}
                            src =  {state.imageURL}
                        />
                    </Box>
                    doctor details(dob, education, name, details)

                    

                </Box>

                <Box

                    component="div"
                    className="w-[48%] mt-5 flex flex-col items-center"
                >
                    <Typography
                        variant="h5"
                        component="h5"
                        align='center'
                    >

                       New Appointment Details
                    </Typography>
                    <Box
                        component="form"
                        className="flex flex-col  justify-between min-w-[320px] sm:min-w-[410px]"
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            type="time"
                            label="Start Time"
                            value={time.startTime}
                            variant="outlined"
                            className='m-2'
                            name="startTime"
                            onChange={(e) => { setTime({ ...time, startTime: e.target.value }) }}

                        />
                        <TextField
                            type="time"
                            label="End Time"
                            value={time.endTime}
                            variant="outlined"
                            className='m-2'
                            name="endTime"
                            onChange={(e) => { setTime({ ...time, endTime: e.target.value }) }}

                        />

                        <TextField
                            type="number"
                            label="Fee(in Rs)"
                            variant="outlined"
                            className='m-2'
                            name="fee"
                            required


                        />
                        <TextField
                            type="number"
                            label="Patient Count"
                            variant="outlined"
                            className='m-2'
                            name="patientCount"
                            required

                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            className="bg-[rgb(167,190,80)]"
                        >
                            Submit
                        </Button>

                    </Box>
                </Box>
            </Box>

           
           <Box className = "flex justify-center">

            <AppointmentList id={state.id}/>
           </Box>
        </>
    )
}

export default Doctor
