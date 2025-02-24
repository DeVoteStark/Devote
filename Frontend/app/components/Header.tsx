"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useDisconnect } from "@starknet-react/core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/use-wallet";
import { User } from "lucide-react";
import { useContractCustom } from "@/hooks/use-contract";
import { PersolRol } from "@/interfaces/Person";

export default function Header() {
  const { disconnect } = useDisconnect();
  const { smallAddress, isDisconnected, address } = useWallet();
  const { getPersonRol } = useContractCustom();
  const router = useRouter();
  const [walletRol, setWalletRol] = useState<PersolRol>(PersolRol.user);

  useEffect(() => {
    if (isDisconnected) router.push("/");
  }, [isDisconnected]);

  const handleDisconnect = () => {
    console.log("disconnecting wallet");
    disconnect();
    router.push("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return;
      const rol = await getPersonRol(address);
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
          {smallAddress}
          <Button
            variant="link"
            className="text-gray-300"
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
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
              <DropdownMenuItem asChild>
                <Link href="/user-settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
