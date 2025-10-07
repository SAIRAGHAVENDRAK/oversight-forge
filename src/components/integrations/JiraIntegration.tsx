import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Link2, RefreshCw, ChevronDown, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

interface JiraProject {
  key: string;
  name: string;
  lead: string;
  autoSync: boolean;
}

interface JiraStory {
  key: string;
  title: string;
  status: string;
  owner: string;
  startDate: string;
  endDate: string;
}

interface JiraTask {
  key: string;
  title: string;
  severity: "High" | "Medium" | "Low";
  assignee: string;
  status: string;
}

const mockProjects: JiraProject[] = [
  { key: "IC", name: "Internal Controls", lead: "Alice", autoSync: false },
  { key: "SX", name: "SOX 2025", lead: "Bob", autoSync: false },
  { key: "IT", name: "ITGC Security Audit", lead: "Carol", autoSync: false },
];

const mockStories: Record<string, JiraStory[]> = {
  IC: [
    { key: "IC-101", title: "Access Control Review", status: "In Progress", owner: "John", startDate: "2025-09-01", endDate: "2025-10-10" },
    { key: "IC-102", title: "Vendor Risk Audit", status: "Completed", owner: "Mary", startDate: "2025-07-10", endDate: "2025-08-20" },
  ],
  SX: [
    { key: "SX-201", title: "Financial Controls Assessment", status: "In Progress", owner: "David", startDate: "2025-08-15", endDate: "2025-09-30" },
  ],
  IT: [
    { key: "IT-301", title: "Network Security Review", status: "Open", owner: "Emma", startDate: "2025-10-01", endDate: "2025-11-15" },
  ],
};

const mockTasks: Record<string, JiraTask[]> = {
  "IC-101": [
    { key: "IC-101-1", title: "Admin Access Not Revoked", severity: "High", assignee: "Ravi", status: "Open" },
    { key: "IC-101-2", title: "MFA not enforced", severity: "Medium", assignee: "Neha", status: "In Progress" },
    { key: "IC-101-3", title: "Vendor onboarding delay", severity: "Low", assignee: "Sai", status: "Closed" },
  ],
  "IC-102": [
    { key: "IC-102-1", title: "Contract review incomplete", severity: "Medium", assignee: "Priya", status: "Closed" },
  ],
  "SX-201": [
    { key: "SX-201-1", title: "Revenue recognition gap", severity: "High", assignee: "Tom", status: "Open" },
    { key: "SX-201-2", title: "Journal entry controls weak", severity: "High", assignee: "Sarah", status: "In Progress" },
  ],
  "IT-301": [
    { key: "IT-301-1", title: "Firewall misconfiguration", severity: "High", assignee: "Kevin", status: "Open" },
  ],
};

