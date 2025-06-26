
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface PerformanceChartProps {
  data: Array<{
    time: string;
    cpu: number;
    ram: number;
    timestamp: number;
  }>;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Performance Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cpu" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4, fill: '#3b82f6' }}
                name="CPU Usage (%)"
              />
              <Line 
                type="monotone" 
                dataKey="ram" 
                stroke="#06b6d4" 
                strokeWidth={2}
                dot={{ r: 4, fill: '#06b6d4' }}
                name="RAM Usage (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {data.length > 0 ? data[data.length - 1].cpu : 0}%
            </div>
            <div className="text-sm text-blue-500">Current CPU</div>
          </div>
          <div className="text-center p-3 bg-cyan-50 rounded-lg">
            <div className="text-2xl font-bold text-cyan-600">
              {data.length > 0 ? data[data.length - 1].ram : 0}%
            </div>
            <div className="text-sm text-cyan-500">Current RAM</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
