import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpDown, Eye } from "lucide-react";

export interface OwnerMetric {
  ownerId: string;
  name: string;
  department: string;
  totalFindings: number;
  closedFindings: number;
  overdueFindings: number;
  avgClosureTime: number;
  performanceScore: number;
  onTimeRate: number;
}

interface AccountabilityTableProps {
  data: OwnerMetric[];
  onSelectOwner: (ownerId: string) => void;
}

export function AccountabilityTable({ data, onSelectOwner }: AccountabilityTableProps) {
  const [sortField, setSortField] = useState<keyof OwnerMetric>("performanceScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof OwnerMetric) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const multiplier = sortDirection === "asc" ? 1 : -1;
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * multiplier;
    }
    return String(aValue).localeCompare(String(bValue)) * multiplier;
  });

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return "bg-status-low";
    if (score >= 60) return "bg-status-info";
    if (score >= 40) return "bg-status-medium";
    return "bg-status-high";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Owner</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("totalFindings")}>
              <div className="flex items-center gap-1">
                Assigned <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("closedFindings")}>
              <div className="flex items-center gap-1">
                Closed <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("overdueFindings")}>
              <div className="flex items-center gap-1">
                Overdue <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("avgClosureTime")}>
              <div className="flex items-center gap-1">
                Avg. Time <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("performanceScore")}>
              <div className="flex items-center gap-1">
                Score <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((owner, index) => (
            <TableRow 
              key={owner.ownerId}
              className="animate-fade-in hover:bg-muted/50 transition-colors"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(owner.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{owner.name}</span>
                </div>
              </TableCell>
              <TableCell>{owner.department}</TableCell>
              <TableCell className="font-medium">{owner.totalFindings}</TableCell>
              <TableCell className="text-status-low">{owner.closedFindings}</TableCell>
              <TableCell>
                {owner.overdueFindings > 0 ? (
                  <Badge className="bg-status-high">{owner.overdueFindings}</Badge>
                ) : (
                  <span className="text-muted-foreground">0</span>
                )}
              </TableCell>
              <TableCell>{owner.avgClosureTime} days</TableCell>
              <TableCell>
                <Badge className={getPerformanceColor(owner.performanceScore)}>
                  {owner.performanceScore}%
                </Badge>
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onSelectOwner(owner.ownerId)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
