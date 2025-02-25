"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { useWallet } from "@/hooks/use-wallet";
import { User } from "lucide-react";
import { useContractCustom } from "@/hooks/use-contract";
import { PersolRol } from "@/interfaces/Person";
import { loginStatus } from "@/interfaces/Login";

export default function Header() {
  const { connectionStatus, address, disconnectWallet } = useWallet();
  const { getPersonRol } = useContractCustom();
  const { getPerson } = useContractCustom();
  const router = useRouter();
  const [walletRol, setWalletRol] = useState<PersolRol>(PersolRol.user);
  const pathname = usePathname();

  useEffect(() => {
    if (
      connectionStatus === loginStatus.DISCONECTED ||
      connectionStatus === loginStatus.ERROR
    )
      router.push("/");
  }, [connectionStatus]);

  useEffect(() => {
    if (walletRol === PersolRol.noUser && pathname !== "/verify")
      router.push("/verify");
  }, [walletRol, pathname]);

  const handleDisconnect = (): void => {
    disconnectWallet();
    router.push("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return;
      const rol = await getPersonRol(address);
      const person = await getPerson(address);
      console.log("person :", person);
      setWalletRol(rol);
    };
    if (address) fetchData();
  }, [address]);

  return (
    <header className="bg-black shadow border-b border-[#f7cf1d]">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DEVOTE%20logo%20alone-jL5bDnrDfhMjjOSqQbVe13uyeQmyPs.png"
            alt="DeVote"
            width={120}
            height={40}
            priority
          />
        </Link>
        <div>
          {(walletRol === PersolRol.user || walletRol === PersolRol.admin) && (
            <>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-[#f7cf1d]"
                asChild
              >
                <Link href="/dashboard">Vote Now</Link>
              </Button>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-[#f7cf1d]"
                asChild
              >
                <Link href="/upcoming">Upcoming</Link>
              </Button>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-[#f7cf1d]"
                asChild
              >
                <Link href="/results">Results</Link>
              </Button>
            </>
          )}

          {walletRol === PersolRol.admin && (
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-[#f7cf1d]"
              asChild
            >
              <Link href="/admin">Admin</Link>
            </Button>
          )}

          {walletRol === PersolRol.noUser && (
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-[#f7cf1d]"
              asChild
            >
              <Link href="/verify">Verify</Link>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              {walletRol !== PersolRol.noUser && (
                <DropdownMenuItem asChild>
                  <Button variant="ghost" className="w-full">
                    <Link href="/user-settings">Settings</Link>
                  </Button>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Button
                  variant="ghost"
                  onClick={handleDisconnect}
                  className="w-full"
                >
                  Disconnect
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
