import Header from '../components/Header'
import Footer from '../components/Footer'
import AIAgent from '../components/AIAgent'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

const activeVotings = [
  { id: 1, name: "City Park Renovation", description: "Vote on the proposed designs for the central park renovation." },
  { id: 2, name: "Public Transportation Expansion", description: "Choose between different plans for expanding the city's public transportation." },
  { id: 3, name: "Education Budget Allocation", description: "Decide on the allocation of the education budget for the next fiscal year." },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">Active Votings</h1>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              {activeVotings.map((voting) => (
                <Card key={voting.id} className="bg-gray-900 border-[#f7cf1d] flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-[#f7cf1d]">{voting.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-300 mb-4">{voting.description}</p>
                  </CardContent>
                  <CardContent>
                    <Button asChild className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]">
                      <Link href={`/voting/${voting.id}`}>Vote Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <AIAgent />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

