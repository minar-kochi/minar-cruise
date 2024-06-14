import Image from "next/image"
import Link from "next/link"
import logo from "@/assets/logo.png"
import {  } from 'next/font/google'
import Bounded from "../elements/Bounded"

const Navbar = () => {
  return (
    <div className="sticky  py-4 top-0 w-full  bg-white">
        <Bounded  as={'nav'} className="w-full flex justify-between">
            <div className="">
                <Link href={'/'}>
                    <Image src={logo} alt="ship logo" className="w-40"/>
                </Link>            
            </div>
            <div className="flex gap-5 font-sans font-medium justify-start max-md:hidden">
                <h1>Home</h1>
                <h1>Packages</h1>
                <h1>Facilities</h1>
                <h1>About</h1>
                <h1>Gallery</h1>
                <h1>Contact</h1>
            </div>
        </Bounded>
    </div>
  )
}

export default Navbar