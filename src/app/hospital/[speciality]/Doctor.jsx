import { db } from '@/lib/firebase/config';
import { Avatar, Box, Button, TextField } from '@mui/material'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react'

const Doctor = ({ state }) => {
    const [time, setTime] = useState({startTime:" ", endTime:" "});

    console.log(state , "state");
    const handleSubmit = async(event)=>{

        try{
            event.preventDefault();
    
            const data = new FormData(event.currentTarget);
            if (data.get('startTime') === "" || data.get("endTime") === "")
            {
                alert('fill everything');
                throw new Error("Provide Start Time and End Time");
            }
            else
            {
                const docRef = await addDoc(collection(db, "appointments"), {
                    id : state.id,
                    startTime : data.get('startTime'),
                    endTime : data.get('endTime'),
                    fee : data.get('fee'),
                    patientCount : data.get('patientCount'),
                    
                });
                console.log(docRef, "saved");

            }
        }catch(err){
            console.log(err);
        }
        
    }

    return (
        <>
            
            <Avatar
                alt="avatar"
                sx={{width : 100, height : 100}}
            >Hello</Avatar>

            doctor details(dob, education, name, details)


            Appointment details
            <Box component="form" className="flex flex-col  justify-between" onSubmit = {handleSubmit}>
                <TextField
                    type="time"
                    label="Start Time"
                    value={time.startTime}
                    variant="outlined"
                    className='m-2'
                    name = "startTime"
                    onChange = {(e)=>{setTime({...time, startTime : e.target.value})}}

                />
                <TextField
                    type="time"
                    label="End Time"
                    value={time.endTime}
                    variant="outlined"
                    className='m-2'
                    name = "endTime"
                    onChange = {(e)=>{setTime({...time, endTime : e.target.value})}}

                />

                <TextField
                    type="number"
                    label="Fee(in Rs)"
                    variant="outlined"
                    className='m-2'
                    name = "fee"
                    required


                />
                <TextField
                    type="number"
                    label="Patient Count"
                    variant="outlined"
                    className='m-2'
                    name = "patientCount"
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
        </>
    )
}

export default Doctor
