import { Finding } from "@/types/audit";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Building2, Tag, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FindingDetailDrawerProps {
  finding: Finding | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FindingDetailDrawer({ finding, open, onOpenChange }: FindingDetailDrawerProps) {
  const navigate = useNavigate();

  if (!finding) return null;

  const riskColorMap = {
    critical: "bg-status-critical text-status-critical-foreground",
    high: "bg-status-high text-status-high-foreground",
    medium: "bg-status-medium text-status-medium-foreground",
    low: "bg-status-low text-status-low-foreground",
  };

  const statusColorMap = {
    open: "bg-status-info text-status-info-foreground",
    in_progress: "bg-status-medium text-status-medium-foreground",
    overdue: "bg-status-critical text-status-critical-foreground",
    resolved: "bg-status-low text-status-low-foreground",
    closed: "bg-muted text-muted-foreground",
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <SheetTitle className="text-xl">{finding.title}</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground mt-1">
                {finding.id}
              </SheetDescription>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Badge className={riskColorMap[finding.riskLevel]}>
                {finding.riskLevel.toUpperCase()}
              </Badge>
              <Badge className={statusColorMap[finding.status]}>
                {finding.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{finding.description}</p>
          </div>

          <Separator />

          {/* Owner & Assignment Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                <User className="h-4 w-4" />
                Owner
              </div>
              <p className="text-sm">{finding.owner.name}</p>
              <p className="text-xs text-muted-foreground">{finding.owner.email}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Building2 className="h-4 w-4" />
                Department
              </div>
              <p className="text-sm">{finding.owner.department || "N/A"}</p>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Calendar className="h-4 w-4" />
                Identified Date
              </div>
              <p className="text-sm">
                {new Date(finding.identifiedDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Calendar className="h-4 w-4" />
                Target Close Date
              </div>
              <p className={`text-sm ${finding.status === "overdue" ? "text-status-critical font-semibold" : ""}`}>
                {new Date(finding.targetCloseDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Separator />

          {/* Category & Tags */}
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold mb-2">
              <Tag className="h-4 w-4" />
              Category & Tags
            </div>
            <p className="text-sm mb-2">{finding.category}</p>
            <div className="flex flex-wrap gap-2">
              {finding.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Linked Audit */}
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold mb-2">
              <ExternalLink className="h-4 w-4" />
              Linked Audit
            </div>
            <Button
              variant="link"
              className="p-0 h-auto text-sm"
              onClick={() => {
                navigate(`/audits#${finding.auditId}`);
                onOpenChange(false);
              }}
            >
              {finding.auditTitle} ({finding.auditId})
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => {
                navigate(`/findings/${finding.id}`);
                onOpenChange(false);
              }}
              className="flex-1"
            >
              View Full Details
            </Button>
            <Button variant="outline" className="flex-1">
              Send Reminder
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
