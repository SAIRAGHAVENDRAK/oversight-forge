import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockFindings } from "@/data/mockData";
import { Search, Filter, Plus } from "lucide-react";
import { FindingCard } from "@/components/findings/FindingCard";

export default function Findings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredFindings = mockFindings.filter((finding) => {
    const matchesSearch = finding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         finding.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || finding.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const criticalHighCount = mockFindings.filter(f => 
    f.riskLevel === "critical" || f.riskLevel === "high"
  ).length;

  const overdueCount = mockFindings.filter(f => f.status === "overdue").length;

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
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search findings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={filterStatus} onValueChange={setFilterStatus}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Findings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredFindings.map((finding) => (
          <FindingCard key={finding.id} finding={finding} />
        ))}
      </div>

      {filteredFindings.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No findings match your current filters</p>
        </Card>
      )}
    </div>
  );
}
