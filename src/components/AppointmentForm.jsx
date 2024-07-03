

import { db } from "@/lib/firebase/config";
import { addDoc, collection, doc, getDocs, query, runTransaction, serverTimestamp, where } from 'firebase/firestore';
import { Box, Button, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserAuth } from "@/context/AuthContext";


const AppointmentForm = ({ setFormOpen, data, state }) => {
    const navigate = useRouter();
    const [dob, setDOB] = useState(" ");
    const {user} = UserAuth();
    // console.log(data);

    const handleSubmit = async (event) => {
        event.preventDefault();


        try {

            const patientData = new FormData(event.currentTarget);
            if (data.patientCount === 0) {
                alert("seat full");
                throw "no seat available";
            }
            else {
                // console.log("run transaction");

                const sfDocRef = doc(db, "appointments", data.docID);

                const newCount = await runTransaction(db, async (transaction) => {
                    const sfDoc = await transaction.get(sfDocRef);

                    // console.log("inside transaction block");
                    if (!sfDoc.exists()) {
                        throw new Error("Document does not exist!");
                    }

                    const nCount = sfDoc.data().patientCount - 1;
                    if (nCount >= 0) {
                        transaction.update(sfDocRef, { patientCount: nCount });
                        return nCount;
                    } else {
                        return Promise.reject("Sorry! seat not avaialable");
                    }

                });

                // console.log("Seats decreased to ", newCount);
                // appointment = appointment.map((doc) => {
                //     if (doc.docID == data.docID)
                //         doc.patientCount = newCount;
                //     return doc;
                // });


                
                
                
                // store the reciept in db
                // console.log("saving reciept");
                const d = {
                    user: user.displayName,
                    appointedDoctor: state.doctorName,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    fee: data.fee,
                    uid: user.uid,
                    timestampField: Date.now(),
                    patientData: {
                        name: patientData.get('patientName'),
                        dob: patientData.get('dob'),
                        sex: patientData.get('sex'),
                        phone: patientData.get('phone'),
                        address: patientData.get('address'),
                        details: patientData.get('details'),
                        
                    }};

                    // console.log(d);

                const docRef = await addDoc(collection(db, "reciept"), {
                    user: user.displayName,
                    appointedDoctor: state.doctorName,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    fee: data.fee,
                    uid: user.uid,
                    timestampField: Date.now(),
                    patientData: {
                        name: patientData.get('patientName'),
                        dob: patientData.get('dob'),
                        sex: patientData.get('sex'),
                        phone: patientData.get('phone'),
                        address: patientData.get('address'),
                        details: patientData.get('details'),
                        
                    }
                });

                // console.log(docRef, "reciept saved");

                // make stripe integration here
    
                navigate.push(data.paymentLink);

                // setAppointment(appointment);
                setFormOpen(false);
                
            }


        } catch (err) {
            console.error(err);
        }
    }


    return (
        <>

            <div className="w-full flex justify-center ">

                <div
                    className="fixed top-[70px] bg-[rgba(169,143,143,0.7)] rounded overflow-y-auto max-h-[85vh] backdrop-blur-lg min-w-[60%] md:min-w-[40%] mt-2"
                >

                    <div className="flex justify-end">
                        <Button
                            color="error"
                            className="font-bold text-[20px]"
                            onClick={() => { setFormOpen(false) }}
                        >
                            X
                        </Button>
                    </div>

                    <Typography
                        variant="h4"
                        component="h4"
                        align="center"
                    >
                        Patient Data

                    </Typography>


                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                        className="flex  justify-center mt-5"


                    >

                        <Box
                            component="fieldset"
                            className="max-w-[320px] flex flex-col"
                        >


                            <TextField
                                type="text"
                                label="Patient Name"
                                margin="normal"
                                name="patientName"
                                autoFocus
                                required

                            />
                            <TextField
                                type="date"
                                label="DOB"
                                margin="normal"
                                name="dob"
                                value={dob}
                                // autoFocus
                                required
                                // fullWidth
                                onChange={(event) => { setDOB(event.target.value) }}
                            />




                            <InputLabel id="sex-label">Sex</InputLabel>
                            <Select
                                labelId="sex-label"
                                id="sex"
                                // value={specialist}
                                // onChange={handleChange}
                                autoWidth
                                required
                                name="sex"
                                className="w-[320px]"
                            >

                                <MenuItem value="male">
                                    MALE
                                </MenuItem>
                                <MenuItem value="female">
                                    FEMALE
                                </MenuItem>
                                <MenuItem value="ohters">
                                    OTHERS
                                </MenuItem>


                            </Select>


                            <TextField
                                type="text"
                                label="Phone Number"
                                margin="normal"
                                name="phone"
                            // multiline
                            // fullWidth
                            />



                            <TextField
                                type="text"
                                label="Address"
                                margin="normal"
                                name="address"
                                // autoFocus
                                required
                            // fullWidth
                            />




                            <TextField
                                type="text"
                                label="Deatils of diseases"
                                margin="normal"
                                name="details"
                                // autoFocus
                                multiline
                            // fullWidth
                            />




                            <Button
                                type="submit"
                                // fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                className="bg-[rgb(190,131,80)]"

                            >
                                PAY  {data.fee}
                            </Button>
                        </Box>

                    </Box>


                </div>


            </div>

        </>
    )
}

export default AppointmentForm;
