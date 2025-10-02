import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { mockFindings } from "@/data/mockData";
import { ArrowLeft, Calendar, User, FileText, MessageSquare, Clock, Tag } from "lucide-react";
import { format } from "date-fns";

export default function FindingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const finding = mockFindings.find(f => f.id === id);

  if (!finding) {
    return (
      <div className="p-6">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Finding not found</p>
          <Button onClick={() => navigate("/findings")} className="mt-4">
            Back to Findings
          </Button>
        </Card>
      </div>
    );
  }

  const riskColorMap: Record<string, string> = {
    critical: "bg-status-critical text-status-critical-foreground",
    high: "bg-status-high text-status-high-foreground",
    medium: "bg-status-medium text-status-medium-foreground",
    low: "bg-status-low text-status-low-foreground",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate("/findings")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Findings
      </Button>

      {/* Header */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-mono text-muted-foreground">{finding.id}</span>
                <Badge className={riskColorMap[finding.riskLevel]}>
                  {finding.riskLevel.toUpperCase()} RISK
                </Badge>
                <Badge variant="outline">{finding.status.replace("_", " ").toUpperCase()}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{finding.title}</h1>
              <p className="text-muted-foreground">{finding.description}</p>
            </div>
          </div>

          <Separator />

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Owner</span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {finding.owner.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{finding.owner.name}</p>
                  <p className="text-xs text-muted-foreground">{finding.owner.department}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Identified Date</span>
              </div>
              <p className="font-medium">{format(new Date(finding.identifiedDate), "MMM dd, yyyy")}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Target Close Date</span>
              </div>
              <p className="font-medium">{format(new Date(finding.targetCloseDate), "MMM dd, yyyy")}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>Category</span>
              </div>
              <Badge variant="outline">{finding.category}</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="remediation">Remediation Plan</TabsTrigger>
          <TabsTrigger value="evidence">Evidence ({finding.evidence.length})</TabsTrigger>
          <TabsTrigger value="comments">Comments ({finding.comments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Audit Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Audit ID:</span>
                  <span className="font-mono">{finding.auditId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Audit Title:</span>
                  <span className="font-medium">{finding.auditTitle}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {finding.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="remediation">
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Remediation Plan</h3>
            {finding.remediationPlan ? (
              <p className="text-muted-foreground">{finding.remediationPlan}</p>
            ) : (
              <p className="text-muted-foreground italic">No remediation plan documented yet</p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="evidence">
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Evidence Files</h3>
            <div className="space-y-2">
              {finding.evidence.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted transition-colors">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="flex-1 text-sm">{file}</span>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Activity & Comments</h3>
            <div className="space-y-4">
              {finding.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {comment.author.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.author.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.timestamp), "MMM dd, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.text}</p>
                  </div>
                </div>
              ))}
              {finding.comments.length === 0 && (
                <p className="text-muted-foreground italic text-center py-8">No comments yet</p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
