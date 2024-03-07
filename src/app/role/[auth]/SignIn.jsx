
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
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
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
            console.log({
                email: data.get('email'),
                password: data.get('password'),
            });

            await signIn(data.get('email'), data.get('password'));


            navigate.push("/");
       

        } catch (err) {
            console.error(err);
        }

    };

    const handleGoogleLogin = async () => {
        try {
            const result = await googleSignIn();
            console.log(result, user, "google singin");
            if (!result) throw Error("login failed");


            if (Date.now() - result.metadata.createdAt <= 10000)  // if data created in less than 10s means it has to be saved in firestore
            {

                const data = await getDoc(doc(db, "users", result.uid));  // make sure no one can change its role once its role is set with same email

                if (!data.data()) {
                    await setDoc(doc(db, "users", result.uid), {
                        username: result.displayName,
                        email: result.email,
                        role: role
                    });
                }
                else if (data.data().role !== role) throw Error("signin failed");
            }

            navigate.push("/",{role:role});
            // setRole(role);
            // await user.reload();

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <ThemeProvider theme={defaultTheme}>

            <Image
                src="/GoogleIcon.png "
                width={50}
                height={50}
                quality={50}
                alt="Login with Google"
                onClick={handleGoogleLogin}
                className="cursor-pointer"


            />

            <Container component="main" maxWidth="xs">
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
                    <Typography component="h1" variant="h5">
                        Sign in
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
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>


                        <Typography variant="body2" align="center" onClick={() => { setSignIn(false) }}>
                            {"Don't have an account? Sign Up"}
                        </Typography>


                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}