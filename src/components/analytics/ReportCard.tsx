import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportCardProps {
  title: string;
  description: string;
  reportType: string;
  icon?: React.ReactNode;
}

export function ReportCard({ title, description, reportType, icon }: ReportCardProps) {
  const { toast } = useToast();

  const handleGenerate = () => {
    toast({
      title: "Report Generation Started",
      description: `Generating ${title}...`,
    });
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: `${title} has been generated successfully.`,
      });
    }, 2000);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              {icon || <FileText className="h-5 w-5" />}
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button onClick={handleGenerate} className="w-full" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </CardContent>
    </Card>
  );
}