export function JiraIntegration() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [projects, setProjects] = React.useState<JiraProject[]>([]);
  const [stories, setStories] = React.useState<Record<string, JiraStory[]>>({});
  const [tasks, setTasks] = React.useState<Record<string, JiraTask[]>>({});
  const [syncLogs, setSyncLogs] = React.useState<string[]>([]);
  const [showLogs, setShowLogs] = React.useState(false);
  const [expandedStory, setExpandedStory] = React.useState<string | null>(null);
  const [showConfetti, setShowConfetti] = React.useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    setShowLogs(true);
    setSyncLogs(["Connecting to Jira..."]);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsConnected(true);
    setIsConnecting(false);
    setProjects(mockProjects);
    setSyncLogs(prev => [...prev, "✅ Jira Connected Successfully (Demo Mode)"]);
    
    toast({
      title: "✅ Connection Successful",
      description: "Jira connected successfully (Demo Mode)",
    });
  };

  const handleFetchStories = async () => {
    setIsFetching(true);
    setProgress(0);
    setShowLogs(true);
    setSyncLogs(["Fetching Stories from Jira..."]);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSyncLogs(prev => [...prev, "Syncing Findings..."]);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    clearInterval(interval);
    setProgress(100);
    
    const enabledProjects = projects.filter(p => p.autoSync);
    const fetchedStories: Record<string, JiraStory[]> = {};
    const fetchedTasks: Record<string, JiraTask[]> = {};
    
    enabledProjects.forEach(project => {
      if (mockStories[project.key]) {
        fetchedStories[project.key] = mockStories[project.key];
        mockStories[project.key].forEach(story => {
          if (mockTasks[story.key]) {
            fetchedTasks[story.key] = mockTasks[story.key];
          }
        });
      }
    });
    
    setStories(fetchedStories);
    setTasks(fetchedTasks);
    setSyncLogs(prev => [...prev, "✅ Completed (Demo Mode)"]);
    setIsFetching(false);
    setShowConfetti(true);
    
    setTimeout(() => setShowConfetti(false), 3000);
    
    toast({
      title: "✅ Sync Complete",
      description: `Fetched ${Object.values(fetchedStories).flat().length} stories with ${Object.values(fetchedTasks).flat().length} findings`,
    });
  };

  const handleRefreshSync = async () => {
    setIsFetching(true);
    setSyncLogs(prev => [...prev, "Refreshing sync data..."]);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Randomly shuffle statuses
    const updatedTasks = { ...tasks };
    const statuses = ["Open", "In Progress", "Closed"];
    
    Object.keys(updatedTasks).forEach(storyKey => {
      updatedTasks[storyKey] = updatedTasks[storyKey].map(task => ({
        ...task,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      }));
    });
    
    setTasks(updatedTasks);
    setSyncLogs(prev => [...prev, "✅ Sync refreshed successfully"]);
    setIsFetching(false);
    
    toast({
      title: "🔄 Sync Refreshed",
      description: "Finding statuses updated from Jira",
    });
  };

  const toggleAutoSync = (projectKey: string) => {
    setProjects(prev => prev.map(p => 
      p.key === projectKey ? { ...p, autoSync: !p.autoSync } : p
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          ⚙️ Currently running in Demo Mode (Mock Jira Data) — Full API Integration available in Phase 2.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Jira Project Linking
          </CardTitle>
          <CardDescription>
            Connect and sync audit stories and findings from Jira
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jira-url">Jira Base URL</Label>
                <Input id="jira-url" placeholder="https://your-company.atlassian.net" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jira-email">Username / Email</Label>
                <Input id="jira-email" type="email" placeholder="user@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jira-key">API Key</Label>
                <Input id="jira-key" type="password" placeholder="Enter your Jira API key" />
              </div>
              <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-2 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="font-medium">Connected to Jira (Demo Mode)</span>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Linked Projects</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Lead</TableHead>
                      <TableHead>Auto-Sync</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map(project => (
                      <TableRow key={project.key}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{project.key}</Badge>
                        </TableCell>
                        <TableCell>{project.lead}</TableCell>
                        <TableCell>
                          <Switch
                            checked={project.autoSync}
                            onCheckedChange={() => toggleAutoSync(project.key)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleFetchStories} disabled={isFetching || !projects.some(p => p.autoSync)}>
                  {isFetching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    "Fetch Stories"
                  )}
                </Button>
                {Object.keys(stories).length > 0 && (
                  <Button onClick={handleRefreshSync} variant="outline" disabled={isFetching}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync from Jira
                  </Button>
                )}
              </div>

              {isFetching && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground">Progress: {progress}%</p>
                </div>
              )}

              {Object.keys(stories).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Synced Stories & Findings</h3>
                  {Object.entries(stories).map(([projectKey, projectStories]) => (
                    <div key={projectKey} className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground">Project: {projectKey}</h4>
                      {projectStories.map(story => (
                        <Card key={story.key} className={showConfetti ? "animate-scale-in" : ""}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{story.key}</Badge>
                                <CardTitle className="text-base">{story.title}</CardTitle>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedStory(expandedStory === story.key ? null : story.key)}
                              >
                                <ChevronDown className={`h-4 w-4 transition-transform ${expandedStory === story.key ? "rotate-180" : ""}`} />
                              </Button>
                            </div>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span>Status: <Badge variant="secondary">{story.status}</Badge></span>
                              <span>Owner: {story.owner}</span>
                              <span>{story.startDate} - {story.endDate}</span>
                            </div>
                          </CardHeader>
                          {expandedStory === story.key && tasks[story.key] && (
                            <CardContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Task Key</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Severity</TableHead>
                                    <TableHead>Assignee</TableHead>
                                    <TableHead>Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {tasks[story.key].map(task => (
                                    <TableRow key={task.key}>
                                      <TableCell>
                                        <Badge variant="outline">{task.key}</Badge>
                                      </TableCell>
                                      <TableCell>{task.title}</TableCell>
                                      <TableCell>
                                        <Badge variant={getSeverityColor(task.severity) as any}>
                                          {task.severity}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>{task.assignee}</TableCell>
                                      <TableCell>
                                        <Badge variant="secondary">{task.status}</Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              <Collapsible open={showLogs} onOpenChange={setShowLogs}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <ChevronDown className={`mr-2 h-4 w-4 transition-transform ${showLogs ? "rotate-180" : ""}`} />
                    Integration Log
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2 font-mono text-sm">
                        {syncLogs.map((log, idx) => (
                          <div key={idx} className="text-muted-foreground animate-fade-in">
                            {log}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
