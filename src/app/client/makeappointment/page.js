"use client"

import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { UserAuth } from '@/context/AuthContext';
import { Avatar, Box, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, TextField, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';



const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme?.palette?.background?.paper,
}));



const MakeAppointment = () => {


    const navigate = useRouter();
    const [dense, setDense] = useState(false);
    const [secondary, setSecondary] = useState(true);
    const [hospitals, setHospitals] = useState([]);
    const [hospitalList, setHospitalList] = useState([]);
    const { user, isLoading, role } = UserAuth();


    useEffect(() => {

        const q = query(collection(db, "users"), where("role", "==", "hospital"));

        const getHospital = async () => {
            try {
                const querySnapshot = await getDocs(q);


                let sdata = [];
                querySnapshot.docs.forEach((doc) => {
                    sdata.push({ id: doc.id, ...doc.data() });
                });
                // console.log(sdata, "hospial lists")
                setHospitals(sdata);
                setHospitalList(sdata);
            } catch (err) {
                console.error(err);
            }
        }
        getHospital();
    }, []);

       const handleKeyDown = (e) => {

        // console.log(e);
        // console.log(e.key);
        if (e.key === "Enter") {
            console.log(e.target.value);
            setHospitalList(hospitals.filter(hospital => hospital?.location?.toLowerCase().includes(e.target.value?.toLowerCase())));

        }
    }

    

    

  return (
    <>


            <div className='flex justify-center'>

                <TextField
                    type="search"
                    label="Search"
                    placeholder='Search by location of hospitals'
                    // autoFocus
                    name="search"
                    className='w-[300px] sm:w-[500px] mt-5'
                    onKeyDown={handleKeyDown}

                />
            </div>


            <Box
                sx={{ flexGrow: 1 }}
                className="flex justify-center max-w-full"
            >

                <Grid item xs={12} md={6}>
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div" align="center">
                        Hospital Lists
                    </Typography>
                    <Demo>
                        <List dense={dense}>
                            {hospitalList.map(hospital =>
                                <ListItem onClick={() => { navigate.push(`/client/makeappointment/${hospital.username}`) }} className='cursor-pointer' key={hospital.id}>
                                    <ListItemAvatar>
                                        <Avatar alt="image" src={hospital.imageURL} />
                                 
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={hospital.username}
                                        secondary={secondary ? 'Secondary text' : null}
                                        // onClick={handleListItemClick}
                                    />
                                    <hr />
                                </ListItem>
                            )}
                        </List>
                    </Demo>
                </Grid>


            </Box>
    </>
  )
}

export default MakeAppointment
