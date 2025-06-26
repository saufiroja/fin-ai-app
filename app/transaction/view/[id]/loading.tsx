import { Skeleton } from "@heroui/skeleton";
import { Card, CardHeader, CardBody } from "@heroui/card";

export default function Loading() {
  return (
    <div className="min-h-screen w-full p-6 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div>
              <Skeleton className="h-8 w-48 rounded-lg mb-2" />
              <Skeleton className="h-4 w-56 rounded" />
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20 rounded-xl" />
            <Skeleton className="h-10 w-16 rounded-xl" />
            <Skeleton className="h-10 w-20 rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Transaction Info Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card Skeleton */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div>
                      <Skeleton className="h-6 w-20 rounded mb-2" />
                      <Skeleton className="h-4 w-24 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </CardHeader>

              <CardBody className="space-y-4">
                {/* Amount Skeleton */}
                <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Skeleton className="h-4 w-16 rounded mx-auto mb-2" />
                  <Skeleton className="h-10 w-48 rounded mx-auto" />
                </div>

                {/* Category Skeleton */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Skeleton className="w-8 h-8 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-24 rounded mb-2" />
                    <Skeleton className="h-3 w-32 rounded" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                {/* Payment Method Skeleton */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Skeleton className="w-8 h-8 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-28 rounded mb-2" />
                    <Skeleton className="h-3 w-36 rounded" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </CardBody>
            </Card>

            {/* Details Card Skeleton */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5 rounded" />
                  <Skeleton className="h-5 w-36 rounded" />
                </div>
              </CardHeader>

              <CardBody className="space-y-4">
                {/* Details Items */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="w-4 h-4 rounded mt-1" />
                    <div className="flex-1">
                      <Skeleton className="h-3 w-20 rounded mb-2" />
                      <Skeleton className="h-4 w-40 rounded" />
                    </div>
                  </div>
                ))}

                {/* Tags Skeleton */}
                <div className="flex items-start gap-3">
                  <Skeleton className="w-4 h-4 rounded mt-1" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-12 rounded mb-2" />
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-6 w-16 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Transaction ID Skeleton */}
            <Card className="shadow-lg">
              <CardHeader>
                <Skeleton className="h-5 w-28 rounded" />
              </CardHeader>
              <CardBody>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 flex-1 rounded" />
                  <Skeleton className="w-8 h-8 rounded" />
                </div>
              </CardBody>
            </Card>

            {/* Timeline Skeleton */}
            <Card className="shadow-lg">
              <CardHeader>
                <Skeleton className="h-5 w-20 rounded" />
              </CardHeader>
              <CardBody className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-3 w-16 rounded mb-1" />
                    <Skeleton className="h-4 w-32 rounded" />
                  </div>
                ))}
              </CardBody>
            </Card>

            {/* Quick Actions Skeleton */}
            <Card className="shadow-lg">
              <CardHeader>
                <Skeleton className="h-5 w-28 rounded" />
              </CardHeader>
              <CardBody className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-xl" />
                ))}
                <div className="my-2">
                  <Skeleton className="h-px w-full" />
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
