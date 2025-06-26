import { Skeleton } from "@heroui/skeleton";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";

export default function Loading() {
  return (
    <div className='min-h-screen w-full p-6 dark:from-gray-900 dark:to-gray-800'>
      <div className='max-w-2xl mx-auto'>
        {/* Header Skeleton */}
        <div className='flex items-center gap-4 mb-6'>
          <Skeleton className='w-10 h-10 rounded-lg' />
          <div>
            <Skeleton className='h-8 w-44 rounded-lg mb-2' />
            <Skeleton className='h-4 w-56 rounded' />
          </div>
        </div>

        {/* Form Card Skeleton */}
        <Card className='shadow-lg'>
          <CardHeader className='pb-4'>
            <div className='flex items-center gap-2'>
              <Skeleton className='w-6 h-6 rounded' />
              <Skeleton className='h-6 w-40 rounded' />
              <div className='ml-auto'>
                <Skeleton className='h-6 w-16 rounded' />
              </div>
            </div>
          </CardHeader>

          <CardBody className='space-y-6'>
            {/* Transaction Type Skeleton */}
            <div>
              <Skeleton className='h-4 w-32 rounded mb-2' />
              <div className='grid grid-cols-2 gap-2'>
                <Skeleton className='h-10 rounded-xl' />
                <Skeleton className='h-10 rounded-xl' />
              </div>
            </div>

            {/* Amount Skeleton */}
            <div>
              <Skeleton className='h-14 w-full rounded-xl' />
            </div>

            {/* Category Skeleton */}
            <div>
              <Skeleton className='h-14 w-full rounded-xl' />
            </div>

            {/* Date Skeleton */}
            <div>
              <Skeleton className='h-4 w-32 rounded mb-2' />
              <Skeleton className='h-10 w-full rounded-xl' />
            </div>

            {/* Payment Method Skeleton */}
            <div>
              <Skeleton className='h-14 w-full rounded-xl' />
            </div>

            {/* Recipient Skeleton */}
            <div>
              <Skeleton className='h-14 w-full rounded-xl' />
            </div>

            {/* Description Skeleton */}
            <div>
              <Skeleton className='h-14 w-full rounded-xl' />
            </div>

            {/* Tags Skeleton */}
            <div>
              <Skeleton className='h-14 w-full rounded-xl' />
            </div>
          </CardBody>

          <CardFooter className='pt-4 flex gap-3 justify-end'>
            <Skeleton className='h-10 w-20 rounded-xl' />
            <Skeleton className='h-10 w-40 rounded-xl' />
          </CardFooter>
        </Card>

        {/* Changes Preview Card Skeleton */}
        <Card className='mt-6 border-2 border-dashed border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-950'>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Skeleton className='w-5 h-5 rounded' />
              <Skeleton className='h-6 w-36 rounded' />
            </div>
          </CardHeader>
          <CardBody>
            <div className='space-y-2'>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className='flex justify-between'>
                  <Skeleton className='h-4 w-16 rounded' />
                  <Skeleton className='h-4 w-24 rounded' />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
