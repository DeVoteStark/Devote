"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Shield,
  Brain,
  Smartphone,
  Scale,
  Lock,
  Wallet,
  CheckSquare,
  Vote,
  Database,
  ChevronRight,
  Star,
  Moon,
  Sun,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
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

  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  const features = [
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Decentralized & Secure",
      description: "Blockchain ensures tamper-proof voting records.",
    },
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "AI-Powered Assistance",
      description: "An AI Agent guides voters through the process.",
    },
    {
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      title: "User-Friendly Interface",
      description: "Easily vote from any device with a seamless experience.",
    },
    {
      icon: <Scale className="h-10 w-10 text-primary" />,
      title: "Scalability",
      description: "Suitable for small communities and large-scale elections.",
    },
    {
      icon: <Lock className="h-10 w-10 text-primary" />,
      title: "Anonymity & Privacy",
      description: "Protects voters' identity while ensuring transparency.",
    },
  ]

  const steps = [
    {
      icon: <Wallet className="h-8 w-8 text-primary" />,
      title: "Connect Your Wallet",
      description: "Securely connect your blockchain wallet to access the platform.",
    },
    {
      icon: <CheckSquare className="h-8 w-8 text-primary" />,
      title: "Select the Active Project",
      description: "Browse and choose from available voting projects.",
    },
    {
      icon: <Vote className="h-8 w-8 text-primary" />,
      title: "Vote with a Few Clicks",
      description: "Cast your vote securely and efficiently.",
    },
    {
      icon: <Database className="h-8 w-8 text-primary" />,
      title: "Verify Your Vote on Blockchain",
      description: "Confirm your vote is recorded on the blockchain.",
    },
  ]

  const testimonials = [
    {
      quote: "DeVote has revolutionized how our DAO makes decisions. The transparency and security are unmatched.",
      author: "Sarah Chen",
      role: "DAO Governance Lead",
      stars: 5,
    },
    {
      quote: "We've increased voter participation by 45% since implementing DeVote for our community decisions.",
      author: "Michael Rodriguez",
      role: "Community Manager",
      stars: 5,
    },
    {
      quote:
        "The user experience is exceptional. Even members with limited technical knowledge find it easy to participate.",
      author: "Aisha Johnson",
      role: "Project Coordinator",
      stars: 4,
    },
  ]

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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <motion.div className="absolute inset-0 -z-10 opacity-20" style={{ y: backgroundY }}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30" />
          <div className="h-full w-full bg-[url('/grid-pattern.svg')] bg-repeat" />
        </motion.div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                The Future of Voting is{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Here.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
                DeVote ensures transparent, secure, and verifiable elections through blockchain technology.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Get Started <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="md:w-1/2 w-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative h-[300px] md:h-[400px] w-full">
                <Image
                  src="/vote.png?height=400&width=500"
                  alt="DeVote Platform Visualization"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About DeVote</h2>
            <p className="text-lg text-muted-foreground">
              DeVote is a revolutionary decentralized voting platform that leverages blockchain technology to ensure
              transparent, secure, and tamper-proof elections. We're solving the critical issues of fraud, lack of
              transparency, and inefficiency in traditional voting systems.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-card rounded-xl p-6 shadow-sm border border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Eliminate Fraud</h3>
              <p className="text-muted-foreground">
                Our blockchain-based system makes vote tampering virtually impossible, ensuring election integrity.
              </p>
            </motion.div>

            <motion.div
              className="bg-card rounded-xl p-6 shadow-sm border border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Full Transparency</h3>
              <p className="text-muted-foreground">
                Every vote is recorded on a public blockchain, allowing for verification while maintaining voter
                privacy.
              </p>
            </motion.div>

            <motion.div
              className="bg-card rounded-xl p-6 shadow-sm border border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Effortless Voting</h3>
              <p className="text-muted-foreground">
                Our intuitive interface makes voting accessible to everyone, regardless of technical expertise.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Key Features</h2>
            <p className="text-lg text-muted-foreground">
              DeVote combines cutting-edge blockchain technology with a user-friendly interface to create the most
              secure and accessible voting platform available.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-card rounded-xl p-6 shadow-sm border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              DeVote makes blockchain voting simple and accessible in just a few steps.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

            {/* Steps */}
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative mb-16 last:mb-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div
                  className={`flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Step number */}
                  <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold z-10 md:-translate-x-1/2">
                    {index + 1}
                  </div>

                  {/* Content */}
                  <div className={`ml-16 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 
                      ? "md:pr-12 lg:pr-16 md:text-right" 
                      : "md:pl-12 lg:pl-16"
                  }`}>
                    <div className={`flex items-center mb-3 gap-3 ${
                      index % 2 === 0 ? "md:justify-end" : ""
                    }`}>
                      {index % 2 === 0 && <div className="hidden md:block">{step.icon}</div>}
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      {index % 2 !== 0 ? <div>{step.icon}</div> : <div className="md:hidden">{step.icon}</div>}
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What People Are Saying</h2>
            <p className="text-lg text-muted-foreground">
              Hear from organizations and communities that have transformed their voting process with DeVote.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-card rounded-xl p-6 shadow-sm border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i, duration: 0.3 }}
                    >
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Future of Voting. Start Now!</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Experience the most secure, transparent, and user-friendly voting platform available today.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Get Started <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Vote className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  DeVote
                </span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                DeVote is revolutionizing the way organizations and communities make decisions through secure,
                transparent blockchain voting technology.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Use Cases
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} DeVote. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}







// // Login

// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { useWallet } from "@/hooks/use-wallet";
// import { loginStatus } from "@/interfaces/Login";
// import { User } from "@/interfaces/User";
// import { useToast } from "@/components/ui/use-toast";

// export default function LoginPage() {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { connectWallet, connectionStatus } = useWallet();
//   const { toast } = useToast();

//   const handleLogin = async () => {
//     try {
//       const encodedEmail = encodeURIComponent(email);
//       const res = await fetch(`/api/login/${encodedEmail}`);
//       const user: User = await res.json();
//       console.log("User data:", user);
//       if (user?.secretKey && user?.walletId) {
//         console.log("conecting wallet");
//         connectWallet(user.secretKey, password, user.walletId);
//       } else {
//         toast({
//           title: "Error",
//           description: "Error logging in",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error logging in:", error);
//       toast({
//         title: "Error",
//         description: "Error logging in",
//         variant: "destructive",
//       });
//     }
//   };

//   useEffect(() => {
//     if (connectionStatus === loginStatus.CONNECTED) {
//       router.push("/dashboard");
//     }
//   }, [connectionStatus]);

//   return (
//     <div className="min-h-screen flex flex-col bg-black text-gray-100">
//       <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
//         <Card className="w-full max-w-md bg-gray-900 border-[#f7cf1d]">
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold text-center text-[#f7cf1d]">
//               Welcome to DeVote
//             </CardTitle>
//             <CardDescription className="text-center text-gray-400">
//               Connect your wallet to access the voting platform
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {/*isDisconnected ? (
//               <Button
//                 onClick={handleConnectWallet}
//                 className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
//               >
//                 Connect Braavos
//               </Button>
//             ) : (
//               <div className="text-center">
//                 <p className="text-sm text-gray-400">Connected Wallet:</p>
//                 <p className="text-[#f7cf1d] font-mono">{address}</p>
//               </div>
//             )*/}
//             {
//               <div className="space-y-2">
//                 <Label className="text-gray-400" htmlFor="email">
//                   User Email
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="bg-gray-800 border-gray-700 text-white"
//                 />
//                 <Label className="text-gray-400" htmlFor="email">
//                   Password
//                 </Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="bg-gray-800 border-gray-700 text-white"
//                 />
//               </div>
//             }
//             <Button
//               className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
//               onClick={handleLogin}
//               disabled={!email || !password}
//             >
//               Login
//             </Button>
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-4">
//             <p className="text-sm text-gray-400 text-center">
//               By connecting, you agree to our{" "}
//               <Link href="/terms" className="text-[#f7cf1d] hover:underline">
//                 Terms of Service
//               </Link>
//             </p>
//           </CardFooter>
//         </Card>
//         <div className="mt-8">
//           <Image
//             src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/devote%20logo-BS33Hv8xS0OR5PqONeZaMOF2cqnKd6.png"
//             alt="DeVote Logo"
//             width={100}
//             height={100}
//             priority
//           />
//         </div>
//       </main>
//     </div>
//   );
// }