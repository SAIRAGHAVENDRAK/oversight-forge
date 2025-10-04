import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

interface DepartmentData {
  department: string;
  count: number;
  color: string;
}

interface DepartmentBarChartProps {
  data: DepartmentData[];
}

export function DepartmentBarChart({ data }: DepartmentBarChartProps) {
  const navigate = useNavigate();

  const handleBarClick = (department: string) => {
    navigate(`/findings?department=${encodeURIComponent(department)}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Findings by Department</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="department" 
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
            <Bar 
              dataKey="count" 
              fill="hsl(var(--accent))"
              radius={[8, 8, 0, 0]}
              cursor="pointer"
              onClick={(data) => handleBarClick(data.department)}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
