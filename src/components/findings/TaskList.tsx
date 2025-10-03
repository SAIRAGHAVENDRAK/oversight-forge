import { Task } from "@/types/audit";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, Circle, Plus } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onAddTask?: () => void;
  canEdit?: boolean;
}

export function TaskList({ tasks, onAddTask, canEdit = false }: TaskListProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {canEdit && (
        <div className="flex justify-end">
          <Button onClick={onAddTask} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      )}

      {tasks.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No tasks assigned yet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {task.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-status-low" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <p className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                    {task.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback className="text-xs">
                          {getInitials(task.assignee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">{task.assignee.name}</span>
                    </div>

                    <div className="text-muted-foreground">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>

                    <Badge variant={task.status === "completed" ? "outline" : "default"}>
                      {task.status === "completed" ? "Completed" : "Open"}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
