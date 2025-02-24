"use client"

import { useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, UserPlus, UserCog } from "lucide-react"
import CreateProposalModal from "../components/CreateProposalModal"
import CreateUserModal from "../components/CreateUserModal"
import ModifyUserModal from "../components/ModifyUserModal"

const projects = [
  { id: "1", name: "City Park Renovation", status: "active" },
  { id: "2", name: "Public Transportation Expansion", status: "active" },
  { id: "3", name: "Education Budget Allocation", status: "upcoming" },
  { id: "4", name: "New Community Center", status: "upcoming" },
]

export default function AdminPage() {
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isModifyUserModalOpen, setIsModifyUserModalOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#f7cf1d] mb-4 md:mb-0">Admin Dashboard</h1>
          <div className="space-y-2 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
            <Button onClick={() => setIsProposalModalOpen(true)} className="bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Proposal
            </Button>
            <Button onClick={() => setIsUserModalOpen(true)} className="bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]">
              <UserPlus className="mr-2 h-4 w-4" /> Create New User
            </Button>
            <Button
              onClick={() => setIsModifyUserModalOpen(true)}
              className="bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
            >
              <UserCog className="mr-2 h-4 w-4" /> Modify User
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="bg-gray-900 border-[#f7cf1d]">
              <CardHeader>
                <CardTitle className="text-[#f7cf1d]">{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">Status: {project.status}</p>
                <Button asChild className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]">
                  <Link href={`/admin/edit-proposal/${project.id}`}>Edit Proposal</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
      <CreateProposalModal isOpen={isProposalModalOpen} onClose={() => setIsProposalModalOpen(false)} />
      <CreateUserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
      <ModifyUserModal isOpen={isModifyUserModalOpen} onClose={() => setIsModifyUserModalOpen(false)} />
    </div>
  )
}

