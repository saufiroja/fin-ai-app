import { Skeleton } from "@heroui/skeleton";
import { Card, CardHeader, CardBody } from "@heroui/card";

export default function Loading() {
  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <Skeleton className="h-10 w-80 rounded-lg mb-2" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-24 rounded-xl" />
              <Skeleton className="h-10 w-36 rounded-xl" />
            </div>
          </div>

          {/* Statistics Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <CardBody className="flex flex-row items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-6 w-32 rounded" />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Filters Section Skeleton */}
        <Card className="mb-8">
          <CardBody>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex gap-4 flex-1">
                <Skeleton className="h-11 flex-1 rounded-xl" />
              </div>
              <div className="flex gap-4 flex-1">
                <Skeleton className="h-11 w-44 rounded-xl" />
                <Skeleton className="h-11 w-44 rounded-xl" />
                <Skeleton className="h-11 w-44 rounded-xl" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Table/Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-4">
              <CardHeader className="flex items-start justify-between mb-2 pb-0">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </CardHeader>
              <CardBody className="mb-2">
                <Skeleton className="h-6 w-24 rounded-full" />
              </CardBody>
              <div className="flex items-center justify-between pt-0">
                <Skeleton className="h-6 w-28 rounded" />
                <div className="flex gap-1">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <Skeleton className="w-8 h-8 rounded-lg" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center mt-6">
          <Skeleton className="h-10 w-64 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
