import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Finding } from "@/types/audit";

interface OverdueTableProps {
  findings: Finding[];
}

export function OverdueTable({ findings }: OverdueTableProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      overdue: "bg-status-critical text-status-critical-foreground",
      open: "bg-status-high text-status-high-foreground",
      in_progress: "bg-status-medium text-status-medium-foreground",
    };
    return colors[status] || "bg-muted";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Overdue Findings - Action Required</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Finding ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {findings.map((finding) => (
              <TableRow key={finding.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{finding.id}</TableCell>
                <TableCell>{finding.title}</TableCell>
                <TableCell>{finding.owner.name}</TableCell>
                <TableCell className="text-status-critical">
                  {new Date(finding.targetCloseDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(finding.status)}>
                    {finding.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/findings/${finding.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {/* Remind action */}}
                    >
                      <Bell className="h-4 w-4 mr-1" />
                      Remind
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
