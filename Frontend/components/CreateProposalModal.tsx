"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface CreateProposalModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateProposalModal({ isOpen, onClose }: CreateProposalModalProps) {
  const [proposalId, setProposalId] = useState("")
  const [proposalTitle, setProposalTitle] = useState("")
  const [proposalDescription, setProposalDescription] = useState("")
  const [votingOptions, setVotingOptions] = useState([""])
  const [pdfDocument, setPdfDocument] = useState<File | null>(null)

  const { toast } = useToast()

  const handleAddOption = () => {
    setVotingOptions([...votingOptions, ""])
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = votingOptions.filter((_, i) => i !== index)
    setVotingOptions(newOptions)
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...votingOptions]
    newOptions[index] = value
    setVotingOptions(newOptions)
  }

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfDocument(e.target.files[0])
    }
  }

  const handleCreateProposal = () => {
    console.log("Creating proposal:", { proposalId, proposalTitle, proposalDescription, votingOptions, pdfDocument })
    setProposalId("")
    setProposalTitle("")
    setProposalDescription("")
    setVotingOptions([""])
    setPdfDocument(null)
    toast({
      title: "Success!",
      description: "Your proposal has been created successfully.",
      variant: "success",
    })
    onClose()
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-[#f7cf1d]">Create New Proposal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="proposalId">Proposal ID</Label>
            <Input
              id="proposalId"
              value={proposalId}
              onChange={(e) => setProposalId(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proposalTitle">Title</Label>
            <Input
              id="proposalTitle"
              value={proposalTitle}
              onChange={(e) => setProposalTitle(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proposalDescription">Description</Label>
            <p className="text-sm text-gray-400">Explain the context of your project to the people voting!</p>
            <Textarea
              id="proposalDescription"
              value={proposalDescription}
              onChange={(e) => setProposalDescription(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label>Voting Options</Label>
            {votingOptions.map((option, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button onClick={() => handleRemoveOption(index)} variant="destructive">
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={handleAddOption} variant="outline">
              Add Option
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pdfUpload">Upload PDF Document</Label>
            <Input
              id="pdfUpload"
              type="file"
              accept=".pdf"
              onChange={handlePdfUpload}
              className="bg-gray-800 border-gray-700 text-white"
            />
            {pdfDocument && <p className="text-sm text-gray-400">File selected: {pdfDocument.name}</p>}
          </div>
          <Button onClick={handleCreateProposal} className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]">
            Create Proposal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

