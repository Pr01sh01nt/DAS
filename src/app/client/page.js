"use client"

import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Avatar, Box, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, TextField, Typography } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';

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
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(true);
    const [hospitals, setHospitals] = React.useState([]);

    React.useEffect(()=>{

        const q = query(collection(db, "users"), where("role", "==", "hospital"));

        const getHospital = async()=>{
            const querySnapshot = await getDocs(q);


            let sdata = [];
            querySnapshot.docs.forEach((doc) => {
                sdata.push({ id: doc.id, ...doc.data() });
            });
            console.log(sdata)
            setHospitals(sdata);
        }
        getHospital();  
    },[])

    const handleListItemClick = (event)=>{
        console.log(event.currentTarget);

    }

    return (
        <>
            <h1>Client home page</h1>
                <h2>List of Hospitals</h2>
            <TextField
                type="search"
                label="Search"
                placeholder='Search Hospitals......'
                autoFocus
                fullWidth
            
            />
            apply filters

            <Box
               sx={{ flexGrow: 1, maxWidth: 752 }}
            >

                <Grid item xs={12} md={6}>
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                        Hospital Lists      
                    </Typography>
                    <Demo>
                        <List dense={dense}>
                            {hospitals.map(hospital=>
                                <ListItem onClick={()=>{navigate.push(`/client/${hospital.username}`)}}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <FolderIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={hospital.username}
                                        secondary={secondary ? 'Secondary text' : null}
                                        onClick={handleListItemClick}
                                    />
                                    <hr/>
                                </ListItem>
                            )}
                        </List>
                    </Demo>
                </Grid>


            </Box>
        </>
    );
}
