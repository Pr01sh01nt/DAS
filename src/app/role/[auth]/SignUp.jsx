"use client"


import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase/config';
import { UserAuth } from '@/context/AuthContext';
import { sendEmailVerification, updateProfile } from 'firebase/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { FitScreen } from '@mui/icons-material';
import { useState } from 'react';



const VisuallyHiddenInput = styled('input')({
  opacity: 0,
  // height: 1,
  position: 'absolute',
  bottom: 0,
  left: 0,
  // whiteSpace: 'nowrap',
  // width: 100,
});




function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      className='text-white pb-2 mt-4'
      {...props}
    >
      {'Copyright © '}
      Website
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}



const defaultTheme = createTheme();

export default function SignUp({ setSignIn, role }) {
  const { user, signUp, googleSignIn, setRole } = UserAuth();
  const navigate = useRouter();
  const [image, setImage] = useState(null);
  // console.log("role =>  ", role);
  console.log(user);
  console.log(image);

  const handleSubmit = async (event) => {

    try {
      event.preventDefault();
      // console.log(event.currentTarget, "$$");
      const data = new FormData(event.currentTarget);

      // console.log({
      //   email: data.get('email'),
      //   password: data.get('password'),
      // });

      // signUp with email and password
      console.log("signup with email and password runs");
      const result = await signUp(data.get('email'), data.get('password'));
      console.log(result, "sign up result");


      console.log("upadate profile display name runs");
      await updateProfile(result.user, {
        displayName: `${data.get('firstName')} ${data.get('lastName')}`,

      });

      // console.log(data.get('displayImage') , "profileImage");

      // console.log('preparing for storaing profile image');
      const storageRef = ref(storage, `image/${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, data.get('displayImage'));


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
            // console.log(url);


            await setDoc(doc(db, "users", result.user.uid), {
              username: `${data.get('firstName')} ${data.get('lastName')}`,
              email: data.get('email'),
              role: role,
              imageURL: url,
              location: data.get('location'),
            });

            // console.log("navigate push going to run");
            navigate.push(`/${role}`);

            // console.log("sending mail");
            await sendEmailVerification(result.user);
            // console.log("mail sent");


          })
        },
      )

      // await user.reload();
      // setRole(role);

    } catch (err) {
      console.error(err);
      alert('error occured');
    }

  };

  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      // console.log(result, user, "google singin");

      if (!result) throw Error("login failed");


      if (Date.now() - result.metadata.createdAt <= 10000)  // if data created in less than 10s means it has to be saved in firestore
      {

        const data = await getDoc(doc(db, "users", result.uid));  // make sure no one can change its role once its role is set with same email

        let location = null;
        if (role === "hospital") {
          location = prompt("Enter Location of hospital");
        }

        if (!data.data()) {
          await setDoc(doc(db, "users", result.uid), {
            username: result.displayName,
            email: result.email,
            role: role,
            imageURL: result.photoURL,
            location: location,
          });
        }
        else if (data.data().role !== role) throw Error("signin failed");
      }


      navigate.push("/");
      // setRole(role);
      // await user.reload();


    } catch (err) {
      console.error(err);
    }
  }





  return (

    <>
      <div
        className='pb-[40px] m-4'
      >

        <Container
          component="main"
          maxWidth="xs"
          className='bg-gradient-to-tr from-[rgba(0,0,0,0.75)] to-[rgba(255,255,255,0.73)] rounded-2xl shadow-black shadow-lg'
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            className=' rounded-2xl '
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              className='text-white'
            >
              Sign up
            </Typography>
            <Box
              component="form"
              // noValidate 
              onSubmit={handleSubmit} sx={{ mt: 3 }}
            // className='border border-black'
            >

              <Grid container spacing={2}
              // className='border border-black'
              >
                <Grid item xs={12} sm={6}
                // className='border border-[rgb(253,253,253)] text-white  bg-[rgba(255,255,255,0.57)]'

                >



                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label={`${role[0].toUpperCase() + role.slice(1)} First Name`}
                    autoFocus
                    // variant="filled"
                    className='bg-[rgba(0,0,0,0.37)] '
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label={`${role[0].toUpperCase() + role.slice(1)} Last Name`}
                    name="lastName"
                    autoComplete="family-name"
                    className='bg-[rgba(0,0,0,0.37)] '
                  />
                </Grid>



                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    className='bg-[rgba(0,0,0,0.37)] '
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    className='bg-[rgba(0,0,0,0.37)] '
                  />
                </Grid>

                {role === "hospital" &&

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="location"
                      label="Hospital Location"
                      type="text"
                      id="location"
                      className='bg-[rgba(0,0,0,0.37)]  '
                    />
                  </Grid>

                }



                <Grid item xs={12}>

                  <div
                    className='flex justify-center'
                  >
                    {image &&

                      <img
                        src={URL?.createObjectURL(image) || "#"}
                        alt="profile image"
                        className='h-[200px] rounded-xl'
                      />
                    }
                  </div>

                  <div
                    className='flex justify-center'
                  >
                    <Button
                      className=' cursor-pointer bg-blue-500 shadow-lg shadow-blue-500/50 text-white font-bold hover:bg-blue-600'
                    >
                      <AddPhotoAlternateIcon className=' text-white'
                        fontSize='large'
                      />

                      Profile Image

                      <VisuallyHiddenInput
                        name="displayImage"
                        type="file"
                        id="displayImage"
                        accept=".jpg, .jpeg, .png"
                        className='w-full h-full'
                        onChange={(e) => { setImage(e.target.files[0]) }}
                      />
                    </Button>

                  </div>





                </Grid>


              </Grid>


              <div
                className='flex justify-center'
              >

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  className='bg-gradient-to-b from-[rgba(0,255,242,0.84)] to-[rgba(0,4,255,0.88)] hover:to-blue-500 w-[50%] shadow-xl shadow-[rgba(114,152,255,0.62)]'
                >
                  Sign Up
                </Button>
              </div>


              <Typography
                variant="body2"
                align='center'
                onClick={() => { setSignIn(true) }}
                className='text-white'
              >
                Already have an account? Sign in
              </Typography>

              <div
                className='flex justify-center pt-4'
              >

                <Image
                  src="/GoogleIcon.png "
                  width={50}
                  height={50}
                  quality={50}
                  alt="Login with Google"
                  onClick={handleGoogleLogin}
                  className="cursor-pointer"
                />

              </div>

            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </div>

    </>



  );
}