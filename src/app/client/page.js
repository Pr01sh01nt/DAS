"use client"

import { styled } from '@mui/material/styles';
import { Avatar, Box, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, TextField, Typography } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { UserAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

function generate(element) {
    return [0, 1, 2].map((value) =>
        React.cloneElement(element, {
            key: value,
        }),
    );
}


export default function Home() {
    const navigate = useRouter();
    const [dense, setDense] = useState(false);
    const [secondary, setSecondary] = useState(true);
    const [hospitals, setHospitals] = useState([]);
    const [hospitalList, setHospitalList] = useState([]);
    const { user, isLoading, role } = UserAuth();
    const  [ myAppointments, setMyAppointments] = useState([]);
    

    useEffect(() => {

        const q = query(collection(db, "users"), where("role", "==", "hospital"));

        const getHospital = async () => {
            try {
                const querySnapshot = await getDocs(q);


                let sdata = [];
                querySnapshot.docs.forEach((doc) => {
                    sdata.push({ id: doc.id, ...doc.data() });
                });
                console.log(sdata, "hospial lists")
                setHospitals(sdata);
                setHospitalList(sdata);
            } catch (err) {
                console.error(err);
            }
        }
        getHospital();
    }, [])

    const handleListItemClick = (event) => {
        console.log(event.currentTarget);

    }


    useEffect(()=>{

        
        
        const getMyAppointment = async () => {
            try {
                const q = query(collection(db, "reciept"), where("uid", "==", user?.uid),orderBy("timestampField", "desc"), limit(3));
                const querySnapshot = await getDocs(q);
          
                
                let sdata = [];
                querySnapshot.docs.forEach((doc) => {
                    sdata.push({ id: doc.id, ...doc.data() });
                });
                console.log(sdata,  "__..__")
                
            } catch (err) {
                console.log(err);
            }

        }

        getMyAppointment();



    },[user]);

    // console.log(user, ':::::::::::');

    const handleKeyDown = (e) => {

        // console.log(e);
        console.log(e.key);
        if (e.key === "Enter") {
            console.log(e.target.value);
            setHospitalList(hospitals.filter(hospital => hospital?.location?.toLowerCase().includes(e.target.value?.toLowerCase())));

        }
    }

    return !isLoading.current ? role === "client" ? user ?
        <>
            <h1>Client home page</h1>






            <h2>List of Hospitals</h2>
            <div className='flex justify-center'>

                <TextField
                    type="search"
                    label="Search"
                    placeholder='Search by location of hospitals'
                    // autoFocus
                    name="search"
                    className='w-[300px] sm:w-[500px]'
                    onKeyDown={handleKeyDown}

                />
            </div>
            apply filters

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
                                <ListItem onClick={() => { navigate.push(`/client/${hospital.username}`) }} className='cursor-pointer' key={hospital.id}>
                                    <ListItemAvatar>
                                        <Avatar alt="image" src={hospital.imageURL} />
                                        {console.log(hospital, ">>>>>>>>>>")}
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={hospital.username}
                                        secondary={secondary ? 'Secondary text' : null}
                                        onClick={handleListItemClick}
                                    />
                                    <hr />
                                </ListItem>
                            )}
                        </List>
                    </Demo>
                </Grid>


            </Box>
        </> : <h1>Login First</h1>
        : <h1>you have not login with client , make login with hospital</h1>
        : <h1>Loading........</h1>

}
