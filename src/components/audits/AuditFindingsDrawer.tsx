import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Audit } from "@/types/audit";
import { mockFindings } from "@/data/mockData";
import { format } from "date-fns";
import { RefreshCw, ChevronDown, Calendar, Hash, FileText, User2, Paperclip } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AuditFindingsDrawerProps {
  audit: Audit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MockFinding {
  id: string;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  owner: string;
  status: "Open" | "In Progress" | "Closed";
  dueDate: string;
  description: string;
  recommendation: string;
  comments: string;
  hasEvidence: boolean;
}

export function AuditFindingsDrawer({ audit, open, onOpenChange }: AuditFindingsDrawerProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [findings, setFindings] = React.useState<MockFinding[]>([]);
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());

  // Generate mock findings based on audit
  React.useEffect(() => {
    if (audit) {
      const mockFindingsData: MockFinding[] = [];
      
      // Add critical findings
      for (let i = 0; i < audit.criticalCount; i++) {
        mockFindingsData.push({
          id: `FND-${audit.id.split('-')[2]}-${String(mockFindingsData.length + 1).padStart(3, '0')}`,
          title: getCriticalFindingTitle(i),
          severity: "Critical",
          owner: getRandomOwner(),
          status: getRandomStatus(),
          dueDate: getRandomDueDate(),
          description: "Critical security vulnerability identified that requires immediate attention. This finding poses significant risk to the organization's security posture.",
          recommendation: "Implement immediate remediation measures and establish continuous monitoring to prevent recurrence.",
          comments: "Management has escalated this issue to the executive team for priority resolution.",
          hasEvidence: true,
        });
      }

      // Add high findings
      for (let i = 0; i < audit.highCount; i++) {
        mockFindingsData.push({
          id: `FND-${audit.id.split('-')[2]}-${String(mockFindingsData.length + 1).padStart(3, '0')}`,
          title: getHighFindingTitle(i),
          severity: "High",
          owner: getRandomOwner(),
          status: getRandomStatus(),
          dueDate: getRandomDueDate(),
          description: "High-priority control deficiency that requires prompt remediation to reduce organizational risk.",
          recommendation: "Develop and execute remediation plan within the next 30 days with regular progress updates.",
          comments: "Control owner has committed resources to address this finding.",
          hasEvidence: true,
        });
      }

      // Add medium findings
      for (let i = 0; i < audit.mediumCount; i++) {
        mockFindingsData.push({
          id: `FND-${audit.id.split('-')[2]}-${String(mockFindingsData.length + 1).padStart(3, '0')}`,
          title: getMediumFindingTitle(i),
          severity: "Medium",
          owner: getRandomOwner(),
          status: getRandomStatus(),
          dueDate: getRandomDueDate(),
          description: "Control weakness identified that should be addressed to strengthen overall control environment.",
          recommendation: "Implement control enhancements within the next 60 days following standard change management process.",
          comments: "Remediation plan under review by department management.",
          hasEvidence: Math.random() > 0.3,
        });
      }

      // Add low findings
      for (let i = 0; i < audit.lowCount; i++) {
        mockFindingsData.push({
          id: `FND-${audit.id.split('-')[2]}-${String(mockFindingsData.length + 1).padStart(3, '0')}`,
          title: getLowFindingTitle(i),
          severity: "Low",
          owner: getRandomOwner(),
          status: getRandomStatus(),
          dueDate: getRandomDueDate(),
          description: "Minor improvement opportunity identified to enhance operational efficiency or control documentation.",
          recommendation: "Address finding as part of regular process improvement initiatives within 90 days.",
          comments: "Low priority - to be addressed in next quarterly review cycle.",
          hasEvidence: Math.random() > 0.5,
        });
      }

      setFindings(mockFindingsData);
    }
  }, [audit]);

  const getCriticalFindingTitle = (index: number) => {
    const titles = [
      "Privileged Access Not Properly Monitored",
      "Critical Data Encryption Missing",
      "Production Database Access Controls Inadequate",
      "Multi-Factor Authentication Not Enforced",
      "Administrative Credentials Shared Among Users",
    ];
    return titles[index % titles.length];
  };

  const getHighFindingTitle = (index: number) => {
    const titles = [
      "Inactive User Accounts Not Timely Disabled",
      "Segregation of Duties Gap in Payment Processing",
      "Security Patch Management Process Deficient",
      "Access Review Process Not Consistently Performed",
      "Change Management Controls Incomplete",
    ];
    return titles[index % titles.length];
  };

  const getMediumFindingTitle = (index: number) => {
    const titles = [
      "Password Policy Does Not Meet Best Practices",
      "Journal Entry Review Documentation Incomplete",
      "Backup and Recovery Testing Not Regular",
      "Vendor Risk Assessment Process Gaps",
      "Incident Response Plan Needs Update",
    ];
    return titles[index % titles.length];
  };

  const getLowFindingTitle = (index: number) => {
    const titles = [
      "Policy Documentation Needs Minor Updates",
      "Training Records Not Centrally Maintained",
      "Asset Inventory Reconciliation Timing",
      "Meeting Minutes Not Consistently Filed",
      "Standard Operating Procedures Need Refresh",
    ];
    return titles[index % titles.length];
  };

  const getRandomOwner = () => {
    const owners = ["Alice Chen", "Bob Martinez", "Carol Singh", "David Kim", "Emma Wilson", "Frank Brown"];
    return owners[Math.floor(Math.random() * owners.length)];
  };

  const getRandomStatus = (): "Open" | "In Progress" | "Closed" => {
    const statuses: Array<"Open" | "In Progress" | "Closed"> = ["Open", "In Progress", "Closed"];
    const weights = [0.3, 0.4, 0.3];
    const random = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random <= sum) return statuses[i];
    }
    return "Open";
  };

  const getRandomDueDate = () => {
    const daysFromNow = Math.floor(Math.random() * 90) + 1;
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-status-critical text-status-critical-foreground";
      case "High":
        return "bg-status-high text-status-high-foreground";
      case "Medium":
        return "bg-status-medium text-status-medium-foreground";
      case "Low":
        return "bg-status-low text-status-low-foreground";
      default:
        return "bg-muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Closed":
        return "bg-status-low text-status-low-foreground";
      case "In Progress":
        return "bg-status-medium text-status-medium-foreground";
      case "Open":
        return "bg-status-high text-status-high-foreground";
      default:
        return "bg-muted";
    }
  };

  const getStatusBadge = (status: AuditStatus) => {
    const statusMap = {
      planned: { variant: "outline" as const, label: "PLANNED" },
      in_progress: { variant: "default" as const, label: "IN PROGRESS" },
      completed: { variant: "secondary" as const, label: "COMPLETED" },
      cancelled: { variant: "destructive" as const, label: "CANCELLED" },
    };
    const config = statusMap[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Randomly shuffle some statuses
    setFindings(prev => prev.map(finding => ({
      ...finding,
      status: Math.random() > 0.7 ? getRandomStatus() : finding.status,
    })));
    
    setIsRefreshing(false);
    toast({
      title: "Findings Refreshed",
      description: "Latest findings data synced successfully.",
    });
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (!audit) return null;

  type AuditStatus = "planned" | "in_progress" | "completed" | "cancelled";

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-mono text-muted-foreground">{audit.id}</span>
                {getStatusBadge(audit.status)}
              </div>
              <DrawerTitle className="text-2xl">{audit.title}</DrawerTitle>
              <DrawerDescription className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(audit.startDate), "MMM dd, yyyy")} - {format(new Date(audit.endDate), "MMM dd, yyyy")}
                </span>
                <span className="flex items-center gap-1">
                  <User2 className="h-3 w-3" />
                  Lead: {audit.leadAuditor.name}
                </span>
              </DrawerDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Findings
            </Button>
          </div>
        </DrawerHeader>

        <div className="overflow-auto p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Findings ({findings.length})</h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Finding ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {findings.map((finding) => (
                <React.Fragment key={finding.id}>
                  <TableRow className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Collapsible
                        open={expandedRows.has(finding.id)}
                        onOpenChange={() => toggleRow(finding.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                expandedRows.has(finding.id) ? 'rotate-180' : ''
                              }`}
                            />
                          </Button>
                        </CollapsibleTrigger>
                      </Collapsible>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{finding.id}</TableCell>
                    <TableCell className="font-medium">{finding.title}</TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(finding.severity)}>
                        {finding.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{finding.owner}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(finding.status)}>
                        {finding.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(finding.dueDate), "MMM dd, yyyy")}</TableCell>
                  </TableRow>
                  {expandedRows.has(finding.id) && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-muted/30">
                        <div className="space-y-4 p-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Description</h4>
                            <p className="text-sm text-muted-foreground">{finding.description}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Recommendation</h4>
                            <p className="text-sm text-muted-foreground">{finding.recommendation}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Assignee Comments</h4>
                            <p className="text-sm text-muted-foreground italic">{finding.comments}</p>
                          </div>
                          {finding.hasEvidence && (
                            <div className="flex items-center gap-2 text-sm">
                              <Paperclip className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Evidence attached</span>
                              <Badge variant="outline" className="ml-2">
                                {Math.floor(Math.random() * 3) + 1} file(s)
                              </Badge>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>

          {findings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No findings recorded for this audit yet.</p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
