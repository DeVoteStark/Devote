"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface CreateProposalModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateProposalModal({ isOpen, onClose }: CreateProposalModalProps) {
  const [proposalTitle, setProposalTitle] = useState("")
  const [proposalDescription, setProposalDescription] = useState("")
  const [pdfDocument, setPdfDocument] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfDocument(e.target.files[0])
    }
  }

  const handleCreateProposal = async () => {
    setIsSubmitting(true)

    // Convertir el PDF a Base64 si se ha seleccionado
    let fileBase64 = ""
    if (pdfDocument) {
      try {
        fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(pdfDocument)
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = error => reject(error)
        })
      } catch (error) {
        console.error("Error converting file:", error)
        toast({
          title: "File Error",
          description: "There was an error processing the PDF file.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }
    }

    const proposalData = {
      title: proposalTitle,
      description: proposalDescription,
      file: fileBase64,
    }

    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proposalData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        toast({
          title: "Error",
          description: errorData.message || "Failed to create proposal.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const data = await res.json()
      toast({
        title: "Proposal Created",
        description: "Your proposal has been created successfully.",
        duration: 3000,
      })
      setProposalTitle("")
      setProposalDescription("")
      setPdfDocument(null)
      onClose()
    } catch (error) {
      console.error("Error creating proposal:", error)
      toast({
        title: "Error",
        description: "An error occurred while creating the proposal.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-[#f7cf1d]">Create New Proposal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
            <p className="text-sm text-gray-400">
              Explain the context of your project for the voters!
            </p>
            <Textarea
              id="proposalDescription"
              value={proposalDescription}
              onChange={(e) => setProposalDescription(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
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
            {pdfDocument && (
              <p className="text-sm text-gray-400">
                File selected: {pdfDocument.name}
              </p>
            )}
          </div>
          <Button
            onClick={handleCreateProposal}
            disabled={isSubmitting || !proposalTitle || !proposalDescription}
            className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
          >
            {isSubmitting ? "Creating..." : "Create Proposal"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
