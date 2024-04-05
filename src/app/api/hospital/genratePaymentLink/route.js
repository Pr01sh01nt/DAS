import { NextResponse } from "next/server";
import Stripe from "stripe";


export async function GET(request ){

    try{

        const stripe  = Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_API_KEY);
    
        


        const session = await stripe.checkout.sessions.create({
        
          cancel_url :  `${request.nextUrl.origin}/client/makeappointment`,
          success_url : `${request.nextUrl.origin}/`,
          line_items: [
            {
              price: request.nextUrl.searchParams.get('priceId'),
              quantity: 1,
            },
          ],
          mode: 'payment',
          billing_address_collection : "auto",
          invoice_creation : {
            enabled : true,
          }
        });
          
    
    
        //   return Response.json(paymentLink);
          return NextResponse.json(session.url, {
            status: 200,
          });

    }catch(err)
    {
        console.log(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    //   return Response.json("doctorAppointment");
}