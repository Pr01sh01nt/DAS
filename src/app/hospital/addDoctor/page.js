"use client"

import { Box, Button, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { doctorEducation, doctorSpecialties } from "@/constants";
import { UserAuth } from "@/context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "@/lib/firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'



export default function Home() {
      const { user, isLoading } = UserAuth();

      console.log(user, "hostps;f");

      const handleSubmit = async (event) => {

            try {
                  event.preventDefault();
                  const data = new FormData(event.currentTarget);
                  let imageURL = null;
                  if (data.get('education') === "" || data.get('specialist') === "" || data.get('dob') === "")
                        alert('fill everything');
                  else {


                        const storageRef = ref(storage, `image/${Date.now()}`);
                        const uploadTask = uploadBytesResumable(storageRef, data.get('image'));


                        uploadTask.on(
                              'state_changed',
                              (snapshot) => {
                                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                                    console.log('Upload is ' + progress + '% done');
                                    // setProgressUpload(progress) // to show progress upload

                                    switch (snapshot.state) {
                                          case 'paused':
                                                console.log('Upload is paused')
                                                break
                                          case 'running':
                                                console.log('Upload is running')
                                                break
                                    }
                              },
                              (error) => {
                                    message.error(error.message)
                              },
                              async () => {
                                    await getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                                          //url is download url of file
                                          // setDownloadURL(url)
                                          console.log(url);
                                          imageURL = url;

                                          const docRef = await addDoc(collection(db, "doctors"), {
                                                hospitalName: user.displayName,
                                                doctorName: data.get('doctorName'),
                                                dob: data.get('dob'),
                                                specialist: data.get('specialist'),
                                                education: data.get('education'),
                                                location: data.get('location'),
                                                imageURL: imageURL,
                                                details: data.get('details'),
                        
                                          });
                        
                                          console.log("Document written with ID: ", docRef.id);

                                    })
                              },
                        )

                  }



               


            }

            catch (err) {
                  console.error(err);
            }

      };

      const [specialist, setSpecialist] = useState('');
      const [docEducation, setDocEducation] = useState('');
      const [dob, setDOB] = useState(' ');

      const handleChange = (event) => {
            console.log(event.target);
            if (event.target.name === "specialist")
                  setSpecialist(event.target.value);
            else if (event.target.name === "education")
                  setDocEducation(event.target.value);
      };

      return !isLoading.current ? user ?
            <>
                  <Box
                        component="form"
                        onSubmit={handleSubmit}
                        // noValidate
                        sx={{ mt: 1 }}
                        className="flex justify-center mt-5"

                  >

                        <Box
                              component="fieldset"
                              className="max-w-[320px] "
                        >
                              <Typography
                                    variant="h3"
                                    className="h3"
                                    align="center"
                              >
                                    Doctor Details
                              </Typography>
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
                                    onChange={(event) => { setDOB(event.target.value) }}
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
                                    className="w-[320px]"
                              >

                                    <MenuItem value="">
                                          <em>None</em>
                                    </MenuItem>
                                    {doctorSpecialties.map(speciality =>
                                          <MenuItem value={speciality.type}>{speciality.type}</MenuItem>

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
                                    className="w-[320px]"

                              >

                                    <MenuItem value="">
                                          <em>None</em>
                                    </MenuItem>
                                    {doctorEducation.map(education =>
                                          <MenuItem value={education}>{education}</MenuItem>

                                    )}

                              </Select>


                              <TextField
                                    type="text"
                                    label="Location"
                                    margin="normal"
                                    name="location"
                                    autoFocus
                                    required
                                    fullWidth
                              />




                              <TextField
                                    type="text"
                                    label="Deatils"
                                    margin="normal"
                                    name="details"
                                    autoFocus
                                    multiline
                                    fullWidth
                              />


                              <InputLabel id="image-label">Add Doctor Image</InputLabel>
                              <TextField
                                    labelId="image-label"
                                    id="image"
                                    type="file"
                                    // label="Deatils"
                                    margin="normal"
                                    name="image"
                                    autoFocus
                                    // multiline
                                    fullWidth
                                    required
                                    className="m-0"
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


            </>
            : <h1>Login First</h1>
            : <h1>Loading........</h1>
}
