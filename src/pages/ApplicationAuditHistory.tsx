import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AuditTimeline from "@/components/itso/AuditTimeline";
import AuditDetailsDrawer from "@/components/itso/AuditDetailsDrawer";
import ComparativeInsightsWidget from "@/components/itso/ComparativeInsightsWidget";

export default function ApplicationAuditHistory() {
  const { appName } = useParams<{ appName: string }>();
  const navigate = useNavigate();
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleAuditClick = (auditId: string) => {
    setSelectedAuditId(auditId);
    setDrawerOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/itso-dashboard")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to ITSO Dashboard
          </Button>
          <h1 className="text-3xl font-bold">
            Application Audit History – {appName?.replace(/-/g, " ")}
          </h1>
          <p className="text-sm text-muted-foreground">
            Home › Dashboards › ITSO › {appName?.replace(/-/g, " ")}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audits..."
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Audit Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sox">SOX</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Control Area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Controls</SelectItem>
            <SelectItem value="access">Access Controls</SelectItem>
            <SelectItem value="financial">Financial Controls</SelectItem>
            <SelectItem value="data">Data Protection</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Comparative Insights Widget */}
      <ComparativeInsightsWidget appName={appName || ""} />

      {/* Audit Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <AuditTimeline
            appName={appName || ""}
            onAuditClick={handleAuditClick}
          />
        </CardContent>
      </Card>

      {/* Audit Details Drawer */}
      <AuditDetailsDrawer
        auditId={selectedAuditId}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
