"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAccount, useDisconnect } from "@starknet-react/core";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/use-wallet";

export default function Header() {
  const { disconnect } = useDisconnect();
  const { smallAddress, isDisconnected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (isDisconnected) router.push("/");
  }, [isDisconnected]);

  const handleDisconnect = () => {
    console.log("disconnecting wallet");
    disconnect();
    router.push("/");
  };

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
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-[#f7cf1d]"
            asChild
          >
            <Link href="/verify">Verify</Link>
          </Button>
          {smallAddress}
          <Button
            variant="link"
            className="text-gray-300"
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        </div>
      </nav>
    </header>
  );
}
