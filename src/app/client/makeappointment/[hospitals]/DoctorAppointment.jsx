import AppointmentForm from '@/components/AppointmentForm';
import { UserAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/config';
import { Avatar, Button, Typography } from '@mui/material';
import { addDoc, collection, doc, getDocs, query, runTransaction, serverTimestamp, where } from 'firebase/firestore';
import { useEffect, useState } from 'react'

const DoctorAppointment = ({ state }) => {

    const { user } = UserAuth();
    let [appointment, setAppointment] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [data, setData] = useState(null);
    // console.log(state, "..", user);

    const handleClick = () => {
        setFormOpen(true);
    }

    useEffect(() => {


        const q = query(collection(db, "appointments"), where("id", "==", state.id));

        const doc = async () => {

            const querySnapshot = await getDocs(q);


            let sdata = [];
            querySnapshot.docs.forEach((doc) => {
                sdata.push({ docID: doc.id, ...doc.data() });
            });


            setAppointment(sdata);
            // console.log("-_____________-",  sdata);
        }
        doc();

    }, []);



    return (
        <div className='mx-4'>

            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center">

                    <Avatar alt="image" sx={{ width: 100, height: 100 }} src={state.imageURL} />
                    <div className="font-bold mt-4 text-[32px]">
                        {state.doctorName}
                    </div>
                </div>
                <div className="flex  justify-between mt-3">
                    <div className="w-[49%] font-semibold">
                        {state.specialist}

                    </div>
                    <div className="w-[49%] font-semibold">
                        {state.education}
                    </div>
                </div>
                <Typography variant="body1" component="p" sx={{ mt: 4 }}>
                    {state.details}
                </Typography>

            </div>

            <div className=''>

                <div className='flex justify-center font-bold text-[30px]'>
                    Appointments
                </div>

                {appointment.map((data) => <div className='m-2 flex flex-col items-center border-3 rounded' key={data.docID}>

                    <div className='flex justify-between w-[50%]'>
                        <span className="font-bold">Start Time</span>
                        <span className="font-medium">

                            {data.startTime}
                        </span>

                    </div>
                    <div className='flex justify-between w-[50%]'>
                        <span className="font-bold">End Time</span>
                        <span className="font-medium">
                            {data.endTime}

                        </span>

                    </div>
                    <div className='flex justify-between w-[50%]'>
                        <span className="font-bold" >Fee (in Rs) </span>
                        <span className="font-medium">
                            {data.fee}

                        </span>

                    </div>
                    <div className='flex justify-between w-[50%]'>

                        <span className="font-bold">Seats Left</span>
                        <span className="font-medium">

                            {data.patientCount}
                        </span>

                    </div>
                    <div className='flex justify-center w-[50%]'>

                        <Button
                            variant="contained"
                            className='bg-black'
                            onClick={() => { setData(data); setFormOpen(true); }}
                        >
                            Apply
                        </Button>
                    </div>
                    <br />


                </div>)}

            </div>

            {formOpen &&

                <AppointmentForm setFormOpen={setFormOpen} data = {data} state={state}/>
            }

            {/* select the available time
            doctor have fixed number of patient checking in a particular shift
            so if the doctor is available then
            allow client to fill the form

            else not allow

            fill form and make payment , if payment successful
            increase total number of patient by one


            CHALLANGE:
            it should be real time */}

        </div>
    )
}

export default DoctorAppointment;
