const Footer = () => {
    return (
        <footer className=" text-gray-300 pb-6 px-4 mt-10">

            <div className="flex flex-col md:flex-row justify-around ">

                {/* Brand Info */}
                <div className="order-1 mt-5 md:mt-0">
                    {/* <h1 className="text-2xl font-bold text-white">HF Stream</h1> */}
                    <p className="mt-2 text-xl sm:text-2xl max-w-96 font-sans font-bold">
                        Stream the latest movies and series for free. Unlimited entertainment at your fingertips.
                    </p>
                </div>
 
                {/* Navigation */}
                <div className="">
                    {/* <h2 className="text-lg font-semibold text-white mb-2">Quick Links</h2> */}
                    <ul className=" flex gap-1 text-md md:text-xl ">
                        <li><a href="/" className="hover:underline">Home</a></li> /
                        <li><a href="/discover/netflix" className="hover:underline">Discover</a></li>/
                        <li><a href="/movierelease" className="hover:underline">Movie Release</a></li>/
                        <li><a href="/your-watchlist" className="hover:underline">My list</a></li>
                    </ul>
                </div>

            </div>

            

            <div className=" mt-8 pt-4 text-center text-sm " style={{ color: "#6a7282" }}>
                © {new Date().getFullYear()} HF Universe. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
