"use client"

import { Box, Button, TextField } from "@mui/material";


export default function Home() {


      const handleSubmit = async (event) => {

            try {
                  event.preventDefault();
                  const data = new FormData(event.currentTarget);

                  console.log(data.get('doctorName'));



            } catch (err) {
                  console.error(err);
            }

      };

      return (
            <>
                  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                              type="text"
                              label="Doctor Name"
                              margin="normal"
                              name="doctorName"
                              autoFocus
                              required
                              fullWidth
                        />
                        dob
                        speciality
                        education


                        <Button
                              type="submit"
                              fullWidth
                              variant="contained"
                              sx={{ mt: 3, mb: 2 }}
                        >
                              Submit
                        </Button>


                  </Box>


            </>
      );
}
