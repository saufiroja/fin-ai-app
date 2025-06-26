import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";

export default function SettingLoading() {
  return (
    <div className="flex justify-center items-start">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Navigation Tabs Skeleton */}
          <Card className="lg:col-span-1 h-fit">
            <CardBody className="p-4">
              <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 p-3">
                    <Skeleton className="w-5 h-5 rounded" />
                    <Skeleton className="h-4 w-20 rounded" />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Main Content Skeleton */}
          <Card className="lg:col-span-2">
            <CardBody className="p-6">
              {/* Profile Section Skeleton */}
              <div className="space-y-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <Skeleton className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32 rounded" />
                    <Skeleton className="h-4 w-40 rounded" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                </div>

                {/* Bio Field */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12 rounded" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>

                <Divider className="my-6" />

                {/* Security Section */}
                <div className="space-y-6">
                  <Skeleton className="h-6 w-40 rounded" />

                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="space-y-2">
                        <Skeleton className="h-4 w-32 rounded" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                      </div>
                    ))}
                  </div>
                </div>

                <Divider className="my-6" />

                {/* Two-Factor Authentication */}
                <div className="space-y-4">
                  <Skeleton className="h-5 w-48 rounded" />
                  <div className="flex items-center justify-between p-4 bg-default-50 rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32 rounded" />
                      <Skeleton className="h-3 w-40 rounded" />
                    </div>
                    <Skeleton className="w-12 h-6 rounded-full" />
                  </div>
                </div>

                {/* Login Sessions */}
                <div className="space-y-4">
                  <Skeleton className="h-5 w-28 rounded" />
                  <div className="space-y-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-default-50 rounded-lg"
                      >
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-28 rounded" />
                          <Skeleton className="h-3 w-48 rounded" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>

                <Divider className="my-6" />

                {/* Notification Preferences */}
                <div className="space-y-4">
                  <Skeleton className="h-6 w-44 rounded" />
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-default-50 rounded-lg"
                      >
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-36 rounded" />
                          <Skeleton className="h-3 w-48 rounded" />
                        </div>
                        <Skeleton className="w-12 h-6 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>

                <Divider className="my-6" />

                {/* Language & Region */}
                <div className="space-y-4">
                  <Skeleton className="h-6 w-36 rounded" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16 rounded" />
                      <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20 rounded" />
                      <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                  </div>
                </div>

                <Divider className="my-6" />

                {/* Theme Preferences */}
                <div className="space-y-4">
                  <Skeleton className="h-5 w-32 rounded" />
                  <div className="flex items-center justify-between p-4 bg-default-50 rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20 rounded" />
                      <Skeleton className="h-3 w-52 rounded" />
                    </div>
                    <Skeleton className="w-12 h-6 rounded-full" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-default-200">
                  <Skeleton className="h-10 w-20 rounded-xl" />
                  <Skeleton className="h-10 w-28 rounded-xl" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
