import Image from "next/image";
import Link from "next/link";
import logo from "@/images/logo.png";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import SearchBar from "./SearchBar";

function Header() {
  return (
    <div className="border-b">
      <div className="flex flex-col items-center lg:flex-row gap-3 p-3">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <Link href="/" className="font-bold shrink-0">
            <Image
              src={logo}
              alt="logo"
              width={100}
              height={100}
              className="w-20 lg:w-28"
            />
          </Link>
          {/* Mobile View: Show Profile Pic OR SignIn Button */}
          <div className="lg:hidden">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-gray-100 text-gray-700 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 border-gray-300 transition border">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        <div className="w-full lg:max-w-2xl">
          <SearchBar />
        </div>

        {/* Large Screen View: Show Profile Pic & Ticket Buttons */}
        <div className="hidden lg:flex items-center gap-3 ml-auto">
          <SignedIn>
            <Link href="/seller">
              <button className="bg-blue-600 text-white px-3 py-1.5 transition text-sm rounded-lg hover:bg-blue-700">
                Sell Tickets
              </button>
            </Link>
            <Link href="/tickets">
              <button className="bg-blue-200 text-gray-800 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-400 transition border">
                My Tickets
              </button>
            </Link>
            {/* Show Profile Pic on Large Screen */}
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-gray-100 text-gray-700 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 border-gray-300 transition border">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        <div className="lg:hidden w-auto flex justify-center gap-3">
          <SignedIn>
            <Link href="/seller">
              <button className="bg-blue-600 text-white px-3 py-1.5 transition text-sm rounded-lg hover:bg-blue-700">
                Sell Tickets
              </button>
            </Link>
            <Link href="/tickets">
              <button className="bg-blue-200 text-gray-800 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-400 transition border">
                My Tickets
              </button>
            </Link>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}

export default Header;
