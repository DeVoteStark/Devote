'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const candidates = [
  { id: 1, name: "Jane Doe", party: "Progressive Party" },
  { id: 2, name: "John Smith", party: "Conservative Party" },
  { id: 3, name: "Alice Johnson", party: "Centrist Alliance" },
]

export default function CandidateList() {
  const [votedFor, setVotedFor] = useState<number | null>(null)

  const handleVote = (candidateId: number) => {
    setVotedFor(candidateId)
    // Here you would typically send the vote to your backend
    console.log(`Voted for candidate with ID: ${candidateId}`)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {candidates.map((candidate) => (
        <Card key={candidate.id} className="bg-gray-900 border-[#f7cf1d]">
          <CardHeader>
            <CardTitle className="text-[#f7cf1d]">{candidate.name}</CardTitle>
            <CardDescription className="text-gray-400">{candidate.party}</CardDescription>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleVote(candidate.id)}
              disabled={votedFor !== null}
              className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
            >
              {votedFor === candidate.id ? "Voted" : "Vote"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

