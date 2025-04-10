import { CircleUserRound, Search } from "lucide-react";
import Link from "next/link";
const layout = ({ children }) => {
  return (
    <div className="">
      <header className="z-[9999] relative bg-gradient-to-b from-black to-transparent to-95%">
        <nav className="flex justify-between py-4 mx-2 items-center">
          <Link
            href={"/"}
            className="text-nowrap text-3xl font-bold font-serif flex items-center">
            <span className="text-[#5c00cc] font-sans text-5xl">HF</span>
            <span>Stream</span>{" "}
          </Link>

          <div className="space-x-6 ml-6 hidden md:block ">
            <Link href={"/"}>Home</Link>
            <Link href={"/"}>Discover</Link>
            <Link href={"/"}>Movie Release</Link>
            <Link href={"/"}>About</Link>
          </div>

          <div className="flex items-center gap-4">
            <Search />
            <div className="gap-2 hidden md:flex">
              <Link href={"/auth/sign-up"}>
                <button className="border-[1px] rounded-xl px-3 py-[7px]">
                  Sign Up
                </button>
              </Link>
              <Link href={"/auth/login"}>
                <button className=" rounded-xl px-3 py-[7px] bg-[#5c00cc] ">
                  Login
                </button>
              </Link>
            </div>

            <div className="block md:hidden">
              <CircleUserRound />
            </div>
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
};

export default layout;
