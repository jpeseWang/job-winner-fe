import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Users, CheckCircle, XCircle } from "lucide-react";
import { ApplicationStatus } from "@/types/enums";

export const getApplicationStatusBadge = (status: ApplicationStatus) => {
    const statusConfig = {
        pending: {
            variant: "outline" as const,
            className: "bg-yellow-50 text-yellow-700 border-yellow-200",
            icon: <Clock className="h-3 w-3" />,
        },
        reviewed: {
            variant: "outline" as const,
            className: "bg-blue-50 text-blue-700 border-blue-200",
            icon: <Eye className="h-3 w-3" />,
        },
        interviewed: {
            variant: "outline" as const,
            className: "bg-purple-50 text-purple-700 border-purple-200",
            icon: <Users className="h-3 w-3" />,
        },
        hired: {
            variant: "outline" as const,
            className: "bg-green-50 text-green-700 border-green-200",
            icon: <CheckCircle className="h-3 w-3" />,
        },
        rejected: {
            variant: "outline" as const,
            className: "bg-red-50 text-red-700 border-red-200",
            icon: <XCircle className="h-3 w-3" />,
        },
    };

    const config = statusConfig[status];
    if (!config) return null;

    return (
        <Badge variant={config.variant} className={`${config.className} flex items-center gap-1`}>
            {config.icon}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
};
