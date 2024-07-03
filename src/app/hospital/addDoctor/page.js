"use client"

import { Avatar, Box, Button, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { doctorEducation, doctorSpecialties } from "@/constants";
import { UserAuth } from "@/context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "@/lib/firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import styled from "@emotion/styled";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';


const VisuallyHiddenInput = styled('input')({
      opacity: 0,
      // height: 1,
      position: 'absolute',
      bottom: 0,
      left: 0,
      // whiteSpace: 'nowrap',
      // width: 100,
});


export default function Home() {
      const { user, isLoading } = UserAuth();

      const [specialist, setSpecialist] = useState('');
      const [docEducation, setDocEducation] = useState('');
      const [dob, setDOB] = useState(' ');
      const [image, setImage] = useState(null);

      // console.log(user, "hostpf");

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
                                                email: data.get('email'),

                                          });

                                          // console.log("Document written with ID: ", docRef.id);

                                    })
                              },
                        )

                  }






            }

            catch (err) {
                  console.error(err);
            }

      };


      const handleChange = (event) => {
            // console.log(event.target);
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
                        className="flex justify-center mt-5  "

                  >

                        <Box
                              component="fieldset"
                              className="max-w-[320px] border border-black rounded-xl p-8"
                        >
                              <Typography
                                    variant="h4"
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
                                          <MenuItem key={speciality.type} value={speciality.type}>{speciality.type}</MenuItem>

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
                                          <MenuItem key={education} value={education}>{education}</MenuItem>

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
                                    type="email"
                                    label="Doctor Email"
                                    margin="normal"
                                    name="email"
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


                              {/* <InputLabel id="image-label">Add Doctor Image</InputLabel>
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
                              /> */}

                              <div
                                    className='flex justify-center'
                              >
                                    {image &&

                                          <Avatar
                                                src={URL?.createObjectURL(image) || "#"}
                                                alt="profile image"
                                                sx={{
                                                      height:120, width:120
                                                }}
                                          />
                                    }
                              </div>

                              <div
                                    className='flex justify-center py-2'
                              >
                                    <Button
                                          className=' cursor-pointer bg-blue-500 shadow-lg shadow-blue-500/50 text-white font-bold hover:bg-blue-600'
                                    >
                                          <PersonAddAltIcon className=' text-white pr-2'
                                                fontSize='large'
                                                
                                          />

                                           Add Doctor Image

                                          <VisuallyHiddenInput
                                                name="image"
                                                type="file"
                                                id="image"
                                                accept=".jpg, .jpeg, .png"
                                                className='w-full h-full'
                                                onChange={(e) => { setImage(e.target.files[0]) }}
                                          />
                                    </Button>

                              </div>

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
