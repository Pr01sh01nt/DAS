"use client"

import { UserAuth } from '@/context/AuthContext';
import { Avatar, Typography } from '@mui/material';
import React from 'react'

const profile = () => {
    const {user, muser} = UserAuth();

    console.log(user);
    console.log(muser);

    return (
        <>
            <div
                className=' p-4'
            >
                <Avatar
                    sx={{ width: {
                        sm : 120,
                        md : 180
                    }, height: {
                        sm : 120,
                        md : 180
                    } }}
                    className='relative left-[45%] sm:top-[100px]  top-[50px]'
                    src= {muser.imageURL}
                    
                />
                    <div
                        className='m-8 border border-black w-[95%] rounded-lg h-screen'
                    >
                        <Typography
                            variant='h3'
                            className='p-8'
                        >

                            {muser.username}
                        </Typography>
                    </div>

            </div>

        </>
    )
}

export default profile;
