'use client'



import { usePathname } from 'next/navigation'
import { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { UserAuth } from '@/context/AuthContext';

export default function Home() {


  const pathname = usePathname().substring(6);
  const [signIn, setSignIn] = useState(true);
  const { user, isLoading } = UserAuth();


  return (pathname == "hospital" || pathname == "client") ?
    <main className="min-h-[100vh] border  pt-2  bg-teal-400 ">
      {
        isLoading.current ? <h1>Loading....</h1> :
          !user ?
            signIn ?
              <>
                <SignIn setSignIn={setSignIn} role={pathname} />
              </> :
              <>
                <SignUp setSignIn={setSignIn} role={pathname} />
              </>
            : <h1>Route not available</h1>
      }

    </main>
    : <p>not a valid route</p>
}

