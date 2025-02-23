import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"

export default function Header() {
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
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-300 hover:text-[#f7cf1d]" asChild>
            <Link href="/dashboard">Vote Now</Link>
          </Button>
          <Button variant="ghost" className="text-gray-300 hover:text-[#f7cf1d]" asChild>
            <Link href="/upcoming">Upcoming</Link>
          </Button>
          <Button variant="ghost" className="text-gray-300 hover:text-[#f7cf1d]" asChild>
            <Link href="/results">Results</Link>
          </Button>
          <Button variant="ghost" className="text-gray-300 hover:text-[#f7cf1d]" asChild>
            <Link href="/admin">Admin</Link>
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
  )
}

