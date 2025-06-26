import { Skeleton } from '@heroui/skeleton';
import { Card, CardBody } from '@heroui/card';

export default function DashboardLoading() {
  return (
    <div className='space-y-6'>
      {/* Statistics Cards Skeleton */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className='p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col space-y-2'>
                <Skeleton className='h-4 w-24 rounded' />
                <Skeleton className='h-6 w-32 rounded' />
              </div>
              <Skeleton className='w-12 h-12 rounded-xl' />
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Transactions Section */}
      <div>
        {/* Section Header Skeleton */}
        <div className='flex items-center justify-between mb-4'>
          <Skeleton className='h-6 w-40 rounded' />
          <Skeleton className='h-8 w-32 rounded' />
        </div>

        {/* Transactions Card Skeleton */}
        <Card>
          <CardBody>
            <div className='divide-y divide-gray-200'>
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className='py-3 flex justify-between items-center'
                >
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-48 rounded' />
                    <Skeleton className='h-3 w-24 rounded' />
                  </div>
                  <Skeleton className='h-4 w-20 rounded' />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
