"use client"

import { Vote } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { useState, useEffect } from "react"

export default function Header() {

    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        // Check user preference
        const isDark =
          localStorage.getItem("darkMode") === "true" || window.matchMedia("(prefers-color-scheme: dark)").matches
        setDarkMode(isDark)
    
        if (isDark) {
          document.documentElement.classList.add("dark")
        }
      }, [])

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
        document.documentElement.classList.toggle("dark")
        localStorage.setItem("darkMode", (!darkMode).toString())
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/">
                        <div className="flex items-center space-x-2">
                            <Vote className="h-8 w-8 text-primary" />
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                DeVote
                            </span>
                        </div>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
                            About
                        </Link>
                        <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                            How It Works
                        </Link>
                        <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
                            Testimonials
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <Button className="bg-primary hover:bg-primary/90 text-white">Get Started</Button>
                    </div>
                </div>
            </header>
        </div>
    )

}
