import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface AuditDetailsDrawerProps {
  auditId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuditDetailsDrawer({
  auditId,
  open,
  onOpenChange,
}: AuditDetailsDrawerProps) {
  if (!auditId) return null;

  // Mock findings data
  const previousFindings = [
    {
      id: "F-001",
      description: "Segregation of duties not enforced in payment module",
      severity: "High",
      control: "Access Control AC-3",
      closureStatus: "Closed",
    },
    {
      id: "F-002",
      description: "Missing approval logs for critical transactions",
      severity: "Medium",
      control: "Audit Logging AU-2",
      closureStatus: "Closed",
    },
    {
      id: "F-003",
      description: "Weak password policy configuration",
      severity: "Medium",
      control: "Identity Management IA-5",
      closureStatus: "Closed",
    },
  ];

  const currentFindings = [
    {
      id: "F-101",
      description: "Segregation of duties not enforced in payment module",
      severity: "High",
      control: "Access Control AC-3",
      owner: "John Smith",
      eta: "2024-02-15",
      tag: "Recurring",
      status: "Active",
    },
    {
      id: "F-102",
      description: "Insufficient encryption for data at rest",
      severity: "High",
      control: "Data Protection SC-28",
      owner: "Sarah Johnson",
      eta: "2024-02-20",
      tag: "New",
      status: "Planned",
    },
    {
      id: "F-103",
      description: "Missing MFA for privileged accounts",
      severity: "Critical",
      control: "Identity Management IA-2",
      owner: "Mike Wilson",
      eta: "2024-02-10",
      tag: "New",
      status: "Active",
    },
    {
      id: "F-104",
      description: "Change management process not documented",
      severity: "Medium",
      control: "Configuration Management CM-3",
      owner: "Emily Brown",
      eta: "2024-03-01",
      tag: "Missed",
      status: "Planned",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-status-high text-white";
      case "high":
        return "bg-status-high text-white";
      case "medium":
        return "bg-status-medium text-white";
      case "low":
        return "bg-status-low text-white";
      default:
        return "bg-muted";
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "new":
        return "bg-accent text-white";
      case "recurring":
        return "bg-status-medium text-white";
      case "missed":
        return "bg-status-high text-white";
      case "re-test":
        return "bg-status-low text-white";
      default:
        return "bg-muted";
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle>Audit Details - {auditId}</DrawerTitle>
              <DrawerDescription>
                View findings from previous and current audit cycles
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto p-6">
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">
                Current Audit Findings ({currentFindings.length})
              </TabsTrigger>
              <TabsTrigger value="previous">
                Previous Audit Findings ({previousFindings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Planned vs Active Findings
                </h3>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm">Finding ID</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Severity</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Owner</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">ETA</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Tag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentFindings.map((finding) => (
                      <tr key={finding.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-sm">{finding.id}</td>
                        <td className="py-3 px-4 max-w-md">
                          <p className="text-sm">{finding.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{finding.control}</p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getSeverityColor(finding.severity)}>
                            {finding.severity}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">{finding.owner}</td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(finding.eta).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={finding.status === "Active" ? "default" : "outline"}>
                            {finding.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getTagColor(finding.tag)}>
                            {finding.tag}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="previous" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Historical Findings Overview
                </h3>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm">Finding ID</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Severity</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Control Impacted</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Closure Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previousFindings.map((finding) => (
                      <tr key={finding.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-sm">{finding.id}</td>
                        <td className="py-3 px-4 max-w-md text-sm">{finding.description}</td>
                        <td className="py-3 px-4">
                          <Badge className={getSeverityColor(finding.severity)}>
                            {finding.severity}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">{finding.control}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="bg-status-low/10 text-status-low border-status-low">
                            {finding.closureStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
