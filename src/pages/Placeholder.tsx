import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function Placeholder() {
  const location = useLocation();
  const pageName = location.pathname.split("/")[1] || "Page";

  return (
    <div className="p-6">
      <Card className="p-12 text-center space-y-4">
        <Construction className="h-16 w-16 mx-auto text-muted-foreground" />
        <h1 className="text-3xl font-bold capitalize">{pageName}</h1>
        <p className="text-muted-foreground">This page is under construction and will be available soon.</p>
      </Card>
    </div>
  );
}
