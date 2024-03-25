"use client"

import { Box, Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import { doctorEducation, doctorSpecialties } from "@/constants";
import { UserAuth } from "@/context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/config";



export default function Home() {
      const {user} = UserAuth();

      console.log(user, "hostps;f");

      const handleSubmit = async (event) => {

            try {
                  event.preventDefault();
                  const data = new FormData(event.currentTarget);
                  if (data.get('education') === "" || data.get('specialist') === "" || data.get('dob') === " ")
                        alert('fill everything');
                  else {
                        const docRef =  await addDoc(collection(db, "doctors"), {
                              hospitalName : user.displayName,
                              doctorName : data.get('doctorName'), 
                              dob : data.get('dob'),
                              specialist : data.get('specialist'),
                              education : data.get('education')

                        });

                        console.log("Document written with ID: ", docRef.id);
                  }

            } catch (err) {
                  console.error(err);
            }

      };

      const [specialist, setSpecialist] = useState('');
      const [docEducation, setDocEducation] = useState('');
      const [dob, setDOB] = useState(' ');

      const handleChange = (event) => {
            if (event.target.getAttribute("name") === "specialist")
                  setSpecialist(event.target.value);
            else if (event.target.getAttribute("name") === "education")
                  setDocEducation(event.target.value);
      };

      return (
            <>
                  <Box component="form" onSubmit={handleSubmit}
                        // noValidate
                        sx={{ mt: 1 }}>
                        <TextField
                              type="text"
                              label="Hospital Name"
                              margin="normal"
                              name="hospitalName"
                              value={user.displayName || " "}
                              disabled    
                              fullWidth
                        />    
                        <TextField
                              type="text"
                              label="Doctor Name"
                              margin="normal"
                              name="doctorName"
                              autoFocus
                              required
                              fullWidth
                        />
                        <TextField
                              type="date"
                              label="DOB"
                              margin="normal"
                              name="dob"
                              value={dob}
                              autoFocus
                              required
                              fullWidth
                              onChange={(event)=>{setDOB(event.target.value)}}
                        />

                        <InputLabel id="specialist-label">Specialist</InputLabel>
                        <Select
                              labelId="specialist-label"
                              id="specialist"
                              value={specialist}
                              onChange={handleChange}
                              autoWidth
                              required
                              name="specialist"
                        >

                              <MenuItem value="">
                                    <em>None</em>
                              </MenuItem>
                              {doctorSpecialties.map(speciality =>
                                    <MenuItem value={speciality}>{speciality}</MenuItem>

                              )}

                        </Select>

                        <InputLabel id="education-label">Education</InputLabel>
                        <Select
                              labelId="education-label"
                              id="education"
                              value={docEducation}
                              onChange={handleChange}
                              autoWidth
                              name="education"

                        >

                              <MenuItem value="">
                                    <em>None</em>
                              </MenuItem>
                              {doctorEducation.map(education =>
                                    <MenuItem value={education}>{education}</MenuItem>

                              )}

                        </Select>



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
      );
}
