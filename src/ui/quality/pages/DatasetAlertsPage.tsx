import DatasetAlertsView from "@/ui/quality/components/DatasetAlerts.view.tsx";
import { useDatasetAlertsController } from "@/application/dataquality/datasetAlerts.controller.ts";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/ui/lib/components/ui/card.tsx";
import { Skeleton } from "@/ui/lib/components/ui/skeleton.tsx";
import { Separator } from "@radix-ui/react-select";
import React from "react";
import { Button } from "@/ui/lib/components/ui/button.tsx";

export default function DatasetAlertsPage() {
  const { id } = useParams<{ id: string }>();
  const datasetId = id ?? null;
  const nav = useNavigate();

  const {
    alerts,
    unresolvedOnly,
    isDatasetAlertsLoading,
    onUnresolvedOnlyChange,
  } = useDatasetAlertsController(datasetId ?? "");

  if (isDatasetAlertsLoading) {
    return (
      <div className="w-full">
        <Button variant="ghost" className="mb-4">
          &larr; Back to datasets
        </Button>
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                {/* Title Skeleton */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" /> {/* Icon */}
                  <Skeleton className="h-6 w-48" />{" "}
                  {/* "Quality & Validity Alerts" */}
                </div>
                {/* Description Skeleton */}
                <Skeleton className="h-4 w-64" />
              </div>

              {/* Switch & Label Skeleton */}
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-9 rounded-full" />{" "}
                {/* Switch shape */}
                <Skeleton className="h-4 w-24" /> {/* Label text */}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {/* Generate 3 dummy items to simulate a list */}
            {[1, 2, 3].map((index) => (
              <React.Fragment key={index}>
                {index > 0 && <Separator className="opacity-50" />}

                <div className="flex flex-col gap-3 p-2">
                  {/* Row 1: Severity and Type */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-16" /> {/* Severity Text */}
                      <span className="text-xs text-muted-foreground/20">
                        •
                      </span>
                      <Skeleton className="h-3 w-24" /> {/* Alert Type */}
                    </div>
                    {/* Optional Resolved Badge placeholder (randomly show one or keep hidden) */}
                    {index === 1 && (
                      <Skeleton className="h-5 w-20 rounded-full" />
                    )}
                  </div>

                  {/* Row 2: Main Content */}
                  <div className="space-y-2">
                    {/* Dataset Title */}
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />{" "}
                      {/* DB Icon */}
                      <Skeleton className="h-4 w-40" />
                    </div>
                    {/* Message Lines */}
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-[80%]" />
                    </div>
                  </div>

                  {/* Row 3: Footer - Date */}
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3 rounded-full" />{" "}
                      {/* Clock Icon */}
                      <Skeleton className="h-3 w-32" /> {/* Date text */}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-5 w-full">
      <Button variant="ghost" className="mb-4" onClick={() => nav("/datasets")}>
        &larr; Back to datasets
      </Button>
      <DatasetAlertsView
        alerts={alerts}
        unresolvedOnly={unresolvedOnly}
        onUnresolvedOnlyChange={onUnresolvedOnlyChange}
      />
    </div>
  );
}
