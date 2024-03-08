import { Button } from "@mui/material";
import Link from "next/link";


export default function Home() {


      

      return (
            <>

                  <h1>Hospital home page</h1>
                  <Link href="/hospital/addDoctor">
                  <Button variant = "contained">Add Doctors</Button>
                  </Link>

            </>
      );
}
