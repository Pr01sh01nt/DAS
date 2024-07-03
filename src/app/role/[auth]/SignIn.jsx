

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from 'next/image';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { UserAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';


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


export default function SignIn({ setSignIn, role }) {

    const { user, googleSignIn, signIn, setRole } = UserAuth();
    const navigate = useRouter();

    const handleSubmit = async (event) => {

        try {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            // console.log({
            //     email: data.get('email'),
            //     password: data.get('password'),
            // });

            await signIn(data.get('email'), data.get('password'));


            navigate.push("/");


        } catch (err) {
            console.error(err);
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

            navigate.push("/", { role: role });
            // setRole(role);
            // await user.reload();

        } catch (err) {
            console.error(err);
        }
    }

    return (

        <>

{/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}

            <ThemeProvider theme={defaultTheme}>



                <Container
                    component="main"
                    maxWidth="xs"
                    className='bg-gradient-to-tr from-[rgba(204,0,153,0.75)] to-[rgba(255,0,0,0.73)] rounded-2xl shadow-black shadow-lg'

                >
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography
                            component="h1"
                            variant="h5"
                            className='text-white font-bold'

                        >
                            Sign In
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                className='bg-[rgba(0,0,0,0.37)]     shadow-inner'
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                className='bg-[rgba(0,0,0,0.37)] '
                            />


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
                                    Sign In
                                </Button>
                            </div>


                            <Typography
                                variant="body2"
                                align="center"
                                onClick={() => { setSignIn(false) }}
                                className='text-white'
                            >
                                {"Don't have an account? Sign Up"}
                            </Typography>

                            <div className='flex justify-center mt-4'>

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
                    <Copyright sx={{ mt: 8, mb: 4 }} />
                </Container>
            </ThemeProvider>

        </>
    );
}