import { NextResponse } from "next/server";
import Stripe from "stripe";


export async function GET(request ){

    try{
        
        const stripe  = Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_API_KEY);
    
        // console.log(request);
        // console.log(request.nextUrl);
        // console.log(request.nextUrl);
        console.log(request.nextUrl.searchParams);
        console.log(request.nextUrl.searchParams.get('name'), request.nextUrl.searchParams.get('amount'));
        const doctorAppointment = await stripe.products.create({
            name: `Appointment with ${request.nextUrl.searchParams.get('name')}`,
            default_price_data : {
                currency :   'INR',
                unit_amount: Number(request.nextUrl.searchParams.get('amount'))*100,
            },
            shippable : false,
    
          });
          
          return Response.json(doctorAppointment.default_price);
    
    
        }catch(err){
            console.log(err);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }

    //   return Response.json("doctorAppointment");
}