'use client'



import { usePathname } from 'next/navigation'
import { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function Home() {

  const pathname = usePathname().substring(6);
  const [signIn, setSignIn] = useState(true);

  return (pathname == "hospital" || pathname == "client") ? <main className="min-h-screen pt-6  bg-teal-400">
    {
      signIn ?
        <>
          <SignIn setSignIn={setSignIn} role={pathname}/>
        </> :
        <>
          <SignUp setSignIn={setSignIn} role={pathname}/>
        </>
    }

  </main>
    : <p>not a valid route</p>
}

