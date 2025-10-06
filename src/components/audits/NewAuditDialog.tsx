import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, FileSpreadsheet, Download, Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { mockUsers } from "@/data/mockData";

const auditFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  auditType: z.string().min(1, "Audit type is required"),
  application: z.string().min(1, "Application is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  leadAuditor: z.string().min(1, "Lead auditor is required"),
  assignedTo: z.string().min(1, "Assigned to is required"),
  description: z.string().min(1, "Description is required").max(1000),
  status: z.string().min(1, "Status is required"),
  tags: z.string(),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type AuditFormValues = z.infer<typeof auditFormSchema>;

const mockApplications = [
  "SAP ERP",
  "Oracle Financial Cloud",
  "Salesforce CRM",
  "Workday HCM",
  "ServiceNow ITSM",
  "Microsoft Dynamics",
  "NetSuite",
  "Custom Internal App",
];

const auditTypes = ["SOX", "Internal", "Vendor", "ITGC", "Process Audit", "Compliance Audit"];
const auditStatuses = ["Planned", "Ongoing", "Completed"];

interface UploadedFinding {
  findingId: string;
  description: string;
  severity: string;
  control: string;
  owner: string;
  status: string;
  dueDate: string;
}

interface NewAuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewAuditDialog({ open, onOpenChange }: NewAuditDialogProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<UploadedFinding[]>([]);
  const [auditData, setAuditData] = useState<AuditFormValues | null>(null);
  const { toast } = useToast();

  const form = useForm<AuditFormValues>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      title: "",
      auditType: "",
      application: "",
      leadAuditor: "",
      assignedTo: "",
      description: "",
      status: "Planned",
      tags: "",
    },
  });

  const onSubmit = (data: AuditFormValues) => {
    setAuditData(data);
    setShowUploadPrompt(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an Excel (.xlsx) or CSV (.csv) file",
          variant: "destructive",
        });
        return;
      }

      setUploadedFile(file);
      // Simulate file processing
      simulateUpload(file);
    }
  };

  const simulateUpload = (file: File) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulate parsing and preview
          setPreviewData([
            {
              findingId: "FND-2024-099",
              description: "Weak password policy implementation",
              severity: "High",
              control: "IAM-001",
              owner: "Security Team",
              status: "Open",
              dueDate: "2025-04-15",
            },
            {
              findingId: "FND-2024-100",
              description: "Missing audit logs for privileged access",
              severity: "Critical",
              control: "LOG-002",
              owner: "IT Operations",
              status: "In Progress",
              dueDate: "2025-03-30",
            },
            {
              findingId: "FND-2024-101",
              description: "Incomplete vendor risk assessment",
              severity: "Medium",
              control: "VRM-003",
              owner: "Procurement",
              status: "Open",
              dueDate: "2025-05-01",
            },
            {
              findingId: "FND-2024-102",
              description: "Segregation of duties violation in payment processing",
              severity: "High",
              control: "FIN-004",
              owner: "Finance Team",
              status: "Open",
              dueDate: "2025-04-10",
            },
            {
              findingId: "FND-2024-103",
              description: "Outdated disaster recovery plan",
              severity: "Medium",
              control: "BCM-001",
              owner: "IT Operations",
              status: "Open",
              dueDate: "2025-06-15",
            },
          ]);
          toast({
            title: "File uploaded successfully",
            description: `${file.name} processed. Preview available below.`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Template downloading",
      description: "Sample Excel template will be downloaded shortly",
    });
  };

  const handleProceedWithUpload = () => {
    setStep(2);
    setShowUploadPrompt(false);
  };

  const handleSkipUpload = () => {
    setStep(3);
    setShowUploadPrompt(false);
  };

  const handleConfirmUpload = () => {
    setStep(3);
    toast({
      title: "Findings imported successfully",
      description: `${previewData.length} findings imported from ${uploadedFile?.name}`,
    });
  };

  const handleFinalConfirmation = () => {
    const auditId = `AUD-2025-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
    
    toast({
      title: "Audit created successfully",
      description: `${auditData?.title} (${auditId}) has been created with ${previewData.length} findings`,
    });

    // Reset and close
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setShowUploadPrompt(false);
    setUploadedFile(null);
    setUploadProgress(0);
    setPreviewData([]);
    setAuditData(null);
    form.reset();
    onOpenChange(false);
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      Critical: "bg-status-critical text-status-critical-foreground",
      High: "bg-status-high text-status-high-foreground",
      Medium: "bg-status-medium text-status-medium-foreground",
      Low: "bg-status-low text-status-low-foreground",
    };
    return colors[severity] || "bg-muted";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Step 1: Audit Form */}
        {step === 1 && !showUploadPrompt && (
          <>
            <DialogHeader>
              <DialogTitle>Create New Audit</DialogTitle>
              <DialogDescription>
                Fill in the audit details below. Required fields are marked with *
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audit Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., IT Security Controls Review 2025" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="auditType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Audit Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {auditTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="application"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application / System *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select application" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockApplications.map((app) => (
                              <SelectItem key={app} value={app}>
                                {app}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="leadAuditor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Auditor *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select auditor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assignedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned To *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select owner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the audit scope, objectives, and context..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {auditStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., compliance, GDPR, risk-area" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Save & Continue</Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}

        {/* Upload Prompt */}
        {showUploadPrompt && (
          <>
            <DialogHeader>
              <DialogTitle>Import Existing Findings?</DialogTitle>
              <DialogDescription>
                Would you like to import findings from an existing Excel file? This helps onboard prior findings for ongoing or repeated audits.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Card className="p-6 bg-muted/50">
                <div className="flex items-center gap-4">
                  <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Upload findings data</h4>
                    <p className="text-sm text-muted-foreground">
                      Import findings from Excel to quickly populate audit data
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleSkipUpload}>
                No, Create Without Upload
              </Button>
              <Button onClick={handleProceedWithUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Yes, Upload File
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Step 2: File Upload */}
        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>Upload Existing Findings</DialogTitle>
              <DialogDescription>
                Upload an Excel file containing findings data. Download the template for the required format.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-dashed rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Excel Template</p>
                    <p className="text-sm text-muted-foreground">Download sample format</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
              </div>

              <div>
                <Label htmlFor="file-upload" className="block mb-2">
                  Select File (.xlsx or .csv) *
                </Label>
                <div className="relative">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {uploadedFile && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Uploading: {uploadedFile.name}</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>

                  {uploadProgress === 100 && previewData.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Preview (First 5 rows)</Label>
                        <Badge variant="outline">{previewData.length} findings loaded</Badge>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Finding ID</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Severity</TableHead>
                              <TableHead>Control</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {previewData.map((finding, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-mono text-sm">{finding.findingId}</TableCell>
                                <TableCell className="max-w-[200px] truncate">{finding.description}</TableCell>
                                <TableCell>
                                  <Badge className={getSeverityColor(finding.severity)}>
                                    {finding.severity}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-mono text-sm">{finding.control}</TableCell>
                                <TableCell>{finding.status}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleConfirmUpload}
                disabled={!uploadedFile || uploadProgress < 100}
              >
                Confirm & Import
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && auditData && (
          <>
            <DialogHeader>
              <DialogTitle>Audit Created Successfully</DialogTitle>
              <DialogDescription>
                Your audit has been created. Review the summary below.
              </DialogDescription>
            </DialogHeader>

            <Card className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">{auditData.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Audit ID:</span>
                    <p className="font-mono font-medium">AUD-2025-{String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium">{auditData.auditType}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Application:</span>
                    <p className="font-medium">{auditData.application}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className="font-medium">{auditData.status}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Audit Period:</span>
                    <p className="font-medium">
                      {format(auditData.startDate, "MMM dd, yyyy")} - {format(auditData.endDate, "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Findings Imported:</span>
                    <p className="font-medium text-primary">{previewData.length}</p>
                  </div>
                </div>
              </div>
            </Card>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleClose}>
                Go to All Audits
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Add Findings Manually
              </Button>
              <Button onClick={handleFinalConfirmation}>
                View Audit Dashboard
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
