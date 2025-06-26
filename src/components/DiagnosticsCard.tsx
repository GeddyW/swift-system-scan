
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface DiagnosticsCardProps {
  title: string;
  value: string;
  progress: number;
  icon: React.ReactNode;
  status: 'excellent' | 'good' | 'moderate' | 'high';
}

const DiagnosticsCard: React.FC<DiagnosticsCardProps> = ({
  title,
  value,
  progress,
  icon,
  status
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-blue-500';
      case 'moderate':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-green-500';
    if (progress < 60) return 'bg-blue-500';
    if (progress < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
              <div className="text-white">
                {icon}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{title}</h3>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`${getStatusColor(status)} text-white border-0`}
          >
            {status}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getProgressColor(progress)}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosticsCard;
