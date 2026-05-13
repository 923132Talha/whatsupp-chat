import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { LogOut, MessageSquare, User } from "lucide-react";

const Navbar = () => {
    const { logout, authUser } = useAuthStore();

    return (
        <header className="border-b border-base-300 fixed w-full top-0 z-40">
            <div className="container mx-auto px-4 h-16">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-primary" color="black" />
                            </div>
                            <h1 className="text-lg font-bold">Chat App</h1>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 ">
                        {authUser && (
                            <>
                                <Link to={"/profile"} className={`btn btn-sm gap-2 bg-gray-300 rounded-3xl`}>
                                    <User className="size-5" color="black" />
                                    <span className="text-black hidden sm:inline">Profile</span>
                                </Link>

                                <button className="btn btn-sm flex gap-2 items-center bg-gray-300 px-2 py-1 rounded-3xl" onClick={logout}>
                                    <LogOut className="size-5" color="black" />
                                    <span className="text-black hidden sm:inline">Logout</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Navbar;