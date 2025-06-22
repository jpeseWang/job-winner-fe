"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from "lucide-react"

interface FAQItemProps {
    question: string
    answer: string
    category: string
    tags: string[]
    helpful: number
    onVote?: (helpful: boolean) => void
}

export function FAQItem({ question, answer, category, tags, helpful, onVote }: FAQItemProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [hasVoted, setHasVoted] = useState(false)

    const handleVote = (isHelpful: boolean) => {
        if (!hasVoted) {
            setHasVoted(true)
            onVote?.(isHelpful)
        }
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg text-left">{question}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{category}</Badge>
                            {tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                </div>
            </CardHeader>
            {isExpanded && (
                <CardContent>
                    <p className="text-gray-600 mb-4">{answer}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">Was this helpful?</span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleVote(true)}
                                    disabled={hasVoted}
                                    className={hasVoted ? "opacity-50" : ""}
                                >
                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                    Yes
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleVote(false)}
                                    disabled={hasVoted}
                                    className={hasVoted ? "opacity-50" : ""}
                                >
                                    <ThumbsDown className="h-4 w-4 mr-1" />
                                    No
                                </Button>
                            </div>
                        </div>
                        <span className="text-sm text-gray-500">{helpful} people found this helpful</span>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
