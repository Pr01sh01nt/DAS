import { NextResponse } from "next/server";


export async function GET(request ){

    console.log(request.nextUrl );
    console.log(request.nextUrl.origin + "/hello" );

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })

    //   return Response.json("doctorAppointment");
}