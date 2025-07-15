"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { formatDate } from "@/utils"
import { Plus, Search, Download, Edit, Eye, Trash2, Clock, CheckCircle, XCircle } from "lucide-react"

// Mock service for proposals
const getProposals = async () => {
  // In a real app, this would fetch from an API
  return [
    [
  {
    id: "1",
    title: "Frontend Developer",
    client: "Acme Inc.",
    status: "sent",
    createdAt: "2023-05-10T10:30:00Z",
    sentAt: "2023-05-12T14:20:00Z",
    amount: "$8,000",
  },
  {
    id: "2",
    title: "Mobile App Design Proposal",
    client: "Tech Solutions",
    status: "draft",
    createdAt: "2023-04-20T09:15:00Z",
    amount: "$8,500",
  },
  {
    id: "3",
    title: "UI/UX Redesign Proposal",
    client: "Creative Agency",
    status: "accepted",
    createdAt: "2023-03-15T16:30:00Z",
    sentAt: "2023-03-16T10:10:00Z",
    acceptedAt: "2023-03-20T11:45:00Z",
    amount: "$3,200",
  },
  {
    id: "4",
    title: "E-commerce Development Proposal",
    client: "Retail Solutions",
    status: "rejected",
    createdAt: "2023-02-10T14:30:00Z",
    sentAt: "2023-02-12T09:45:00Z",
    rejectedAt: "2023-02-15T16:20:00Z",
    amount: "$12,000",
  },
  {
    id: "5",
    title: "Backend API Development",
    client: "Fintech Corp.",
    status: "sent",
    createdAt: "2023-06-01T08:00:00Z",
    sentAt: "2023-06-03T12:00:00Z",
    amount: "$6,500",
  },
  {
    id: "6",
    title: "Digital Marketing Proposal",
    client: "Marketing Experts",
    status: "accepted",
    createdAt: "2023-07-05T11:00:00Z",
    sentAt: "2023-07-06T09:00:00Z",
    acceptedAt: "2023-07-10T15:30:00Z",
    amount: "$4,200",
  },
  {
  id: "7",
  title: "Cloud Infrastructure Setup",
  client: "Enterprise Cloud",
  status: "draft",
  createdAt: "2023-07-20T13:00:00Z",
  amount: "$9,800",
},
{
  id: "8",
  title: "Brand Identity Design",
  client: "Startup Labs",
  status: "rejected",
  createdAt: "2023-05-25T10:15:00Z",
  sentAt: "2023-05-27T11:45:00Z",
  rejectedAt: "2023-05-30T17:00:00Z",
  amount: "$5,400",
},
{
  id: "9",
  title: "Website SEO Optimization",
  client: "Ecom Global",
  status: "sent",
  createdAt: "2023-06-15T09:30:00Z",
  sentAt: "2023-06-17T14:00:00Z",
  amount: "$3,600",
}
]

  ]
}

export default function ProposalsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [proposals, setProposals] = useState<any[]>([])

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setIsLoading(true)
        const userProposals = await getProposals()
        setProposals(userProposals)
      } catch (error) {
        console.error("Error fetching proposals:", error)
        toast({
          title: "Error",
          description: "Failed to load your proposals. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProposals()
  }, [toast])

  const handleDelete = async (proposalId: string) => {
    if (window.confirm("Are you sure you want to delete this proposal?")) {
      try {
        // In a real app, this would call an API
        setProposals((prevProposals) => prevProposals.filter((prop) => prop.id !== proposalId))
        toast({
          title: "Proposal Deleted",
          description: "Your proposal has been deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete proposal. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const filteredProposals = proposals.filter(
    (proposal) =>
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.client.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Draft
          </Badge>
        )
      case "sent":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
            <Eye className="h-3 w-3" /> Sent
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Proposals</h1>
        <Button asChild className="flex items-center gap-2">
          <Link href="/dashboard/job-seeker/generate-cv?type=proposal">
            <Plus className="h-4 w-4" /> Create New Proposal
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search proposals..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="flex gap-2">
                  <div className="h-9 bg-gray-200 rounded w-9"></div>
                  <div className="h-9 bg-gray-200 rounded w-9"></div>
                  <div className="h-9 bg-gray-200 rounded w-9"></div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredProposals.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No proposals found</h3>
          <p className="text-gray-500 mb-6">You haven't created any proposals yet or none match your search.</p>
          <Button asChild>
            <Link href="/dashboard/job-seeker/generate-cv?type=proposal">Create Your First Proposal</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{proposal.title}</CardTitle>
                    <CardDescription>Client: {proposal.client}</CardDescription>
                  </div>
                  {getStatusBadge(proposal.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Created: {formatDate(proposal.createdAt)}</span>
                  <span className="font-medium">{proposal.amount}</span>
                </div>
                {proposal.sentAt && <p className="text-sm text-gray-500 mt-1">Sent: {formatDate(proposal.sentAt)}</p>}
                {proposal.acceptedAt && (
                  <p className="text-sm text-green-600 mt-1">Accepted: {formatDate(proposal.acceptedAt)}</p>
                )}
                {proposal.rejectedAt && (
                  <p className="text-sm text-red-600 mt-1">Rejected: {formatDate(proposal.rejectedAt)}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="icon" title="Download Proposal">
                  <Download className="h-4 w-4" />
                </Button>
                {proposal.status === "draft" && (
                  <Button variant="outline" size="icon" asChild title="Edit Proposal">
                    <Link href={`/generate-cv?type=proposal&id=${proposal.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(proposal.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Proposal"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
