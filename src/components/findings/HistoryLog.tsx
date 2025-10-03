import { HistoryEvent } from "@/types/audit";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Mail,
  UserPlus,
  FileText,
} from "lucide-react";

interface HistoryLogProps {
  history: HistoryEvent[];
}

export function HistoryLog({ history }: HistoryLogProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getActionIcon = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes("created")) return FileText;
    if (actionLower.includes("status")) return Clock;
    if (actionLower.includes("assigned")) return UserPlus;
    if (actionLower.includes("edited")) return Edit;
    if (actionLower.includes("reminder")) return Mail;
    if (actionLower.includes("closed")) return CheckCircle;
    return AlertCircle;
  };

  const getActionColor = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes("created")) return "text-status-info";
    if (actionLower.includes("status")) return "text-status-medium";
    if (actionLower.includes("closed")) return "text-status-low";
    if (actionLower.includes("overdue")) return "text-status-critical";
    return "text-muted-foreground";
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {history.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No history available</p>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-border" />

          {/* History events */}
          <div className="space-y-6">
            {history.map((event, index) => {
              const Icon = getActionIcon(event.action);
              const iconColor = getActionColor(event.action);

              return (
                <div key={event.id} className="relative flex gap-4">
                  {/* Icon */}
                  <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background border-2 ${iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <Card className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={event.user.avatar} />
                          <AvatarFallback className="text-xs">
                            {getInitials(event.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-sm">{event.user.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>

                    <p className="text-sm mb-1">
                      <span className="font-medium">{event.action}</span>
                    </p>

                    {event.details && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {event.details}
                      </p>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
