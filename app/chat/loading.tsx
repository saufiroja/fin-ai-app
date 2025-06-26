import { Skeleton } from "@heroui/skeleton";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { ScrollShadow } from "@heroui/scroll-shadow";

export default function ChatLoading() {
  return (
    <div className="flex h-[calc(100vh-2rem)] md:h-[calc(93vh-2rem)] bg-gradient-to-br from-background to-content1 rounded-none md:rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Sidebar Skeleton */}
      <Card className="w-80 bg-content1/80 backdrop-blur-xl shadow-none rounded-none flex flex-col">
        {/* Header Section */}
        <CardHeader className="pb-4 flex-shrink-0">
          <div className="flex flex-col w-full gap-4">
            {/* Brand Header Skeleton */}
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>
            </div>

            {/* Search Input Skeleton */}
            <Skeleton className="h-10 w-full rounded-xl" />

            {/* New Chat Button Skeleton */}
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </CardHeader>

        {/* Chat History Section */}
        <CardBody className="pt-0 flex-1 overflow-hidden flex flex-col">
          <div className="flex flex-col h-full">
            {/* Recent Conversations Label */}
            <Skeleton className="h-4 w-24 rounded mb-3" />

            {/* Chat List Skeleton */}
            <div className="flex-1 overflow-hidden">
              <ScrollShadow
                hideScrollBar
                className="overflow-y-auto w-[300px] h-[600px]"
              >
                <div className="space-y-2">
                  {/* Multiple chat items skeleton */}
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Card
                      key={index}
                      className="w-full p-0 bg-content2/50 shadow-none"
                    >
                      <CardBody className="py-2 px-4 relative">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 w-full">
                            <Skeleton className="h-4 w-full max-w-[200px] rounded" />
                          </div>
                          <Skeleton className="w-6 h-6 rounded-full" />
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </ScrollShadow>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Main Chat Area Skeleton */}
      <div className="flex-1 flex flex-col bg-content1/30 backdrop-blur-xl w-full relative">
        {/* Header Skeleton */}
        <div className="sticky top-0 z-30 bg-content1/80 backdrop-blur-xl w-full">
          <div className="py-3 md:py-4 flex items-center justify-between px-4">
            <div className="flex items-center gap-3 md:gap-4">
              <Skeleton className="w-8 h-8 rounded-full md:hidden" />
              <Skeleton className="h-6 w-32 rounded" />
            </div>
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>

        {/* Messages Area Skeleton */}
        <ScrollShadow
          hideScrollBar
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-content2/50 backdrop-blur-sm"
        >
          {/* Welcome Screen Skeleton */}
          <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto px-4">
            {/* Logo Skeleton */}
            <div className="relative mb-6 md:mb-8">
              <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-3xl" />
              <Skeleton className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 rounded-full" />
            </div>

            {/* Title Skeleton */}
            <Skeleton className="h-8 md:h-9 w-48 md:w-56 rounded mb-3 md:mb-4" />

            {/* Description Skeleton */}
            <div className="space-y-2 mb-6 md:mb-8 w-full">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-4/5 rounded mx-auto" />
              <Skeleton className="h-4 w-3/4 rounded mx-auto" />
            </div>

            {/* Suggested Prompts Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full max-w-2xl">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  className="p-3 md:p-4 bg-content2/50 backdrop-blur-sm border-divider/30"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-xl" />
                    <Skeleton className="h-4 w-32 md:w-40 rounded" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </ScrollShadow>

        {/* Input Area Skeleton */}
        <Card className="shadow-none rounded-none bg-content1/50">
          <CardBody className="p-4 md:p-6">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <Skeleton className="w-12 h-12 rounded-full" />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
