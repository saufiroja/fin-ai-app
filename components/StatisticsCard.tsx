import { Card, CardHeader, CardBody } from '@heroui/card';
import { ReactNode } from 'react';

interface StatisticsCardProps {
  icon?: ReactNode;
  label: string;
  value: string | number;
  valueColor?: string;
  iconBg?: string;
}

export default function StatisticsCard({
  icon,
  label,
  value,
  valueColor = '',
  iconBg = '',
}: StatisticsCardProps) {
  return (
    <Card>
      <CardHeader className='flex items-center gap-3'>
        {icon && (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}
          >
            {icon}
          </div>
        )}
        <span className='text-base font-medium'>{label}</span>
      </CardHeader>
      <CardBody>
        <span className={`text-2xl font-bold ${valueColor}`}>{value}</span>
      </CardBody>
    </Card>
  );
}
