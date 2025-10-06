import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditTimelineProps {
  appName: string;
  onAuditClick: (auditId: string) => void;
}

export default function AuditTimeline({ appName, onAuditClick }: AuditTimelineProps) {
  // Mock audit timeline data
  const audits = [
    {
      id: "AUD-2024-Q1",
      name: "Q1 2024 SOX Audit",
      type: "SOX",
      startDate: "2024-01-15",
      endDate: "2024-03-15",
      status: "Ongoing",
      auditor: "Jane Smith",
      findingsCount: 5,
      controlsTested: 18,
    },
    {
      id: "AUD-2023-Q4",
      name: "Q4 2023 Security Audit",
      type: "Security",
      startDate: "2023-10-01",
      endDate: "2023-12-15",
      status: "Closed",
      auditor: "John Doe",
      findingsCount: 3,
      controlsTested: 15,
    },
    {
      id: "AUD-2023-Q2",
      name: "Q2 2023 SOX Audit",
      type: "SOX",
      startDate: "2023-04-01",
      endDate: "2023-06-30",
      status: "Closed",
      auditor: "Sarah Johnson",
      findingsCount: 4,
      controlsTested: 18,
    },
    {
      id: "AUD-2023-Q1",
      name: "Q1 2023 Internal Audit",
      type: "Internal",
      startDate: "2023-01-10",
      endDate: "2023-03-20",
      status: "Closed",
      auditor: "Mike Wilson",
      findingsCount: 2,
      controlsTested: 12,
    },
    {
      id: "AUD-2022-Q4",
      name: "Q4 2022 SOX Audit",
      type: "SOX",
      startDate: "2022-10-15",
      endDate: "2022-12-20",
      status: "Closed",
      auditor: "Emily Brown",
      findingsCount: 6,
      controlsTested: 18,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ongoing":
        return "bg-status-medium";
      case "closed":
        return "bg-status-low";
      case "planned":
        return "bg-accent";
      default:
        return "bg-muted";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "sox":
        return <Shield className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

      {/* Timeline items */}
      <div className="space-y-8">
        {audits.map((audit, index) => (
          <div
            key={audit.id}
            className="relative pl-20 group cursor-pointer"
            onClick={() => onAuditClick(audit.id)}
          >
            {/* Timeline node */}
            <div
              className={cn(
                "absolute left-5 top-2 w-6 h-6 rounded-full border-4 border-background transition-transform group-hover:scale-125",
                getStatusColor(audit.status)
              )}
            />

            {/* Audit card */}
            <div className="bg-card border rounded-lg p-4 hover:shadow-lg transition-all group-hover:border-accent">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent">
                    {getTypeIcon(audit.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{audit.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(audit.startDate).toLocaleDateString()} –{" "}
                      {new Date(audit.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={audit.status === "Ongoing" ? "default" : "outline"}
                  className={cn(
                    audit.status === "Ongoing" && "bg-status-medium text-white"
                  )}
                >
                  {audit.status}
                </Badge>
              </div>

              {/* Metadata tooltip preview */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Auditor:</span>
                  <p className="font-medium">{audit.auditor}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Findings:</span>
                  <p className="font-medium">{audit.findingsCount}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Controls Tested:</span>
                  <p className="font-medium">{audit.controlsTested}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
