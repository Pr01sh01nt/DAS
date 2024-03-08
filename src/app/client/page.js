"use client"

import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Avatar, Box, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, TextField, Typography } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';


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
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(true);

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
                        Avatar with text
                    </Typography>
                    <Demo>
                        <List dense={dense}>
                            {generate(
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <FolderIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Single-line item"
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
