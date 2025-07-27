// components/ApplicationDetailsDialog.tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Loader2, Download, Building, MapPin } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils"
import { getApplicationStatusBadge } from "@/lib/ui/getApplicationStatusBadge";
import { downloadFile } from "@/utils/fileHandler";

export default function ApplicationDetailsDialog({
    applicationId,
    onViewDetails,
    // isLoading,
    selectedApplication,
}: {
    applicationId: string;
    onViewDetails: (id: string) => void;
    // isLoading: boolean;
    selectedApplication: any;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(applicationId)}
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Application Details</DialogTitle>
                    <DialogDescription>
                        View your application information and status
                    </DialogDescription>
                </DialogHeader>

                {selectedApplication ? (
                    <div className="space-y-6">
                        {/* Job Information */}
                        <div>
                            <h3 className="font-semibold mb-3">Job Information</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage
                                        src={
                                            selectedApplication.companyInfo[0]?.logo ||
                                            "/placeholder.svg"
                                        }
                                        alt={selectedApplication.companyInfo[0]?.name || "Company"}
                                    />
                                    <AvatarFallback>
                                        {(selectedApplication.job?.company?.name || "CO")
                                            .substring(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-medium text-lg">
                                        {selectedApplication.job?.title || "Job Title"}
                                    </h4>
                                    <p className="text-gray-600 flex items-center gap-1">
                                        <Building className="h-4 w-4" />
                                        {selectedApplication.job?.company?.name || "Company Name"}
                                    </p>
                                    <p className="text-gray-600 flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {selectedApplication?.location || "Location"}
                                    </p>
                                    {selectedApplication.job?.salary && (
                                        <p className="text-green-600 font-medium">
                                            ${selectedApplication.job.salary.min?.toLocaleString()} - $
                                            {selectedApplication.job.salary.max?.toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Application Status */}
                        <div>
                            <h3 className="font-semibold mb-3">Application Status</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span>Current Status:</span>
                                    {getApplicationStatusBadge(selectedApplication.status)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Applied Date:</span>
                                    <span className="text-gray-600">
                                        {formatDate(selectedApplication.createdAt)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Last Updated:</span>
                                    <span className="text-gray-600">
                                        {formatDate(selectedApplication.updatedAt)}
                                    </span>
                                </div>
                                {selectedApplication.interviewDate && (
                                    <div className="flex items-center justify-between">
                                        <span>Interview Date:</span>
                                        <span className="text-purple-600 font-medium">
                                            {formatDate(selectedApplication.interviewDate)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Cover Letter */}
                        {selectedApplication.coverLetter && (
                            <>
                                <div>
                                    <h3 className="font-semibold mb-3">Cover Letter</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-700 whitespace-pre-wrap">
                                            {selectedApplication.coverLetter}
                                        </p>
                                    </div>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* Resume */}
                        {selectedApplication.resumeUrl && (
                            <>
                                <div>
                                    <h3 className="font-semibold mb-3">Resume</h3>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-blue-800 mb-2">
                                            Resume attached to this application
                                        </p>
                                        <Button variant="outline" size="sm" onClick={() => downloadFile(selectedApplication.resumeUrl, "resume.pdf")}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Download Resume
                                        </Button>
                                    </div>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* Feedback */}
                        {selectedApplication.feedback && (
                            <>
                                <div>
                                    <h3 className="font-semibold mb-3">Feedback</h3>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-blue-800">{selectedApplication.feedback}</p>
                                    </div>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* Notes */}
                        {selectedApplication.notes && (
                            <div>
                                <h3 className="font-semibold mb-3">Notes</h3>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <p className="text-yellow-800">{selectedApplication.notes}</p>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-4">
                            <Button asChild variant="outline">
                                <Link href={`/jobs/${selectedApplication.job?._id}`}>
                                    View Job Posting
                                </Link>
                            </Button>
                            {selectedApplication.resumeUrl && (
                                <Button variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Resume
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Failed to load application details</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
