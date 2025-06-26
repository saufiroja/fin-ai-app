import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody, CardHeader } from "@heroui/card";

export default function InsightLoading() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-80 mx-auto rounded mb-2" />
          <Skeleton className="h-5 w-64 mx-auto rounded" />
        </div>

        {/* Tips Card Skeleton */}
        <Card>
          <CardBody className="text-center py-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-6 w-32 rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-2xl mx-auto rounded" />
              <Skeleton className="h-4 w-3/4 mx-auto rounded" />
            </div>
          </CardBody>
        </Card>

        {/* Add Button Skeleton */}
        <div className="flex justify-end mb-4">
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>

        {/* Insights Cards Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="border-l-4 border-l-transparent"
              shadow="sm"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 w-full">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48 rounded" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
              </CardHeader>

              <CardBody className="pt-0">
                {/* Content Skeleton */}
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                </div>

                {/* Dynamic Content Based on Index */}
                {index === 0 && (
                  // Analysis type
                  <div className="flex flex-wrap gap-4 items-center">
                    <Skeleton className="h-8 w-16 rounded-lg" />
                    <Skeleton className="h-6 w-24 rounded" />
                    <Skeleton className="h-6 w-32 rounded-full" />
                  </div>
                )}

                {index === 1 && (
                  // Target type
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24 rounded" />
                      <Skeleton className="h-4 w-24 rounded" />
                    </div>
                    <Skeleton className="h-3 w-full rounded-full" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20 rounded" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </div>
                )}

                {index === 2 && (
                  // Alert type
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24 rounded" />
                      <Skeleton className="h-4 w-24 rounded" />
                    </div>
                    <Skeleton className="h-3 w-full rounded-full" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20 rounded" />
                      <div className="flex items-center gap-1">
                        <Skeleton className="w-4 h-4 rounded" />
                        <Skeleton className="h-4 w-20 rounded" />
                      </div>
                    </div>
                  </div>
                )}

                {index === 3 && (
                  // Recommendation type
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <Skeleton className="h-5 w-32 rounded" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-28 rounded-full" />
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
