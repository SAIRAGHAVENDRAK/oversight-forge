import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TrendChartProps {
  data: Array<{ month: string; closed: number; opened: number }>;
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Findings Closure Trend (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="closed" 
              stroke="hsl(var(--status-low))" 
              strokeWidth={2}
              name="Closed Findings"
            />
            <Line 
              type="monotone" 
              dataKey="opened" 
              stroke="hsl(var(--status-high))" 
              strokeWidth={2}
              name="Opened Findings"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
