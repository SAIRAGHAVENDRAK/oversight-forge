import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

interface OwnerChartData {
  name: string;
  closed: number;
  overdue: number;
  inProgress: number;
  ownerId: string;
}

interface OwnerBarChartProps {
  data: OwnerChartData[];
  onSelectOwner: (ownerId: string) => void;
}

export function OwnerBarChart({ data, onSelectOwner }: OwnerBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Findings by Owner</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              className="text-xs"
            />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar 
              dataKey="closed" 
              fill="hsl(var(--status-low))" 
              name="Closed"
              stackId="a"
              cursor="pointer"
              onClick={(data) => onSelectOwner(data.ownerId)}
            />
            <Bar 
              dataKey="inProgress" 
              fill="hsl(var(--status-info))" 
              name="In Progress"
              stackId="a"
              cursor="pointer"
              onClick={(data) => onSelectOwner(data.ownerId)}
            />
            <Bar 
              dataKey="overdue" 
              fill="hsl(var(--status-high))" 
              name="Overdue"
              stackId="a"
              cursor="pointer"
              onClick={(data) => onSelectOwner(data.ownerId)}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
