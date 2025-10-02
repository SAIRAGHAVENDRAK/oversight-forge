import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Finding } from "@/types/audit";
import { Calendar, User } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";

interface FindingCardProps {
  finding: Finding;
}

export function FindingCard({ finding }: FindingCardProps) {
  const navigate = useNavigate();
  const daysUntilDue = differenceInDays(new Date(finding.targetCloseDate), new Date());
  const isOverdue = daysUntilDue < 0;

  const riskColorMap: Record<string, string> = {
    critical: "bg-status-critical text-status-critical-foreground",
    high: "bg-status-high text-status-high-foreground",
    medium: "bg-status-medium text-status-medium-foreground",
    low: "bg-status-low text-status-low-foreground",
  };

  const statusColorMap: Record<string, "default" | "secondary" | "outline"> = {
    open: "default",
    in_progress: "secondary",
    resolved: "outline",
    closed: "outline",
    overdue: "destructive" as any,
  };

  return (
    <Card 
      className="p-5 hover:shadow-lg transition-all cursor-pointer"
      onClick={() => navigate(`/findings/${finding.id}`)}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={riskColorMap[finding.riskLevel]}>
                {finding.riskLevel.toUpperCase()}
              </Badge>
              <Badge variant={statusColorMap[finding.status]}>
                {finding.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg mb-1">{finding.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{finding.description}</p>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Owner:</span>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {finding.owner.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{finding.owner.name}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Due: {format(new Date(finding.targetCloseDate), "MMM dd, yyyy")}</span>
          </div>
          {isOverdue ? (
            <span className="text-sm font-medium text-status-high">
              {Math.abs(daysUntilDue)} days overdue
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              {daysUntilDue} days remaining
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
