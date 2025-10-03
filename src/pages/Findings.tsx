import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockFindings } from "@/data/mockData";
import { Search, Filter, Plus, Eye, Mail, Grid3x3, TableIcon } from "lucide-react";
import { FindingCard } from "@/components/findings/FindingCard";
import { FindingDetailDrawer } from "@/components/findings/FindingDetailDrawer";
import { useNavigate } from "react-router-dom";
import { Finding } from "@/types/audit";

export default function Findings() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique departments
  const departments = ["all", ...Array.from(new Set(mockFindings.map(f => f.owner.department || "Other")))];

  const filteredFindings = mockFindings.filter((finding) => {
    const matchesSearch = 
      finding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      finding.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      finding.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      finding.owner.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || finding.status === filterStatus;
    const matchesDepartment = filterDepartment === "all" || finding.owner.department === filterDepartment;
    const matchesPriority = filterPriority === "all" || finding.riskLevel === filterPriority;
    return matchesSearch && matchesStatus && matchesDepartment && matchesPriority;
  });

  // Pagination
  const totalPages = Math.ceil(filteredFindings.length / itemsPerPage);
  const paginatedFindings = filteredFindings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const criticalHighCount = mockFindings.filter(f => 
    f.riskLevel === "critical" || f.riskLevel === "high"
  ).length;

  const overdueCount = mockFindings.filter(f => f.status === "overdue").length;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-status-info text-status-info-foreground",
      in_progress: "bg-status-medium text-status-medium-foreground",
      overdue: "bg-status-critical text-status-critical-foreground",
      resolved: "bg-status-low text-status-low-foreground",
      closed: "bg-muted text-muted-foreground",
    };
    return colors[status] || "bg-muted";
  };

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      critical: "bg-status-critical text-status-critical-foreground",
      high: "bg-status-high text-status-high-foreground",
      medium: "bg-status-medium text-status-medium-foreground",
      low: "bg-status-low text-status-low-foreground",
    };
    return colors[risk] || "bg-muted";
  };

  const handleRowClick = (finding: Finding) => {
    setSelectedFinding(finding);
    setDrawerOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Findings</h1>
          <p className="text-muted-foreground">Track and manage all audit findings</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90">
          <Plus className="mr-2 h-4 w-4" />
          New Finding
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Findings</p>
          <p className="text-2xl font-bold">{mockFindings.length}</p>
        </Card>
        <Card className="p-4 border-status-high">
          <p className="text-sm text-muted-foreground mb-1">Critical / High</p>
          <p className="text-2xl font-bold text-status-high">{criticalHighCount}</p>
        </Card>
        <Card className="p-4 border-status-medium">
          <p className="text-sm text-muted-foreground mb-1">Overdue</p>
          <p className="text-2xl font-bold text-status-medium">{overdueCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Open</p>
          <p className="text-2xl font-bold text-status-info">
            {mockFindings.filter(f => f.status === "open").length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          {/* Search and View Toggle */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, title, owner, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("table")}
              >
                <TableIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filter Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <Tabs value={filterStatus} onValueChange={setFilterStatus} className="flex-1">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Table View */}
      {viewMode === "table" ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Finding ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFindings.map((finding) => (
                <TableRow 
                  key={finding.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(finding)}
                >
                  <TableCell className="font-medium">{finding.id}</TableCell>
                  <TableCell className="max-w-xs truncate">{finding.title}</TableCell>
                  <TableCell>{finding.owner.name}</TableCell>
                  <TableCell>{finding.owner.department || "N/A"}</TableCell>
                  <TableCell className={finding.status === "overdue" ? "text-status-critical font-semibold" : ""}>
                    {new Date(finding.targetCloseDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskColor(finding.riskLevel)} variant="outline">
                      {finding.riskLevel.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(finding.status)}>
                      {finding.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/findings/${finding.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {/* Send reminder */}}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredFindings.length)} of {filteredFindings.length} findings
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        /* Grid View */
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {paginatedFindings.map((finding) => (
              <FindingCard key={finding.id} finding={finding} />
            ))}
          </div>

          {/* Pagination for Grid */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredFindings.length)} of {filteredFindings.length} findings
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {filteredFindings.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No findings match your current filters</p>
        </Card>
      )}

      {/* Detail Drawer */}
      <FindingDetailDrawer
        finding={selectedFinding}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
