

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/context/AuthContext";
import Navbar from '@/components/shared/Navbar'
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DAS App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  console.log("layout renders");
  return (
    <html lang="en">
      <body className={`${inter.className} border-cyan-800`}>
      <AuthContextProvider>

          <Navbar/>
          {children}

    </AuthContextProvider>

      </body>
    </html>
  );
}
