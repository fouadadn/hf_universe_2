import { CircleUserRound, Search } from "lucide-react"
import Link from "next/link"
const layout = ({ children }) => {
    return (
        <div className="">
            <header className="z-[9999] relative    ">
                <nav className="flex justify-between py-4 mx-2 items-center">
                    <h1 className="text-nowrap">HF Universe</h1>

                    <div className="space-x-6 ml-6 hidden md:block ">
                        <Link href={'/'}>Home</Link>
                        <Link href={'/'}>Discover</Link>
                        <Link href={'/'}>Movie Release</Link>
                        <Link href={'/'}>About</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Search />
                        <div className="gap-2 hidden md:flex">
                            <button className="border-[1px] rounded-xl px-3 py-[7px]">Sign Up</button>
                            <button className=" rounded-xl px-3 py-[7px] bg-[#5c00cc] ">Login</button>
                        </div>

                        <div className="block md:hidden">
                            <CircleUserRound />
                        </div>
                    </div>
                </nav>
            </header>
            {children}
        </div>
    )
}

export default layout