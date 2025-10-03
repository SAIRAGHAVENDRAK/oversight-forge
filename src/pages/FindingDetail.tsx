import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockFindings } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  User,
  Building2,
  FileText,
  Download,
  Edit,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { TaskList } from "@/components/findings/TaskList";
import { CommentTimeline } from "@/components/findings/CommentTimeline";
import { HistoryLog } from "@/components/findings/HistoryLog";
import { AddTaskDialog } from "@/components/findings/AddTaskDialog";
import { CloseFindingDialog } from "@/components/findings/CloseFindingDialog";
import { toast } from "sonner";

export default function FindingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [closeFindingOpen, setCloseFindingOpen] = useState(false);

  const finding = mockFindings.find((f) => f.id === id);

  if (!finding) {
    return (
      <div className="p-6">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">Finding not found</p>
          <Button onClick={() => navigate("/findings")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Findings
          </Button>
        </Card>
      </div>
    );
  }

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleExportPDF = () => {
    toast.success("PDF export will be implemented");
  };

  const handleSendReminder = () => {
    toast.success(`Reminder sent to ${finding.owner.name}`);
  };

  const isOverdue = finding.status === "overdue";

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate("/findings")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Findings
      </Button>

      {/* Header Section */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-3xl font-bold">{finding.title}</h1>
          </div>
          <p className="text-muted-foreground mb-4">{finding.id}</p>
          <div className="flex gap-2 flex-wrap">
            <Badge className={riskColorMap[finding.riskLevel]}>
              {finding.riskLevel.toUpperCase()} PRIORITY
            </Badge>
            <Badge className={statusColorMap[finding.status]}>
              {finding.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          {finding.status !== "closed" && (
            <Button 
              variant="default"
              onClick={() => setCloseFindingOpen(true)}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Summary Info Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Finding Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Owner */}
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                <User className="h-4 w-4" />
                Owner
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={finding.owner.avatar} />
                  <AvatarFallback>{getInitials(finding.owner.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{finding.owner.name}</p>
                  <p className="text-xs text-muted-foreground">{finding.owner.email}</p>
                </div>
              </div>
            </div>

            {/* Department */}
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Building2 className="h-4 w-4" />
                Department
              </div>
              <p className="text-lg">{finding.owner.department || "N/A"}</p>
            </div>

            {/* Identified Date */}
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Calendar className="h-4 w-4" />
                Identified Date
              </div>
              <p className="text-lg">
                {new Date(finding.identifiedDate).toLocaleDateString()}
              </p>
            </div>

            {/* Due Date */}
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Calendar className="h-4 w-4" />
                Target Close Date
              </div>
              <p className={`text-lg ${isOverdue ? "text-status-critical font-semibold" : ""}`}>
                {new Date(finding.targetCloseDate).toLocaleDateString()}
                {isOverdue && <Badge className="ml-2 bg-status-critical">OVERDUE</Badge>}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Linked Audit Reference */}
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold mb-2">
              <FileText className="h-4 w-4" />
              Linked Audit Reference
            </div>
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => navigate(`/audits#${finding.auditId}`)}
            >
              {finding.auditTitle} ({finding.auditId})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="tasks">
                Tasks ({finding.tasks?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="comments">
                Comments ({finding.comments?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {finding.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category & Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">Category</p>
                      <Badge variant="outline">{finding.category}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {finding.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {finding.remediationPlan && (
                <Card>
                  <CardHeader>
                    <CardTitle>Remediation Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{finding.remediationPlan}</p>
                  </CardContent>
                </Card>
              )}

              {finding.evidence.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Evidence Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {finding.evidence.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm font-medium">{file}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks">
              <TaskList
                tasks={finding.tasks || []}
                onAddTask={() => setAddTaskOpen(true)}
                canEdit={true}
              />
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments">
              <CommentTimeline
                comments={finding.comments || []}
                onAddComment={(text) => {
                  console.log("New comment:", text);
                }}
              />
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <HistoryLog history={finding.history || []} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Quick Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleSendReminder}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Reminder
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate(`/audits#${finding.auditId}`)}
              >
                <FileText className="mr-2 h-4 w-4" />
                View Audit
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExportPDF}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risk Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-semibold mb-1">Risk Level</p>
                <Badge className={riskColorMap[finding.riskLevel]}>
                  {finding.riskLevel.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Category</p>
                <p className="text-sm text-muted-foreground">{finding.category}</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Days Until Due</p>
                <p className={`text-sm ${isOverdue ? "text-status-critical font-semibold" : "text-muted-foreground"}`}>
                  {Math.ceil(
                    (new Date(finding.targetCloseDate).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <AddTaskDialog
        open={addTaskOpen}
        onOpenChange={setAddTaskOpen}
        onSubmit={(task) => {
          console.log("New task:", task);
        }}
      />

      <CloseFindingDialog
        open={closeFindingOpen}
        onOpenChange={setCloseFindingOpen}
        findingId={finding.id}
        onConfirm={(notes) => {
          console.log("Closure notes:", notes);
        }}
      />
    </div>
  );
}
